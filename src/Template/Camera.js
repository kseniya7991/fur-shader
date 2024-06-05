import Template from "./Template";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const CAMERA_NEAR = 0.1;
const CAMERA_FAR = 100;

export default class Camera {
    constructor() {
        this.template = new Template();

        this.sizes = this.template.sizes;
        this.scene = this.template.scene;
        this.canvas = this.template.canvas;

        this.initComponent();
    }

    initComponent() {
        this.initCamera();
        this.initcontrols();
    }

    initCamera = () => {
        if (!this.sizes) return;
        this.instance = new THREE.PerspectiveCamera(
            35,
            this.sizes?.width / this.sizes?.height,
            CAMERA_NEAR,
            CAMERA_FAR
        );
        this.instance.position.set(0, 15, 25);

        this.scene?.add(this.instance);
    };

    initcontrols = () => {
        if (!this.instance) return;

        this.controls = new OrbitControls(this.instance, this.canvas);
        this.controls.enableDamping = true;
        // this.controls.enableRotate = false;

        this.controls.mouseButtons = {
            LEFT: THREE.MOUSE.ROTATE,
            MIDDLE: THREE.MOUSE.DOLLY,
            RIGHT: null,
        };

        // Limit rotation along the Y axis
        const fixedAzimuthAngle = 0;
        this.controls.minAzimuthAngle = fixedAzimuthAngle;
        this.controls.maxAzimuthAngle = fixedAzimuthAngle;
    };

    resize = () => {
        if (!this.instance || !this.sizes) return;
        this.instance.aspect = this.sizes?.width / this.sizes?.height;
        this.instance.updateProjectionMatrix();
    };

    update = () => {
        if (!this.controls) return;

        this.controls.update();
    };

    destroy = () => {
        this.controls?.dispose();
    };
}
