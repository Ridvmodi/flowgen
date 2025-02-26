import "./App.css";
import FlowChart from "./FlowChart";
import FileUploader from "./FileUploder";
import { useState } from "react";
import ControlRisk from "./ControlRisk";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DownloadCsvAgGrid from "./AgEdiatable";
import { Button, Stack, Typography } from "@mui/material";
import { fetchJsonData, updateCsv } from "./utils";
import { ContainerSx } from "./styles";

function App() {
  const [jsonData, setJsonData] = useState({});
  const [fileUploadResponse, setFileUploadResponse] = useState(null);
  const [updates, setUpdates] = useState([]);
  const [isFileUploading, setIsFileUploading] = useState(false);
  const isHaveRow = jsonData && Object.keys(jsonData).length > 0;

  const handleOnClick = async () => {
    if (updates.length > 0) {
      try {
        setIsFileUploading(true);
        updateCsv({
          file_id: fileUploadResponse?.fileId,
          csv_updates: updates,
        }).then((item) => {
          fetchJsonData(item)
            .then((data) => {
              setJsonData(data);
              toast.success("File processed successfully!");
            })
            .catch((error) =>
              toast.error(error.message || "Error fetching data")
            );

          setIsFileUploading(false);
          setUpdates([]);
        });
      } catch (error) {
        toast.error(error);
      }
    }
  };

  return (
    <Stack sx={ContainerSx} className="container">
      <ToastContainer position="top-right" autoClose={3000} />
      <Typography sx={{ textAlign: "center" }}>
        GRC Risk Control Management Analyser
      </Typography>
      <FileUploader
        setFileUploadResponse={setFileUploadResponse}
        setJsonData={setJsonData}
      />
      {fileUploadResponse && isHaveRow && (
        <DownloadCsvAgGrid
          fileUploadResponse={fileUploadResponse}
          setUpdates={setUpdates}
        />
      )}
      <Button
        variant="contained"
        disabled={!updates.length > 0}
        color="primary"
        onClick={handleOnClick}
        sx={{ mt: 2, textTransform: "none", fontWeight: "bold" }}
      >
        Generate Workflow Diagram
      </Button>
      <FlowChart jsonData={jsonData} isFileUploading={isFileUploading} />
      {isHaveRow && <ControlRisk jsonData={jsonData} />}
    </Stack>
  );
}

export default App;
