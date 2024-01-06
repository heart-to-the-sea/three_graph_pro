import * as THREE from "three";

import { Exprience } from "./Experience";
import Renderer from "./Renderer";
import Sizes from "./utils/Sizes";
// 后处理
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import Camera from "./Camera";

export default class PostProcessing {
  experience!: Exprience;
  renderer!: Renderer;
  sizes!: Sizes;
  effectComposer!: EffectComposer;
  sence: THREE.Scene;
  camera: Camera;
  layer: THREE.Layers;
  constructor() {
    this.experience = new Exprience();
    this.renderer = this.experience.renderer;
    this.sizes = this.experience.sizes;
    this.sence = this.experience.scene;
    this.camera = this.experience.camera;
    this.layer = new THREE.Layers();
    this.effectComposer = new EffectComposer(this.renderer.renderer);
    this.effectComposer.addPass(this.addRenderPass());
    this.effectComposer.addPass(this.addUnealBloomPass());
    this.initLayear();
  }
  initLayear() {
    this.layer.set(1);
  }
  addUnealBloomPass() {
    console.log("init pass", this.sizes.width);
    const pass = new UnrealBloomPass(
      new THREE.Vector2(this.sizes.width * 4, this.sizes.height * 4),
      0.3,
      0.6,
      0.3
    );
    return pass;
  }
  addRenderPass() {
    const pass = new RenderPass(this.sence, this.camera.perspectiveCamera);
    return pass;
  }
  resize() {
    console.log("post processing resize");
    this.effectComposer.setSize(this.sizes.width, this.sizes.height);
  }
  update() {
    this.effectComposer.render();
  }
}
