import { Scene, Loader } from "phaser";

export class BootLoader extends Scene {
    constructor() {
        super({
            key: "BoatLoader",
            active: true,
        });
    }

    preload() {
        console.log("Cargando los recursos");

        this.load.path = "./src/assets/";
        this.load.image("capibara", "Personajes/capibara.png");
        this.load.image("husky", "Personajes/husky.png");
        this.load.image("panda", "Personajes/panda.png");

        this.load.on(Loader.Events.PROGRESS, (value: number) => {
            console.log(value);
        });
        this.load.on(Loader.Events.COMPLETE, () => {
            console.log("Completo la carga de los recursos")
            this.scene.setActive(false);
            console.log("complete");
            this.scene.manager.getAt(1).scene.start();
        });
    }

}
