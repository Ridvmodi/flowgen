
import "./App.css";
import FlowChart from "./FlowChart";
import FileUploader from "./FileUploder";
import EditableAgGrid from "./Table";
import { useEffect, useState } from "react";
import workflowData from "./workflow.json";

function App() {
  const [jsonData,setJsonData] = useState({});
  const [showGraph,setShowgraph] = useState(false)

  useEffect(()=>{
    setJsonData(workflowData)
  },[])

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
    </div>
  </>
}

export default App;
