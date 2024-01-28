import { Scene } from "phaser";
import {calculateDimensions} from "@phaser/Util";
import { Backgrounds } from "@phaser/Objects";
import { getStore} from "@store/index";
export class MainMenu extends Scene {

    fondoBg : Backgrounds | null = null;

    half_width: number = 0;
    half_height: number = 0;
    width: number = 0;
    height: number = 0;
    constructor() {
        super({
            key: "MainMenu",
            active: false,
        });
    }
    preload() {
        [this.half_width, this.half_height, this.width, this.height] =
            calculateDimensions(this);

        this.fondoBg = new Backgrounds(this,0,0,this.width,this.height,getStore<string>("fondoActual"));

    }
    create() {
        this.add.existing(this.fondoBg!);
    }
}
