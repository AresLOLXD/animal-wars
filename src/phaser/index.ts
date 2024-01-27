import { AUTO, Game, Types } from "phaser";
import { BootLoader, MainMenu, SimonDice } from "./Scenes";

const config: Types.Core.GameConfig = {
    type: AUTO,
    backgroundColor: "#125555",
    max: {
        width: 800,
        height: 600,
    },
    scene: [
        BootLoader,
        //TODO: Quitar el simon dice y poner el menu principal
        //MainMenu,
        SimonDice,
    ],
    parent: "phaser-content",
};
// Inicio del juego de phaser

const game = new Game(config);

export { game };
