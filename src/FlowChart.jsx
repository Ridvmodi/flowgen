import React, { useEffect, useRef, useState } from "react";
import { dia, shapes } from "@joint/core";
import {
  Modal,
  Box,
  Button,
  TextField,
  Paper,
  Typography,
  CircularProgress,
  Stack,
  IconButton,
} from "@mui/material";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import { FullScreenBtnSx, FullScreenExitBtnSx, FullScreenSx } from "./styles";

const TextElement = shapes.standard.Rectangle.define("CustomElement", {
  attrs: {
    body: {
      fill: "#FFFFFF",
      stroke: "#000000",
      strokeWidth: 0,
    },
    label: {
      text: "Default Text",
      refX: "50%",
      refY: "50%",
      textAnchor: "middle",
      yAlignment: "middle",
      fontSize: 14,
      fill: "#000000",
    },
  },
});

const FlowChart = ({ isFileUploading, jsonData }) => {
  const graphRef = useRef(null);
  const [selectedSubprocess, setSelectedSubprocess] = useState(null);
  const [updatedName, setUpdatedName] = useState("");
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    const graph = new dia.Graph();
    const paper = new dia.Paper({
      el: graphRef.current,
      model: graph,
      width: 1350,
      height: 2000,
      gridSize: 10,
      interactive: { elementMove: true },
    });

    let elements = [];
    let yOffset = 50;
    let links = [];
    if (jsonData && jsonData?.processes)
      Object.keys(jsonData.processes).forEach((processKey) => {
        const process = jsonData.processes[processKey];
        const processHeight =
          Math.ceil(Object.keys(process.subprocesses).length / 2) * 200 + 50;
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
              body: {
                fill: "#EEE",
                stroke: "#000",
                rx: 10,
                ry: 10,
                opacity: 0.7,
              },
              label: { text: subprocess.name, fill: "#000", fontSize: 12 },
            },
          });

          elements.push(subprocessGroup);
          subProcessId.push(subprocessGroup.id);
          subprocessGroup.prop("customData", subprocess);

          subprocess.risks.forEach((risk, index) => {
            const riskTriangle = new shapes.standard.Polygon({
              position: {
                x: xOffset - 16,
                y: subprocessY + subHeight - (index + 1) * 20,
              },
              size: { width: 30, height: 30 },
              attrs: {
                body: { fill: "#FFFF00", stroke: "#000" },
                label: {
                  text: risk.id,
                  fill: "#000",
                  fontSize: 8,
                  textAnchor: "middle",
                  y: "2.8em",
                },
              },
            });

            riskTriangle.attr("body/refPoints", "0,30 15,0 30,30");
            subprocessGroup.embed(riskTriangle);
            elements.push(riskTriangle);
          });

          subprocess.controls.forEach((control, index) => {
            const controlCircle = new shapes.standard.Circle({
              position: {
                x: xOffset + subWidth - 15,
                y: subprocessY + index * 15 - 15,
              },
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

    const ProcessDefinition = new shapes.standard.Rectangle({
      position: { x: 100, y: yOffset },
      size: { width: 200, height: 200 },
      attrs: {
        body: { fill: "#ADD8E6", stroke: "#000", rx: 10, ry: 10 },
      },
    });

    const ProcessText = new TextElement({
      position: { x: 350, y: yOffset + 100 },
      size: { width: 150, height: 40 },
      attrs: {
        label: {
          text: "Defines a process",
        },
      },
    });

    yOffset += 250;

    elements.push(ProcessDefinition);
    elements.push(ProcessText);
    // links.push(
    //   new shapes.standard.Link({
    //     source: { id: ProcessDefinition.id },
    //     target: { id: ProcessText.id },
    //     attrs: { line: { stroke: "#000" } },
    //   })
    // );

    const SubProcessDefinition = new shapes.standard.Rectangle({
      position: { x: 100, y: yOffset },
      size: { width: 200, height: 200 },
      attrs: {
        body: { fill: "#EEE", stroke: "#000", rx: 10, ry: 10 },
      },
    });

    const SubProcessText = new TextElement({
      position: { x: 350, y: yOffset + 100 },
      size: { width: 150, height: 40 },
      attrs: {
        label: {
          text: "Defines a sub process",
        },
      },
    });

    yOffset += 250;

    elements.push(SubProcessDefinition);
    elements.push(SubProcessText);
    // links.push(
    //   new shapes.standard.Link({
    //     source: { id: SubProcessDefinition.id },
    //     target: { id: SubProcessText.id },
    //     attrs: { line: { stroke: "#000" } },
    //   })
    // );

    const RiskDefinition = new shapes.standard.Polygon({
      position: {
        x: 150,
        y: yOffset,
      },
      size: { width: 100, height: 100 },
      attrs: {
        body: { fill: "#FFFF00", stroke: "#000" },
      },
    });

    RiskDefinition.attr("body/refPoints", "0,30 15,0 30,30");

    const RiskDefinitionText = new TextElement({
      position: { x: 300, y: yOffset },
      size: { width: 150, height: 40 },
      attrs: {
        label: {
          text: "Defines a Risk",
        },
      },
    });

    yOffset += 150;

    elements.push(RiskDefinition);
    elements.push(RiskDefinitionText);
    // links.push(
    //   new shapes.standard.Link({
    //     source: { id: RiskDefinition.id },
    //     target: { id: RiskDefinitionText.id },
    //     attrs: { line: { stroke: "#000" } },
    //   })
    // );

    const ControlDefinition = new shapes.standard.Circle({
      position: {
        x: 150,
        y: yOffset,
      },
      size: { width: 100, height: 100 },
      attrs: {
        body: { fill: "#00FF00", stroke: "#000" },
      },
    });

    const ControlDefinitionText = new TextElement({
      position: { x: 300, y: yOffset },
      size: { width: 150, height: 40 },
      attrs: {
        label: {
          text: "Defines a Control",
        },
      },
    });

    yOffset += 150;

    elements.push(ControlDefinition);
    elements.push(ControlDefinitionText);
    // links.push(
    //   new shapes.standard.Link({
    //     source: { id: ControlDefinition.id },
    //     target: { id: ControlDefinitionText.id },
    //     attrs: { line: { stroke: "#000" } },
    //   })
    // );
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
    return (
      <>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height={300}
        >
          <CircularProgress />
        </Box>
      </>
    );
  }

  if (Object.keys(jsonData).length > 0 && !isFileUploading)
    return (
      <Stack
        sx={isFullScreen ? FullScreenSx : { width: "90%", margin: "36px" }}
      >
        <IconButton
          id="heyyyyy"
          sx={isFullScreen ? FullScreenExitBtnSx : FullScreenBtnSx}
          onClick={() => setIsFullScreen(!isFullScreen)}
        >
          {isFullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
        </IconButton>
        <Paper
          elevation={3}
          sx={{
            borderRadius: 2,
            overflow: "auto",
            maxHeight: "100%",
            width: "100%",
            padding: 2,
            position: isFullScreen ? "absolute" : "unset",
            ...(isFullScreen
              ? {
                  justifyContent: "center",
                  alignItems: "center",
                  display: "flex",
                  padding: "100px 0",
                }
              : {}),
          }}
        >
          <Box
            ref={graphRef}
            sx={{
              border: "1px solid black",
              backgroundColor: "#fff",
              minHeight: 600,
              height: "100%",
              overflow: "auto",
            }}
          />

          <Modal
            open={!!selectedSubprocess}
            onClose={() => setSelectedSubprocess(null)}
          >
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
              <Button
                variant="contained"
                color="primary"
                onClick={handleUpdate}
              >
                Save
              </Button>
            </Box>
          </Modal>
        </Paper>
      </Stack>
    );
  return <></>;
};

export default FlowChart;
