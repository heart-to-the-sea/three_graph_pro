import { Exprience } from "./Experience";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Sizes from "./utils/Sizes";
import Camera from "./Camera";
export default class Control {
    sizes!: Sizes;
    experience!: Exprience;

    scene!: THREE.Scene;
    control!: OrbitControls;
    canvas!: HTMLCanvasElement;
    position = new THREE.Vector3();
    camera!: Camera;
    constructor() {
        this.experience = new Exprience();
        this.scene = this.experience.scene;
        this.canvas = this.experience.canvas;
        this.sizes = this.experience.sizes;
        this.camera = this.experience.camera;

        this.control = this.createOrbitControl();
    }
    setPosition(position: THREE.Vector3) {
        console.log(position);
        this.position.copy(position);
        this.camera.perspectiveCamera.lookAt(position);
        this.control.target.copy(position);
        this.control.update();
    }
    createOrbitControl() {
        const control = new OrbitControls(
            this.camera.perspectiveCamera,
            this.experience.cssRender.renderer.domElement
        );
        // control.enableDamping = true;
        control.enableZoom = true;
        return control;
    }
    resize(){
        this.control.reset()
    }
    update() {
        this.control.update();
    }
}
