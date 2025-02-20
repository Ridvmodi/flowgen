import React, { useEffect, useRef } from "react";
import { dia, shapes } from "@joint/core";
import workflowData from "./workflow.json"; // Ensure this JSON is correctly imported

const FlowChart = () => {
  const graphRef = useRef(null);

  useEffect(() => {
    const graph = new dia.Graph();
    const paper = new dia.Paper({
      el: graphRef.current,
      model: graph,
      width: 1200,
      height: 800,
      gridSize: 10,
    });

    let elements = [];

    Object.keys(workflowData.processes).forEach((processKey, i) => {
      const process = workflowData.processes[processKey];
      const processRect = new shapes.standard.Rectangle({
        position: { x: 100, y: 100 + i * 300 },
        size: {
          width: 1200,
          height: Object.keys(process.subprocesses).length * 300,
        },
        attrs: {
          body: { fill: "#ADD8E6", stroke: "#000" },
          label: { text: process.name, fill: "#000" },
        },
      });
      elements.push(processRect);

      let subprocessY = 120 + i * 300;
      Object.keys(process.subprocesses).forEach((subKey, j) => {
        const subprocess = process.subprocesses[subKey];
        const subprocessRect = new shapes.standard.Rectangle({
          position: { x: 150, y: subprocessY + j * 150 },
          size: { width: 400, height: 100 },
          attrs: {
            body: { fill: "#FFF", stroke: "#000" },
            label: { text: subprocess.name, fill: "#000" },
          },
        });
        elements.push(subprocessRect);

        let riskY = subprocessY + j * 150 + 80;
        subprocess.risks.forEach((risk, index) => {
          const riskTriangle = new shapes.standard.Polygon({
            position: { x: 140, y: riskY + index * 40 },
            size: { width: 45, height: 45 },
            attrs: {
              body: { fill: "#FFFF00", stroke: "#000" },
              label: { text: risk.id, fill: "#000" },
            },
          });
          riskTriangle.attr("body/refPoints", "0,10 10,0 20,10 0,10");
          elements.push(riskTriangle);
        });

        let controlY = subprocessY + j * 150 - 40;
        subprocess.controls.forEach((control, index) => {
          const controlHexagon = new shapes.standard.Circle({
            position: { x: 525, y: controlY + index * 40 },
            size: { width: 40, height: 40 },
            attrs: {
              body: { fill: "#00FF00", stroke: "#000" },
              label: { text: control.id, fill: "#000" },
            },
          });
          elements.push(controlHexagon);
        });
      });
    });

    graph.addCells([...elements]);
  }, []);

  return <div ref={graphRef} style={{ border: "1px solid black" }}></div>;
};

export default FlowChart;
