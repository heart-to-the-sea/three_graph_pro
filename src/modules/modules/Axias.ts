import * as THREE from "three";
import { Exprience } from "../Experience";
export default class Axis {
    experience!: Exprience;
    scene: THREE.Scene;
    constructor() {
        console.log("init axis");
        this.experience = new Exprience();
        this.scene = this.experience.scene;
        // this.scene.add(this.getBox());
        // this.scene.add(this.getAxis());
        this.scene.add(
            new THREE.AmbientLight(0xffffff, 1)
        );
    }
    getAxis() {
        const axis = new THREE.AxesHelper(100);
        return axis;
    }
    getBox() {
        const geometry = new THREE.BoxGeometry(10, 10, 10);
        const material = new THREE.MeshBasicMaterial({
            color: 0x00c4c4,
        });
        const mesh = new THREE.Mesh(geometry, material);
        return mesh;
    }
}
