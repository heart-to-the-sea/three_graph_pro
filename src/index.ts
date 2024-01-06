import ForceGraph from "3d-force-graph";
import * as THREE from "three";
import { Exprience } from "./modules/Experience";
const dom = [
  "Registration Request (UE)",
  "AMF Selection",
  "Registration Request (RAN)",
  "Identity Request",
  "Identity Response",
  "AUSF Selection",
  "Authentication/Security",
  "Identity Request/Response",
  "UDM Selection",
  "Nudm_UECM_Registration",
  "Nudm_SDM_Get",
  "Nudm_SDM_Subscribe",
  "PCF selection",
  "Registration Accept",
  "UE Policy Association Establishment",
  "Registration Complete",
];
window.onload = () => {
  const box = new Exprience(
    document.querySelector("#graph") as HTMLCanvasElement
  );
  // setTimeout(() => {
  //   box.resource.shaderBox.checkPosition("AUSF Selection")
  // }, 3000);
  const divs = document.querySelector(".search-box");
  dom.forEach((str, index) => {
    const node = document.createElement("div");
    node.innerHTML = index + 1+'&nbsp;&nbsp;&nbsp;&nbsp;' + str;
    node.onclick = () => {
      box.resource.shaderBox.checkPosition(str);
    };

    divs?.append(node);
  });
};
