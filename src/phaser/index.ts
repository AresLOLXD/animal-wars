import { AUTO, Game, Types } from "phaser";
import { First } from "./Scenes";

const config: Types.Core.GameConfig = {
    type: AUTO,
    backgroundColor: "#125555",
    width: 800,
    height: 600,
    scene: First,
    parent: "phaser-content",
};
// Inicio del juego de phaser

const game = new Game(config);

export { game };
