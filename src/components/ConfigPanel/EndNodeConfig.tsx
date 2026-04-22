/**
 * End Node Configuration Form
 * End message + summary flag toggle
 */

import React from 'react';
import { useWorkflowStore } from '../../hooks/useWorkflowStore';
import type { EndNodeData } from '../../types/workflow';

interface Props {
  nodeId: string;
  data: EndNodeData;
}

export function EndNodeConfig({ nodeId, data }: Props) {
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);

  const update = (partial: Partial<EndNodeData>) => {
    updateNodeData(nodeId, partial);
  };

  return (
    <div className="config-form">
      <div className="config-field">
        <label className="config-label">End Message</label>
        <textarea
          className="config-textarea"
          value={data.endMessage}
          onChange={(e) => update({ endMessage: e.target.value })}
          placeholder="e.g., Onboarding process completed successfully"
          rows={3}
        />
      </div>

      <div className="config-field">
        <label className="config-toggle-row">
          <div className="toggle-wrapper">
            <input
              type="checkbox"
              className="config-toggle"
              checked={data.summaryFlag}
              onChange={(e) => update({ summaryFlag: e.target.checked })}
            />
            <div className="toggle-slider"></div>
          </div>
          <div>
            <span className="config-toggle-label">Generate Summary</span>
            <span className="config-toggle-desc">
              Create a summary report when this workflow completes
            </span>
          </div>
        </label>
      </div>
    </div>
  );
}
