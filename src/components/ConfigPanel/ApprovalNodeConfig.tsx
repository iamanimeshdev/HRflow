/**
 * Approval Node Configuration Form
 * Title, approver role, auto-approve threshold
 */


import { useWorkflowStore } from '../../hooks/useWorkflowStore';
import type { ApprovalNodeData } from '../../types/workflow';

interface Props {
  nodeId: string;
  data: ApprovalNodeData;
}

export function ApprovalNodeConfig({ nodeId, data }: Props) {
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);

  const update = (partial: Partial<ApprovalNodeData>) => {
    updateNodeData(nodeId, partial);
  };

  return (
    <div className="config-form">
      <div className="config-field">
        <label className="config-label">Title</label>
        <input
          type="text"
          className="config-input"
          value={data.title}
          onChange={(e) => update({ title: e.target.value })}
          placeholder="e.g., Manager Approval"
        />
      </div>

      <div className="config-field">
        <label className="config-label">Approver Role</label>
        <select
          className="config-select"
          value={data.approverRole}
          onChange={(e) => update({ approverRole: e.target.value })}
        >
          <option value="">Select a role...</option>
          <option value="HR Manager">HR Manager</option>
          <option value="Department Head">Department Head</option>
          <option value="VP">Vice President</option>
          <option value="Director">Director</option>
          <option value="CEO">CEO</option>
          <option value="Finance Lead">Finance Lead</option>
          <option value="Legal">Legal</option>
        </select>
      </div>

      <div className="config-field">
        <label className="config-label">Auto-Approve Threshold</label>
        <input
          type="number"
          className="config-input"
          value={data.autoApproveThreshold}
          onChange={(e) => update({ autoApproveThreshold: parseInt(e.target.value) || 0 })}
          min={0}
          placeholder="0 = disabled"
        />
        <p className="config-help">
          Requests below this value (in $) will be auto-approved. Set to 0 to disable.
        </p>
      </div>
    </div>
  );
}
