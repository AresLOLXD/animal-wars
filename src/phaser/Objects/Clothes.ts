import { Garment } from "@phaser/Objects";
import { SCALE_FACTOR } from "@phaser/Util";
import { Animations } from "phaser";

export class Clothes {
    clothes: Garment[];
    constructor(scene: Phaser.Scene, clothes: Garment[]) {
        this.clothes = clothes;
        this.clothes.forEach((clothe) => {
            scene.add.existing(clothe);
            clothe.setScale(SCALE_FACTOR);
        });
    }
    getGarment(index: number) {
        return this.clothes[index];
    }

    getGarments() {
        return this.clothes;
    }

    playAnimationAll(animation: string) {
        this.clothes.forEach((clothe) => {
            clothe
                .play(animation + "_" + clothe.texture.key)
                .on(Animations.Events.ANIMATION_COMPLETE, () => {
                    clothe.play("idle_" + clothe.texture.key);
                });
        });
    }
    removeAllGarments() {
        this.clothes.forEach((clothe) => {
            clothe.destroy();
        });
    }

    setFlipXAll(flip: boolean) {
        this.clothes.forEach((clothe) => {
            clothe.setFlipX(flip);
        });
    }
}
