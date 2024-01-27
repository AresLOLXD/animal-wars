import { Personaje } from "@phaser/Objects";
import { Scene } from "phaser";
export class SimonDice extends Scene {
    jugador_uno: Personaje | null;
    jugador_dos: Personaje | null;
    constructor() {
        super({
            key: "SimonDice",
        });
        this.jugador_uno = null;
        this.jugador_dos = null;
    }
    preload() {
        console.log("Preload SimonDice");
        this.jugador_uno = new Personaje(this, 100, 100, "capibara");
        this.jugador_dos = new Personaje(this, 200, 200, "husky");
    }
    create() {}
}
