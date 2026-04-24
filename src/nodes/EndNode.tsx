/**
 * End Node — Terminal point of the HR workflow.
 */
import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Flag } from 'lucide-react';
import { useWorkflowStore } from '../hooks/useWorkflowStore';
import type { EndNodeData } from '../types/workflow';

type EndNodeProps = NodeProps & { data: EndNodeData };

function EndNodeComponent({ data, selected }: EndNodeProps) {
  const hasErrors = data.errors && data.errors.length > 0;
  const layoutDirection = useWorkflowStore((s) => s.layoutDirection);

  const targetPos = layoutDirection === 'LR' ? Position.Left : Position.Top;

  return (
    <div
      className={`
        workflow-node end-node
        ${selected ? 'ring-2 ring-rose-400 shadow-lg shadow-rose-500/20' : ''}
        ${hasErrors ? 'ring-2 ring-red-500 shadow-lg shadow-red-500/20' : ''}
      `}
    >
      <div className="node-header end-header">
        <div className="node-icon end-icon">
          <Flag size={14} />
        </div>
        <span className="node-type-label">End</span>
      </div>
      <div className="node-body">
        <p className="node-title">{data.endMessage || 'Workflow End'}</p>
        {data.summaryFlag && (
          <span className="node-badge end-badge">📊 Summary enabled</span>
        )}
      </div>
      {hasErrors && (
        <div className="node-error-indicator" title={data.errors!.join(', ')}>!</div>
      )}
      <Handle type="target" position={targetPos} className="handle-target end-handle" />
    </div>
  );
}

export const EndNode = memo(EndNodeComponent);
