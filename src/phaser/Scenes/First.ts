import { Scene } from "phaser";

export class First extends Scene {
    constructor() {
        super("first");
    }

    preload() {}

    create() {}

    update(time: number, delta: number): void {
        console.table({ time, delta });
    }
}
