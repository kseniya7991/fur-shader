import EventEmitter from "./EventEmitter";

const START_ELAPSED = 0;

//how much time was spent since the previous frame (at 60 fps)
//approximately close value
const DELTA_DEFAULT = 16;

export default class Time extends EventEmitter {
    constructor() {
        super();
        this.start = Date.now();
        this.current = this.start; //current timestamp
        this.elapsed = START_ELAPSED; //how much time spent since the start
        this.delta = 16;

        this.eventName = "tick";

        // if don't use EventEmitter
        this.event = new Event(this.eventName);

        /**
         * Call tick() after first frame, otherwise the first @delta value will be 0
         */
        window.requestAnimationFrame(() => {
            this.tick();
        });
    }

    tick() {
        const currentTime = Date.now();
        this.delta = currentTime - this.current;
        this.current = currentTime;
        this.elapsed = this.current - this.start;

        this.trigger(this.eventName);

        window.requestAnimationFrame(() => {
            this.tick();
        });
    }

    destroy = () => {
        this.off(this.eventName);
    };
}
