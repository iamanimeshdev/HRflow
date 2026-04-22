/**
 * Task Node — Represents a manual HR task (e.g., review, onboarding step).
 * Blue accent with clipboard icon. Shows assignee and due date.
 */

import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { ClipboardList } from 'lucide-react';
import type { TaskNodeData } from '../types/workflow';

type TaskNodeProps = NodeProps & { data: TaskNodeData };

function TaskNodeComponent({ data, selected }: TaskNodeProps) {
  const hasErrors = data.errors && data.errors.length > 0;

  return (
    <div
      className={`
        workflow-node task-node
        ${selected ? 'ring-2 ring-blue-400 shadow-lg shadow-blue-500/20' : ''}
        ${hasErrors ? 'ring-2 ring-red-500 shadow-lg shadow-red-500/20' : ''}
      `}
    >
      <div className="node-header task-header">
        <div className="node-icon task-icon">
          <ClipboardList size={14} />
        </div>
        <span className="node-type-label">Task</span>
      </div>
      <div className="node-body">
        <p className="node-title">{data.title || 'Untitled Task'}</p>
        <div className="node-details">
          {data.assignee && (
            <span className="node-badge task-badge">
              👤 {data.assignee}
            </span>
          )}
          {data.dueDate && (
            <span className="node-badge task-badge">
              📅 {data.dueDate}
            </span>
          )}
        </div>
        {data.customFields.length > 0 && (
          <p className="node-meta">{data.customFields.length} custom field{data.customFields.length > 1 ? 's' : ''}</p>
        )}
      </div>
      {hasErrors && (
        <div className="node-error-indicator" title={data.errors!.join(', ')}>!</div>
      )}
      <Handle type="target" position={Position.Top} className="handle-target task-handle" />
      <Handle type="source" position={Position.Bottom} className="handle-source task-handle" />
    </div>
  );
}

export const TaskNode = memo(TaskNodeComponent);
