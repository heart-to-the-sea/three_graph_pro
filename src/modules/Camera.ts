import { Exprience } from "./Experience";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Sizes from "./utils/Sizes";
export default class Camera {
    sizes!: Sizes;
    experience!: Exprience;
    scene!: THREE.Scene;
    canvas!: HTMLCanvasElement;
    position = new THREE.Vector3();

    perspectiveCamera!: THREE.PerspectiveCamera;
    constructor() {
        this.experience = new Exprience();
        this.scene = this.experience.scene;
        this.canvas = this.experience.canvas;
        this.sizes = this.experience.sizes;
        this.perspectiveCamera = this.createPerspectiveCamera();
        this.setScene();
    }
    setPosition(position: THREE.Vector3) {
        console.log(position);
        this.position.copy(position);
        this.perspectiveCamera.lookAt(position);
    }
    createPerspectiveCamera() {
        const camera = new THREE.PerspectiveCamera(
            45,
            this.sizes.aspect,
            0.001,
            10000
        );
        this.position.set(0, 0, 0);
        camera.lookAt(0, 0, 0)
        camera.position.set(0, 0, 3000); // 设置相机初始位置
        return camera;
    }
    createOrbitControl() {
        const control = new OrbitControls(
            this.perspectiveCamera,
            this.experience.cssRender.renderer.domElement
        );
        // control.enableDamping = true;
        control.enableZoom = true;
        return control;
    }
    setScene() {
        this.scene.add(this.perspectiveCamera);
    }
    resize() {
        this.perspectiveCamera.aspect = this.sizes.aspect;
        this.perspectiveCamera.updateProjectionMatrix();
    }
    update() {}
}
