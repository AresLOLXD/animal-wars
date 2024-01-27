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
        this.load.spritesheet("capibara", "SpriteSheet/Capibara_SS.png", {
            frameWidth: 600,
            frameHeight: 600,
        });
        this.load.spritesheet("husky", "SpriteSheet/Oso_SS.png", {
            frameWidth: 600,
            frameHeight: 600,
        });
        this.load;

        //this.load.image("capibara", "Personajes/capibara.png");
        //this.load.image("husky", "Personajes/husky.png");
        this.load.image("panda", "Personajes/panda.png");
        this.load.audio("placeholder", "Audios/placeholder.mp3");
        this.load.on(
            Loader.Events.FILE_COMPLETE,
            (key: string, type: string, data: any) => {
                console.log(`Archivo cargado correctamente: ${key}`);
                console.log(`Tipo de archivo: ${type}`);
                console.log(data);
            }
        );

        this.load.on(Loader.Events.PROGRESS, (value: number) => {
            //Por si queremos poner una barra de carga
            console.log(value);
        });
        this.load.on(Loader.Events.COMPLETE, () => {
            console.log("Completo la carga de los recursos");
            this.scene.setActive(false);
            this.scene.manager.getAt(1).scene.start();
        });
    }
}
