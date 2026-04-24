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
import { useEffect } from 'react';
import { NodeSidebar } from './components/Sidebar/NodeSidebar';
import { WorkflowCanvas } from './components/Canvas/WorkflowCanvas';
import { ConfigPanel } from './components/ConfigPanel/ConfigPanel';
import { Toolbar } from './components/Toolbar/Toolbar';
import { SimulationPanel } from './components/SimulationPanel/SimulationPanel';
import { LayoutModal } from './components/LayoutModal/LayoutModal';
import { useWorkflowStore } from './hooks/useWorkflowStore';

export default function App() {
  const theme = useWorkflowStore((s) => s.theme);

  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('theme-light');
    } else {
      document.body.classList.remove('theme-light');
    }
  }, [theme]);

  return (
    <ReactFlowProvider>
      <LayoutModal />
      <div className="app-shell">
        {/* Left Sidebar — Node Palette */}
        <NodeSidebar />

        {/* Center — Toolbar + Canvas + Simulation + Config Overlay */}
        <main className="app-main">
          <Toolbar />
          <div className="canvas-wrapper">
            <WorkflowCanvas />
            <SimulationPanel />
            <ConfigPanel />
          </div>
        </main>
      </div>
    </ReactFlowProvider>
  );
}
