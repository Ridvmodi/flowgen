import React from "react";
import { AgGridReact } from "ag-grid-react";
import { ClientSideRowModelModule, ValidationModule, TextEditorModule } from "ag-grid-community";
import { Button, Box, Paper, Typography } from "@mui/material";

const EditableAgGrid = ({ setJsonData, jsonData, setShowgraph }) => {
    const rowData = Object.entries(jsonData.processes).map(([id, process]) => ({
        id,
        name: process.name,
        description: process.description || "No description available"
    }));

    const columnDefs = [
        { field: "id", headerName: "Process ID", editable: false },
        { field: "name", headerName: "Process Name", editable: true },
        { field: "description", headerName: "Process Description", editable: true, flex: 1 }
    ];

    const onCellEditingStopped = (event) => {
        const updatedRow = event.data;
        setJsonData(prevData => {
            const newData = JSON.parse(JSON.stringify(prevData));
            if (newData.processes[updatedRow.id]) {
                newData.processes[updatedRow.id].name = updatedRow.name;
                newData.processes[updatedRow.id].description = updatedRow.description;
            }
            return newData;
        });
    };

    const handleOnClick = () => {
        setJsonData(jsonData);
        setShowgraph(true);
    };

    return (
        <Paper elevation={3} sx={{ padding: 2, mt: 2, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
                Editable Processes Table
            </Typography>
            <Box
                sx={{
                    height: 300,
                    width: "100%",
                    "& .ag-header": { backgroundColor: "#f0f0f0" }
                }}
                className="ag-theme-alpine"
            >
                <AgGridReact
                    modules={[ClientSideRowModelModule, ValidationModule, TextEditorModule]}
                    rowData={rowData}
                    columnDefs={columnDefs}
                    defaultColDef={{ editable: true, resizable: true }}
                    onCellEditingStopped={onCellEditingStopped}
                />
            </Box>
            <Button
                variant="contained"
                color="primary"
                onClick={handleOnClick}
                sx={{ mt: 2, textTransform: "none", fontWeight: "bold" }}
            >
                Generate Workflow Diagram
            </Button>
        </Paper>
    );
};

export default EditableAgGrid;
