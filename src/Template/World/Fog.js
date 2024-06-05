import * as THREE from "three";
import Template from "../Template";

export default class Fog {
    constructor() {
        this.template = new Template();

        this.debug = this.template.debug;
        this.scene = this.template.scene;

        this.initComponent();
    }

    initComponent = () => {
        this.setDebugObj();
        this.setSceneBackground();
        this.setDebug();
    };

    setDebugObj = () => {
        this.debugObj = {
            fogColor: new THREE.Color("#f99eff"),
        };
    };

    setSceneBackground = () => {
        this.scene.background = this.debugObj.fogColor;
        this.scene.fog = new THREE.Fog(this.debugObj.fogColor, 27, 50);
    };

    setDebug = () => {
        if (!this.debug || !this.debug.gui) return;
        const fogFolder = this.debug.gui.addFolder("Fog").close();

        fogFolder
            .addColor(this.scene.fog, "color")
            .name("Color")
            .onChange((value) => {
                this.scene.background = value;
            });
        fogFolder.add(this.scene.fog, "near").min(0).max(100).step(0.001).name("Near");
        fogFolder.add(this.scene.fog, "far").min(1).max(100).step(0.001).name("Far");
    };
}
