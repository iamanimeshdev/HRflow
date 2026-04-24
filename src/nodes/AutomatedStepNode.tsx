/**
 * Automated Step Node — Represents an automated action (email, doc gen, etc.).
 */
import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Zap } from 'lucide-react';
import { useWorkflowStore } from '../hooks/useWorkflowStore';
import type { AutomatedStepData } from '../types/workflow';

type AutomatedStepProps = NodeProps & { data: AutomatedStepData };

function AutomatedStepComponent({ data, selected }: AutomatedStepProps) {
  const hasErrors = data.errors && data.errors.length > 0;
  const layoutDirection = useWorkflowStore((s) => s.layoutDirection);

  const isHorizontal = layoutDirection === 'LR';
  const targetPos = isHorizontal ? Position.Left : Position.Top;
  const sourcePos = isHorizontal ? Position.Right : Position.Bottom;
  const paramCount = Object.keys(data.parameters).length;

  return (
    <div
      className={`
        workflow-node automated-node
        ${selected ? 'ring-2 ring-purple-400 shadow-lg shadow-purple-500/20' : ''}
        ${hasErrors ? 'ring-2 ring-red-500 shadow-lg shadow-red-500/20' : ''}
      `}
    >
      <div className="node-header automated-header">
        <div className="node-icon automated-icon">
          <Zap size={14} />
        </div>
        <span className="node-type-label">Automated</span>
      </div>
      <div className="node-body">
        <p className="node-title">{data.title || 'Automated Step'}</p>
        <div className="node-details">
          {data.actionId ? (
            <span className="node-badge automated-badge">⚙️ {data.actionId}</span>
          ) : (
            <span className="node-badge automated-badge-empty">No action set</span>
          )}
          {paramCount > 0 && (
            <span className="node-badge automated-badge">📋 {paramCount} param{paramCount > 1 ? 's' : ''}</span>
          )}
        </div>
      </div>
      {hasErrors && (
        <div className="node-error-indicator" title={data.errors!.join(', ')}>!</div>
      )}
      <Handle type="target" position={targetPos} className="handle-target automated-handle" />
      <Handle type="source" position={sourcePos} className="handle-source automated-handle" />
    </div>
  );
}

export const AutomatedStepNode = memo(AutomatedStepComponent);
