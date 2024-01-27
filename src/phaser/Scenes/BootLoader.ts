import { Scene, Loader} from "phaser";

export class BootLoader extends Scene {
    constructor() {
        super({
            key: "BoatLoader",
        });
    }

    preload() {
        this.load.on(Loader.Events.PROGRESS, (value: number) => {
            console.log(value);
        });
        this.load.on(Loader.Events.COMPLETE, () => {
            this.scene.setActive(false);
            console.log("complete");
            this.scene.transition({
                target: "MainMenu",
                duration: 1000,
                moveBelow: true,
            });
        });
    }

    create() {

    }

}
