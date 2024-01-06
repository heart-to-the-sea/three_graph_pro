import { data } from "../mock/mock";

// node {}
// links
export interface Node {
  id: string;
  name: string;
  color: number;
  // x: number;
  // y: number;
}
export interface Link {
  source: string;
  target: string;
  // sX: number;
  // sY: number;
  // tX: number;
  // tY: number;
}
export default class DrawData {
  // 数据meta
  dataMeta: { [k: string]: any }[] = [];
  data: { name?: string; nodes: Node[]; links: Link[] }[] = [];
  group: any[] = [];
  constructor() {
    this.init2();
    // this.initPosition();
  }
  private init() {
    const innerData = data.info_list.find((item) => item.name === "知识图谱");
    if (!innerData) return;
    const { /* 层级矩阵 */ step_graph, procedure_graph } = innerData;
    if (!procedure_graph) return;
    const { matrix, matrix_color, matrix_name } = procedure_graph;
    // 根据层级树组织结构
    for (let step of step_graph) {
      const nodes: Node[] = [];
      const links: Link[] = [];
      // 获取当前元素所在位置的坐标集合
      const nodeNameIndexList = step.sub_matrix_name
        .map((nodeName) => matrix_name.findIndex((name) => nodeName === name))
        .filter((item) => item !== -1);
      // 获取当前节点下子节点的关联数据
      step.sub_matrix_name.map((nodeName, index) => {
        // 获取当前元素的坐标位置
        const idx = matrix_name.findIndex((name) => name === nodeName);
        if (idx !== -1) {
          // 创建节点矩阵
          const obj = {
            id: nodeName,
            name: nodeName,
            color: matrix_color[index],
          };
          nodes.push(obj);
          // 当前元素的关系矩阵
          const innerMatrix = matrix[idx];
          innerMatrix.forEach((matrixNode, matrixIndex) => {
            if (nodeNameIndexList.includes(matrixIndex) && matrixNode) {
              const link = {
                source: nodeName, // 元节点
                target: matrix_name[matrixIndex], //目标节点
              };
              links.push(link);
            }
          });
        }
      });
      const obj = {
        name: step.name,
        nodes: nodes,
        links: links,
      };
      // this.data.push(obj);
    }
  }
  private init2() {
    this.dataMeta = data.info_list[0].data_list as { [k: string]: any }[];
    const innerData = data.info_list.find((item) => item.name === "知识图谱");
    if (!innerData) return;
    const { /* 层级矩阵 */ step_graph, procedure_graph } = innerData;
    if (!procedure_graph) return;
    const { matrix, matrix_color, matrix_name } = procedure_graph;
    // 根据层级树组织结构
    for (let step of step_graph) {
      const nodes: Node[] = [];
      const links: Link[] = [];
      // 获取当前元素所在位置的坐标集合
      const nodeNameIndexList = step.sub_matrix_name
        .map((nodeName) => matrix_name.findIndex((name) => nodeName === name))
        .filter((item) => item !== -1);
      // 获取当前节点下子节点的关联数据
      step.sub_matrix_name.map((nodeName, index) => {
        // 获取当前元素的坐标位置
        const idx = matrix_name.findIndex((name) => name === nodeName);
        // 获取颜色等级
        if (idx !== -1) {
          // 创建节点矩阵
          const obj = {
            id: nodeName,
            name: nodeName,
            index: idx,
            color: matrix_color[index],
          };
          nodes.push(obj);
          // 当前元素的关系矩阵
          const innerMatrix = matrix[idx];
          innerMatrix.forEach((matrixNode, matrixIndex) => {
            if (nodeNameIndexList.includes(matrixIndex) && matrixNode) {
              const link = {
                source: nodeName, // 元节点
                target: matrix_name[matrixIndex], //目标节点
              };
              links.push(link);
            }
          });
        }
      });
      const obj = {
        name: step.name,
        nodes: nodes,
        links: links,
      };
      this.data.push(obj);
    }
    this.group = step_graph;
    /****************************************************/
    const nodes = matrix_name.map((name, idx) => ({
      id: name,
      name,
      color: matrix_color[idx],
    }));

    const links: Link[] = [];
    matrix_name.map((name, idx) => {
      const graphMatrix = matrix[idx];
      graphMatrix.forEach((matrixNode, matrixIndex) => {
        if (matrixNode) {
          const obj = {
            target: matrix_name[matrixIndex],
            source: name,
          };
          links.push(obj);
        }
      });
    });
    this.data.push({ nodes, links });
  }
  initPosition() {
    this.data.forEach((d) => {
      {
        const list: Link[] = [];
        d.links.forEach((link, idx) => {
          const source = d.nodes.find(
            (item) => item.id === link.source
          ) as Node;
          const target = d.nodes.find(
            (item) => item.id === link.target
          ) as Node;
          if (
            -1 ===
            list.findIndex(
              (node) =>
                (node.source === link.source && node.target === link.target) ||
                (node.source === link.target && node.target === link.source)
            )
          ) {
            list.push(link);
          }
        });
        d.links = list;
      }
    });
  }
  private filterData() {}
  getData() {
    return this.data;
  }
  getGraphData() {
    const data = this.data;
    data.map((item) => {});
  }
}
