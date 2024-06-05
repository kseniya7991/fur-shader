import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import Template from "../Template";
import EventEmitter from "./EventEmitter";

export default class Resources extends EventEmitter {
    constructor(sources) {
        super();

        this.sources = sources;

        this.eventName = "sourcesLoaded";

        //Setup
        this.items = {};
        this.toLoad = this.sources.length;
        this.loaded = 0;

        this.setLoaders();
        this.startLoading();
    }

    setLoaders = () => {
        this.loaders = {};
        this.loaders.gltfLoader = new GLTFLoader();
        this.loaders.textureLoader = new THREE.TextureLoader();
        this.loaders.cubeTextureLoader = new THREE.CubeTextureLoader();
        this.loaders.audio = new Audio();
    };

    startLoading = () => {
        //Load each source
        for (const source of this.sources) {
            switch (source.type) {
                case "texture":
                    this.loaders?.textureLoader.load(source.path, (file) => {
                        this.sourceLoaded(source, file);
                    });
                    break;
            }
        }
    };

    sourceLoaded = (source, file) => {
        this.items[source.name] = file;
        this.loaded++;

        if (this.loaded === this.toLoad) {
            this.trigger(this.eventName);
        }
    };
}
