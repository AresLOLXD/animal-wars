import { GameObjects } from "phaser";
export class Garment extends GameObjects.Sprite {
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.anims.create({
            key: "idle",
            frames: scene.anims.generateFrameNumbers(texture, {
                start: 4,
                end: 4,
            }),
            frameRate: 10,
            repeat: 0,
        });
        scene.anims.create({
            key: "crouch",
            frames: scene.anims.generateFrameNumbers(texture, {
                start: 2,
                end: 2,
            }),
            frameRate: 10,
            repeat: 0,
        });
        scene.anims.create({
            key: "jump",
            frames: [
                {
                    key: texture,
                    frame: 4,
                },
                {
                    key: texture,
                    frame: 4,
                },
                {
                    key: texture,
                    frame: 3,
                },
            ],
            frameRate: 10,
            repeat: 0,
        });
        scene.anims.create({
            key: "left",
            frames: scene.anims.generateFrameNumbers(texture, {
                start: 0,
                end: 0,
            }),
            frameRate: 10,
            repeat: 0,
        });
        scene.anims.create({
            key: "right",
            frames: scene.anims.generateFrameNumbers(texture, {
                start: 0,
                end: 0,
            }),
            frameRate: 10,
            repeat: 0,
        });
    }
}
