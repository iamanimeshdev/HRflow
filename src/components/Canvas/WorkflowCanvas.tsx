/**
 * Workflow Canvas — Main React Flow canvas area.
 * 
 * Handles:
 * - Rendering the React Flow graph with custom node types
 * - Drop handler for creating nodes from sidebar drag
 * - Keyboard shortcuts (Delete/Backspace to remove selected)
 * - Background, minimap, and controls
 */

import { useCallback, useRef } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
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

  // ── Click on pane to deselect ──
  const onPaneClick = useCallback(() => {
    selectNode(null);
  }, [selectNode]);

  return (
    <div
      ref={reactFlowWrapper}
      className="workflow-canvas"
      onKeyDown={onKeyDown}
      tabIndex={0}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
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
        snapToGrid
        snapGrid={[16, 16]}
        defaultEdgeOptions={{
          animated: true,
          style: { stroke: '#6366f1', strokeWidth: 2 },
        }}
        connectionLineStyle={{ stroke: '#818cf8', strokeWidth: 2 }}
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="rgba(148, 163, 184, 0.15)"
        />
        <Controls
          className="flow-controls"
          showInteractive={false}
        />
        <MiniMap
          nodeColor={getMinimapColor}
          maskColor="rgba(15, 23, 42, 0.7)"
          className="flow-minimap"
          pannable
          zoomable
        />
      </ReactFlow>
    </div>
  );
}
