import { Player, Simon } from "@phaser/Objects";
import {
    SCALE_FACTOR,
    TIME_CHECK_KEY_PRESSED,
    TIME_SIMON_SAYS,
    TIME_SIMON_SAYS_PLAYER,
    TIME_TEXT_PLAYER,
    calculateDimensions,
    calculateLogarithmTime,
} from "@phaser/Util";
import { getStore } from "@store/index";
import { Input, Math as MathP, Scene } from "phaser";

enum Values {
    UP = "Arriba",
    DOWN = "Abajo",
    LEFT = "Izquierda",
    RIGHT = "Derecha",
}

enum States {
    Beginning,
    SimonTurn,
    SayingTurn,
    PlayersTurn,
    ListeningPlayer,
    EvaluateTurn,
    PostEvaluateTurn,
    CriticalTurn,
    GameOver,
}

interface KeysPlayer {
    up: Input.Keyboard.Key;
    down: Input.Keyboard.Key;
    left: Input.Keyboard.Key;
    right: Input.Keyboard.Key;
}

export class SimonSays extends Scene {
    player_one: Player | null = null;
    player_two: Player | null = null;
    simon: Simon | null = null;

    half_width: number = 0;
    half_height: number = 0;
    width: number = 0;
    height: number = 0;

    player_one_positionX: number = 0;
    player_two_positionX: number = 0;

    state: States = States.Beginning;
    simonSaysValues: Values[] = [];

    player_one_values: Values[] = [];
    player_two_values: Values[] = [];
    listen_player_one_keys: boolean = false;
    listen_player_two_keys: boolean = false;
    keys_player_one: KeysPlayer | null = null;
    keys_player_two: KeysPlayer | null = null;

    constructor() {
        super({
            key: "SimonSays",
        });
    }
    preload() {
        console.log("Preload SimonDice");

        [this.half_width, this.half_height, this.width, this.height] =
            calculateDimensions(this);

        this.player_one_positionX = 100;
        this.player_two_positionX = this.width - 100;

        this.player_one = new Player(
            this,
            this.player_one_positionX,
            this.half_height,
            getStore("p1Asset")
        );
        this.player_one.setFlipX(true);
        this.player_one.setScale(SCALE_FACTOR);

        this.player_two = new Player(
            this,
            this.player_two_positionX,
            this.half_height,
            getStore("p2Asset")
        );
        this.player_two.setScale(SCALE_FACTOR);

        this.simon = new Simon(
            this,
            this.half_width,
            this.half_height - 200,
            "panda"
        );
        this.simon.setScale(SCALE_FACTOR * 1.2);

        this.keys_player_one = this.input.keyboard!.addKeys({
            up: Input.Keyboard.KeyCodes.W,
            down: Input.Keyboard.KeyCodes.S,
            left: Input.Keyboard.KeyCodes.A,
            right: Input.Keyboard.KeyCodes.D,
        }) as unknown as KeysPlayer;

        this.keys_player_two = this.input.keyboard!.addKeys({
            up: Input.Keyboard.KeyCodes.UP,
            down: Input.Keyboard.KeyCodes.DOWN,
            left: Input.Keyboard.KeyCodes.LEFT,
            right: Input.Keyboard.KeyCodes.RIGHT,
        }) as unknown as KeysPlayer;
    }
    create() {
        console.log("Create SimonDice");
        this.add.existing(this.player_one!);
        this.add.existing(this.player_two!);
        this.time.delayedCall(1000, () => {
            this.state = States.SimonTurn;
        });
    }

    update() {
        switch (this.state) {
            case States.SimonTurn:
                this.simonTurn();
                break;
            case States.PlayersTurn:
                this.playersTurn();
                break;
            case States.EvaluateTurn:
                this.evaluateTurn();
                break;
            case States.CriticalTurn:
                this.criticalTurn();
                break;
            case States.GameOver:
                this.gameOver();
                break;
        }
    }
    evaluateTurn() {
        this.state = States.PostEvaluateTurn;
        this.time.delayedCall(1000, () => {
            const player_one_correct = this.compareAnswers(
                this.player_one_values,
                true
            );
            const player_two_correct = this.compareAnswers(
                this.player_two_values,
                true
            );

            if (player_one_correct && player_two_correct) {
                this.drawText(
                    "Empate",
                    this.half_width,
                    this.half_height,
                    1000
                );
            } else if (player_one_correct) {
                this.drawText(
                    "Gano el jugador 1",
                    this.half_width,
                    this.half_height,
                    1000
                );
            } else if (player_two_correct) {
                this.drawText(
                    "Gano el jugador 2",
                    this.half_width,
                    this.half_height,
                    1000
                );
            } else {
                this.drawText(
                    "Perdieron los dos",
                    this.half_width,
                    this.half_height,
                    1000
                );
            }
            this.time.delayedCall(1000, () => {
                this.state = States.SimonTurn;
            });
        });
    }
    simonTurn() {
        const newValue = this.getRandomValue();
        this.simonSaysValues.push(newValue);
        const simon_time = calculateLogarithmTime(
            this.simonSaysValues.length,
            TIME_SIMON_SAYS
        );
        const total_time =
            simon_time * this.simonSaysValues.length +
            800 * this.simonSaysValues.length;
        console.log("Simon Time: ", simon_time);
        console.log("Simon Says: ", this.simonSaysValues);
        console.log("Total Time: ", total_time);
        this.state = States.SayingTurn;
        for (let i = 0; i < this.simonSaysValues.length; i++) {
            const letter = this.simonSaysValues[i];
            this.time.addEvent({
                delay: simon_time * i + 500,
                callback: () => {
                    this.drawValue(
                        letter,
                        this.half_width,
                        this.half_height,
                        simon_time - 200
                    );
                    this.sound.play("placeholder");
                },
            });
        }
        this.time.delayedCall(total_time + 200, () => {
            this.state = States.PlayersTurn;
            this.player_one_values = [];
            this.player_two_values = [];
            this.listen_player_one_keys = true;
            this.listen_player_two_keys = true;
            this.drawText("Tu turno", this.half_width, this.half_height, 1000);
            const player_time =
                calculateLogarithmTime(
                    this.simonSaysValues.length,
                    TIME_SIMON_SAYS_PLAYER
                ) * this.simonSaysValues.length;
            this.time.delayedCall(player_time, () => {
                this.listen_player_one_keys = false;
                this.listen_player_two_keys = false;
                this.state = States.EvaluateTurn;
                this.drawText(
                    "Se acabo el tiempo",
                    this.half_width,
                    this.half_height,
                    1000
                );
            });
        });
    }

    compareAnswers(values: Values[], final: boolean = false): boolean {
        console.log("Simon Says: ", this.simonSaysValues);
        console.log("Player Says: ", values);
        if (values.length !== this.simonSaysValues.length && final) {
            return false;
        }
        for (let i = 0; i < values.length; i++) {
            if (values[i] !== this.simonSaysValues[i]) {
                return false;
            }
        }
        return true;
    }

    getAnswer(value: Values, isPlayerOne: boolean) {
        if (
            isPlayerOne &&
            this.player_one_values.length < this.simonSaysValues.length
        ) {
            this.player_one_values.push(value);
            //this.listen_player_one_keys = this.compareAnswers(this.player_one_values);
            //return this.listen_player_one_keys;
        } else if (
            !isPlayerOne &&
            this.player_two_values.length < this.simonSaysValues.length
        ) {
            this.player_two_values.push(value);
            //this.listen_player_two_keys = this.compareAnswers(this.player_two_values);
            //return this.listen_player_two_keys;
        }

        if (this.player_one_values.length === this.simonSaysValues.length) {
            this.listen_player_one_keys = false;
        }
        if (this.player_two_values.length === this.simonSaysValues.length) {
            this.listen_player_two_keys = false;
        }
    }

    playersTurn() {
        if (this.listen_player_one_keys) {
            if (
                this.input.keyboard!.checkDown(
                    this.keys_player_one!.up,
                    TIME_CHECK_KEY_PRESSED
                )
            ) {
                this.drawText(
                    "Arriba",
                    this.player_one_positionX,
                    this.player_one!.y - 100,
                    TIME_TEXT_PLAYER
                );
                this.getAnswer(Values.UP, true);
            } else if (
                this.input.keyboard!.checkDown(
                    this.keys_player_one!.down,
                    TIME_CHECK_KEY_PRESSED
                )
            ) {
                this.drawText(
                    "Abajo",
                    this.player_one_positionX,
                    this.player_one!.y - 100,
                    TIME_TEXT_PLAYER
                );
                this.getAnswer(Values.DOWN, true);
            } else if (
                this.input.keyboard!.checkDown(
                    this.keys_player_one!.left,
                    TIME_CHECK_KEY_PRESSED
                )
            ) {
                this.drawText(
                    "Izquierda",
                    this.player_one_positionX,
                    this.player_one!.y - 100,
                    TIME_TEXT_PLAYER
                );
                this.getAnswer(Values.LEFT, true);
            } else if (
                this.input.keyboard!.checkDown(
                    this.keys_player_one!.right,
                    TIME_CHECK_KEY_PRESSED
                )
            ) {
                this.drawText(
                    "Derecha",
                    this.player_one_positionX,
                    this.player_one!.y - 100,
                    TIME_TEXT_PLAYER
                );
                this.getAnswer(Values.RIGHT, true);
            }
        }
        if (this.listen_player_two_keys) {
            if (
                this.input.keyboard!.checkDown(
                    this.keys_player_two!.up,
                    TIME_CHECK_KEY_PRESSED
                )
            ) {
                this.drawText(
                    "Arriba",
                    this.player_two_positionX,
                    this.player_two!.y - 100,
                    TIME_TEXT_PLAYER
                );
                this.getAnswer(Values.UP, false);
            } else if (
                this.input.keyboard!.checkDown(
                    this.keys_player_two!.down,
                    TIME_CHECK_KEY_PRESSED
                )
            ) {
                this.drawText(
                    "Abajo",
                    this.player_two_positionX,
                    this.player_two!.y - 100,
                    TIME_TEXT_PLAYER
                );
                this.getAnswer(Values.DOWN, false);
            } else if (
                this.input.keyboard!.checkDown(
                    this.keys_player_two!.left,
                    TIME_CHECK_KEY_PRESSED
                )
            ) {
                this.drawText(
                    "Izquierda",
                    this.player_two_positionX,
                    this.player_two!.y - 100,
                    TIME_TEXT_PLAYER
                );
                this.getAnswer(Values.LEFT, false);
            } else if (
                this.input.keyboard!.checkDown(
                    this.keys_player_two!.right,
                    TIME_CHECK_KEY_PRESSED
                )
            ) {
                this.drawText(
                    "Derecha",
                    this.player_two_positionX,
                    this.player_two!.y - 100,
                    TIME_TEXT_PLAYER
                );
                this.getAnswer(Values.RIGHT, false);
            }
        }
    }
    criticalTurn() {}
    gameOver() {}

    getRandomValue(): Values {
        const values_array = Object.values(Values);
        const index_values = MathP.Between(0, values_array.length - 1);
        return values_array[index_values];
    }

    drawText(text: string, x: number, y: number, time: number) {
        const text_object = this.add.text(x, y, text, {
            fontSize: "40px",
            color: "#000000",
        });
        text_object.setOrigin(0.5);
        this.time.delayedCall(time, () => {
            text_object.destroy();
        });
    }

    drawValue(value: Values, x: number, y: number, time: number) {
        const text = this.add.text(x, y, value, {
            fontSize: "40px",
            color: "#000000",
        });
        text.setOrigin(0.5);

        this.time.delayedCall(time, () => {
            text.destroy();
        });
    }
}
