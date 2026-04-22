/**
 * Approval Node — Represents an approval step in the workflow.
 * Amber accent with shield icon. Shows approver role and threshold.
 */

import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { ShieldCheck } from 'lucide-react';
import type { ApprovalNodeData } from '../types/workflow';

type ApprovalNodeProps = NodeProps & { data: ApprovalNodeData };

function ApprovalNodeComponent({ data, selected }: ApprovalNodeProps) {
  const hasErrors = data.errors && data.errors.length > 0;

  return (
    <div
      className={`
        workflow-node approval-node
        ${selected ? 'ring-2 ring-amber-400 shadow-lg shadow-amber-500/20' : ''}
        ${hasErrors ? 'ring-2 ring-red-500 shadow-lg shadow-red-500/20' : ''}
      `}
    >
      <div className="node-header approval-header">
        <div className="node-icon approval-icon">
          <ShieldCheck size={14} />
        </div>
        <span className="node-type-label">Approval</span>
      </div>
      <div className="node-body">
        <p className="node-title">{data.title || 'Approval Step'}</p>
        <div className="node-details">
          {data.approverRole && (
            <span className="node-badge approval-badge">
              🔐 {data.approverRole}
            </span>
          )}
          {data.autoApproveThreshold > 0 && (
            <span className="node-badge approval-badge">
              ⚡ Auto-approve &lt; {data.autoApproveThreshold}
            </span>
          )}
        </div>
      </div>
      {hasErrors && (
        <div className="node-error-indicator" title={data.errors!.join(', ')}>!</div>
      )}
      <Handle type="target" position={Position.Top} className="handle-target approval-handle" />
      <Handle type="source" position={Position.Bottom} className="handle-source approval-handle" />
    </div>
  );
}

export const ApprovalNode = memo(ApprovalNodeComponent);
