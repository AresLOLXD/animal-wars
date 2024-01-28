import { Clothes, Garment, Player} from "@phaser/Objects";
import {
    SCALE_FACTOR,
    TIME_BATLLE_SHIP_PLAYER,
    TIME_CHECK_KEY_PRESSED,
    TIME_TEXT_PLAYER,
    calculateDimensions,
    calculateLogarithmTime,
} from "@phaser/Util";
import { TimerState } from "@store/defaultStore";
import { getStore, setStore, subscribeStore } from "@store/index";
import { Console } from "console";
import { Input, Math as MathP, Scene, Animations, UP } from "phaser";

enum Positions {
    UP = 0,
    DOWN = 1,
    LEFT = 2,
    RIGHT = 3,
    NONE = -1
}

enum States {
    TurnStart,
    Defending,
    Attacking,
    Selecting,
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

export class BattleShip extends Scene {
    player_one: Player | null = null;
    player_two: Player | null = null;

    half_width: number = 0;
    half_height: number = 0;
    width: number = 0;
    height: number = 0;

    player_one_positionX: number = 0;
    player_two_positionX: number = 0;

    state: States = States.TurnStart;

    player_one_positions: boolean[] = [true, true, true, true];
    player_one_defend: Positions = Positions.NONE;
    player_one_attack: Positions = Positions.NONE;
    player_two_positions: boolean[] = [true, true, true, true];
    player_two_defend: Positions = Positions.NONE;
    player_two_attack: Positions = Positions.NONE;
    listen_player_one_keys: boolean = false;
    listen_player_two_keys: boolean = false;
    keys_player_one: KeysPlayer | null = null;
    keys_player_two: KeysPlayer | null = null;

    score_player_one: number = 0;
    score_player_two: number = 0;

    rounds_played: number = 0;
    rounds_played_text: Phaser.GameObjects.Text | null = null;

    timeLeft: number = 0;
    points_player_one_text: Phaser.GameObjects.Text | null = null;
    points_player_two_text: Phaser.GameObjects.Text | null = null;

    clothes_player_one: Clothes[] = [];
    clothes_player_two: Clothes[] = [];

    constructor() {
        super({
            key: "BattleShip",
        });
    }
    preload() {
        console.log("Preload BattleShip");

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
        console.log("Create BattleShip");
        this.add.existing(this.player_one!);
        this.add.existing(this.player_two!);
        this.time.delayedCall(1000, () => {
            this.state = States.TurnStart;
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
            case States.TurnStart:
                this.turnStart();
                break;
            case States.Attacking:
                this.attacking();
                break;
            case States.Defending:
                this.defending();
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

    turnStart() {
        console.log("Inicio de turno");
        this.state = States.Defending;
        this.player_one_attack = Positions.NONE;
        this.player_one_defend = Positions.NONE;
        this.player_two_attack = Positions.NONE;
        this.player_two_defend = Positions.NONE;
        this.listen_player_one_keys = true;
        this.listen_player_two_keys = true;
        this.drawText("Elige tu casilla para defender", this.half_width, this.half_height, 1000);
    }

    defending(){
        this.state = States.Selecting;
        const player_time =
            calculateLogarithmTime(this.rounds_played + 1, TIME_BATLLE_SHIP_PLAYER) 
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
                    this.state = States.Attacking;
                    this.drawText(
                        "Elige la casilla del rival que vas a atacar",
                        this.half_width,
                        this.half_height,
                        1000
                    );
                    removeSubscription();
                }
            }
        );
        this.checkPlayerOneKeys();
    }

    attacking(){
        this.state = States.Selecting;
        const player_time =
            calculateLogarithmTime(this.rounds_played + 1, TIME_BATLLE_SHIP_PLAYER) 
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
                        "Ataque!",
                        this.half_width,
                        this.half_height,
                        1000
                    );
                    removeSubscription();
                }
            }
        );
        this.listenPlayers();
    }

    countPositions(positions : boolean[]) : number{
        let count: number = 0;
        for (let i = 0; i < positions.length; i++) {
            if (positions[i]) {
                count ++;
            }
        }
        return count;
    }

    evaluateTurn() {
        this.state = States.PostEvaluateTurn;
        this.time.delayedCall(1000, () => {
            if(this.player_one_attack == Positions.NONE){
                this.score_player_one --;
            }
            else if(this.player_one_attack == this.player_two_defend){
                this.score_player_one ++;
                this.score_player_two += (this.countPositions(this.player_two_positions) -3)*-1;
            }
            else{
                this.score_player_one --;
                this.player_two_positions[this.player_one_attack] = false;
            }

            if(this.player_two_attack == Positions.NONE){
                this.score_player_two --;
            }
            else if(this.player_two_attack == this.player_one_defend){
                this.score_player_two ++;
                this.score_player_one += (this.countPositions(this.player_two_positions) -3)*-1;
            }
            else{
                this.score_player_two --;
                this.player_one_positions[this.player_two_attack] = false;
            }

            if(this.countPositions(this.player_one_positions) == 1){
                for (let i = 0; i < this.player_one_positions.length; i++) {
                    this.player_one_positions[i] = true;
                }
            }

            if(this.countPositions(this.player_two_positions) == 1){
                for (let i = 0; i < this.player_two_positions.length; i++) {
                    this.player_two_positions[i] = true;
                }
            }

            setStore("p1Score", this.score_player_one);
            setStore("p2Score", this.score_player_two);

            this.time.delayedCall(1000, () => {
                if (this.rounds_played+1 % 5 === 0) {
                    this.state = States.CriticalTurn;
                } else {
                    this.state = States.TurnStart;
                }
            });
        });
    }
    

    redrawRoundsPlayed() {
        this.rounds_played_text!.setText(`Ronda: ${this.rounds_played}`);
    }


    checkOption(value: Positions, isPlayerOne: boolean) {
        if(this.state == States.Defending){
            if(isPlayerOne && this.player_one_positions[value]){
                this.player_one_defend = value;
            }
            else if(!isPlayerOne && this.player_two_positions[value]){
                this.player_two_defend = value;
            }
        }
        else if(this.state == States.Attacking){
            if(isPlayerOne && this.player_two_positions[value]){
                this.player_one_attack = value;
            }
            else if(!isPlayerOne && this.player_one_positions[value]){
                this.player_two_attack = value;
            }
        }
        
    }

    checkPlayerOneKeys() {
        if (
            this.input.keyboard!.checkDown(
                this.keys_player_one!.up,
                TIME_CHECK_KEY_PRESSED
            )
        ) {
            /*this.player_one!.anims.play("jump", false).on(
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
            );*/
            this.checkOption(Positions.UP, true);
        } else if (
            this.input.keyboard!.checkDown(
                this.keys_player_one!.down,
                TIME_CHECK_KEY_PRESSED
            )
        ) {
            /*this.player_one!.anims.play("crouch", false).on(
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
            );*/
            this.checkOption(Positions.DOWN, true);
        } else if (
            this.input.keyboard!.checkDown(
                this.keys_player_one!.left,
                TIME_CHECK_KEY_PRESSED
            )
        ) {
            /*if (this.player_one!.flipX) {
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
            );*/
            this.checkOption(Positions.LEFT, true);
        } else if (
            this.input.keyboard!.checkDown(
                this.keys_player_one!.right,
                TIME_CHECK_KEY_PRESSED
            )
        ) {
            /*this.player_one!.anims.play("left", false).on(
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
            );*/
            this.checkOption(Positions.RIGHT, true);
        }
    }

    checkPlayerTwoKeys() {
        if (
            this.input.keyboard!.checkDown(
                this.keys_player_two!.up,
                TIME_CHECK_KEY_PRESSED
            )
        ) {
            /*this.player_two!.anims.play("jump", false).on(
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
            );*/
            this.checkOption(Positions.UP, false);
        } else if (
            this.input.keyboard!.checkDown(
                this.keys_player_two!.down,
                TIME_CHECK_KEY_PRESSED
            )
        ) {
            /*this.player_two!.anims.play("crouch", false).on(
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
            );*/
            this.checkOption(Positions.DOWN, false);
        } else if (
            this.input.keyboard!.checkDown(
                this.keys_player_two!.left,
                TIME_CHECK_KEY_PRESSED
            )
        ) {
            /*this.player_two!.anims.play("left", false).on(
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
            );*/
            this.checkOption(Positions.LEFT, false);
        } else if (
            this.input.keyboard!.checkDown(
                this.keys_player_two!.right,
                TIME_CHECK_KEY_PRESSED
            )
        ) {
            /*if (!this.player_two!.flipX) {
                console.log("Flip");
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
                        console.log("Reflip");
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
            );*/
            this.checkOption(Positions.RIGHT, false);
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
    criticalTurn() {
        this.clothes_player_one.forEach((clothes) => {
            clothes.removeAllGarments();
        });
        this.clothes_player_two.forEach((clothes) => {
            clothes.removeAllGarments();
        });
        this.clothes_player_one.shift();
        this.clothes_player_two.shift();
    }
    gameOver() {}


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

    drawValue(value: Positions, x: number, y: number, time: number) {
        const text = this.add.text(x, y, ""+value, {
            fontSize: "40px",
            color: "#000000",
        });
        text.setOrigin(0.5);

        this.time.delayedCall(time, () => {
            text.destroy();
        });
    }
}
