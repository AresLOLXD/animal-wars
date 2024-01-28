import { Garment, Head } from "@phaser/Objects";
import { SCALE_FACTOR } from "@phaser/Util";
import { Animations } from "phaser";

export class Clothes {
    clothes: Garment[];
    head: Head | null = null;
    constructor(scene: Phaser.Scene, clothes: Garment[]/*, head: Head*/) {
        this.clothes = clothes;
        //this.head = head;
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

    getHead(){
        return this.head;
    }

    playAnimationAll(animation: string) {
        this.clothes.forEach((clothe) => {
            clothe
                .play(animation + "_" + clothe.texture.key)
                .on(Animations.Events.ANIMATION_COMPLETE, () => {
                    clothe.play("idle_" + clothe.texture.key);
                });
        });
        this.head!.play(animation + "_" + this.head!.texture.key).on(Animations.Events.ANIMATION_COMPLETE, () => {
            this.head!.play("idle_" + this.head!.texture.key);
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
        this.head?.setFlipX(flip);
    }
}
