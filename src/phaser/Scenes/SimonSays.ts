import { Clothes, Garment, Player, Simon, Pay } from "@phaser/Objects";
import {
    SCALE_FACTOR,
    TIME_CHECK_KEY_PRESSED,
    TIME_SIMON_SAYS,
    TIME_SIMON_SAYS_PLAYER,
    TIME_TEXT_PLAYER,
    TURNS_TO_CRITIC,
    calculateDimensions,
    calculateLogarithmTime,
} from "@phaser/Util";
import { BarResult, BarState, TimerState } from "@store/defaultStore";
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
    ListeningFirstCriticalTurn,
    ListeningSecondCriticalTurn,
    EvaluateCriticalTurn,
    AnimatingAttackP1,
    AnimatingAttackP2,
    Animating,
    CheckingEnd,
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

    clothes_player_one: Clothes[] = [];
    clothes_player_two: Clothes[] = [];

    player_one_barUsed: boolean = false;
    player_two_barUsed: boolean = false;

    total_time_player_one: number = 0;
    total_time_player_two: number = 0;
    start_player_one: boolean = false;

    player_one_result_bar: BarResult = BarResult.Fallo;
    player_two_result_bar: BarResult = BarResult.Fallo;

    constructor() {
        super({
            key: "SimonSays",
        });
    }
    preload() {
        [this.half_width, this.half_height, this.width, this.height] =
            calculateDimensions(this);

        this.player_one_positionX = 200;
        this.player_two_positionX = this.width - 200;

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
            this.half_height - 150,
            "panda"
        );
        this.simon.setScale(SCALE_FACTOR * .8);

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

        this.clothes_player_one = [
            new Clothes(this, [
                new Garment(
                    this,
                    this.player_one_positionX,
                    this.player_one!.y,
                    "pantalon_p1"
                ),
                new Garment(
                    this,
                    this.player_one_positionX,
                    this.player_one!.y,
                    "overol_p1"
                ),
            ]),
        ];

        this.clothes_player_two = [
            new Clothes(this, [
                new Garment(
                    this,
                    this.player_two_positionX,
                    this.player_two!.y,
                    "pantalon_p2"
                ),
                new Garment(
                    this,
                    this.player_two_positionX,
                    this.player_two!.y,
                    "overol_p2"
                ),
            ]),
        ];

        
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
                console.log("Turno de simon");
                this.simonTurn();
                break;
            case States.PlayersTurn:
                console.log("Turno de los jugadores");
                this.playerTurn();
                break;
            case States.ListeningPlayer:
                console.log("Escuchando a los jugadores");
                this.listenPlayers();
                break;
            case States.EvaluateTurn:
                console.log("Evaluando turno");
                this.evaluateTurn();
                break;
            case States.CriticalTurn:
                console.log("Turno critico");
                this.criticalTurn();
                break;
            case States.ListeningFirstCriticalTurn:
                console.log("Escuchando primer turno critico");
                this.listeningFirstCriticalTurn();
                break;
            case States.ListeningSecondCriticalTurn:
                console.log("Escuchando segundo turno critico");
                this.listeningSecondCriticalTurn();
                break;
            case States.GameOver:
                console.log("Game Over");
                this.gameOver();
                break;
            case States.EvaluateCriticalTurn:
                console.log("Evaluando turno critico");
                this.evaluateCriticalTurn();
                break;
            case States.AnimatingAttackP1:
                this.animateAttackP1();
                break;
            case States.AnimatingAttackP2:
                this.animateAttackP2();
                break;
            case States.CheckingEnd:
                this.checkingEnd();
                break;
        }
    }
    listeningSecondCriticalTurn() {
        if (!this.start_player_one) {
            this.checkAnyKeyPressedPlayerOne();
        } else {
            this.checkAnyKeyPressedPlayerTwo();
        }
    }
    checkGameOver() {
        if (this.state !== States.GameOver) {
            if (this.clothes_player_one.length === 0) {
                this.state = States.GameOver;
                this.drawPermanentText(
                    `Gano el jugador ${getStore<string>("p2Name")}`,
                    this.half_width,
                    this.half_height
                );
            } else if (this.clothes_player_two.length === 0) {
                this.state = States.GameOver;
                this.drawPermanentText(
                    `Gano el jugador ${getStore<string>("p1Name")}`,
                    this.half_width,
                    this.half_height
                );
            }
        }
    }
    listeningFirstCriticalTurn() {
        if (this.start_player_one) {
            if (this.checkAnyKeyPressedPlayerOne()) {
                this.checkGameOver();
                if (this.state === States.GameOver) {
                    return;
                }
                this.state = States.ListeningSecondCriticalTurn;
                this.drawText(
                    `Presiona cualquier tecla para detener la barra ${getStore<string>(
                        "p2Name"
                    )}`,
                    this.half_width,
                    this.half_height,
                    1000
                );
                setStore("timerTiempoMaximo", 5000);
                setStore("timerState", TimerState.Start);
                setStore("p2BarState", BarState.Active);
                const removeSubscriptionTimer = subscribeStore(
                    "timerValue",
                    (valueSubscription?: number) => {
                        if (valueSubscription === 0) {
                            if (!this.player_two_barUsed) {
                                setStore("p2BarState", BarState.Stop);
                                this.player_two_barUsed = true;
                            }
                            this.checkP2BarResult(
                                getStore<BarResult>("p2BarResult")
                            );
                            removeSubscriptionTimer();
                        }
                    }
                );
            }
        } else {
            if (this.checkAnyKeyPressedPlayerTwo()) {
                this.checkGameOver();
                if (this.state === States.GameOver) {
                    return;
                }
                this.state = States.ListeningSecondCriticalTurn;

                this.drawText(
                    `Presiona cualquier tecla para detener la barra ${getStore<string>(
                        "p1Name"
                    )}`,
                    this.half_width,
                    this.half_height,
                    1000
                );
                setStore("timerTiempoMaximo", 5000);
                setStore("timerState", TimerState.Start);
                setStore("p1BarState", BarState.Active);
                const removeSubscriptionTimer = subscribeStore(
                    "timerValue",
                    (valueSubscription?: number) => {
                        this.timeLeft = valueSubscription ?? 0;
                        if (valueSubscription === 0) {
                            if (!this.player_one_barUsed) {
                                setStore("p1BarState", BarState.Stop);
                                this.player_one_barUsed = true;
                            }
                            this.checkP1BarResult(
                                getStore<BarResult>("p1BarResult")
                            );
                            removeSubscriptionTimer();
                        }
                    }
                );
            }
        }
    }

    evaluateCriticalTurn() {
        if (this.start_player_one) {
            this.state = States.AnimatingAttackP1;
        } else {
            this.state = States.AnimatingAttackP2;
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

            setStore("p1Score", this.score_player_one);
            setStore("p2Score", this.score_player_two);

            this.time.delayedCall(1000, () => {
                if (this.rounds_played % TURNS_TO_CRITIC === 0) {
                    this.state = States.CriticalTurn;
                    this.prepareCriticalTurn();
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
                    this.simon!.setFlipX(true);
                }
                this.simon!.anims.play("left", false).on(
                    Animations.Events.ANIMATION_COMPLETE,
                    () => {
                        if (this.simon!.flipX) {
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
            this.total_time_player_one += this.timeLeft;
        }
        if (this.player_two_values.length === this.simonSaysValues.length) {
            this.listen_player_two_keys = false;
            this.times_player_two += this.timeLeft;
            this.total_time_player_two += this.timeLeft;
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
            this.clothes_player_one.forEach((clothes) => {
                clothes.playAnimationAll("jump");
            });
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
            this.clothes_player_one.forEach((clothes) => {
                clothes.playAnimationAll("crouch");
            });
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
                this.player_one!.setFlipX(false);
            }
            this.player_one!.anims.play("left", false).on(
                Animations.Events.ANIMATION_COMPLETE,
                () => {
                    if (!this.player_one!.flipX) {
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

    prepareCriticalTurn() {
        if (this.total_time_player_one > this.total_time_player_two) {
            this.start_player_one = true;
        } else {
            this.start_player_one = false;
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
            this.clothes_player_two.forEach((clothes) => {
                clothes.playAnimationAll("jump");
            });
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
            this.clothes_player_two.forEach((clothes) => {
                clothes.playAnimationAll("crouch");
            });
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
            this.clothes_player_two.forEach((clothes) => {
                clothes.playAnimationAll("left");
            });
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
                this.player_two!.setFlipX(true);
                this.clothes_player_two.forEach((clothes) => {
                    clothes.setFlipXAll(true);
                });
            }
            this.clothes_player_two.forEach((clothes) => {
                clothes.playAnimationAll("left");
            });
            this.player_two!.anims.play("left", false).on(
                Animations.Events.ANIMATION_COMPLETE,
                () => {
                    if (this.player_two!.flipX) {
                        this.player_two!.setFlipX(false);
                        this.clothes_player_two.forEach((clothes) => {
                            clothes.setFlipXAll(false);
                        });
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

    removeOneGarmentPlayerOne() {
        if (this.clothes_player_one.length > 0) {
            const clothes = this.clothes_player_one.pop();
            clothes!.removeAllGarments();
        }
    }

    removeOneGarmentPlayerTwo() {
        if (this.clothes_player_two.length > 0) {
            const clothes = this.clothes_player_two.pop();
            clothes!.removeAllGarments();
        }
    }

    checkToEvaluateCriticalTurn() {
        if (this.player_one_barUsed && this.player_two_barUsed) {
            this.state = States.EvaluateCriticalTurn;
        }
    }

    checkP1BarResult(result: BarResult) {
        this.player_one_result_bar = result;
        console.log("Result P1:", result);
        this.checkToEvaluateCriticalTurn();
    }

    checkP2BarResult(result: BarResult) {
        console.log("Result P2:", result);
        this.player_two_result_bar = result;
        this.checkToEvaluateCriticalTurn();
    }

    criticalTurn() {
        this.state = States.ListeningFirstCriticalTurn;
        this.player_one_barUsed = false;
        this.player_two_barUsed = false;
        if (this.start_player_one) {
            console.log("Inicia el p1");
            this.drawText(
                `       ${getStore<string>(
                    "p1Name"
                )} \nPresiona cualquier tecla\n para detener la barra`,
                this.half_width,
                this.half_height,
                3000
            );
            setStore("timerTiempoMaximo", 5000);
            setStore("timerState", TimerState.Start);
            setStore("p1BarState", BarState.Active);
            const removeSubscriptionTimer = subscribeStore(
                "timerValue",
                (valueSubscription?: number) => {
                    this.timeLeft = valueSubscription ?? 0;
                    if (valueSubscription === 0) {
                        if (!this.player_one_barUsed) {
                            setStore("p1BarState", BarState.Stop);
                            this.player_one_barUsed = true;
                        }
                        this.checkP1BarResult(
                            getStore<BarResult>("p1BarResult")
                        );
                        removeSubscriptionTimer();
                    }
                }
            );
            const removeSubscriptionBar = subscribeStore(
                "p1BarState",
                (valueSubscription?: BarState) => {
                    if (valueSubscription === BarState.Stop) {
                        this.checkP1BarResult(this.player_one_result_bar);
                        removeSubscriptionBar();
                    }
                }
            );
        } else {
            console.log("Inicia el p2");
            this.drawText(
                `        ${getStore<string>(
                    "p2Name"
                )} \nPresiona cualquier tecla\n para detener la barra`,
                this.half_width,
                this.half_height,
                3000
            );
            setStore("timerTiempoMaximo", 5000);
            setStore("timerState", TimerState.Start);
            setStore("p2BarState", BarState.Active);
            const removeSubscriptionTimer = subscribeStore(
                "timerValue",
                (valueSubscription?: number) => {
                    this.timeLeft = valueSubscription ?? 0;
                    if (valueSubscription === 0) {
                        if (!this.player_two_barUsed) {
                            setStore("p2BarState", BarState.Stop);
                            this.player_two_barUsed = true;
                        }
                        this.checkP2BarResult(
                            getStore<BarResult>("p2BarResult")
                        );
                        removeSubscriptionTimer();
                    }
                }
            );
        }
    }
    checkAnyKeyPressedPlayerOne() {
        if (
            (this.keys_player_one!.up.isDown ||
                this.keys_player_one!.down.isDown ||
                this.keys_player_one!.left.isDown ||
                this.keys_player_one!.right.isDown) &&
            !this.player_one_barUsed
        ) {
            console.log("Lo detuvo el p1");
            setStore("p1BarState", BarState.Stop);
            this.player_one_barUsed = true;
            return true;
        }
        return false;
    }
    checkAnyKeyPressedPlayerTwo() {
        if (
            (this.keys_player_two!.up.isDown ||
                this.keys_player_two!.down.isDown ||
                this.keys_player_two!.left.isDown ||
                this.keys_player_two!.right.isDown) &&
            !this.player_two_barUsed
        ) {
            console.log("Lo detuvo el p2");
            setStore("p2BarState", BarState.Stop);
            this.player_two_barUsed = true;
            return true;
        }
        return false;
    }
    gameOver() {
        //TODO:Agregar animacion de game over
    }

    getRandomValue(): ValueSimon {
        const values_array = Object.values(ValueSimon);
        const index_values = MathP.Between(0, values_array.length - 1);
        return values_array[index_values];
    }

    drawText(text: string, x: number, y: number, time: number) {
        const text_object = this.add.text(x, y, text, {
            fontSize: "20px",
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
            color: "#000000"
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

    animateAttackP1(){
        this.state = States.Animating;
        /*if (this.start_player_one) {
            this.state = States.AnimatingAttackP1;
        } else {
            this.state = States.AnimatingAttackP2;
        }*/
        if (this.player_one_result_bar === BarResult.Acierto) {
            //TODO:Agregar animacion de quitar ropa
            this.removeOneGarmentPlayerTwo();
            if(this.start_player_one){
                this.animarPayBomba(States.AnimatingAttackP2, true);
            }
            else{
                this.animarPayBomba(States.CheckingEnd, true);
            }
        } else if (this.player_one_result_bar === BarResult.Critico) {
            //TODO:Agregar animacion de quitar ropa a uno mismo P1
            this.removeOneGarmentPlayerOne();
            if(this.start_player_one){
                this.animarPayNuclear(States.AnimatingAttackP2, true);
            }
            else{
                this.animarPayNuclear(States.CheckingEnd, true);
            }
        }
        else{
            if(this.start_player_one){
                this.animarPayFake(States.AnimatingAttackP2);
            }
            else{
                this.animarPayFake(States.CheckingEnd);
            }
        }
    }

    animateAttackP2(){
        this.state = States.Animating;
        if (this.player_two_result_bar === BarResult.Acierto) {
            //TODO:Agregar animacion de quitar ropa
            this.removeOneGarmentPlayerOne();
            if(this.start_player_one){
                this.animarPayBomba(States.CheckingEnd, false);
            }
            else{
                this.animarPayBomba(States.AnimatingAttackP1, false);
            }
        } else if (this.player_two_result_bar === BarResult.Critico) {
            //TODO:Agregar animacion de quitar ropa a uno mismo P2
            this.removeOneGarmentPlayerTwo();
            if(this.start_player_one){
                this.animarPayNuclear(States.CheckingEnd, false);
            }
            else{
                this.animarPayNuclear(States.AnimatingAttackP1, false);
            }
        }
        else{
            if(this.start_player_one){
                this.animarPayFake(States.CheckingEnd);
            }
            else{
                this.animarPayFake(States.AnimatingAttackP1);
            }
            
        }
    }

    checkingEnd(){
        this.total_time_player_one = 0;
        this.total_time_player_two = 0;
        this.player_one_barUsed = false;
        this.player_two_barUsed = false;
        this.state = States.SimonTurn;
        this.checkGameOver();
    }

    animarPayFake(state : States){
        let payFake1 = new Pay(this, 100, this.half_height+40, "pays");
        payFake1.setScale(SCALE_FACTOR * 1);

        let payFake2 = new Pay(this, this.width-100, this.half_height+40, "pays");
        payFake2.setScale(SCALE_FACTOR * 1);

        payFake1.anims.play("pay_fake", false)

        payFake2.anims.play("pay_fake", false).on(
            Animations.Events.ANIMATION_COMPLETE,
            () => {
                console.log("Finalizo la animacion");
                payFake1.destroy();
                payFake2.destroy();
                this.state = state;
            }
        );
    }

    animarPayNuclear(state : States, isPlayerOne: boolean){
        let payFake;
        let payNuc;
        if(isPlayerOne){
            payNuc = new Pay(this, 100, this.half_height+40, "pays");   
            payFake = new Pay(this, this.width-100, this.half_height+40, "pays");
        }
        else{
            payFake = new Pay(this, 100, this.half_height+40, "pays");   
            payNuc = new Pay(this, this.width-100, this.half_height+40, "pays");
        }



        payNuc.anims.play("pay_nuc", false).on(
            Animations.Events.ANIMATION_COMPLETE,
            () => {
                console.log("Finalizo la animacion de bomba");
                payNuc.destroy();
                this.checkGameOver();
                if(this.state != States.GameOver){
                    this.state = state;
                }
            }
        );

        payFake.anims.play("pay_fake", false).on(
            Animations.Events.ANIMATION_COMPLETE,
            () => {
                console.log("Finalizo la animacion");
                payFake.destroy();
            }
        );
    }

    animarPayBomba(state : States, isPlayerOne: boolean){
        let payFake;
        let payBomba;
        if(isPlayerOne){
            payFake = new Pay(this, 100, this.half_height+40, "pays");   
            payBomba = new Pay(this, this.width-100, this.half_height+40, "pays");
        }
        else{
            payBomba = new Pay(this, 100, this.half_height+40, "pays");   
            payFake = new Pay(this, this.width-100, this.half_height+40, "pays");
        }



        payBomba.anims.play("pay_exp", false).on(
            Animations.Events.ANIMATION_COMPLETE,
            () => {
                console.log("Finalizo la animacion de bomba");
                payBomba.destroy();
                this.checkGameOver();
                if(this.state != States.GameOver){
                    this.state = state;
                }
            }
        );

        payFake.anims.play("pay_fake", false).on(
            Animations.Events.ANIMATION_COMPLETE,
            () => {
                console.log("Finalizo la animacion");
                payFake.destroy();
            }
        );
    }
}
