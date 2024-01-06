import * as THREE from "three";
import { Exprience } from "../Experience";
import {
  CSS3DObject,
  CSS3DSprite,
} from "three/examples/jsm/renderers/CSS3DRenderer";
import gsap from "gsap";
import ForceGraph from "three-forcegraph";

const types = [
  {
    id: 1,
    label: "普通字段",
    color: "#80ffa5",
    linkColor: "",
  },
  {
    id: 2,
    label: "流程实体",
    color: "rgb(244,189,125)",
    linkColor: "",
  },
  {
    id: 3,
    label: "统计指标",
    color: "#37a2ff",
    linkColor: "",
  },
  {
    id: 4,
    label: "算法指标",
    color: "#ff0087",
    linkColor: "",
  },
  // {
  //   id: 5,
  //   label: "type5",
  //   color: "rgb(138,80,207)",
  // },
];
let linkKV = types.reduce((t, r) => {
  t[r.id] = r.color;
  return t;
}, {});

export default class ShaderBox {
  experience: Exprience;
  box!: THREE.Group;
  graphList: ForceGraph[] = [];
  globalGroup!: THREE.Group;
  canvas = document.createElement("canvas");
  constructor() {
    this.experience = new Exprience();
    this.init();
  }
  init() {
    this.experience.drawData.group.forEach((drawGroup, idx) => {
      // this.init3(drawGroup,idx)
    });
    this.init3();
  }
  init3() {
    const globalGroup = new THREE.Group();
    const width = 2600; // 边界宽度
    const height = 400; // 边界高度
    const depth = 2600; // 边界深度
    const N = 100;
    const drawData = this.experience.drawData.getData();

    this.graphList = [];
    for (const idx in this.experience.drawData.group) {
      const group = this.experience.drawData.group[idx];
      const graph = new ForceGraph(); //(document.querySelector("#graph") as any);
      const data = drawData[idx];
      console.log(data);
      graph.graphData({
        nodes: [
          ...data.nodes
            .map((n) => ({ ...n, path: idx, group }))
            .map((node) => ({ ...node })),
        ],
        links: [...data.links.map((node) => ({ ...node }))],
      });
      graph.name = data.name || "";
      graph
        .linkWidth(1)
        .linkResolution(10)
        .nodeAutoColorBy("group")
        .linkResolution(22)
        .d3Force("charge");
      this.graphList.push(graph);
    }
    this.graphList.forEach((graph, index) => {
      // graph.dagMode("radialin");
      // graph.dagLevelDistance(600);
      graph.d3Force("charge")?.strength(-500); // 设置斥力强度
      graph.d3Force("link")?.distance(400); // 设置节点之间的距离
      graph.d3Force("positioning", (alpha) => {
        // 遍历所有节点
        graph.graphData().nodes.forEach((node: any) => {
          // console.log(node);
          // 限制节点 X 坐标在边界范围内
          node.x = Math.max(-width / 2, Math.min(width / 2, node.x as any));
          // 限制节点 Z 坐标在边界范围内
          node.z = Math.max(-depth / 2, Math.min(depth / 2, node.z as any));
          // 限制节点 Z 坐标在边界范围内
          node.y = Math.max(-height / 2, Math.min(height / 2, node.y as any));
        });
      });
      graph.position.setY(1000 * index);
      // graph((node) => {
      //   let obj = this.XGZD.data.find((r) => r["英文名称"] === node.id);
      //   if (obj) {
      //     return `
      //           <div class="d3-tooltip padv10 padh20 radius10 " style='background:rgb(0,77,155);' >
      //             <div class="title bold">${node.id}</div>
      //             <div class="desc font14 marv10">实体类型：${obj["实体类型"]}</div>
      //             <div class="desc font14">中文名称：${obj["中文名称"]}</div>
      //           </div>
      //           `;
      //   } else {
      //     return `
      //           <div class="d3-tooltip padv10 padh20 radius10" style='background:rgb(0,77,155)' >
      //             <div class="title bold">${node.id}</div>
      //           </div>
      //           `;
      //   }
      // })
      graph.cooldownTicks(200);
      // 处理节点
      graph.nodeThreeObject((node: any) => {
        const group = new THREE.Group();
        /***************************节点***************************** */
        // const geometry = new THREE.SphereGeometry(20);
        // let material = new THREE.MeshStandardMaterial({
        //   color: new THREE.Color(1, 1, 1),
        // });
        // material.transparent = true;
        // material.opacity = 0.6;
        // console.log(node.group.sub_matrix_name, node);
        // if (node.group.sub_matrix_name.includes(node.id)) {
        //   material = new THREE.MeshStandardMaterial({
        //     color: new THREE.Color(
        //       node.color*0.5,
        //       node.color*0.5,
        //       node.color*0.5
        //     ),
        //   });
        //   material.opacity = 1;
        // }

        // const sphere = new THREE.Mesh(geometry, material);
        // group.add(sphere);
        /******************************************************** */
        const img = document.createElement("div");
        let imgsrc = "1.png";
        if (!isNaN(node.color)) {
          imgsrc = `/${node.color}.png`;
        }
        img.innerHTML = `<div 
        style="
        cursor: pointer;
        background-size: 100%;
        width: 50px;
        height: 50px;
        position:relative;
        top: 35px;
        background-image:url(${imgsrc});
            "></div>`;
        const objImg = new CSS3DSprite(img);
        objImg.layers.set(0);
        objImg.position.setY(30);
        document.body.appendChild(img);
        group.add(objImg);
        const meta = this.experience.drawData.dataMeta[node.index];
        img.onmouseenter = (e) => {
          const d = e.target as HTMLDivElement;
          this.experience.screenToolTip.innerHTML = `
          <div class="d3-tooltip padv10 padh20 radius10 " style='background:rgb(0,77,155);color:#fff;padding: 10px;border-radius: 5px;' >
          <div class="title bold">${node.id}</div>
          <div class="desc font14 marv10">实体类型：${meta["实体类型"]}</div>
          <div class="desc font14">中文名称：${meta["中文名称"]}</div>
        </div>
          `;
          d.onmousemove = (e) => {
            console.log(e.x);
            const { width, height } =
              this.experience.screenToolTip.getBoundingClientRect();

            this.experience.screenToolTip.style.top = e.y + 20 + "px";
            this.experience.screenToolTip.style.left = e.x - width / 2 + "px";
          };
        };
        img.onmouseleave = (e) => {
          const d = e.target as HTMLDivElement;
          this.experience.screenToolTip.innerHTML = "";
          d.onmousemove = (e) => {};
        };
        // img.onmousedown = (e) => {
        //   console.log("--->");
        //   console.log(node);
        //   let startX = e.x
        //   let startY = e.y
        //   // this.experience.camera.perspectiveCamera.position.set(node.x, node.y, node.z)
        //   this.experience.control.setPosition(new THREE.Vector3(node.x, node.y, node.z))
        // };

        const dom = document.createElement("div");
        dom.innerHTML = `<div style="color:${linkKV[node.color]};">${
          node.id
        }</div>`;

        const obj = new CSS3DSprite(dom);
        obj.layers.set(0);
        obj.position.setY(30);
        document.body.appendChild(dom);
        group.add(obj);

        // 精灵图
        // const spriteMap = new THREE.TextureLoader().load(imgsrc);
        // const spriteMaterial = new THREE.SpriteMaterial({
        //   map: spriteMap,
        //   transparent: true,
        // });
        // const sprite = new THREE.Sprite(spriteMaterial);
        // group.add(sprite);
        // sprite.scale.set(80, 80, 10); //// 只需要设置x、y两个分量就可以
        // sprite.position.setY(-30);
        return group;
      });

      graph.linkThreeObject((node: any) => {
        const colors = new Float32Array(
          [172, 109, 118, 41, 22, 222].map((a) => a / 255)
        );

        const material = new THREE.LineBasicMaterial({
          color: "#3e5a79",
          transparent: false,
          opacity: 1,
        });
        const geometry = new THREE.BufferGeometry();
        return new THREE.Line(geometry, material);
      });

      globalGroup.add(graph);
      globalGroup.add(this.getBox(index * 1000, graph.name));
      // setInterval(() => {
      //   this.experience.camera.perspectiveCamera.lookAt(0, 0, 0)
      //   this.experience.camera.perspectiveCamera.position.set(0, 0, 3000)
      //   globalGroup.position.setY(globalGroup.position.y - 62);
      // }, 1000);
    });
    this.experience.scene.add(globalGroup);
    this.globalGroup = globalGroup;
  }
  getCanvasTexture(text: string, col: string = "#ffffff") {
    const canvas = document.createElement("canvas");
    canvas.width = 2000;
    canvas.height = 70;
    const color = col.replace("#", "");
    const colorList = [
      `0x${color[0]}${color[1]}`,
      `0x${color[2]}${color[3]}`,
      `0x${color[4]}${color[5]}`,
    ]
      .map((item) => Number(item))
      .map((item) => Math.floor((item / 255) * 100) / 100);
    const context = canvas.getContext("2d") as CanvasRenderingContext2D;
    context.beginPath();
    context.beginPath();
    const grd = context.createLinearGradient(0, 0, 0, 800);
    grd.addColorStop(0, "rgba(0,0,0,0)");
    grd.addColorStop(1, `rgba(${colorList.join(",")},1)`);
    context.fillStyle=grd
    context.fillRect(0, 0, 2000, 70);
    context.beginPath();
    context.fillStyle = "#ffffff"; //文本填充颜色
    context.font = "bold 60px 宋体"; //字体样式设置
    context.textBaseline = "middle"; //文本与fillText定义的纵坐标
    context.textAlign = "center"; //文本居中(以fillText定义的横坐标)
    context.fillText(text, 1000, 38, 800);
    return new THREE.CanvasTexture(canvas);
  }
  getBox(y: number, name: string) {
    const group = new THREE.Group();
    let pos = [
      [-1, -1, 1, 0, 1000],
      [-1, +1, 2, 1, -1000],
      [+1, +1, 1, 0, 1000],
      [+1, -1, 2, 1, -1000],
    ];
    {
      for (let idx in pos) {
        const innerGroup = new THREE.Group();
        const p = pos[idx];
        const geometry1 = new THREE.PlaneGeometry(2000, 700);
        const material1 = new THREE.ShaderMaterial({
          uniforms: {
            u_height: { value: 900 },
            u_time: { value: 0 },
          },
          linewidth: 2,
          side: THREE.DoubleSide,
          fragmentShader: `
            precision highp float;
            uniform float u_height;
            varying vec3 v_position;
            varying vec2 v_uv;
            void main() {
              float height_opc = 1.0 - ((v_position.y+400.0) / 700.0);
              gl_FragColor += vec4(0, 0.521, 0.964, height_opc*0.3);
            }`,
          vertexShader: `
            precision highp float;
            varying vec3 v_position;
            // 造云
            void main() {
              v_position = position;
              vec4 model_position = modelMatrix * vec4(position, 1.0);
              gl_Position = projectionMatrix * viewMatrix * model_position;
            }`,
          transparent: true,
          opacity: 1,
        });
        const mesh1 = new THREE.Mesh(geometry1, material1);
        innerGroup.add(mesh1);

        const geometry2 = new THREE.PlaneGeometry(2200, 100);
        const material2 = new THREE.ShaderMaterial({
          uniforms: {
            u_height: { value: 900 },
            u_time: { value: 0 },
          },
          linewidth: 2,
          side: THREE.DoubleSide,
          fragmentShader: `
            precision highp float;
            uniform float u_height;
            varying vec3 v_position;
            varying vec2 v_uv;
            void main() {
              float height_opc = 1.0 - ((v_position.y+400.0) / 700.0);
              gl_FragColor += vec4(0, 0.521, 0.964, 0.2);
            }`,
          vertexShader: `
            precision highp float;
            varying vec3 v_position;
            // 造云
            void main() {
              v_position = position;
              vec4 model_position = modelMatrix * vec4(position, 1.0);
              gl_Position = projectionMatrix * viewMatrix * model_position;
            }`,
          transparent: true,
          opacity: 1,
        });
        const mesh2 = new THREE.Mesh(geometry2, material2);
        mesh2.position.setY(y - 400);
        mesh2.position.setZ(1050);
        innerGroup.position.setY(y - 20);
        innerGroup.position.setZ(1000);
        switch (Number(idx)) {
          case 0:
            break;
          case 1:
            innerGroup.position.setZ(-1000);

            mesh2.position.setZ(-1100);
            break;
          case 2:
            innerGroup.rotateY(Math.PI / p[2] / 2);
            innerGroup.position.setX(1000);
            innerGroup.position.setZ(0);

            mesh2.rotateY(Math.PI / p[2] / 2);
            mesh2.position.setX(1100);
            mesh2.position.setZ(0);
            break;
          case 3:
            innerGroup.rotateY(Math.PI / p[2]);
            innerGroup.position.setX(-1000);
            innerGroup.position.setZ(0);

            mesh2.rotateY(Math.PI / p[2]);
            mesh2.position.setX(-1100);
            mesh2.position.setZ(0);
            break;
        }
        // group.add(mesh2);
        group.add(innerGroup);
      }
    }

    const geometry = new THREE.BoxGeometry(2000, 650, 2000);
    const material = new THREE.LineBasicMaterial({
      color: "#0080ec",
      transparent: true,
      opacity: 1,
    });

    const mesh = new THREE.LineSegments(
      new THREE.EdgesGeometry(geometry),
      material
    );

    const bottomGeometry = new THREE.BoxGeometry(2000, 70, 2000, 10, 3, 10);
    console.log("-------------------------->", name);
    const bottomMaterial = new THREE.ShaderMaterial({
      uniforms: {
        u_height: { value: 150 },
        u_time: { value: 0 },
        u_texture: { value: this.getCanvasTexture(name) },
      },
      side: THREE.FrontSide,
      fragmentShader: `
        precision highp float;
        uniform sampler2D u_texture;
        uniform float u_height;
        varying vec3 v_position;
        varying vec2 v_uv;
        varying vec3 v_normal;

        void main() {
          vec4 textureColor = texture2D(u_texture, 1.0 - v_uv);
            float height_opc = 1.0 - ((v_position.y + 60.0) / 150.0);
            gl_FragColor = vec4(0, 0.521, 0.964, height_opc);
          if (abs(v_normal.y) < 0.9) {
            gl_FragColor += textureColor;
          }
        }`,
      vertexShader: `
        precision highp float;
        varying vec3 v_position;
        varying vec2 v_uv;
        varying vec3 v_normal;

        // 造云
        void main() {
          v_position = position;
          v_uv = uv;
          v_normal = normalize(mat3(modelMatrix) * normal);
          vec4 model_position = modelMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * viewMatrix * model_position;
        }`,
      transparent: true,
    });
    const bottomMaterialBase = new THREE.LineBasicMaterial({
      color: "#ff0000",
      linewidth: 2,
    });
    const bottomMesh = new THREE.Mesh(bottomGeometry, bottomMaterial);
    bottomMesh.position.setY(y - 400);
    bottomMesh.rotateZ(Math.PI);
    const bottomLine = new THREE.LineSegments(
      new THREE.EdgesGeometry(bottomGeometry),
      bottomMaterial
    );
    bottomLine.position.setY(y - 400);
    bottomLine.rotateZ(Math.PI);
    mesh.position.setY(y);



      // const text = document.createElement('div')
      // text.innerHTML = `<div 
      //   style="
      //     cursor: pointer;
      //     background-size: 100%;
      //     width: auto;
      //     height: 60px;
      //     position:relative;
      //     top: 40px;
      //     color:#fff;
      //     background-color: #2378d7;
      //     text-align: center;
      //     font-weight: 700;
      //     font-size: 40px;
      //       ">${name}</div>`;
      //   const objImg = new CSS3DSprite(text);
      //   objImg.layers.set(0);
      //   objImg.position.setY(y - 360);
      //   objImg.position.setZ(1000);
      //   document.body.appendChild(text);
      //   group.add(objImg);

    const geometrytopbox = new THREE.BoxGeometry(2000, 900, 2000, 20, 10, 20);
    const geometrytopmaterial = new THREE.MeshBasicMaterial({
      color: "#ff0000",
      transparent: true,
      opacity: 0.3,
    });

    const geometryTopMaterial = new THREE.ShaderMaterial({
      uniforms: {
        u_height: { value: 900 },
        u_time: { value: 0 },
      },
      linewidth: 2,
      side: THREE.FrontSide,
      fragmentShader: `precision highp float;
            uniform float u_height;
            varying vec3 v_position;
            varying vec2 v_uv;
            void main() {
              float height_opc = 1.0 - ((v_position.y + 100.0) / 700.0);
              gl_FragColor = vec4(0, 0.521, 0.964, 0.3);
            }
            `,
      vertexShader: `
            precision highp float;
  
            varying vec3 v_position;
            // 造云
            void main() {
                v_position = position;
                vec4 model_position = modelMatrix * vec4(position, 1.0);
                gl_Position = projectionMatrix * viewMatrix * model_position;
            }
            `,
      transparent: true,
    });

    // const topboxmesh = new THREE.Mesh(geometrytopbox, geometryTopMaterial);
    // const topboxline = new THREE.Line(geometrytopbox, geometryTopMaterial);
    // topboxmesh.position.setY(y + 30);
    // topboxline.position.setY(y + 30);
    // group.add(topboxline)
    // group.add(topboxmesh);
    group.add(bottomMesh);
    group.add(bottomLine);
    return group;
  }
  getLine() {
    const line = new THREE.DirectionalLight("#0080ec", 0.6);
    line.position.set(200, 200, 500);
    this.experience.scene.add(new THREE.DirectionalLightHelper(line));
    line.castShadow = true;
    return line;
  }
  checkPosition(name: string) {
    console.log(name);
    console.log(this.graphList.map((item) => item.name));
    const index = this.graphList.findIndex((graph) => graph.name === name);
    console.log(index);
    this.experience.camera.perspectiveCamera.lookAt(0, 0, 0);
    this.experience.camera.perspectiveCamera.position.set(0, 0, 3000);
    this.experience.camera.perspectiveCamera.lookAt(0, 0, 0);
    this.experience.camera.perspectiveCamera.position.set(0, 0, 3000);
    this.experience.control.setPosition(new THREE.Vector3(0, 0, 0));
    if (-1 !== index) {
      gsap.to(this.globalGroup.position, {
        y: -1000 * index,
        yoyo: true,
        duration: 1,
      });
      // this.globalGroup.position.setY(-1000 * index);
    }
  }
  update() {
    this.graphList.forEach((graph) => graph.tickFrame());
  }
}
