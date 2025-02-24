import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  IconButton,
  CircularProgress,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import CloseIcon from "@mui/icons-material/Close";
import { fetchJsonData, getStatus, uploadFile } from "./utils";
import { toast } from "react-toastify";

const FileUploader = ({ setJsonData }) => {
  const [file, setFile] = useState(null);
  const [isFileUploading, setIsFileUploading] = useState(false);

  const checkStatus = async (fileId) => {
    try {
      const res = await getStatus(fileId);
      const { status } = res || {};

      if (status?.status === "Completed") {
        fetchJsonData(status)
          .then((data) => {
            setJsonData(data);
            toast.success("File processed successfully!");
          })
          .catch((error) => toast.error(error.message || "Error fetching data"));

        setIsFileUploading(false);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        checkStatus(fileId);
      }
    } catch (error) {
      setIsFileUploading(false);
      toast.error(error.message || "Failed to check file status");
    }
  };

  const handleFileChange = async (event) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);

      const formData = new FormData();
      formData.append("file", selectedFile);
      setIsFileUploading(true);

      try {
        const data = await uploadFile(formData);
        const { file_id, message } = data || {};

        if (message && file_id) {
          toast.success(message);
          checkStatus(file_id);
        }
      } catch (error) {
        toast.error(error?.message || "File upload failed");
        setIsFileUploading(false);
      }
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    if (event.dataTransfer.files.length > 0) {
      const droppedFile = event.dataTransfer.files[0];
      setFile(droppedFile);
    }
  };

  const handleRemoveFile = () => {
    setJsonData({});
    setFile(null);
    setIsFileUploading(false);
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 600, mx: "auto", textAlign: "center" }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Upload Policy Document
      </Typography>
      <Paper
        variant="outlined"
        sx={{
          border: "2px dashed #ccc",
          p: 3,
          cursor: isFileUploading ? "not-allowed" : "pointer",
          textAlign: "center",
          mb: 2,
          opacity: isFileUploading ? 0.5 : 1,
          "&:hover": { backgroundColor: "#f5f5f5" },
        }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <CloudUploadIcon color="action" sx={{ fontSize: 40 }} />
        <Typography variant="body1" color="textSecondary">
          Drag and drop file here
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Limit 200MB per file • PDF, DOCX
        </Typography>

        <Button
          variant="contained"
          component="label"
          sx={{ mt: 2 }}
          disabled={isFileUploading}
        >
          {isFileUploading ? (
            <>
              Uploading... <CircularProgress size={20} sx={{ ml: 1 }} />
            </>
          ) : (
            "Browse files"
          )}
          <input type="file" hidden accept=".pdf,.docx" onChange={handleFileChange} />
        </Button>
      </Paper>

      {/* Uploaded File Preview */}
      {file && (
        <Paper
          variant="outlined"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 2,
            backgroundColor: "#f9f9f9",
            opacity: isFileUploading ? 0.6 : 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <InsertDriveFileIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="body2">{file.name}</Typography>
          </Box>
          <IconButton size="small" onClick={handleRemoveFile} disabled={isFileUploading}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Paper>
      )}
    </Box>
  );
};

export default FileUploader;
