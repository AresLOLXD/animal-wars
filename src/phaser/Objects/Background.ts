import { GameObjects } from "phaser";
export class Backgrounds extends GameObjects.Sprite {
    constructor(scene: Phaser.Scene, x: number, y: number, w:number, h:number, texture: string) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        this.setOrigin(x,y);
        this.displayWidth = w;
        this.displayHeight = h;
        this.anims.create({
            key: "fondo",
            frames: [
                {
                    key: texture,
                    frame: 0,
                },
            ],
            frameRate: 1,
            repeat: 0,
        });
    }
}
