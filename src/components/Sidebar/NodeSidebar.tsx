/**
 * Node Sidebar — Draggable Node Palette
 * 
 * Left sidebar containing all available node types.
 * Uses HTML5 drag-and-drop API to transfer node type data
 * to the canvas drop handler.
 */

import React from 'react';
import { Play, ClipboardList, ShieldCheck, Zap, Flag } from 'lucide-react';
import type { WorkflowNodeType } from '../../types/workflow';

interface NodeTypeItem {
  type: WorkflowNodeType;
  label: string;
  description: string;
  icon: React.ReactNode;
  colorClass: string;
  bgClass: string;
}

const NODE_TYPES: NodeTypeItem[] = [
  {
    type: 'start',
    label: 'Start Node',
    description: 'Entry point of workflow',
    icon: <Play size={18} />,
    colorClass: 'text-emerald-400',
    bgClass: 'bg-emerald-500/10 border-emerald-500/30 hover:border-emerald-400/60',
  },
  {
    type: 'task',
    label: 'Task Node',
    description: 'Manual HR task',
    icon: <ClipboardList size={18} />,
    colorClass: 'text-blue-400',
    bgClass: 'bg-blue-500/10 border-blue-500/30 hover:border-blue-400/60',
  },
  {
    type: 'approval',
    label: 'Approval Node',
    description: 'Requires approval step',
    icon: <ShieldCheck size={18} />,
    colorClass: 'text-amber-400',
    bgClass: 'bg-amber-500/10 border-amber-500/30 hover:border-amber-400/60',
  },
  {
    type: 'automated',
    label: 'Automated Step',
    description: 'System automation',
    icon: <Zap size={18} />,
    colorClass: 'text-purple-400',
    bgClass: 'bg-purple-500/10 border-purple-500/30 hover:border-purple-400/60',
  },
  {
    type: 'end',
    label: 'End Node',
    description: 'Terminal point',
    icon: <Flag size={18} />,
    colorClass: 'text-rose-400',
    bgClass: 'bg-rose-500/10 border-rose-500/30 hover:border-rose-400/60',
  },
];

export function NodeSidebar() {
  const onDragStart = (event: React.DragEvent, nodeType: WorkflowNodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="node-sidebar">
      {/* Logo / Brand */}
      <div className="sidebar-brand">
        <div className="brand-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="url(#grad1)" />
            <path d="M2 17L12 22L22 17" stroke="url(#grad2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2 12L12 17L22 12" stroke="url(#grad2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <defs>
              <linearGradient id="grad1" x1="2" y1="2" x2="22" y2="12" gradientUnits="userSpaceOnUse">
                <stop stopColor="#818cf8" />
                <stop offset="1" stopColor="#c084fc" />
              </linearGradient>
              <linearGradient id="grad2" x1="2" y1="12" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                <stop stopColor="#818cf8" />
                <stop offset="1" stopColor="#c084fc" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div>
          <h1 className="brand-title">FlowHR</h1>
          <p className="brand-subtitle">Workflow Designer</p>
        </div>
      </div>

      {/* Node Types */}
      <div className="sidebar-section">
        <h2 className="sidebar-section-title">
          <span className="section-dot"></span>
          Node Types
        </h2>
        <div className="sidebar-nodes">
          {NODE_TYPES.map((item) => (
            <div
              key={item.type}
              className={`sidebar-node-card border ${item.bgClass}`}
              draggable
              onDragStart={(e) => onDragStart(e, item.type)}
            >
              <div className={`sidebar-node-icon ${item.colorClass}`}>
                {item.icon}
              </div>
              <div className="sidebar-node-info">
                <span className="sidebar-node-label">{item.label}</span>
                <span className="sidebar-node-desc">{item.description}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="sidebar-section sidebar-instructions">
        <h2 className="sidebar-section-title">
          <span className="section-dot"></span>
          Quick Tips
        </h2>
        <ul className="tips-list">
          <li>Drag nodes onto the canvas</li>
          <li>Connect nodes by dragging handles</li>
          <li>Click a node to configure it</li>
          <li>Press <kbd>Delete</kbd> to remove</li>
        </ul>
      </div>
    </aside>
  );
}
