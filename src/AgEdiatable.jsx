import React, { useEffect, useState, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import Papa from "papaparse";
import { ClientSideRowModelModule, TextEditorModule, ValidationModule } from "ag-grid-community";
import { Box, Button, CircularProgress, Paper } from "@mui/material";

const DownloadCsvAgGrid = ({ fileUploadResponse, setUpdates }) => {
    const [rowData, setRowData] = useState([]);
    const [columnDefs, setColumnDefs] = useState([])
    const [loading, setLoading] = useState(true);
    const { csv_url = "" } = fileUploadResponse || {};

    // const csv_url = "https://uniquest-demo.s3.amazonaws.com/grc_files/1740477680/grc_data_1740477680.csv?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAU2VPE6VL5RUFDLTV%2F20250225%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20250225T100129Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=1875a4722045456447332b1d5037a9b421d32f7617ec196e0acfb5a4bdd78805"

    useEffect(() => {
        const fetchCsvData = async () => {
            try {
                const response = await fetch(csv_url);
                const csvText = await response.text();

                Papa.parse(csvText, {
                    header: true,
                    skipEmptyLines: true,
                    complete: (result) => {
                        setRowData(result.data);
                        if (result.data.length > 0) {
                            const columns = Object.keys(result.data[0]).map(key => ({
                                field: key,
                                editable: !["Process_ID", "Risk_ID", "Control_ID", "SubProcess_ID"].includes(key)
                            }));
                            setColumnDefs(columns);
                        }
                        setLoading(false);
                    },
                });
            } catch (error) {
                console.error("Error fetching CSV data:", error);
                setLoading(false);
            }
        };

        if (csv_url) {
            fetchCsvData();
        }
    }, [csv_url]);

    const generateUniqueID = (prefix, existingIDs) => {
        let newID;
        do {
            newID = `${prefix}${Math.floor(100 + Math.random() * 900)}`;
        } while (existingIDs.includes(newID));
        return newID;
    };

    const addRow = () => {
        const existingProcessIDs = rowData.map(row => row.Process_ID).filter(Boolean);
        const existingRiskIDs = rowData.map(row => row.Risk_ID).filter(Boolean);
        const existingControlIDs = rowData.map(row => row.Control_ID).filter(Boolean);
        const existingSubProcessIDs = rowData.map(row => row.SubProcess_ID).filter(Boolean);

        const newRow = {
            Process_ID: generateUniqueID("P", existingProcessIDs),
            Risk_ID: generateUniqueID("R", existingRiskIDs),
            Control_ID: generateUniqueID("C", existingControlIDs),
            SubProcess_ID: generateUniqueID("SP", existingSubProcessIDs),
        };

        setRowData(prev => [...prev, newRow]);
    };

    const onCellValueChanged = useCallback((params) => {
        setUpdates(prev => {
            const existingIndex = prev.findIndex(item => item.Process_ID === params.data.Process_ID);
            if (existingIndex !== -1) {
                const updated = [...prev];
                updated[existingIndex] = params.data;
                return updated;
            } else {
                return [...prev, params.data];
            }
        });
    }, []);

    return (
        <Box sx={{ p: 2 }}>
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height={300}>
                    <CircularProgress />
                </Box>
            ) : (
                <Paper sx={{ p: 2, pb: 7 }}>
                    <div className="ag-theme-alpine" style={{ width: "100%", height: rowData.length ? rowData.length * 25 + 50 : 250 }}>
                        <AgGridReact
                            modules={[ClientSideRowModelModule, ValidationModule, TextEditorModule]}
                            rowData={rowData}
                            columnDefs={columnDefs}
                            onCellValueChanged={onCellValueChanged}
                            // frameworkComponents={{ customButton: () => <Button variant="contained" color="primary" onClick={addRow} sx={{ mt: 1 }}>Add Row</Button> }}   
                            paginationAutoPageSize
                        />
                        <Button variant="contained" color="primary" onClick={addRow} fullWidth sx={{ mt: 1 }}>
                            Add Row
                        </Button>
                    </div>
                </Paper>
            )}
        </Box>
    );
};

export default DownloadCsvAgGrid;
