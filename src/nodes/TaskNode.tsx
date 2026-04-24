/**
 * Task Node — Represents a manual HR task (e.g., review, onboarding step).
 */
import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { ClipboardList } from 'lucide-react';
import { useWorkflowStore } from '../hooks/useWorkflowStore';
import type { TaskNodeData } from '../types/workflow';

type TaskNodeProps = NodeProps & { data: TaskNodeData };

function TaskNodeComponent({ data, selected }: TaskNodeProps) {
  const hasErrors = data.errors && data.errors.length > 0;
  const layoutDirection = useWorkflowStore((s) => s.layoutDirection);
  
  const isHorizontal = layoutDirection === 'LR';
  const targetPos = isHorizontal ? Position.Left : Position.Top;
  const sourcePos = isHorizontal ? Position.Right : Position.Bottom;

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
            <span className="node-badge task-badge">👤 {data.assignee}</span>
          )}
          {data.dueDate && (
            <span className="node-badge task-badge">📅 {data.dueDate}</span>
          )}
        </div>
        {data.customFields.length > 0 && (
          <p className="node-meta">{data.customFields.length} custom field{data.customFields.length > 1 ? 's' : ''}</p>
        )}
      </div>
      {hasErrors && (
        <div className="node-error-indicator" title={data.errors!.join(', ')}>!</div>
      )}
      <Handle type="target" position={targetPos} className="handle-target task-handle" />
      <Handle type="source" position={sourcePos} className="handle-source task-handle" />
    </div>
  );
}

export const TaskNode = memo(TaskNodeComponent);
