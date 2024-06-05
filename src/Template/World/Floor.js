import * as THREE from "three";
import Template from "../Template";
import EventEmitter from "../Utils/EventEmitter";

export default class Floor extends EventEmitter {
    constructor() {
        super();

        this.template = new Template();
        this.scene = this.template.scene;

        this.initialSize = 7;
        this.initColor = "#e65c00";

        //Debug
        this.debug = this.template.debug;
        this.debugObj = this.template.debugObj;

        this.initComponent();
    }

    initComponent = () => {
        this.initDebugObj();

        this.setGeometry();
        this.setMaterial();
        this.setMesh();

        this.initDebug();

        this.on("reset", () => {
            this.updateSize();
        });
    };

    initDebugObj = () => {
        this.debugObj.plane = {
            size: this.initialSize,
            color: this.initColor,
        };
    };

    setGeometry = () => {
        this.geometry = new THREE.CircleGeometry(this.initialSize, 24);
    };

    setMaterial = () => {
        this.material = new THREE.MeshBasicMaterial({
            color: new THREE.Color(this.debugObj?.plane.color),
            side: THREE.DoubleSide,
        });
    };

    setMesh = () => {
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.rotation.x = -Math.PI * 0.5;
        this.mesh.position.y = -0.05;
        this.scene?.add(this.mesh);
    };

    initDebug = () => {
        if (this.debug?.active) {
            this.debugFolder = this.debug.gui?.addFolder("Plane");

            this.debugFolder.addColor(this.debugObj.plane, "color").onChange((value) => {
                if (!this.material) return;
                this.material.color = new THREE.Color(value);
            });
        }
    };

    updateSize = () => {
        if (!this.mesh) return;
        this.mesh.scale.setScalar(this.debugObj.plane.size / this.initialSize);
    };
}
