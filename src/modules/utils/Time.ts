import EventEmitter from "events";

export default class Times extends EventEmitter {
    start = Date.now();
    current = Date.now();
    elapsed = 0;
    delta = 16;

    constructor() {
        super();
        this.update();
    }
    update() {
        const current = Date.now();
        this.delta = current - this.current;
        this.current = current;
        this.elapsed = this.current - this.start;
        this.emit("update");
        window.requestAnimationFrame(() => this.update());
    }
}
