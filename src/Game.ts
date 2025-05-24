import { Component, GameObject } from "@willyuum/pixi-gameobject-system"
import { Application, Bounds, Graphics } from "pixi.js";



export function startGame(app: Application) {


    const newEmptySlot = createSlotGameObject(app);

    newEmptySlot.holder.x = 100;
    newEmptySlot.holder.y = 100;
}


function createSlotGameObject(app: Application): GameObject {
    const slotGameObject = new GameObject("Slot", app.stage);
    const slotComponent = new Slot();
    slotGameObject.addComponent(slotComponent);
    return slotGameObject;
}


function createThrowableLetterGameObject(app: Application): GameObject {
    const letterGameObject = new GameObject("ThrowableLetter", app.stage);
    const letterComponent = new ThrowableLetter();
    letterGameObject.addComponent(letterComponent);
    return letterGameObject;
}


enum SlotType {
    Empty = 0,
    Used = 1,
}

class Slot extends Component {

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




class ThrowableLetter extends Component {
    private squareBounds: Graphics = new Graphics();

    onAwake(): void {
        this.drawLetter();
        this.gameObject?.addVisualComponent(this.squareBounds);
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