import { styled } from "@mui/material";
import { AgGridReact } from "ag-grid-react";

const ContainerSx = {
  margin: "24px",
};

const FullScreenBtnSx = {
  top: "55px",
  left: "98%",
  width: "40px",
  position: "relative",
  zIndex: 12242,
};

const FullScreenExitBtnSx = {
  top: "10px",
  left: "97%",
  width: "40px",
  position: "relative",
  zIndex: 12242,
};

const FullScreenSx = {
  height: "100vh",
  width: "100vw",
  position: "fixed",
  zIndex: 2147483620,
  top: 0,
  left: 0,
};

const StyledAg = styled(AgGridReact)(({ removeAllBorder }) => ({
  "& .ag-header-container": {
    backgroundColor: "#F9FAFB",
    "& span": {
      color: "#57534E",
      fontWeight: 500,
      fontSize: "12px",
    },
  },
  "& .ag-header-cell-label": {
    color: "#57534E",
    fontWeight: 500,
    fontSize: "12px",
  },
  "& .ag-header": {
    height: "40px",
    minHeight: "40px !important",
    borderRadius: "0px",
    borderBottom: "1px solid #EAECF0",
  },
  "& .ag-header-cell": {
    borderRight: removeAllBorder ? "" : "1px solid #EAECF0",
  },
  "& .ag-root-wrapper": {
    border: removeAllBorder ? "" : "1px solid #EAECF0",
  },
  "& .ag-row": {
    borderBottom: "1px solid #EAECF0",
  },
  "& .ag-cell": {
    display: "flex",
    alignItems: "center",
    color: "#57534E",
    borderRight: removeAllBorder ? "" : "1px solid #EAECF0",
    height: "40px",
    minHeight: "40px !important",
  },
  "& .ag-pinned-left-header": {
    backgroundColor: `#F9FAFB`,
    border: "none",
  },
  "& .ag-cell.ag-cell-last-left-pinned:not(.ag-cell-range-right):not(.ag-cell-range-single-cell)":
    {
      border: "none",
    },
  "& .ag-body-horizontal-scroll-viewport": {
    height: "5px !important",
    minHeight: "5px !important",
    maxHeight: "5px !important",
  },
  "& .ag-body-horizontal-scroll": {
    height: "5px !important",
    minHeight: "5px !important",
    maxHeight: "5px !important",
  },
  "& .ag-body-vertical-scroll-viewport": {
    width: "5px !important",
    minWidth: "5px !important",
    maxWidth: "5px !important",
  },
  "& .ag-body-vertical-scroll": {
    width: "5px !important",
    minWidth: "5px !important",
    maxWidth: "5px !important",
  },
  "& .ag-horizontal-left-spacer": {
    display: "none !important",
  },
  "& .ag-horizontal-right-spacer": {
    display: "none !important",
  },
  '& span[id^="cell-checkbox"] ,span[id^="cell-firstChild"]': {
    display: "none",
  },
  "& .ag-cell-label-container": {
    padding: "0px",
  },
  "& .ag-header-cell-text": {
    fontSize: "12px !important",
  },
  "& .ag-floating-bottom": {
    overflow: "auto !important",
  },
}));

export {
  ContainerSx,
  FullScreenSx,
  StyledAg,
  FullScreenBtnSx,
  FullScreenExitBtnSx,
};
