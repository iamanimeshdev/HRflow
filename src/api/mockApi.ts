/**
 * Mock API Layer
 * 
 * Simulates backend endpoints with realistic delays.
 * All functions return Promises to mirror real API behavior,
 * making it trivial to swap in a real backend later.
 */

import type {
  AutomationAction,
  SimulationLog,
  WorkflowNode,
  WorkflowEdge,
  WorkflowNodeType,
} from '../types/workflow';

// ─── Helper: Simulate network latency ────────────────────────────
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// ─── GET /automations ────────────────────────────────────────────
const MOCK_AUTOMATIONS: AutomationAction[] = [
  { id: 'send_email', label: 'Send Email', params: ['to', 'subject'] },
  { id: 'generate_doc', label: 'Generate Document', params: ['template', 'recipient'] },
  { id: 'slack_notify', label: 'Slack Notification', params: ['channel', 'message'] },
  { id: 'create_ticket', label: 'Create Ticket', params: ['project', 'summary', 'priority'] },
  { id: 'update_hris', label: 'Update HRIS Record', params: ['employeeId', 'field', 'value'] },
];

export async function getAutomations(): Promise<AutomationAction[]> {
  await delay(300);
  return [...MOCK_AUTOMATIONS];
}

// ─── POST /simulate ──────────────────────────────────────────────

/**
 * Topologically walks the workflow graph and produces step-by-step logs.
 * Uses Kahn's algorithm for topological ordering.
 */
export async function simulateWorkflow(
  nodes: WorkflowNode[],
  edges: WorkflowEdge[]
): Promise<SimulationLog[]> {
  await delay(800);

  // Build adjacency + in-degree maps
  const adjacency = new Map<string, string[]>();
  const inDegree = new Map<string, number>();

  nodes.forEach((n) => {
    adjacency.set(n.id, []);
    inDegree.set(n.id, 0);
  });

  edges.forEach((e) => {
    adjacency.get(e.source)?.push(e.target);
    inDegree.set(e.target, (inDegree.get(e.target) ?? 0) + 1);
  });

  // Kahn's algorithm
  const queue: string[] = [];
  inDegree.forEach((deg, id) => {
    if (deg === 0) queue.push(id);
  });

  const sorted: string[] = [];
  while (queue.length > 0) {
    const current = queue.shift()!;
    sorted.push(current);
    for (const neighbor of adjacency.get(current) ?? []) {
      const newDeg = (inDegree.get(neighbor) ?? 1) - 1;
      inDegree.set(neighbor, newDeg);
      if (newDeg === 0) queue.push(neighbor);
    }
  }

  // If not all nodes are in sorted order, fall back to node list order
  const nodeOrder = sorted.length === nodes.length ? sorted : nodes.map((n) => n.id);
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  const logs: SimulationLog[] = [];
  const now = Date.now();

  nodeOrder.forEach((nodeId, index) => {
    const node = nodeMap.get(nodeId);
    if (!node) return;

    const data = node.data;
    const nodeType = data.type as WorkflowNodeType;
    const title = getNodeTitle(data);

    // Generate contextual log messages
    let status: SimulationLog['status'] = 'success';
    let message = '';

    switch (nodeType) {
      case 'start':
        message = `Workflow started: "${title}"`;
        break;
      case 'task':
        if (data.type === 'task' && !data.assignee) {
          status = 'warning';
          message = `Task "${title}" has no assignee — auto-assigning to HR Manager`;
        } else {
          message = `Task "${title}" assigned to ${data.type === 'task' ? data.assignee : 'unknown'}`;
        }
        break;
      case 'approval':
        message = `Approval step "${title}" — waiting for ${data.type === 'approval' ? data.approverRole || 'approver' : 'approver'}`;
        break;
      case 'automated':
        if (data.type === 'automated') {
          message = data.actionId
            ? `Executing automation: ${data.actionId} with ${Object.keys(data.parameters).length} params`
            : `Automated step "${title}" — no action configured`;
          if (!data.actionId) status = 'warning';
        }
        break;
      case 'end':
        message = `Workflow completed: ${data.type === 'end' ? data.endMessage || 'Done' : 'Done'}`;
        break;
    }

    logs.push({
      stepIndex: index,
      nodeId,
      nodeTitle: title,
      nodeType,
      status,
      message,
      timestamp: now + index * 1200,
    });
  });

  return logs;
}

// ─── Helpers ─────────────────────────────────────────────────────
function getNodeTitle(data: WorkflowNode['data']): string {
  switch (data.type) {
    case 'start':
      return data.title || 'Start';
    case 'task':
      return data.title || 'Untitled Task';
    case 'approval':
      return data.title || 'Approval';
    case 'automated':
      return data.title || 'Automated Step';
    case 'end':
      return data.endMessage || 'End';
  }
}
