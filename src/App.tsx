/**
 * App.tsx — Root application component.
 * 
 * Three-column layout:
 * ┌──────────┬────────────────────────┬──────────────┐
 * │ Sidebar  │     Toolbar            │              │
 * │ (nodes)  ├────────────────────────┤ Config Panel │
 * │          │   Workflow Canvas      │ (dynamic)    │
 * │          ├────────────────────────┤              │
 * │          │   Simulation Logs      │              │
 * └──────────┴────────────────────────┴──────────────┘
 */

import { ReactFlowProvider } from '@xyflow/react';
import { useWorkflowStore } from './hooks/useWorkflowStore';
import { NodeSidebar } from './components/Sidebar/NodeSidebar';
import { WorkflowCanvas } from './components/Canvas/WorkflowCanvas';
import { ConfigPanel } from './components/ConfigPanel/ConfigPanel';
import { Toolbar } from './components/Toolbar/Toolbar';
import { SimulationPanel } from './components/SimulationPanel/SimulationPanel';

export default function App() {
  const theme = useWorkflowStore((s) => s.theme);

  return (
    <ReactFlowProvider>
      <div className={`app-shell theme-${theme}`}>
        {/* Left Sidebar — Node Palette */}
        <NodeSidebar />

        {/* Center — Toolbar + Canvas + Simulation */}
        <main className="app-main">
          <Toolbar />
          <div className="canvas-wrapper">
            <WorkflowCanvas />
            <SimulationPanel />
          </div>
        </main>

        {/* Right — Configuration Panel */}
        <ConfigPanel />
      </div>
    </ReactFlowProvider>
  );
}
