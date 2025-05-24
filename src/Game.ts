import { Component, GameObject } from "@willyuum/pixi-gameobject-system"
import { Application, Bounds, Graphics } from "pixi.js";
import { ThrowBehavior } from "./components/ThrowBehavior";
import { ThrowableLetter } from "./components/ThrowableLetter";
import { EmptySlot } from "./components/EmptySlot";
import { GamePlayVector2 } from "./types";


export function startGame(app: Application) {
    let currentEmptySlot: EmptySlot | undefined = undefined;
    let currentThrowableLetter: ThrowableLetter | undefined = undefined;


    const onHandleInteraction = () => {
        const isThrown = currentThrowableLetter?.isThrown;
        // const isNearEmptySlot = currentEmptySlot?.gameObject?.holder.getBounds().contains(currentTrhowableLetter?.gameObject.holder.x ?? 0, currentTrhowableLetter?.gameObject.holder.y ?? 0) ?? false;
        const emptySlotPosition = currentEmptySlot?.gameObject?.holder.position;
        const letterPosition = currentThrowableLetter?.gameObject?.holder.position;

        const distanceY = Math.abs((emptySlotPosition?.y ?? 0) - (letterPosition?.y ?? 0));

        const isInRange = distanceY < 200;

        console.log("isInRange", isInRange, "distanceY", distanceY, "emptySlotPosition", emptySlotPosition, "letterPosition", letterPosition);

        if (isThrown && isInRange) {
            currentThrowableLetter?.gameObject?.getComponent(ThrowBehavior)?.DisableThrowBehavior();
        }
    }


    app.canvas.addEventListener('pointerdown', () => onHandleInteraction);
    window.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            onHandleInteraction();
        }
    });



    const newEmptySlot = createSlotGameObject(app);

    newEmptySlot.holder.x = 100;
    newEmptySlot.holder.y = 100;

    const bottomScreenBounds = new Bounds(0, 0, app.screen.width, app.screen.height);
    const throwAbleObject = createThrowableLetterGameObject(app, new GamePlayVector2(newEmptySlot.holder.x, bottomScreenBounds.height - 100));

    currentThrowableLetter = throwAbleObject.getComponent(ThrowableLetter);
    currentEmptySlot = newEmptySlot.getComponent(EmptySlot);
}


function createSlotGameObject(app: Application): GameObject {
    const slotGameObject = new GameObject("Slot", app.stage);
    const slotComponent = new EmptySlot();
    slotGameObject.addComponent(slotComponent);
    return slotGameObject;
}


function createThrowableLetterGameObject(app: Application, assignedSlotPos: GamePlayVector2): GameObject {
    const letterGameObject = new GameObject("ThrowableLetter", app.stage);
    const letterComponent = new ThrowableLetter();
    letterGameObject.addComponent(letterComponent);


    letterGameObject.holder.position.set(assignedSlotPos.x, assignedSlotPos.y);


    const throwPhysicsComponent = new ThrowBehavior();
    letterGameObject.addComponent(throwPhysicsComponent);

    setTimeout(() => {
        throwPhysicsComponent.throwObject();
    }, 1000);

    return letterGameObject;
}


