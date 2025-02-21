import React, { useEffect, useRef, useState } from "react";
import { dia, shapes } from "@joint/core";
import * as XLSX from "xlsx";
import workflowData from "./workflow.json";
import { Modal, Box, Button, TextField } from "@mui/material";

const FlowChart = () => {
  const graphRef = useRef(null);
  const [selectedSubprocess, setSelectedSubprocess] = useState(null);
  const [updatedName, setUpdatedName] = useState("");

  useEffect(() => {
    const graph = new dia.Graph();
    const paper = new dia.Paper({
      el: graphRef.current,
      model: graph,
      width: 1350,
      height: 1000,
      gridSize: 10,
      interactive: { elementMove: true },
    });

    let elements = [];
    let yOffset = 50;
    let links = [];

    Object.keys(workflowData.processes).forEach((processKey) => {
      const process = workflowData.processes[processKey];
      const processHeight = Object.keys(process.subprocesses).length * 180 + 50;
      const processRect = new shapes.standard.Rectangle({
        position: { x: 100, y: yOffset },
        size: { width: 1000, height: processHeight },
        attrs: {
          body: { fill: "#ADD8E6", stroke: "#000", rx: 10, ry: 10 },
          label: { text: process.name, fill: "#000", fontSize: 14, y: "2em" },
        },
      });
      elements.push(processRect);



      let subprocessY = yOffset + 100;
      let xOffset = 140;
      const screenWidth = 1200;
      let rowHeight = 0;
      let subProcessId = [];


      Object.keys(process.subprocesses).forEach((subKey) => {
        const subprocess = process.subprocesses[subKey];

        // Dynamic width based on text length
        const textWidth = subprocess.name.length * 7;
        const subWidth = Math.max(100, textWidth + 40);
        const subHeight = 120;

        // Check if subprocess goes beyond screen width, move to new row
        if (xOffset + subWidth > screenWidth) {
          xOffset = 140; // Reset X to start of new row
          subprocessY += rowHeight + 20; // Move to next row
          rowHeight = 0; // Reset row height
        }

        const subprocessGroup = new shapes.standard.Rectangle({
          position: { x: xOffset, y: subprocessY },
          size: { width: subWidth, height: subHeight },
          attrs: {
            body: { fill: "#EEE", stroke: "#000", rx: 10, ry: 10, opacity: 0.7 },
            label: { text: subprocess.name, fill: "#000", fontSize: 12 },
          },
        });

        elements.push(subprocessGroup);
        subProcessId.push(subprocessGroup.id);
        subprocessGroup.prop("customData", subprocess);

        // Risks (Triangles)
        subprocess.risks.forEach((risk, index) => {
          const riskTriangle = new shapes.standard.Polygon({
            position: { x: xOffset - 16, y: subprocessY + subHeight - (index + 1) * 20 },
            size: { width: 30, height: 30 },
            attrs: {
              body: { fill: "#FFFF00", stroke: "#000" },
              label: { text: risk.id, fill: "#000", fontSize: 8, textAnchor: "middle", y: "2.8em" },
            },
          });

          riskTriangle.attr("body/refPoints", "0,30 15,0 30,30");
          subprocessGroup.embed(riskTriangle);
          elements.push(riskTriangle);
        });

        // Controls (Circles)
        subprocess.controls.forEach((control, index) => {
          const controlCircle = new shapes.standard.Circle({
            position: { x: xOffset + subWidth - 15, y: subprocessY + (index * 15) - 15 },
            size: { width: 30, height: 30 },
            attrs: {
              body: { fill: "#00FF00", stroke: "#000" },
              label: { text: control.id, fill: "#000", fontSize: 10 },
            },
          });
          subprocessGroup.embed(controlCircle);
          elements.push(controlCircle);
        });

        xOffset += subWidth + 30; // Move right
        rowHeight = Math.max(rowHeight, subHeight); // Update row height
      });

      yOffset = subprocessY + rowHeight + 50; // Move yOffset down after processes

      // Add links between subprocesses
      for (let i = 0; i < subProcessId.length - 1; i++) {
        links.push(
          new shapes.standard.Link({
            source: { id: subProcessId[i] },
            target: { id: subProcessId[i + 1] },
            attrs: { line: { stroke: "#000" } },
          })
        );
      }
    });

    graph.addCells([...elements, ...links]);

    // Double click to edit subprocess name
    paper.on("element:pointerdblclick", (elementView) => {
      const element = elementView.model;
      const subprocessData = element.prop("customData");
      if (subprocessData) {
        setSelectedSubprocess(element);
        setUpdatedName(subprocessData.name);
      }
    });
  }, []);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(Object.values(workflowData));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Workflow");
    XLSX.writeFile(workbook, "workflow.xlsx");
  };

  const handleUpdate = () => {
    if (selectedSubprocess) {
      selectedSubprocess.attr("label/text", updatedName); // Update name in the graph
      selectedSubprocess.prop("customData/name", updatedName); // Update stored data
      setSelectedSubprocess(null); // Close modal
    }
  };

  return (
    <div style={{ border: "1px solid black", overflow: "auto", margin: "2em" }}>
      <button onClick={exportToExcel} style={{ marginBottom: "10px" }}>Export to Excel</button>
      <div ref={graphRef}></div>
      <Modal open={!!selectedSubprocess} onClose={() => setSelectedSubprocess(null)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <h3>Edit Subprocess</h3>
          <TextField
            label="Subprocess Name"
            value={updatedName}
            onChange={(e) => setUpdatedName(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <Button variant="contained" onClick={handleUpdate}>
            Save
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default FlowChart;
