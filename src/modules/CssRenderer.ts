import { CSS3DRenderer } from "three/examples/jsm/renderers/CSS3DRenderer";
import { Exprience } from "./Experience";
import * as THREE from "three";
import Sizes from "./utils/Sizes";
export default class CssRenderer {
    renderer: CSS3DRenderer;
    experience: Exprience;
    scene: THREE.Scene;
    sizes!: Sizes;
    canvas: HTMLCanvasElement;
    camera: THREE.PerspectiveCamera;
    constructor() {
        this.experience = new Exprience();
        this.sizes = this.experience.sizes;
        this.scene = this.experience.scene;
        this.canvas = this.experience.canvas;
        this.camera = this.experience.camera.perspectiveCamera;

        this.renderer = new CSS3DRenderer({});
        this.renderer.domElement.style.position = "absolute";
        this.renderer.domElement.style.top = "0";
        this.renderer.setSize(this.sizes.width, this.sizes.height);
        //@ts-ignore
        document
            .querySelector("#canvas-box")
            .appendChild(this.renderer.domElement);
    }
    resize() {
        this.renderer.setSize(this.sizes.width, this.sizes.height);
    }
    update() {
        this.renderer.render(this.scene, this.camera);
    }
}
