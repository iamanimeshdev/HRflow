/**
 * Workflow Canvas — Main React Flow canvas area.
 * 
 * Handles:
 * - Rendering the React Flow graph with custom node types
 * - Drop handler for creating nodes from sidebar drag
 * - Keyboard shortcuts (Delete/Backspace to remove selected)
 * - Background, minimap, and controls
 */

import { useCallback, useRef, useState, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  ConnectionLineType,
  Position,
  type ReactFlowInstance,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { nodeTypes } from '../../nodes/nodeTypes';
import { useWorkflowStore } from '../../hooks/useWorkflowStore';
import type {
  WorkflowNode,
  WorkflowNodeType,
  WorkflowNodeData,
} from '../../types/workflow';

// ─── Default data factories per node type ────────────────────────
function createDefaultNodeData(type: WorkflowNodeType): WorkflowNodeData {
  switch (type) {
    case 'start':
      return { type: 'start', title: '', metadata: [] };
    case 'task':
      return { type: 'task', title: '', description: '', assignee: '', dueDate: '', customFields: [] };
    case 'approval':
      return { type: 'approval', title: '', approverRole: '', autoApproveThreshold: 0 };
    case 'automated':
      return { type: 'automated', title: '', actionId: '', parameters: {} };
    case 'end':
      return { type: 'end', endMessage: '', summaryFlag: false };
  }
}

// ─── Minimap color mapping ───────────────────────────────────────
function getMinimapColor(node: WorkflowNode): string {
  switch (node.data.type) {
    case 'start': return '#10b981';
    case 'task': return '#3b82f6';
    case 'approval': return '#f59e0b';
    case 'automated': return '#a855f7';
    case 'end': return '#f43f5e';
    default: return '#64748b';
  }
}

let nodeIdCounter = 0;

export function WorkflowCanvas() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const reactFlowInstance = useRef<ReactFlowInstance<WorkflowNode> | null>(null);

  const nodes = useWorkflowStore((s) => s.nodes);
  const edges = useWorkflowStore((s) => s.edges);
  const onNodesChange = useWorkflowStore((s) => s.onNodesChange);
  const onEdgesChange = useWorkflowStore((s) => s.onEdgesChange);
  const onConnect = useWorkflowStore((s) => s.onConnect);
  const addNode = useWorkflowStore((s) => s.addNode);
  const deleteSelected = useWorkflowStore((s) => s.deleteSelected);
  const selectNode = useWorkflowStore((s) => s.selectNode);
  const selectedNodeId = useWorkflowStore((s) => s.selectedNodeId);
  const layoutDirection = useWorkflowStore((s) => s.layoutDirection);
  const theme = useWorkflowStore((s) => s.theme);

  const [placementMode, setPlacementMode] = useState<WorkflowNodeType | null>(null);

  // ── Keyboard shortcuts for placement mode ──
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      switch (e.key) {
        case '1': setPlacementMode('start'); break;
        case '2': setPlacementMode('task'); break;
        case '3': setPlacementMode('approval'); break;
        case '4': setPlacementMode('automated'); break;
        case '5': setPlacementMode('end'); break;
        case 'Escape': setPlacementMode(null); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // ── Drop handler: create node from sidebar drag ──
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow') as WorkflowNodeType;
      if (!type) return;

      const instance = reactFlowInstance.current;
      if (!instance || !reactFlowWrapper.current) return;

      const bounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = instance.screenToFlowPosition({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      });

      const newNode: WorkflowNode = {
        id: `${type}-${++nodeIdCounter}-${Date.now()}`,
        type,
        position,
        targetPosition: layoutDirection === 'LR' ? Position.Left : Position.Top,
        sourcePosition: layoutDirection === 'LR' ? Position.Right : Position.Bottom,
        data: createDefaultNodeData(type),
      };

      addNode(newNode);
    },
    [addNode]
  );

  // ── Keyboard delete handler ──
  const onKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Delete' || event.key === 'Backspace') {
        deleteSelected();
      }
    },
    [deleteSelected]
  );

  // ── Click on pane to deselect or place node ──
  const onPaneClick = useCallback((event: React.MouseEvent) => {
    if (placementMode) {
      const instance = reactFlowInstance.current;
      if (!instance || !reactFlowWrapper.current) return;

      const bounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = instance.screenToFlowPosition({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      });

      const newNode: WorkflowNode = {
        id: `${placementMode}-${++nodeIdCounter}-${Date.now()}`,
        type: placementMode,
        position,
        targetPosition: layoutDirection === 'LR' ? Position.Left : Position.Top,
        sourcePosition: layoutDirection === 'LR' ? Position.Right : Position.Bottom,
        data: createDefaultNodeData(placementMode),
      };

      addNode(newNode);
      setPlacementMode(null); // Exit placement mode after placing one
      return;
    }
    
    selectNode(null);
  }, [placementMode, addNode, selectNode]);

  // ── Render ──
  const styledEdges = edges.map((edge) => {
    const sourceNode = nodes.find((n) => n.id === edge.source);
    let strokeColor = theme === 'light' ? '#64748b' : '#6366f1'; // fallback colors
    
    if (sourceNode) {
      if (theme === 'light') {
        switch (sourceNode.type) {
          case 'start': strokeColor = '#059669'; break;     // emerald-600
          case 'task': strokeColor = '#2563eb'; break;      // blue-600
          case 'approval': strokeColor = '#d97706'; break;  // amber-600
          case 'automated': strokeColor = '#7c3aed'; break; // purple-600
          case 'end': strokeColor = '#e11d48'; break;       // rose-600
        }
      } else {
        switch (sourceNode.type) {
          case 'start': strokeColor = '#10b981'; break;     // emerald-500
          case 'task': strokeColor = '#3b82f6'; break;      // blue-500
          case 'approval': strokeColor = '#f59e0b'; break;  // amber-500
          case 'automated': strokeColor = '#8b5cf6'; break; // purple-500
          case 'end': strokeColor = '#f43f5e'; break;       // rose-500
        }
      }
    }

    return {
      ...edge,
      style: { ...edge.style, stroke: strokeColor, strokeWidth: 2 },
    };
  });

  return (
    <div
      ref={reactFlowWrapper}
      className={`workflow-canvas ${placementMode ? 'cursor-crosshair' : ''}`}
      onKeyDown={onKeyDown}
      tabIndex={0}
    >
      {/* Placement Mode Indicator */}
      {placementMode && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-accent text-white px-4 py-2 rounded-full shadow-lg z-50 font-semibold text-sm animate-bounce">
          Click anywhere to place a {placementMode.toUpperCase()} node (Press Esc to cancel)
        </div>
      )}
      <ReactFlow
        nodes={nodes}
        edges={styledEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={(instance) => {
          reactFlowInstance.current = instance as unknown as ReactFlowInstance<WorkflowNode>;
        }}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ maxZoom: 1, padding: 0.2 }}
        snapToGrid
        snapGrid={[16, 16]}
        connectionRadius={30}
        connectionLineType={ConnectionLineType.SmoothStep}
        defaultEdgeOptions={{
          type: 'smoothstep',
          animated: true,
        }}
        connectionLineStyle={{ 
          stroke: theme === 'light' ? '#64748b' : '#818cf8', 
          strokeWidth: 2 
        }}
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={theme === 'light' ? BackgroundVariant.Dots : BackgroundVariant.Lines}
          gap={theme === 'light' ? 20 : 24}
          size={theme === 'light' ? 1.5 : 1}
          color={theme === 'light' ? 'rgba(90,120,170,0.3)' : 'rgba(255, 255, 255, 0.05)'}
        />
        <Controls
          className="flow-controls"
          showInteractive={false}
        />
        <MiniMap
          nodeColor={getMinimapColor}
          maskColor="rgba(15, 23, 42, 0.7)"
          className={`flow-minimap transition-transform duration-300 ${selectedNodeId ? '-translate-x-[300px]' : ''}`}
          pannable
          zoomable
        />
      </ReactFlow>
    </div>
  );
}
