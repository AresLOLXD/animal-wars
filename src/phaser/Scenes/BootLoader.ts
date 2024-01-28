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
        this.load.spritesheet("oso", "SpriteSheet/Oso_SS.png", {
            frameWidth: 600,
            frameHeight: 600,
        });
        this.load.spritesheet("panda", "SpriteSheet/Panda_SS.png", {
            frameWidth: 600,
            frameHeight: 600,
        });

        this.load.spritesheet(
            "pantalon_p1",
            "SpriteSheet/PantalonAzul_SS.png",
            {
                frameWidth: 600,
                frameHeight: 600,
            }
        );
        this.load.spritesheet(
            "pantalon_p2",
            "SpriteSheet/PantalonRojo_SS.png",
            {
                frameWidth: 600,
                frameHeight: 600,
            }
        );
        this.load.spritesheet(
            "overol_p1",
            "SpriteSheet/SuperiorAmarillo_SS.png",
            {
                frameWidth: 600,
                frameHeight: 600,
            }
        );
        this.load.spritesheet("overol_p2", "SpriteSheet/SuperiorRojo_SS.png", {
            frameWidth: 600,
            frameHeight: 600,
        });

        this.load.audio("animal_up", "Audios/Animal_Arr.mp3");
        this.load.audio("animal_down", "Audios/Animal_Aba.mp3");
        this.load.audio("animal_left", "Audios/Animal_Izq.mp3");
        this.load.audio("animal_right", "Audios/Animal_Der.mp3");

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
