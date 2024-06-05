import EventEmitter from "./EventEmitter";

export default class Sizes extends EventEmitter {
    constructor() {
        super();

        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.pixelRatio = Math.min(window.devicePixelRatio, 2);

        this.eventName = "resizeWindow";
        // if don't use EventEmitter
        // this.event = new Event(this.eventName);

        this.#listenResize();
    }

    #listenResize = () => {
        window.addEventListener("resize", this.handleResize);
    };

    destroy = () => {
        window.removeEventListener("resize", this.handleResize);
        this.off(this.eventName);
    };

    handleResize = () => {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.pixelRatio = Math.min(window.devicePixelRatio, 2);

        this.trigger(this.eventName);
    };
}
