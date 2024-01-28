import { GameObjects } from "phaser";
export class Garment extends GameObjects.Sprite {
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
        scene.anims.create({
            key: "crouch_" + texture,
            frames: [
                {
                    key: texture,
                    frame: 3,
                },
                {
                    key: texture,
                    frame: 2,
                },
            ],
            frameRate: 10,
            repeat: 0,
        });
        scene.anims.create({
            key: "jump_" + texture,
            frames: [
                {
                    key: texture,
                    frame: 3,
                },
                {
                    key: texture,
                    frame: 4,
                },
            ],
            frameRate: 10,
            repeat: 0,
        });
        scene.anims.create({
            key: "left_" + texture,
            frames: [
                {
                    key: texture,
                    frame: 3,
                },
                {
                    key: texture,
                    frame: 4,
                },
            ],
            frameRate: 10,
            repeat: 0,
        });
    }
}
