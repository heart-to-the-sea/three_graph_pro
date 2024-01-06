import * as THREE from "three";
import Camera from "./Camera";
import Renderer from "./Renderer";
import Resource from "./Resource";
import Sizes from "./utils/Sizes";
import Times from "./utils/Time";
import CssRenderer from "./CssRenderer";
import Control from "./Control";
import DrawData from "./DrawData";
import PostProcessing from "./PostProcessing";
export class Exprience {
  static instance: Exprience;

  sizes!: Sizes;
  times!: Times;
  camera!: Camera;
  scene!: THREE.Scene;
  renderer!: Renderer;
  resource!: Resource;
  control!: Control;
  drawData!: DrawData;
  cssRender!: CssRenderer;
  postProcessing!: PostProcessing;
  screenToolTip!: HTMLDivElement;
  canvas!: HTMLCanvasElement;
  constructor(canvas?: HTMLCanvasElement) {
    if (Exprience.instance) {
      return Exprience.instance;
    }
    Exprience.instance = this;

    if (canvas) {
      this.canvas = canvas;
    }

    this.drawData = new DrawData();

    this.sizes = new Sizes();
    this.times = new Times();

    this.scene = new THREE.Scene();
    this.camera = new Camera();
    this.cssRender = new CssRenderer();
    this.control = new Control();
    this.renderer = new Renderer();
    this.resource = new Resource();
    this.postProcessing = new PostProcessing();

    this.sizes.on("resize", () => this.resize());
    this.times.on("update", () => this.update());
    console.log(this.scene);
    this.screenToolTip = document.querySelector(
      "#screen-tooltip"
    ) as HTMLDivElement;
  }
  resize() {
    this.camera.resize();
    this.cssRender.resize();
    this.renderer.resize();
    // this.control.resize();
  }
  update() {
    this.resource.update();
    this.camera.update();
    this.renderer.update();
    this.cssRender.update();
    // this.control.update();
    // this.postProcessing.update()
  }
}
