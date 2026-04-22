/**
 * Core TypeScript interfaces for the HR Workflow Designer.
 * Uses discriminated unions to ensure type safety across all node types.
 */

import type { Node, Edge } from '@xyflow/react';

// ─── Node Type Enum ──────────────────────────────────────────────
export type WorkflowNodeType = 'start' | 'task' | 'approval' | 'automated' | 'end';

// ─── Per-Node Data Shapes ────────────────────────────────────────

export interface KeyValuePair {
  key: string;
  value: string;
}

export interface StartNodeData {
  type: 'start';
  title: string;
  metadata: KeyValuePair[];
  /** Validation errors for visual indicators */
  errors?: string[];
}

export interface TaskNodeData {
  type: 'task';
  title: string;
  description: string;
  assignee: string;
  dueDate: string;
  customFields: KeyValuePair[];
  errors?: string[];
}

export interface ApprovalNodeData {
  type: 'approval';
  title: string;
  approverRole: string;
  autoApproveThreshold: number;
  errors?: string[];
}

export interface AutomatedStepData {
  type: 'automated';
  title: string;
  actionId: string;
  parameters: Record<string, string>;
  errors?: string[];
}

export interface EndNodeData {
  type: 'end';
  endMessage: string;
  summaryFlag: boolean;
  errors?: string[];
}

// ─── Discriminated Union ─────────────────────────────────────────
export type WorkflowNodeData =
  | StartNodeData
  | TaskNodeData
  | ApprovalNodeData
  | AutomatedStepData
  | EndNodeData;

// ─── React Flow Node/Edge Types ──────────────────────────────────
export type WorkflowNode = Node<WorkflowNodeData, WorkflowNodeType>;
export type WorkflowEdge = Edge;

// ─── Mock API Types ──────────────────────────────────────────────

export interface AutomationAction {
  id: string;
  label: string;
  params: string[];
}

export interface SimulationLog {
  stepIndex: number;
  nodeId: string;
  nodeTitle: string;
  nodeType: WorkflowNodeType;
  status: 'success' | 'warning' | 'error' | 'running' | 'pending';
  message: string;
  timestamp: number;
}

// ─── Serialization ───────────────────────────────────────────────

export interface WorkflowJSON {
  name: string;
  version: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  exportedAt: string;
}

// ─── Validation ──────────────────────────────────────────────────

export interface ValidationError {
  nodeId?: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  /** Map of nodeId -> error messages for visual indicators */
  nodeErrors: Record<string, string[]>;
}
