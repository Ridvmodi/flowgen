import React, { useEffect, useRef, useState } from "react";
import { dia, shapes } from "@joint/core";
import { Modal, Box, Button, TextField, Paper, Typography, CircularProgress } from "@mui/material";

const FlowChart = ({ isFileUploading, jsonData }) => {
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
    if (jsonData && jsonData?.processes)
      Object.keys(jsonData.processes).forEach((processKey) => {
        const process = jsonData.processes[processKey];
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

          const textWidth = subprocess.name.length * 7;
          const subWidth = Math.max(100, textWidth + 40);
          const subHeight = 120;

          if (xOffset + subWidth > screenWidth) {
            xOffset = 140;
            subprocessY += rowHeight + 20;
            rowHeight = 0;
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

          xOffset += subWidth + 30;
          rowHeight = Math.max(rowHeight, subHeight);
        });

        yOffset = subprocessY + rowHeight + 50;

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

    paper.on("element:pointerdblclick", (elementView) => {
      const element = elementView.model;
      const subprocessData = element.prop("customData");
      if (subprocessData) {
        setSelectedSubprocess(element);
        setUpdatedName(subprocessData.name);
      }
    });
  }, [jsonData]);

  const handleUpdate = () => {
    if (selectedSubprocess) {
      selectedSubprocess.attr("label/text", updatedName);
      selectedSubprocess.prop("customData/name", updatedName);
      setSelectedSubprocess(null);
    }
  };



  if (isFileUploading) {
    return <>
      <Box display="flex" justifyContent="center" alignItems="center" height={300}>
        <CircularProgress />
      </Box>
    </>
  }

  if (Object.keys(jsonData).length > 0 && !isFileUploading)
    return (
      <Paper elevation={3}
        sx={{ padding: 2, borderRadius: 2, margin: "2em", overflow: "auto", maxHeight: "80vh" }}
      >
        <Box ref={graphRef} sx={{ border: "1px solid black", backgroundColor: "#fff", minHeight: 600, height: "100%", overflow: "auto" }} />

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
            <Typography variant="h6" gutterBottom>
              Edit Subprocess
            </Typography>
            <TextField
              label="Subprocess Name"
              value={updatedName}
              onChange={(e) => setUpdatedName(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            />
            <Button variant="contained" color="primary" onClick={handleUpdate}>
              Save
            </Button>
          </Box>
        </Modal>
      </Paper>
    );
  return <></>
};

export default FlowChart;
