import { GameObjects } from "phaser";
export class Pay extends GameObjects.Sprite {
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.anims.create({
            key: "idle_" + texture,
            frames: [
                {
                    key: texture,
                    frame: 0,
                },
            ],
            frameRate: 10,
            repeat: -1,
        });

    }
}
