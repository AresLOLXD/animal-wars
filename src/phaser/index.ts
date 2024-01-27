import { AUTO, Game, Types } from "phaser";
import { BootLoader, SimonSays } from "./Scenes";

const config: Types.Core.GameConfig = {
    type: AUTO,
    backgroundColor: "#125555",
    width: 1440,
    height: 1024,
    scene: [
        BootLoader,
        //TODO: Quitar el simon dice y poner el menu principal
        //MainMenu,
        SimonSays,
    ],
    parent: "phaser-content",
    physics: {
        default: "arcade",
        arcade: {
            debug: true,
            gravity: {
                y: 9.81,
            },
        },
    },
};
// Inicio del juego de phaser

const game = new Game(config);

export { game };
