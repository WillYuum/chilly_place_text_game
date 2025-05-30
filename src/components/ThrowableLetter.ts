import { Component } from "@willyuum/pixi-gameobject-system";
import { Graphics, Bounds } from "pixi.js";
import { ThrowBehavior } from "./ThrowBehavior";

export class ThrowableLetter extends Component {
    private squareBounds: Graphics = new Graphics();

    onAwake(): void {
        this.drawLetter();
        this.gameObject?.addVisualComponent(this.squareBounds);
    }


    public isThrown(): boolean {
        const throwBehavior = this.gameObject?.getComponent(ThrowBehavior);
        return throwBehavior ? throwBehavior.IsThrown : false;
    }

    private drawLetter(): void {
        const squareRect = new Bounds(0, 0, 100, 100);
        const redColor = 0xFF0000;

        this.squareBounds.clear();

        this.squareBounds.rect(squareRect.x, squareRect.y, squareRect.width, squareRect.height).stroke({
            color: redColor,
            width: 2,
        });
    }
}
