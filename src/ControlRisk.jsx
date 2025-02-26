import React, { useMemo } from "react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import {
  ClientSideRowModelModule,
  TextEditorModule,
  ValidationModule,
} from "ag-grid-community";
import { Stack } from "@mui/material";
import { StyledAg } from "./styles";

const ControlRisk = ({ jsonData }) => {
  const extractRisksAndControls = (processes) => {
    const risks = [];
    const controls = [];

    Object.values(processes).forEach((process) => {
      Object.values(process.subprocesses).forEach((subprocess) => {
        if (subprocess.risks) {
          risks.push(...subprocess.risks);
        }
        if (subprocess.controls) {
          controls.push(...subprocess.controls);
        }
      });
    });

    return { risks, controls };
  };

  const { risks, controls } = useMemo(
    () => extractRisksAndControls(jsonData.processes),
    [jsonData]
  );

  const riskColumns = [
    { headerName: "Risk ID", field: "id", flex: 1 },
    { headerName: "Risk Name", field: "name", flex: 2 },
    { headerName: "Description", field: "description", flex: 3 },
  ];

  const controlColumns = [
    { headerName: "Control ID", field: "id", flex: 1 },
    { headerName: "Control Name", field: "name", flex: 2 },
    { headerName: "Description", field: "description", flex: 3 },
  ];

  return (
    <Stack sx={{ width: "100%" }}>
      <h2>Risks</h2>
      <div
        className="ag-grid-styling ag-theme-alpine"
        style={{
          height: risks.length ? risks.length * 40 + 90 : 250,
          width: "100%",
        }}
      >
        <StyledAg
          modules={[
            ClientSideRowModelModule,
            ValidationModule,
            TextEditorModule,
          ]}
          rowData={risks}
          columnDefs={riskColumns}
          getRowHeight={() => 40}
        />
      </div>
      <h2>Controls</h2>
      <div
        className="ag-grid-styling ag-theme-alpine"
        style={{
          height: controls.length ? controls.length * 40 + 90 : 250,
          width: "100%",
        }}
      >
        <StyledAg
          modules={[
            ClientSideRowModelModule,
            ValidationModule,
            TextEditorModule,
          ]}
          rowData={controls}
          columnDefs={controlColumns}
          getRowHeight={() => 40}
        />
      </div>
    </Stack>
  );
};

export default ControlRisk;
