/**
 * Workflow Serialization Utilities
 * 
 * Handles converting React Flow state to/from portable JSON format.
 * Used for export/import and sending to the simulation API.
 */

import type { WorkflowNode, WorkflowEdge, WorkflowJSON } from '../types/workflow';

/**
 * Serializes the current workflow state into a portable JSON structure.
 */
export function serializeWorkflow(
  nodes: WorkflowNode[],
  edges: WorkflowEdge[],
  name: string = 'Untitled Workflow'
): WorkflowJSON {
  return {
    name,
    version: '1.0.0',
    nodes: nodes.map((n) => ({
      ...n,
      // Strip React Flow internal state that shouldn't be persisted
      selected: undefined,
      dragging: undefined,
    })) as WorkflowNode[],
    edges: edges.map((e) => ({
      ...e,
      selected: undefined,
    })) as WorkflowEdge[],
    exportedAt: new Date().toISOString(),
  };
}

/**
 * Downloads the workflow as a JSON file.
 */
export function downloadWorkflowJSON(workflow: WorkflowJSON): void {
  const json = JSON.stringify(workflow, null, 2);
  const dataStr = "data:application/json;charset=utf-8," + encodeURIComponent(json);
  
  const a = document.createElement('a');
  a.setAttribute("href", dataStr);
  
  // Ensure we always have a valid filename (browsers reject empty names or just ".json")
  let safeName = 'workflow';
  if (workflow.name && workflow.name.trim().length > 0) {
    safeName = workflow.name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
  }
  
  a.setAttribute("download", `${safeName}.json`);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/**
 * Reads a JSON file and returns the parsed WorkflowJSON.
 */
export function importWorkflowJSON(file: File): Promise<WorkflowJSON> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string) as WorkflowJSON;
        if (!data.nodes || !data.edges) {
          throw new Error('Invalid workflow file: missing nodes or edges');
        }
        resolve(data);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}
