import { Component } from "@willyuum/pixi-gameobject-system";
import { GamePlayVector2 } from "../types";

const GRAVITY = 9.81;
export class ThrowBehavior extends Component {

    private velocity: GamePlayVector2 = new GamePlayVector2(0, 1.5);
    private isThrown: boolean = false;


    onUpdate(deltaTime: number): void {
        if (this.isThrown) {
            this.moveObject(deltaTime);
        }
    }


    public throwObject(): void {
        if (!this.isThrown) {
            this.isThrown = true;
            this.velocity.y = 1.5; // Set an initial upward velocity
        }
    }


    moveObject(deltaTime: number): void {
        const deltaY = this.velocity.y * deltaTime;
        if (this.gameObject?.holder) {
            this.gameObject.holder.y -= deltaY; // Move the object upwards
        }
    }




}