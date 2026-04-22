/**
 * Start Node — Entry point of the HR workflow.
 * Visually distinguished with green accent and play icon.
 */

import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Play } from 'lucide-react';
import type { StartNodeData } from '../types/workflow';

type StartNodeProps = NodeProps & { data: StartNodeData };

function StartNodeComponent({ data, selected }: StartNodeProps) {
  const hasErrors = data.errors && data.errors.length > 0;

  return (
    <div
      className={`
        workflow-node start-node
        ${selected ? 'ring-2 ring-emerald-400 shadow-lg shadow-emerald-500/20' : ''}
        ${hasErrors ? 'ring-2 ring-red-500 shadow-lg shadow-red-500/20' : ''}
      `}
    >
      <div className="node-header start-header">
        <div className="node-icon start-icon">
          <Play size={14} />
        </div>
        <span className="node-type-label">Start</span>
      </div>
      <div className="node-body">
        <p className="node-title">{data.title || 'Workflow Start'}</p>
        {data.metadata.length > 0 && (
          <p className="node-meta">{data.metadata.length} metadata field{data.metadata.length > 1 ? 's' : ''}</p>
        )}
      </div>
      {hasErrors && (
        <div className="node-error-indicator" title={data.errors!.join(', ')}>!</div>
      )}
      {/* Start node only has a source handle (output) */}
      <Handle type="source" position={Position.Bottom} className="handle-source start-handle" />
    </div>
  );
}

export const StartNode = memo(StartNodeComponent);
