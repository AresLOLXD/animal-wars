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
import { TimerState } from "@store/defaultStore";
import { getStore, setStore, subscribeStore } from "@store/index";
import { Input, Math as MathP, Scene, Animations } from "phaser";

enum ValueSimon {
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
    simonSaysValues: ValueSimon[] = [];

    player_one_values: ValueSimon[] = [];
    player_two_values: ValueSimon[] = [];
    listen_player_one_keys: boolean = false;
    listen_player_two_keys: boolean = false;
    keys_player_one: KeysPlayer | null = null;
    keys_player_two: KeysPlayer | null = null;

    score_player_one: number = 0;
    score_player_two: number = 0;

    times_player_one: number = 0;
    times_player_two: number = 0;

    rounds_played: number = 0;
    rounds_played_text: Phaser.GameObjects.Text | null = null;

    timeLeft: number = 0;
    points_player_one_text: Phaser.GameObjects.Text | null = null;
    points_player_two_text: Phaser.GameObjects.Text | null = null;

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
            getStore<string>("p1Asset")
        );
        this.player_one.setFlipX(true);
        this.player_one.setScale(SCALE_FACTOR);

        this.player_two = new Player(
            this,
            this.player_two_positionX,
            this.half_height,
            getStore<string>("p2Asset")
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

        this.points_player_one_text = this.add.text(
            this.player_one_positionX,
            this.player_one!.y + 150,
            "Puntos: 0",
            {
                fontSize: "20px",
                color: "#000000",
            }
        );
        this.points_player_one_text.setOrigin(0.5);

        this.points_player_two_text = this.add.text(
            this.player_two_positionX,
            this.player_two!.y + 150,
            "Puntos: 0",
            {
                fontSize: "20px",
                color: "#000000",
            }
        );
        this.points_player_two_text.setOrigin(0.5);

        this.rounds_played_text = this.add.text(
            this.half_width + 150,
            this.half_height - 200,
            "Ronda: 0",
            {
                fontSize: "20px",
                color: "#000000",
            }
        );
        this.rounds_played_text.setOrigin(0.5);
    }

    redrawTextPoints() {
        this.points_player_one_text!.setText(
            `Puntos: ${this.score_player_one}`
        );
        this.points_player_two_text!.setText(
            `Puntos: ${this.score_player_two}`
        );
    }

    create() {
        console.log("Create SimonDice");
        this.add.existing(this.player_one!);
        this.add.existing(this.player_two!);
        this.time.delayedCall(1000, () => {
            this.state = States.SimonTurn;
        });

        this.drawPermanentText(
            getStore<string>("p1Name"),
            this.player_one_positionX,
            this.player_one!.y - 80
        );
        this.drawPermanentText(
            getStore<string>("p2Name"),
            this.player_two_positionX,
            this.player_two!.y - 80
        );
    }

    update() {
        this.redrawTextPoints();
        switch (this.state) {
            case States.SimonTurn:
                this.simonTurn();
                break;
            case States.PlayersTurn:
                this.playerTurn();

                break;
            case States.ListeningPlayer:
                this.listenPlayers();
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
    playerTurn() {
        this.state = States.ListeningPlayer;
        this.player_one_values = [];
        this.player_two_values = [];
        this.listen_player_one_keys = true;
        this.listen_player_two_keys = true;
        this.drawText("Tu turno", this.half_width, this.half_height, 1000);
        const player_time =
            calculateLogarithmTime(this.rounds_played, TIME_SIMON_SAYS_PLAYER) *
            this.simonSaysValues.length;
        console.log("Player Time: ", player_time);
        setStore("timerTiempoMaximo", player_time);
        setStore("timerState", TimerState.Start);
        const removeSubscriptionTimer = subscribeStore(
            "timerValue",
            (valueSubscription?: number) => {
                this.timeLeft = valueSubscription ?? 0;
                if (valueSubscription === 0) {
                    removeSubscriptionTimer();
                }
            }
        );
        const removeSubscription = subscribeStore(
            "timerState",
            (valueSubscription?: TimerState) => {
                if (valueSubscription === TimerState.Stop) {
                    this.listen_player_one_keys = false;
                    this.listen_player_two_keys = false;
                    this.state = States.EvaluateTurn;
                    this.drawText(
                        "Se acabo el tiempo",
                        this.half_width,
                        this.half_height,
                        1000
                    );
                    removeSubscription();
                }
            }
        );
    }

    restartSimonSaysValues() {
        this.simonSaysValues = [];
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
                if (this.simonSaysValues.length % 3 === 0) {
                    if (this.times_player_one > this.times_player_two) {
                        this.score_player_one++;
                    } else if (this.times_player_one < this.times_player_two) {
                        this.score_player_two++;
                    }
                }
            } else if (player_one_correct) {
                this.score_player_one++;
                this.score_player_two--;
                this.restartSimonSaysValues();
                this.drawText(
                    "Gano el jugador 1",
                    this.half_width,
                    this.half_height,
                    1000
                );
            } else if (player_two_correct) {
                this.score_player_two++;
                this.score_player_one--;
                this.restartSimonSaysValues();
                this.drawText(
                    "Gano el jugador 2",
                    this.half_width,
                    this.half_height,
                    1000
                );
            } else {
                this.score_player_one--;
                this.score_player_two--;
                this.restartSimonSaysValues();
                this.drawText(
                    "Perdieron los dos",
                    this.half_width,
                    this.half_height,
                    1000
                );
            }
            this.time.delayedCall(1000, () => {
                if (this.rounds_played % 9 === 0) {
                    this.state = States.CriticalTurn;
                } else {
                    this.state = States.SimonTurn;
                }
            });
        });
    }
    playAnimSimonByValue(value: ValueSimon) {
        switch (value) {
            case ValueSimon.UP:
                this.sound.rate = 1;
                this.sound.play("animal_up");

                this.simon!.anims.play("jump", false).on(
                    Animations.Events.ANIMATION_COMPLETE,
                    () => {
                        this.simon!.anims.play("idle", true);
                    }
                );
                break;
            case ValueSimon.DOWN:
                this.sound.play("animal_down");
                this.simon!.anims.play("crouch", false).on(
                    Animations.Events.ANIMATION_COMPLETE,
                    () => {
                        this.simon!.anims.play("idle", true);
                    }
                );
                break;
            case ValueSimon.LEFT:
                this.sound.play("animal_left");
                this.simon!.anims.play("left", false).on(
                    Animations.Events.ANIMATION_COMPLETE,
                    () => {
                        this.simon!.anims.play("idle", true);
                    }
                );
                break;
            case ValueSimon.RIGHT:
                this.sound.play("animal_right");
                if (!this.simon!.flipX) {
                    console.log("Flip");
                    this.simon!.setFlipX(true);
                }
                this.simon!.anims.play("left", false).on(
                    Animations.Events.ANIMATION_COMPLETE,
                    () => {
                        if (this.simon!.flipX) {
                            console.log("Reflip");
                            this.simon!.setFlipX(false);
                        }
                        this.simon!.anims.play("idle", true);
                    }
                );
                break;
        }
    }

    redrawRoundsPlayed() {
        this.rounds_played_text!.setText(`Ronda: ${this.rounds_played}`);
    }

    simonTurn() {
        this.player_one!.anims.play("idle", true);
        this.player_two!.anims.play("idle", true);
        this.simon!.anims.play("idle", true);
        const newValue = this.getRandomValue();
        this.simonSaysValues.push(newValue);
        this.rounds_played++;
        this.redrawRoundsPlayed();
        const simon_time = calculateLogarithmTime(
            this.simonSaysValues.length,
            TIME_SIMON_SAYS
        );
        const total_time =
            simon_time * this.simonSaysValues.length +
            500 * this.simonSaysValues.length;
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
                    this.playAnimSimonByValue(letter);
                },
            });
        }
        this.time.delayedCall(total_time + 200, () => {
            this.state = States.PlayersTurn;
        });
    }

    compareAnswers(values: ValueSimon[], final: boolean = false): boolean {
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

    getAnswer(value: ValueSimon, isPlayerOne: boolean) {
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
            this.times_player_one += this.timeLeft;
        }
        if (this.player_two_values.length === this.simonSaysValues.length) {
            this.listen_player_two_keys = false;
            this.times_player_two += this.timeLeft;
        }
    }

    checkPlayerOneKeys() {
        if (
            this.input.keyboard!.checkDown(
                this.keys_player_one!.up,
                TIME_CHECK_KEY_PRESSED
            )
        ) {
            this.player_one!.anims.play("jump", false).on(
                Animations.Events.ANIMATION_COMPLETE,
                () => {
                    this.player_one!.anims.play("idle", true);
                }
            );
            this.drawText(
                "Arriba",
                this.player_one_positionX,
                this.player_one!.y - 100,
                TIME_TEXT_PLAYER
            );
            this.getAnswer(ValueSimon.UP, true);
        } else if (
            this.input.keyboard!.checkDown(
                this.keys_player_one!.down,
                TIME_CHECK_KEY_PRESSED
            )
        ) {
            this.player_one!.anims.play("crouch", false).on(
                Animations.Events.ANIMATION_COMPLETE,
                () => {
                    this.player_one!.anims.play("idle", true);
                }
            );
            this.drawText(
                "Abajo",
                this.player_one_positionX,
                this.player_one!.y - 100,
                TIME_TEXT_PLAYER
            );
            this.getAnswer(ValueSimon.DOWN, true);
        } else if (
            this.input.keyboard!.checkDown(
                this.keys_player_one!.left,
                TIME_CHECK_KEY_PRESSED
            )
        ) {
            if (this.player_one!.flipX) {
                console.log("Flip");
                this.player_one!.setFlipX(false);
            }
            this.player_one!.anims.play("left", false).on(
                Animations.Events.ANIMATION_COMPLETE,
                () => {
                    if (!this.player_one!.flipX) {
                        console.log("Reflip");
                        this.player_one!.setFlipX(true);
                    }
                    this.player_one!.anims.play("idle", true);
                }
            );
            this.drawText(
                "Izquierda",
                this.player_one_positionX,
                this.player_one!.y - 100,
                TIME_TEXT_PLAYER
            );
            this.getAnswer(ValueSimon.LEFT, true);
        } else if (
            this.input.keyboard!.checkDown(
                this.keys_player_one!.right,
                TIME_CHECK_KEY_PRESSED
            )
        ) {
            this.player_one!.anims.play("left", false).on(
                Animations.Events.ANIMATION_COMPLETE,
                () => {
                    this.player_one!.anims.play("idle", true);
                }
            );
            this.drawText(
                "Derecha",
                this.player_one_positionX,
                this.player_one!.y - 100,
                TIME_TEXT_PLAYER
            );
            this.getAnswer(ValueSimon.RIGHT, true);
        }
    }

    checkPlayerTwoKeys() {
        if (
            this.input.keyboard!.checkDown(
                this.keys_player_two!.up,
                TIME_CHECK_KEY_PRESSED
            )
        ) {
            this.player_two!.anims.play("jump", false).on(
                Animations.Events.ANIMATION_COMPLETE,
                () => {
                    this.player_two!.anims.play("idle", true);
                }
            );
            this.drawText(
                "Arriba",
                this.player_two_positionX,
                this.player_two!.y - 100,
                TIME_TEXT_PLAYER
            );
            this.getAnswer(ValueSimon.UP, false);
        } else if (
            this.input.keyboard!.checkDown(
                this.keys_player_two!.down,
                TIME_CHECK_KEY_PRESSED
            )
        ) {
            this.player_two!.anims.play("crouch", false).on(
                Animations.Events.ANIMATION_COMPLETE,
                () => {
                    this.player_two!.anims.play("idle", true);
                }
            );
            this.drawText(
                "Abajo",
                this.player_two_positionX,
                this.player_two!.y - 100,
                TIME_TEXT_PLAYER
            );
            this.getAnswer(ValueSimon.DOWN, false);
        } else if (
            this.input.keyboard!.checkDown(
                this.keys_player_two!.left,
                TIME_CHECK_KEY_PRESSED
            )
        ) {
            this.player_two!.anims.play("left", false).on(
                Animations.Events.ANIMATION_COMPLETE,
                () => {
                    this.player_two!.anims.play("idle", true);
                }
            );
            this.drawText(
                "Izquierda",
                this.player_two_positionX,
                this.player_two!.y - 100,
                TIME_TEXT_PLAYER
            );
            this.getAnswer(ValueSimon.LEFT, false);
        } else if (
            this.input.keyboard!.checkDown(
                this.keys_player_two!.right,
                TIME_CHECK_KEY_PRESSED
            )
        ) {
            if (!this.player_two!.flipX) {
                console.log("Flip");
                this.player_two!.setFlipX(true);
            }
            this.player_two!.anims.play("left", false).on(
                Animations.Events.ANIMATION_COMPLETE,
                () => {
                    if (this.player_two!.flipX) {
                        console.log("Reflip");
                        this.player_two!.setFlipX(false);
                    }
                    this.player_two!.anims.play("idle", true);
                }
            );
            this.drawText(
                "Derecha",
                this.player_two_positionX,
                this.player_two!.y - 100,
                TIME_TEXT_PLAYER
            );
            this.getAnswer(ValueSimon.RIGHT, false);
        }
    }

    listenPlayers() {
        if (this.listen_player_one_keys) {
            this.checkPlayerOneKeys();
        }
        if (this.listen_player_two_keys) {
            this.checkPlayerTwoKeys();
        }
    }
    criticalTurn() {}
    gameOver() {}

    getRandomValue(): ValueSimon {
        const values_array = Object.values(ValueSimon);
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

    drawPermanentText(text: string, x: number, y: number) {
        const text_object = this.add.text(x, y, text, {
            fontSize: "40px",
            color: "#000000",
        });
        text_object.setOrigin(0.5);
    }

    drawValue(value: ValueSimon, x: number, y: number, time: number) {
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
