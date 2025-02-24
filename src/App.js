
import "./App.css";
import FlowChart from "./FlowChart";
import FileUploader from "./FileUploder";
import EditableAgGrid from "./Table";
import { useState } from "react";
import ControlRisk from "./ControlRisk";
// import workflowData from "./workflow.json";

function App() {
  const [jsonData,setJsonData] = useState({});
  const [showGraph,setShowgraph] = useState(false);
  const isHaveRow = jsonData && Object.keys(jsonData).length > 0

  return <>
    <div id="root">
      <h1>GRC Risk Control Managent Analayser </h1>
      <FileUploader setJsonData={setJsonData}/>
      {isHaveRow && <EditableAgGrid 
      setJsonData={setJsonData} 
      jsonData={jsonData}
      setShowgraph={setShowgraph}
      />}
      {showGraph && <FlowChart jsonData={jsonData} />}
      {isHaveRow && <ControlRisk jsonData={jsonData}  />}
    </div>
  </>
}

export default App;
