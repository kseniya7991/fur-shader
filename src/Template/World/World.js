import Template from "../Template";
import Floor from "./Floor";
import Fur from "./Fur";
import Fog from "./Fog";

export default class World {
    constructor() {
        this.template = new Template();
        this.scene = this.template.scene;
        this.resources = this.template.resources;

        this.initComponent();
    }

    initComponent = () => {
        this.resources?.on(this.resources.eventName, () => {
            this.floor = new Floor();
            this.fur = new Fur();
            this.fog = new Fog();
        });
    };

    update = () => {
        if (this.fur) this.fur.update();
    };

    destroy = () => {
        this.scene?.traverse((child) => {
            if (child.isMesh) {
                child.geometry.dispose();

                for (let key in child.material) {
                    const value = child.material[key];

                    if (value && typeof value.dispose === "function") {
                        value.dispose();
                    }
                }
            }
        });
    };
}
