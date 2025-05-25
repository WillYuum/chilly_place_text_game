import { GameObject } from "@willyuum/pixi-gameobject-system"
import { Application, Bounds } from "pixi.js";
import { ThrowBehavior } from "./components/ThrowBehavior";
import { ThrowableLetter } from "./components/ThrowableLetter";
import { EmptySlot } from "./components/EmptySlot";
import { GamePlayVector2 } from "./types";
import { KeyBinding } from "./KeyBinding";
import { PixiApp } from ".";


type GameAction =
    | { type: 'INIT'; sentence: string[] }
    | { type: 'THROW_LETTER'; }
    | { type: 'HANDLE_INTERACTION' };


type GameState = {
    sentence: string[];
    currentIndex: number;
    slots: GameObject[];
    currentSlot?: EmptySlot;
    currentLetter?: ThrowableLetter;
};

let gameState: GameState = {
    sentence: [],
    currentIndex: 0,
    slots: [],
};


function reducer(state: GameState, action: GameAction): GameState {
    switch (action.type) {
        case 'INIT': {
            const slots = action.sentence.map((_, i) => {
                const slot = createSlotGameObject(PixiApp);
                slot.holder.position.set((i * 110) + 100, 100);
                return slot;
            });

            return {
                ...state,
                sentence: action.sentence,
                slots,
                currentIndex: 0,
            };
        }

        case 'THROW_LETTER': {
            const currentSlot = state.slots[state.currentIndex];
            const position = new GamePlayVector2(currentSlot.holder.x, PixiApp.screen.height - 100);
            const letterGO = createThrowableLetterGameObject(PixiApp, position);
            letterGO.getComponent(ThrowBehavior)?.throwObject();

            const newGameInput = new ThrowLetterAction();
            newGameInput.enableInputHandlers();


            return {
                ...state,
                currentSlot: currentSlot.getComponent(EmptySlot),
                currentLetter: letterGO.getComponent(ThrowableLetter),
            };
        }

        case 'HANDLE_INTERACTION': {
            const { currentSlot, currentLetter, currentIndex, slots } = state;

            console.log("Handling interaction for index:", currentIndex);

            const slotY = currentSlot?.gameObject?.holder.y ?? 0;
            const letterY = currentLetter?.gameObject?.holder.y ?? 0;
            const isThrown = currentLetter?.isThrown;
            const inRange = Math.abs(slotY - letterY) < 45;

            if (!isThrown || !inRange) return state;

            currentLetter?.gameObject?.getComponent(ThrowBehavior)?.DisableThrowBehavior();
            currentLetter?.destroy();
            currentSlot?.disableSlot();

            if (currentIndex + 1 >= slots.length) {
                console.log("Game Over! All letters placed.");
                return { ...state, currentIndex: currentIndex + 1 };
            }

            return { ...state, currentIndex: currentIndex + 1 };
        }

        default: {
            // Exhaustive check for action
            const _exhaustiveCheck: never = action;
            console.warn("Unhandled state", _exhaustiveCheck);
            return state;
        }
    }
}

export function startGame() {

    const clean = "Hello World!".replace(/\s+/g, '').split('');
    gameState = reducer(gameState, { type: 'INIT', sentence: clean });
    gameState = reducer(gameState, { type: 'THROW_LETTER' });
}



class ThrowLetterAction {
    keyBindings: KeyBinding[] = [];
    enableInputHandlers() {
        this.keyBindings = [
            new KeyBinding('Space', () => reducer(gameState, { type: 'HANDLE_INTERACTION' }), 'keydown'),
            new KeyBinding('0', () => reducer(gameState, { type: 'HANDLE_INTERACTION' }), 'pointerdown'),
        ]
    }

    disableInputHandlers() {
        this.keyBindings.forEach(binding => binding.toggle(false));
        this.keyBindings = [];
    }

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