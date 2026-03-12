import WorkflowDiagram from "./components/WorkflowDiagram";
import { SpeedInsights } from "@vercel/speed-insights/react";

export default function App() {
  return (
    <>
      <WorkflowDiagram />
      <SpeedInsights />
    </>
  );
}
