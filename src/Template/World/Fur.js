import * as THREE from "three";
import Template from "../Template";
import furVertexShader from "../../shaders/fur/vertex.glsl";
import furFragmentShader from "../../shaders/fur/fragment.glsl";
import EventEmitter from "../Utils/EventEmitter";

const DEFAULT_SPEED = 0.0005;

export default class Fur extends EventEmitter {
    constructor() {
        super();

        this.template = new Template();
        this.scene = this.template.scene;
        this.resources = this.template.resources;
        this.mouse = this.template.mouse;
        this.time = this.template.time;

        this.world = this.template.world;
        this.floor = this.world?.floor;

        //Debug
        this.debug = this.template.debug;
        this.debugObj = this.template.debugObj;

        //Blade settings
        this.bladeCount = 100000;
        this.bladeWidth = 0.018;
        this.bladeWidthVariation = 0.1;
        this.bladeHeight = 1.0;
        this.bladeHeightVariation = 0.65;

        //Blow settings
        this.blowRadius = 0.15;

        //Wave settings
        this.waveSize = 1;

        //Time settings
        this.timeSpeed = 1.5;

        this.resetEventName = "reset";

        this.initComponent();
    }

    initComponent = () => {
        this.setTextures();
        this.initDebugObj();

        console.time("test");
        this.initField();
        console.timeEnd("test");
        this.initDebug();
    };

    setTextures() {
        this.textures = {};

        this.textures.color = this.resources.items.furTexture;
        this.textures.color.colorSpace = THREE.SRGBColorSpace;
    }

    initDebugObj = () => {
        if (!this.debugObj) return;

        this.debugObj.blade = {
            count: this.bladeCount,
            width: this.bladeWidth,
            widthVariation: this.bladeWidthVariation,
            height: this.bladeHeight,
            heightVariation: this.bladeHeightVariation,
        };
        this.debugObj.blow = {
            radius: this.blowRadius,
        };
        this.debugObj.wave = {
            size: this.waveSize,
        };
        this.debugObj.timeSpeed = this.timeSpeed;

        this.debugObj.reset = () => {
            this.destroyField();
            this.floor?.trigger(this.resetEventName);

            this.initField();
        };
    };

    initField = () => {
        this.geometry = this.initGeometry();
        this.material = this.initMaterial();

        this.fieldMesh = new THREE.Mesh(this.geometry, this.material);
        this.scene.add(this.fieldMesh);
    };

    destroyField = () => {
        if (!this.fieldMesh) return;
        this.scene?.remove(this.fieldMesh);
        this.fieldMesh.material?.dispose();
        this.fieldMesh.geometry?.dispose();
    };

    generateBlade = (center, vArrOffset, uv, vertCount) => {
        const resultWidth = this.debugObj.blade.width + Math.random() * this.debugObj.blade.widthVariation;
        const midWidth = resultWidth * 0.5;
        const height = this.debugObj.blade.height + Math.random() * this.debugObj.blade.heightVariation;

        const yaw = Math.random() * Math.PI * 2;
        const yawUnitVec = new THREE.Vector3(Math.sin(yaw), 0, -Math.cos(yaw));
        const tipBend = Math.random() * Math.PI * 2;
        const tipBendUnitVec = new THREE.Vector3(Math.sin(tipBend), 0, -Math.cos(tipBend));

        // Find the Bottom Left, Bottom Right, Top Left, Top right, Top Center vertex positions
        const bl = center.clone().addScaledVector(yawUnitVec, resultWidth / 2);
        const br = center.clone().addScaledVector(yawUnitVec, -resultWidth / 2);
        const tl = center.clone().addScaledVector(yawUnitVec, midWidth / 2);
        const tr = center.clone().addScaledVector(yawUnitVec, -midWidth / 2);
        const tc = center.clone().addScaledVector(tipBendUnitVec, 0);
        tl.y += height * 0.6;
        tr.y += height * 0.6;
        tc.y += height;

        // Vertex Colors
        const black = [0, 0, 0];
        const gray1 = [0.2, 0.2, 0.2];
        const gray2 = [0.5, 0.5, 0.5];
        const gray3 = [0.8, 0.8, 0.8];
        const white = [1.0, 1.0, 1.0];

        // Добавляем дополнительные вершины
        const m1 = new THREE.Vector3().addVectors(bl, tl).multiplyScalar(0.5);
        const m2 = new THREE.Vector3().addVectors(br, tr).multiplyScalar(0.5);

        const verts = [
            { pos: bl.toArray(), uv, color: black },
            { pos: br.toArray(), uv, color: black },
            { pos: m1.toArray(), uv, color: gray1 },
            { pos: m2.toArray(), uv, color: gray1 },
            { pos: tl.toArray(), uv, color: gray2 },
            { pos: tr.toArray(), uv, color: gray2 },
            { pos: tc.toArray(), uv, color: white },
        ];

        const indices = [];

        for (let i = 0; i < vertCount - 2; i++) {
            indices.push(vArrOffset + i);
            indices.push(vArrOffset + i + 1);
            indices.push(vArrOffset + i + 2);
        }

        return { verts, indices };
    };

    convertRange = (val, oldMin, oldMax, newMin, newMax) => {
        return ((val - oldMin) * (newMax - newMin)) / (oldMax - oldMin) + newMin;
    };

    initGeometry = () => {
        const positions = [];
        const uvs = [];
        const indices = [];
        const colors = [];

        const surfaceMin = this.debugObj.plane.size * -1;
        const surfaceMax = this.debugObj.plane.size;
        const radius = this.debugObj.plane.size;

        let bladeCount = this.debugObj.blade.count;

        const VERTEX_COUNT = 7;

        for (let i = 0; i < bladeCount; i++) {
            const r = radius * Math.sqrt(Math.random());

            const theta = Math.random() * 2 * Math.PI;
            const x = r * Math.cos(theta);
            const z = r * Math.sin(theta);

            const pos = new THREE.Vector3(x, 0, z);

            const uv = [
                this.convertRange(pos.x, surfaceMin, surfaceMax, 0, 1),
                this.convertRange(pos.z, surfaceMin, surfaceMax, 0, 1),
            ];

            const blade = this.generateBlade(pos, i * VERTEX_COUNT, uv, VERTEX_COUNT);

            blade.verts.forEach((vert) => {
                positions.push(...vert.pos);
                uvs.push(...vert.uv);
                colors.push(...vert.color);
            });

            blade.indices.forEach((indice) => indices.push(indice));
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(positions), 3));
        geometry.setAttribute("uv", new THREE.BufferAttribute(new Float32Array(uvs), 2));
        geometry.setAttribute("color", new THREE.BufferAttribute(new Float32Array(colors), 3));
        geometry.setIndex(indices);
        geometry.computeVertexNormals();

        return geometry;
    };

    initMaterial = () => {
        return new THREE.ShaderMaterial({
            vertexShader: furVertexShader,
            fragmentShader: furFragmentShader,
            side: THREE.DoubleSide,
            wireframe: false,
            fog: true,
            uniforms: {
                uTexture: new THREE.Uniform(this.textures.color),
                uTime: new THREE.Uniform(0),
                uMouse: new THREE.Uniform(this.mouse?.mouseObj),
                uBlowRadius: new THREE.Uniform(this.debugObj.blow.radius),
                uWaveSize: new THREE.Uniform(this.debugObj.wave.size),
                uBladeHeight: new THREE.Uniform(this.debugObj.blade.height),

                uMouseTest: new THREE.Uniform(new THREE.Vector3(0, 0, 0)),
                ...THREE.UniformsLib["fog"],
            },
        });
    };

    initDebug = () => {
        if (this.debug?.active) {
            //Plane debug
            this.floor?.debugFolder.add(this.debugObj.plane, "size", 0.1, 30, 0.1).onFinishChange((value) => {
                this.debugObj.reset();
            });

            //Common debug
            this.debug.gui
                ?.add(this.debugObj.wave, "size", 0.1, 10, 0.1)
                .name("wave size")
                .onChange(() => {
                    this.fieldMesh.material.uniforms.uWaveSize.value = this.debugObj.wave.size;
                });
            this.debug.gui
                .add(this.debugObj.blow, "radius", 0.0, 0.4, 0.001)
                .name("blow radius")
                .onChange(() => {
                    this.fieldMesh.material.uniforms.uBlowRadius.value = this.debugObj.blow.radius;
                });

            this.debug.gui
                .add(this.debugObj, "timeSpeed", 0, 5, 0.1)
                .name("time speed")
                .onChange(() => {
                    this.timeSpeed = this.debugObj.timeSpeed;
                });

            //Blade debug
            let bladeFolder = this.debug.gui?.addFolder("Blade");
            if (!bladeFolder) return;

            bladeFolder
                .add(this.debugObj.blade, "count", 0, 500000, 1)
                .name("count")
                .onFinishChange(() => {
                    this.debugObj.reset();
                });

            bladeFolder
                .add(this.debugObj.blade, "width", 0, 1.0, 0.001)
                .name("width")
                .onFinishChange(() => {
                    this.debugObj.reset();
                });

            bladeFolder
                .add(this.debugObj.blade, "widthVariation", 0.0, 1.0, 0.001)
                .name("width variation")
                .onFinishChange(() => {
                    this.debugObj.reset();
                });
            bladeFolder
                .add(this.debugObj.blade, "height", 0, 1.0, 0.001)
                .name("height")
                .onFinishChange(() => {
                    this.debugObj.reset();
                });

            bladeFolder
                .add(this.debugObj.blade, "heightVariation", 0.0, 1.0, 0.001)
                .name("height variation")
                .onFinishChange(() => {
                    this.debugObj.reset();
                });
        }
    };

    update = () => {
        if (!this.template.time) return;
        this.material.uniforms.uTime.value = this.time.elapsed * DEFAULT_SPEED * this.timeSpeed;
    };
}
