import { GameObject } from "@willyuum/pixi-gameobject-system"
import { Application, Bounds } from "pixi.js";
import { ThrowBehavior } from "./components/ThrowBehavior";
import { ThrowableLetter } from "./components/ThrowableLetter";
import { EmptySlot } from "./components/EmptySlot";
import { GamePlayVector2 } from "./types";




export function startGame(app: Application) {
    const sentenceToDisplay = "Hello World!"
    const removeWhitespaceSentence = sentenceToDisplay.replace(/\s+/g, '');
    const splitSentence = removeWhitespaceSentence.split('');

    console.log("Sentence to display:", splitSentence);

    const spacingBetweenSlots = 110;


    let spawnedSlots: GameObject[] = [];
    const displayAllEmptySlots = (app: Application, text: string[]) => {
        for (let i = 0; i < text.length; i++) {
            const newEmptySlot = createSlotGameObject(app);
            newEmptySlot.holder.x = (i * spacingBetweenSlots) + 100;
            newEmptySlot.holder.y = 100
            spawnedSlots.push(newEmptySlot);
        }

    }

    let currentEmptySlot: EmptySlot | undefined = undefined;
    let currentThrowableLetter: ThrowableLetter | undefined = undefined;
    let currentFocusedSlotIndex = 0;

    const onHandleInteraction = () => {
        const isThrown = currentThrowableLetter?.isThrown;
        const emptySlotPosition = currentEmptySlot?.gameObject?.holder.position;
        const letterPosition = currentThrowableLetter?.gameObject?.holder.position;

        const distanceY = Math.abs((emptySlotPosition?.y ?? 0) - (letterPosition?.y ?? 0));

        const isInRange = distanceY < 45;

        if (isThrown && isInRange) {
            currentThrowableLetter?.gameObject?.getComponent(ThrowBehavior)?.DisableThrowBehavior();
            currentThrowableLetter?.destroy();
            currentEmptySlot?.disableSlot();

            currentFocusedSlotIndex += 1;
            if (currentFocusedSlotIndex >= spawnedSlots.length) {
                //Should end the game here
                console.log("Game Over! All letters placed.");
                return;
            } else {
                sendLetterToSlot(currentFocusedSlotIndex);
            }
        }
    }


    const sendLetterToSlot = (index: number) => {
        if (index < 0 || index >= spawnedSlots.length) {
            console.warn("Index out of bounds:", index);
            return;
        }
        const currentSlot = spawnedSlots[index];
        const bottomScreenBounds = new Bounds(0, 0, app.screen.width, app.screen.height);
        const throwAbleObject = createThrowableLetterGameObject(app, new GamePlayVector2(currentSlot.holder.x, bottomScreenBounds.height - 100));
        throwAbleObject.getComponent(ThrowBehavior)?.throwObject();

        currentEmptySlot = currentSlot.getComponent(EmptySlot);
        currentThrowableLetter = throwAbleObject.getComponent(ThrowableLetter);
    }

    const bindedKeys = [
        new KeyBinding('Space', () => onHandleInteraction(), 'keydown'),
        new KeyBinding('0', () => onHandleInteraction(), 'pointerdown'),
    ];

    displayAllEmptySlots(app, splitSentence);
    sendLetterToSlot(currentFocusedSlotIndex);
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

    return letterGameObject;
}


export class KeyBinding {
    constructor(
        private key: string,
        private action: () => void,
        private eventType: 'keydown' | 'keyup' | 'pointerdown' | 'pointerup',
    ) {
        this.bind();
    }

    private onKeyEvent = (e: PointerEvent | KeyboardEvent | any) => {
        if (e instanceof PointerEvent && e.button.toString() === this.key) {
            this.action();
        } else if (e instanceof KeyboardEvent && e.code === this.key) {
            this.action();
        }
    };

    public bind() {
        window.addEventListener(this.eventType, this.onKeyEvent);
    }

    public unbind() {
        window.removeEventListener(this.eventType, this.onKeyEvent);
    }

    public toggle(enabled: boolean) {
        enabled ? this.bind() : this.unbind();
    }
}

