import { Scene } from "phaser";
import { LOG_BASE } from "./Constants";
export function calculateDimensions(scene: Scene) {
    return [
        scene.sys.canvas.width / 2,
        scene.sys.canvas.height / 2,
        scene.sys.canvas.width,
        scene.sys.canvas.height,
    ];
}

export function calculateLogarithmTime(quantity: number, time: number) {
    return (Math.log(quantity) / Math.log(LOG_BASE)) * time * -1 + time;
}

//El valor debe ser un número entre 1 y 3
export function calculateRate(quantity: number, time: number) {
    return (Math.log(quantity) / Math.log(LOG_BASE)) * time * -1 + time;
}
