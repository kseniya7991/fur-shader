import * as THREE from "three";

import Camera from "./Camera";
import Renderer from "./Renderer";
import Sizes from "./Utils/Sizes";
import Time from "./Utils/Time";
import World from "./World/World";
import Resources from "./Utils/Resources";
import sources from "./sources";
import Debug from "./Utils/Debug";
import Mouse from "./Utils/Mouse";

let INSTANCE = null;

export default class Template {
    constructor(selector) {
        if (INSTANCE) {
            return INSTANCE;
        }

        INSTANCE = this;

        this.canvas = document.querySelector(selector);
        //@ts-ignore
        window.template = this;

        //Debug obj
        this.debugObj = {};

        //Utilities
        this.debug = new Debug();
        this.sizes = new Sizes();
        this.time = new Time();
        this.mouse = new Mouse();

        //World
        this.resources = new Resources(sources);
        this.scene = new THREE.Scene();
        this.camera = new Camera();
        this.renderer = new Renderer();
        this.world = new World();

        this.#listenEvents();
    }

    #listenEvents = () => {
        this.sizes?.on(this.sizes.eventName, () => {
            this.handleResize();
        });

        this.time?.on(this.time.eventName, () => {
            this.updateOnTick();
        });
    };

    handleResize = () => {
        this.camera?.resize();
        this.renderer?.resize();
    };

    updateOnTick = () => {
        this.camera?.update();
        this.renderer?.update();
        this.world?.update();
        this.mouse?.update();
    };

    //@ts-ignore
    destroy = () => {
        this.sizes?.destroy();
        this.time?.destroy();

        this.world?.destroy();

        //Camera
        this.camera?.destroy();

        //Renderer
        this.renderer?.destroy();

        //Debug
        this.debug?.destroy();

        /**
         * Be careful, if you are using post-processing, you'll need to dispose of the EffectComposer,
         * its WebGLRenderTarget and any potential passes you are using.
         */
    };
}
