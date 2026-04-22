/**
 * Workflow Validation
 * 
 * Pure utility functions for validating workflow graph integrity.
 * Decoupled from UI — can be tested independently.
 */

import type {
  WorkflowNode,
  WorkflowEdge,
  ValidationResult,
  ValidationError,
} from '../types/workflow';

/**
 * Validates the workflow graph for structural correctness.
 * 
 * Checks performed:
 * 1. Must have exactly one Start node
 * 2. Must have at least one End node
 * 3. All nodes must be connected (no orphans)
 * 4. No cycles (DAG check via DFS)
 */
export function validateWorkflow(
  nodes: WorkflowNode[],
  edges: WorkflowEdge[]
): ValidationResult {
  const errors: ValidationError[] = [];
  const nodeErrors: Record<string, string[]> = {};

  const addNodeError = (nodeId: string, message: string, severity: ValidationError['severity'] = 'error') => {
    errors.push({ nodeId, message, severity });
    if (!nodeErrors[nodeId]) nodeErrors[nodeId] = [];
    nodeErrors[nodeId].push(message);
  };

  // ─── Check 1: Start node existence ───────────────────────────
  const startNodes = nodes.filter((n) => n.data.type === 'start');
  if (startNodes.length === 0) {
    errors.push({ message: 'Workflow must have a Start node', severity: 'error' });
  } else if (startNodes.length > 1) {
    startNodes.forEach((n) =>
      addNodeError(n.id, 'Only one Start node is allowed')
    );
  }

  // ─── Check 2: End node existence ─────────────────────────────
  const endNodes = nodes.filter((n) => n.data.type === 'end');
  if (endNodes.length === 0) {
    errors.push({ message: 'Workflow must have at least one End node', severity: 'error' });
  }

  // ─── Check 3: Connectivity — no orphan nodes ────────────────
  const connectedNodeIds = new Set<string>();
  edges.forEach((e) => {
    connectedNodeIds.add(e.source);
    connectedNodeIds.add(e.target);
  });

  if (nodes.length > 1) {
    nodes.forEach((n) => {
      if (!connectedNodeIds.has(n.id)) {
        addNodeError(n.id, `"${getTitle(n)}" is not connected to any other node`, 'warning');
      }
    });
  }

  // ─── Check 4: Cycle detection (DFS) ─────────────────────────
  const hasCycle = detectCycle(nodes, edges);
  if (hasCycle) {
    errors.push({ message: 'Workflow contains a cycle — HR workflows must be acyclic', severity: 'error' });
  }

  // ─── Check 5: Required field validation ──────────────────────
  nodes.forEach((n) => {
    if (n.data.type === 'task' && !n.data.title.trim()) {
      addNodeError(n.id, 'Task node requires a title');
    }
  });

  return {
    isValid: errors.filter((e) => e.severity === 'error').length === 0,
    errors,
    nodeErrors,
  };
}

/**
 * DFS-based cycle detection for directed graphs.
 * Uses three-coloring: WHITE (unvisited), GRAY (in-stack), BLACK (done).
 */
function detectCycle(nodes: WorkflowNode[], edges: WorkflowEdge[]): boolean {
  const adjacency = new Map<string, string[]>();
  nodes.forEach((n) => adjacency.set(n.id, []));
  edges.forEach((e) => adjacency.get(e.source)?.push(e.target));

  const WHITE = 0, GRAY = 1, BLACK = 2;
  const color = new Map<string, number>();
  nodes.forEach((n) => color.set(n.id, WHITE));

  function dfs(nodeId: string): boolean {
    color.set(nodeId, GRAY);
    for (const neighbor of adjacency.get(nodeId) ?? []) {
      if (color.get(neighbor) === GRAY) return true; // Back edge = cycle
      if (color.get(neighbor) === WHITE && dfs(neighbor)) return true;
    }
    color.set(nodeId, BLACK);
    return false;
  }

  for (const node of nodes) {
    if (color.get(node.id) === WHITE && dfs(node.id)) return true;
  }
  return false;
}

function getTitle(node: WorkflowNode): string {
  const d = node.data;
  switch (d.type) {
    case 'start': return d.title || 'Start';
    case 'task': return d.title || 'Task';
    case 'approval': return d.title || 'Approval';
    case 'automated': return d.title || 'Automated';
    case 'end': return d.endMessage || 'End';
  }
}
