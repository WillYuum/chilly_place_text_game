import { Component } from "@willyuum/pixi-gameobject-system";
import { Graphics, Bounds } from "pixi.js";

enum SlotType {
    Empty = 0,
    Used = 1,
}

export class EmptySlot extends Component {

    private _type: SlotType = SlotType.Empty;

    private _visual: Graphics = new Graphics();

    onAwake(): void {
        this.drawEmptySlot();
        this.gameObject?.addVisualComponent(this._visual);
    }


    private drawEmptySlot(): void {
        const squareRect = new Bounds(0, 0, 100, 100);
        const grayColor = 0xCCCCCC;


        this._visual.clear();

        this._visual.rect(squareRect.x, squareRect.y, squareRect.width, squareRect.height).stroke({
            color: grayColor,
            width: 2,
        });
    }
}