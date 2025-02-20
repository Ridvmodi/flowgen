import { useEffect, useRef } from "react";
import { dia, shapes } from "@joint/core";
import "./App.css";
import FlowChart from "./FlowChart";

function App() {
  const canvas = useRef(null);

  //   useEffect(() => {
  //     const graph = new dia.Graph({}, { cellNamespace: shapes });

  //     const paper = new dia.Paper({
  //       el: canvas.current,
  //       model: graph,
  //       background: {
  //         color: "#F8F9FA",
  //       },
  //       cellViewNamespace: shapes,
  //     });

  //     const rect = new shapes.standard.Rectangle({
  //       position: { x: 100, y: 100 },
  //       size: { width: 100, height: 50 },
  //       attrs: {
  //         label: {
  //           text: "Hello World",
  //         },
  //       },
  //     });

  //     rect.addTo(graph);
  //   }, []);

  //   return <div className="canvas" ref={canvas} />;
  return <FlowChart />;
}

export default App;
