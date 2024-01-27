import { GameObjects } from "phaser";
export class Simon extends GameObjects.Sprite {
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        this.anims.create({
            key: "idle",
            frames: [
                {
                    key: texture,
                    frame: 8,
                },
            ],
            frameRate: 10,
            repeat: -1,
        });
        this.anims.create({
            key: "crouch",
            frames: [
                {
                    key: texture,
                    frame: 4,
                },
                {
                    key: texture,
                    frame: 9,
                },
            ],
            frameRate: 10,
            repeat: 0,
        });
        this.anims.create({
            key: "jump",
            frames: [
                {
                    key: texture,
                    frame: 5,
                },
                {
                    key: texture,
                    frame: 10,
                },
            ],
            frameRate: 10,
            repeat: 0,
        });
        this.anims.create({
            key: "left",
            frames: [
                {
                    key: texture,
                    frame: 0,
                },
                {
                    key: texture,
                    frame: 3,
                },
            ],
            frameRate: 10,
            repeat: 0,
        });
    }
}
