import * as THREE from "three";
import EventEmitter from "./EventEmitter";
import Template from "../Template";

export default class Mouse extends EventEmitter {
    constructor() {
        super();

        this.template = new Template();
        this.sizes = this.template.sizes;

        this.mouseObj = new THREE.Vector2(0.0, 0.0);

        this.eventName = "pointerMove";

        this.#listenMousemove();
    }

    #listenMousemove = () => {
        window.addEventListener("pointermove", this.hanldeMousemove);
    };

    destroy = () => {
        window.removeEventListener("pointermove", this.hanldeMousemove);
        this.off(this.eventName);
    };

    handleResize = () => {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.pixelRatio = Math.min(window.devicePixelRatio, 2);

        this.trigger(this.eventName);
    };

    hanldeMousemove = (e) => {
        this.mouseObj.x = e.clientX / this.sizes.width;
        this.mouseObj.y = e.clientY / this.sizes.height;
    };

    update = () => {};
}
