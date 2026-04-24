/**
 * Zustand Store — Central State Management
 * 
 * Why Zustand over Context:
 * - No provider nesting required
 * - Built-in selectors prevent unnecessary re-renders
 * - Simpler API with less boilerplate
 * - Easy to access state outside of React components
 */

import { create } from 'zustand';
import {
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  type Connection,
  type NodeChange,
  type EdgeChange,
} from '@xyflow/react';

import { getLayoutedElements } from '../utils/layout';

import type {
  WorkflowNode,
  WorkflowEdge,
  WorkflowNodeData,
  SimulationLog,
  ValidationResult,
} from '../types/workflow';

// ─── Store Interface ─────────────────────────────────────────────

interface WorkflowState {
  // ── Graph state ──
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  
  // ── Selection ──
  selectedNodeId: string | null;
  
  // ── Simulation ──
  simulationLogs: SimulationLog[];
  isSimulating: boolean;
  showSimulation: boolean;
  
  // ── Validation ──
  validationResult: ValidationResult | null;
  
  // ── Workflow metadata ──
  workflowName: string;
  layoutDirection: 'TB' | 'LR';
  isLayoutChosen: boolean;
  theme: 'dark' | 'light';
  
  // ── React Flow handlers ──
  onNodesChange: OnNodesChange<WorkflowNode>;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  
  // ── Actions ──
  addNode: (node: WorkflowNode) => void;
  updateNodeData: (nodeId: string, data: Partial<WorkflowNodeData>) => void;
  deleteSelected: () => void;
  selectNode: (nodeId: string | null) => void;
  
  // ── Simulation actions ──
  setSimulationLogs: (logs: SimulationLog[]) => void;
  setIsSimulating: (val: boolean) => void;
  setShowSimulation: (val: boolean) => void;
  
  // ── Validation actions ──
  setValidationResult: (result: ValidationResult | null) => void;
  applyValidationErrors: (result: ValidationResult) => void;
  clearValidationErrors: () => void;
  
  // ── Workflow actions ──
  setWorkflowName: (name: string) => void;
  loadWorkflow: (nodes: WorkflowNode[], edges: WorkflowEdge[], name?: string) => void;
  clearWorkflow: () => void;
  setLayoutDirection: (dir: 'TB' | 'LR') => void;
  setLayoutChosen: (chosen: boolean) => void;
  applyAutoLayout: () => void;
  toggleTheme: () => void;
}

// ─── Store Implementation ────────────────────────────────────────

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,
  simulationLogs: [],
  isSimulating: false,
  showSimulation: false,
  validationResult: null,
  workflowName: 'tredence',
  layoutDirection: 'TB',
  isLayoutChosen: false,
  theme: 'dark',

  // ── React Flow change handlers ──
  onNodesChange: (changes: NodeChange<WorkflowNode>[]) => {
    set({ nodes: applyNodeChanges(changes, get().nodes) });
    
    // Track selection changes
    const selectionChange = changes.find(
      (c) => c.type === 'select' && c.selected
    );
    if (selectionChange && 'id' in selectionChange) {
      set({ selectedNodeId: selectionChange.id });
    }
    
    // Deselect if a node was deselected
    const deselectionChange = changes.find(
      (c) => c.type === 'select' && !c.selected && 'id' in c && c.id === get().selectedNodeId
    );
    if (deselectionChange) {
      set({ selectedNodeId: null });
    }
  },

  onEdgesChange: (changes: EdgeChange[]) => {
    set({ edges: applyEdgeChanges(changes, get().edges) as WorkflowEdge[] });
  },

  onConnect: (connection: Connection) => {
    // Find the source node to determine edge color
    const sourceNode = get().nodes.find(n => n.id === connection.source);
    let strokeColor = '#6366f1'; // default indigo
    
    if (sourceNode) {
      switch (sourceNode.data.type) {
        case 'start': strokeColor = '#10b981'; break;
        case 'task': strokeColor = '#3b82f6'; break;
        case 'approval': strokeColor = '#f59e0b'; break;
        case 'automated': strokeColor = '#a855f7'; break;
        case 'end': strokeColor = '#f43f5e'; break;
      }
    }

    const newEdge: WorkflowEdge = {
      ...connection,
      id: `e-${connection.source}-${connection.target}`,
      animated: true,
      style: { stroke: strokeColor, strokeWidth: 2 },
    } as WorkflowEdge;
    
    set({ edges: addEdge(newEdge, get().edges) as WorkflowEdge[] });
  },

  addNode: (node: WorkflowNode) => {
    set({ nodes: [...get().nodes, node] });
  },

  updateNodeData: (nodeId: string, partialData: Partial<WorkflowNodeData>) => {
    set({
      nodes: get().nodes.map((n) =>
        n.id === nodeId
          ? { ...n, data: { ...n.data, ...partialData } as WorkflowNodeData }
          : n
      ),
    });
  },

  deleteSelected: () => {
    const { nodes, edges, selectedNodeId } = get();
    const selectedNodes = nodes.filter((n) => n.selected);
    const selectedEdges = edges.filter((e) => e.selected);
    
    if (selectedNodes.length === 0 && selectedEdges.length === 0) return;
    
    const removedNodeIds = new Set(selectedNodes.map((n) => n.id));
    
    set({
      nodes: nodes.filter((n) => !n.selected),
      edges: edges.filter(
        (e) => !e.selected && !removedNodeIds.has(e.source) && !removedNodeIds.has(e.target)
      ),
      selectedNodeId: removedNodeIds.has(selectedNodeId ?? '') ? null : selectedNodeId,
    });
  },

  selectNode: (nodeId: string | null) => {
    set({
      selectedNodeId: nodeId,
      nodes: get().nodes.map((n) => ({
        ...n,
        selected: n.id === nodeId,
      })),
    });
  },

  setSimulationLogs: (logs) => set({ simulationLogs: logs }),
  setIsSimulating: (val) => set({ isSimulating: val }),
  setShowSimulation: (val) => set({ showSimulation: val }),
  
  setValidationResult: (result) => set({ validationResult: result }),
  
  applyValidationErrors: (result: ValidationResult) => {
    set({
      validationResult: result,
      nodes: get().nodes.map((n) => ({
        ...n,
        data: {
          ...n.data,
          errors: result.nodeErrors[n.id] ?? [],
        } as WorkflowNodeData,
      })),
    });
  },
  
  clearValidationErrors: () => {
    set({
      validationResult: null,
      nodes: get().nodes.map((n) => ({
        ...n,
        data: {
          ...n.data,
          errors: [],
        } as WorkflowNodeData,
      })),
    });
  },

  setWorkflowName: (name) => set({ workflowName: name }),
  
  loadWorkflow: (nodes, edges, name) => {
    set({
      nodes,
      edges,
      workflowName: name ?? 'Imported Workflow',
      selectedNodeId: null,
      simulationLogs: [],
      validationResult: null,
    });
  },
  
  clearWorkflow: () => {
    set({
      nodes: [],
      edges: [],
      selectedNodeId: null,
      simulationLogs: [],
      validationResult: null,
      showSimulation: false,
      isLayoutChosen: false,
    });
  },
  
  setLayoutDirection: (dir) => {
    set({ layoutDirection: dir, isLayoutChosen: true });
    get().applyAutoLayout();
  },
  
  setLayoutChosen: (chosen) => set({ isLayoutChosen: chosen }),
  
  applyAutoLayout: () => {
    const { nodes, edges, layoutDirection } = get();
    if (nodes.length === 0) return;
    
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      nodes,
      edges,
      layoutDirection
    );
    
    // Clear sourceHandle/targetHandle so edges re-route to the new handle positions
    const cleanEdges = layoutedEdges.map((e) => ({
      ...e,
      sourceHandle: undefined,
      targetHandle: undefined,
      type: 'smoothstep',
    }));
    
    set({
      nodes: layoutedNodes,
      edges: cleanEdges as WorkflowEdge[],
    });
  },
  
  toggleTheme: () => {
    set({ theme: get().theme === 'dark' ? 'light' : 'dark' });
  },
}));
