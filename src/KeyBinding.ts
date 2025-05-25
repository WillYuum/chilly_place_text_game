
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

