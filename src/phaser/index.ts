import { AUTO, Game, Types } from "phaser";
import { BootLoader, MainMenu, SimonSays } from "./Scenes";
export {config as gameConfig};

const config: Types.Core.GameConfig = {
    type: AUTO,
    backgroundColor: "#125555",
    width: 800,
    height: 600,
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
                y: 9.81
            },
        },
    },
};
// Inicio del juego de phaser

const game = new Game(config);

export { game };
