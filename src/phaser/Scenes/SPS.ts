import { Player,Clothes } from "@phaser/Objects";
import {
    calculateDimensions,
    SCALE_FACTOR,
    TIME_CHECK_KEY_PRESSED,
    TIME_TEXT_PLAYER
} from "@phaser/Util";
import { getStore, setStore, subscribeStore } from "@store/index";
import { Scene, Input, Animations } from "phaser";

enum ValueSPS {
    PIEDRA = "Piedra",
    PAPEL = "Papel",
    TIJERA = "Tijera"
}

enum States {
    Beginning,
    PlayersElection,
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

export class SPS extends Scene {
    player_one: Player | null = null;
    player_two: Player | null = null;

    keys_player_one: KeysPlayer | null = null;
    keys_player_two: KeysPlayer | null = null;

    half_width: number = 0;
    half_height: number = 0;
    width: number = 0;
    height: number = 0;

    player_one_positionX: number = 0;
    player_two_positionX: number = 0;

    player_one_values: ValueSPS | null = null;
    player_two_values: ValueSPS | null = null;

    listen_player_one_keys: boolean = false;
    listen_player_two_keys: boolean = false;
    
    timeLeft: number = 0;
    points_player_one_text: Phaser.GameObjects.Text | null = null;
    points_player_two_text: Phaser.GameObjects.Text | null = null;

    clothes_player_one: Clothes[] = [];
    clothes_player_two: Clothes[] = [];

    score_player_one: number = 0;
    score_player_two: number = 0;

    state: States = States.Beginning;

    constructor() {
        super({
            key: "SPS",
        });
    }
    preload() {
        console.log("Preload SPS");

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
    }

    create() {
        console.log("Create SPS");
        this.add.existing(this.player_one!);
        this.add.existing(this.player_two!);
        this.time.delayedCall(1000, () => {
            this.state = States.PlayersElection;
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
        // console.log("update SPS "+this.state);
        switch (this.state) {
            case States.PlayersElection:
                // console.log("PlayersElection");
                this.playersElection();
                break;
            case States.ListeningPlayer:
                this.listenPlayers();
                // console.log("ListeningPlayer");
                break;
            case States.EvaluateTurn:
                this.evaluateResult();
                // console.log("EvaluateTurn");
                break;
            case States.PostEvaluateTurn:
                this.postEvaluate();
                console.log("PostEvaluateTurn");
                break;
            case States.CriticalTurn:
                console.log("CriticalTurn");
                this.criticalTurn();
                break;
            case States.GameOver:
                console.log("GameOver");
                this.gameOver();
                break;
        }
    }

    playersElection(){
        this.listen_player_one_keys = true;
        this.listen_player_two_keys = true;
        this.state = States.ListeningPlayer;
    }

    getAnswer(value: ValueSPS, isPlayerOne: boolean) {
        if ( isPlayerOne && this.player_one_values == null ) {
            this.player_one_values = value;
            console.log("Valor jugador 1 "+this.player_one_values);
            this.listen_player_one_keys = false;
            //this.listen_player_one_keys = this.compareAnswers(this.player_one_values);
            //return this.listen_player_one_keys;
        } else if ( !isPlayerOne && this.player_two_values == null ) {
            this.player_two_values = value;
            console.log("Valor jugador 2 "+this.player_two_values);
            this.listen_player_two_keys = false;
            //this.listen_player_two_keys = this.compareAnswers(this.player_two_values);
            //return this.listen_player_two_keys;
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
                this.player_one!.y - 90,
                TIME_TEXT_PLAYER
            );            
        } else 
        if (
            this.input.keyboard!.checkDown(
                this.keys_player_one!.down,
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
                "Abajo",
                this.player_one_positionX,
                this.player_one!.y - 100,
                TIME_TEXT_PLAYER
            );
            this.getAnswer(ValueSPS.PAPEL, true);
        } else if (
            this.input.keyboard!.checkDown(
                this.keys_player_one!.left,
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
                "Izquierda",
                this.player_one_positionX,
                this.player_one!.y - 100,
                TIME_TEXT_PLAYER
            );
            this.getAnswer(ValueSPS.PIEDRA, true);
        } else if (
            this.input.keyboard!.checkDown(
                this.keys_player_one!.right,
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
                "Derecha",
                this.player_one_positionX,
                this.player_one!.y - 100,
                TIME_TEXT_PLAYER
            );
            this.getAnswer(ValueSPS.TIJERA, true);
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
        } else if (
            this.input.keyboard!.checkDown(
                this.keys_player_two!.down,
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
                "Abajo",
                this.player_two_positionX,
                this.player_two!.y - 100,
                TIME_TEXT_PLAYER
            );
            this.getAnswer(ValueSPS.PAPEL, false);
        } else if (
            this.input.keyboard!.checkDown(
                this.keys_player_two!.left,
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
                "Izquierda",
                this.player_two_positionX,
                this.player_two!.y - 100,
                TIME_TEXT_PLAYER
            );
            this.getAnswer(ValueSPS.PIEDRA, false);
        } else if (
            this.input.keyboard!.checkDown(
                this.keys_player_two!.right,
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
                "Derecha",
                this.player_two_positionX,
                this.player_two!.y - 100,
                TIME_TEXT_PLAYER
            );
            this.getAnswer(ValueSPS.TIJERA, false);
        }
    }

    listenPlayers() {
        if (this.listen_player_one_keys) {
            this.checkPlayerOneKeys();
        }
        if (this.listen_player_two_keys) {
            this.checkPlayerTwoKeys();
        }
        if( !this.listen_player_one_keys && !this.listen_player_two_keys){
            this.state = States.EvaluateTurn;
        }
    }

    evaluateResult() {
        if(this.player_one_values == this.player_two_values){

        }
        //Gana el jugador 1
        if(this.player_one_values == ValueSPS.PAPEL && this.player_two_values == ValueSPS.PIEDRA){
            this.score_player_one ++;
        }
        if(this.player_one_values == ValueSPS.PIEDRA && this.player_two_values == ValueSPS.TIJERA){
            this.score_player_one ++;
        }
        if(this.player_one_values == ValueSPS.TIJERA && this.player_two_values == ValueSPS.PAPEL){
            this.score_player_one ++;
        }
        //Gana el jugador 2
        if(this.player_two_values == ValueSPS.PAPEL && this.player_one_values == ValueSPS.PIEDRA){
            this.score_player_two ++;
        }
        if(this.player_two_values == ValueSPS.PIEDRA && this.player_one_values == ValueSPS.TIJERA){
            this.score_player_two ++;
        }
        if(this.player_two_values == ValueSPS.TIJERA && this.player_one_values == ValueSPS.PAPEL){
            this.score_player_two ++;
        }
        this.redrawTextPoints();
        this.state = States.PostEvaluateTurn;
    }

    postEvaluate(){
        if( (this.score_player_one  % 3 ==0) || (this.score_player_two % 3 == 0) ){
            this.state = States.CriticalTurn;
        }else {
            this.state = States.PlayersElection;
        }
    }

    criticalTurn(){
        this.time.delayedCall(1000, () => {
            this.state = States.PlayersElection;            
        });
    }

    gameOver() {}

    drawPermanentText(text: string, x: number, y: number) {
        const text_object = this.add.text(x, y, text, {
            fontSize: "40px",
            color: "#000000",
        });
        text_object.setOrigin(0.5);
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

    redrawTextPoints() {
        this.points_player_one_text!.setText(
            `Puntos: ${this.score_player_one}`
        );
        this.points_player_two_text!.setText(
            `Puntos: ${this.score_player_two}`
        );
    }

}