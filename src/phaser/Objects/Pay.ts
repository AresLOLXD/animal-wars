import { GameObjects } from "phaser";
export class Pay extends GameObjects.Sprite {
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.anims.create({
            key: "pay_fake",
            frames: [
                {
                    key: texture,
                    frame: 13,
                },
            ],
            frameRate: 1,
            repeat: 0,
        });
        scene.anims.create({
            key: "pay_exp",
            frames: [
                {
                    key: texture,
                    frame: 0
                },
                {
                    key: texture,
                    frame: 1
                },
                {
                    key: texture,
                    frame: 3
                },
                {
                    key: texture,
                    frame: 4
                },
                {
                    key: texture,
                    frame: 2
                }
            ],
            frameRate: 2,
            repeat: 0
        });
        scene.anims.create({
            key: "pay_nuc",
            frames: [
                {
                    key: texture,
                    frame: 5
                },
                {
                    key: texture,
                    frame: 6
                },
                {
                    key: texture,
                    frame: 7
                },
                {
                    key: texture,
                    frame: 8
                },
                {
                    key: texture,
                    frame: 12
                },
                {
                    key: texture,
                    frame: 9  
                },
                {
                    key: texture,
                    frame: 10
                },
                {
                    key: texture,
                    frame: 11
                }
            ],
            frameRate: 2,
            repeat: 0
        });

    }
}
