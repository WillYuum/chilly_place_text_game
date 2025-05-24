import { Component } from "@willyuum/pixi-gameobject-system";
import { GamePlayVector2 } from "../types";

const GRAVITY = 9.81;
export class ThrowBehavior extends Component {

    private velocity: GamePlayVector2 = new GamePlayVector2(0, 1.5);
    public IsThrown: boolean = false;


    onUpdate(deltaTime: number): void {
        if (this.IsThrown) {
            this.moveObject(deltaTime);
        }
    }


    public throwObject(): void {
        if (!this.IsThrown) {
            this.IsThrown = true;
            this.velocity.y = 1.5; // Set an initial upward velocity
        }
    }

    public DisableThrowBehavior(): void {
        this.IsThrown = false;
        this.velocity.y = 0; // Reset the velocity when throwing is disabled
    }


    moveObject(deltaTime: number): void {
        const deltaY = this.velocity.y * deltaTime;
        if (this.gameObject?.holder) {
            this.gameObject.holder.y -= deltaY; // Move the object upwards
        }
    }




}