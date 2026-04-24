/**
 * Config Panel — Dynamic right sidebar for node configuration.
 * 
 * Renders the appropriate form based on the selected node's type.
 * Uses TypeScript discriminated union narrowing for type safety.
 */

import { useState, useEffect } from 'react';
import { X, Play, ClipboardList, ShieldCheck, Zap, Flag } from 'lucide-react';
import { useWorkflowStore } from '../../hooks/useWorkflowStore';
import { StartNodeConfig } from './StartNodeConfig';
import { TaskNodeConfig } from './TaskNodeConfig';
import { ApprovalNodeConfig } from './ApprovalNodeConfig';
import { AutomatedStepConfig } from './AutomatedStepConfig';
import { EndNodeConfig } from './EndNodeConfig';

const NODE_ICONS = {
  start: <Play size={16} />,
  task: <ClipboardList size={16} />,
  approval: <ShieldCheck size={16} />,
  automated: <Zap size={16} />,
  end: <Flag size={16} />,
};

const NODE_COLORS = {
  start: 'text-emerald-400',
  task: 'text-blue-400',
  approval: 'text-amber-400',
  automated: 'text-purple-400',
  end: 'text-rose-400',
};

const NODE_LABELS = {
  start: 'Start Node',
  task: 'Task Node',
  approval: 'Approval Node',
  automated: 'Automated Step',
  end: 'End Node',
};

export function ConfigPanel() {
  const selectedNodeId = useWorkflowStore((s) => s.selectedNodeId);
  const nodes = useWorkflowStore((s) => s.nodes);
  const selectNode = useWorkflowStore((s) => s.selectNode);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);
  const [activeNode, setActiveNode] = useState(selectedNode);

  useEffect(() => {
    if (selectedNode) {
      setActiveNode(selectedNode);
    }
  }, [selectedNode]);

  const isOpen = !!selectedNode;
  const displayNode = selectedNode || activeNode;

  if (!displayNode) {
    return (
      <aside className={`config-panel config-panel-empty ${isOpen ? 'open' : ''}`}>
        <div className="config-empty-state">
          <div className="config-empty-icon">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="23" stroke="rgba(148,163,184,0.3)" strokeWidth="2" strokeDasharray="4 4" />
              <path d="M18 24h12M24 18v12" stroke="rgba(148,163,184,0.4)" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <h3 className="config-empty-title">No Node Selected</h3>
          <p className="config-empty-desc">Click on a node in the canvas to configure its properties</p>
        </div>
      </aside>
    );
  }

  const nodeType = displayNode.data.type;

  return (
    <aside className={`config-panel ${isOpen ? 'open' : ''}`}>
      {/* Panel Header */}
      <div className="config-header">
        <div className="config-header-info">
          <span className={`config-header-icon ${NODE_COLORS[nodeType]}`}>
            {NODE_ICONS[nodeType]}
          </span>
          <div>
            <h3 className="config-header-title">{NODE_LABELS[nodeType]}</h3>
            <p className="config-header-id">ID: {displayNode.id}</p>
          </div>
        </div>
        <button
          className="config-close-btn"
          onClick={() => selectNode(null)}
          title="Close panel"
        >
          <X size={16} />
        </button>
      </div>

      {/* Dynamic Form Content */}
      <div className="config-body">
        {displayNode.data.type === 'start' && (
          <StartNodeConfig nodeId={displayNode.id} data={displayNode.data} />
        )}
        {displayNode.data.type === 'task' && (
          <TaskNodeConfig nodeId={displayNode.id} data={displayNode.data} />
        )}
        {displayNode.data.type === 'approval' && (
          <ApprovalNodeConfig nodeId={displayNode.id} data={displayNode.data} />
        )}
        {displayNode.data.type === 'automated' && (
          <AutomatedStepConfig nodeId={displayNode.id} data={displayNode.data} />
        )}
        {displayNode.data.type === 'end' && (
          <EndNodeConfig nodeId={displayNode.id} data={displayNode.data} />
        )}
      </div>
    </aside>
  );
}
