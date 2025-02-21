import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  IconButton,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import CloseIcon from "@mui/icons-material/Close";
import { getStatus, uploadFile } from "./utils";
import { toast } from "react-toastify";

const FileUploader = () => {
  const [file, setFile] = useState(null);
  const [isFileUploading, setisFileUploading] = useState(false);
  const [fileResponse, setFileResponse] = useState(null)


  const checkStatus = async (fileId) => {
    try {
      const response = await getStatus(fileId);
      if (response?.status === "Completed") {
        setFileResponse(response);
        setisFileUploading(false)
        return toast.success("File Uploaded");
      } else {
        // Adding a delay of 2 seconds before retrying
        await new Promise(resolve => setTimeout(resolve, 2000));
        return checkStatus(fileId);
      }
    } catch (error) {
      toast.error(error.message ?? "Failed to check file status");
    }
  };


  const handleFileChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
      const formData = new FormData();
      formData.append("file", event.target.files[0]);
      setisFileUploading(true);
      try {
        uploadFile(formData).then((data) => {
          const { file_id = "", message = "" } = data || {};
          if (message && file_id) {
            toast.success(message)
            checkStatus(file_id)
          }
          console.log(data);
        })
      } catch (error) {
        toast.error(error?.message ?? "fail")
      }
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    if (event.dataTransfer.files.length > 0) {
      setFile(event.dataTransfer.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
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
          cursor: "pointer",
          textAlign: "center",
          mb: 2,
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
        <Button variant="contained" component="label" sx={{ mt: 2 }}>
          Browse files
          <input
            type="file"
            hidden
            accept=".pdf,.docx"
            onChange={handleFileChange}
          />
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
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <InsertDriveFileIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="body2">{file.name}</Typography>
          </Box>
          <IconButton size="small" onClick={handleRemoveFile}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Paper>
      )}
    </Box>
  );
};

export default FileUploader;
