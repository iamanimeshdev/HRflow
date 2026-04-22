/**
 * Automated Step Configuration Form
 * 
 * Fetches available actions from mock API.
 * Dynamically renders parameter fields based on the selected action.
 */

import { useEffect, useState } from 'react';
import { useWorkflowStore } from '../../hooks/useWorkflowStore';
import { getAutomations } from '../../api/mockApi';
import type { AutomatedStepData, AutomationAction } from '../../types/workflow';

interface Props {
  nodeId: string;
  data: AutomatedStepData;
}

export function AutomatedStepConfig({ nodeId, data }: Props) {
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);
  const [actions, setActions] = useState<AutomationAction[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch available automations from mock API on mount
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getAutomations().then((result) => {
      if (!cancelled) {
        setActions(result);
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, []);

  const update = (partial: Partial<AutomatedStepData>) => {
    updateNodeData(nodeId, partial);
  };

  const selectedAction = actions.find((a) => a.id === data.actionId);

  const handleActionChange = (actionId: string) => {
    const action = actions.find((a) => a.id === actionId);
    // Reset parameters when action changes — initialize with empty strings
    const params: Record<string, string> = {};
    action?.params.forEach((p) => { params[p] = ''; });
    update({ actionId, parameters: params });
  };

  const handleParamChange = (paramName: string, value: string) => {
    update({
      parameters: { ...data.parameters, [paramName]: value },
    });
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
          placeholder="e.g., Send Welcome Email"
        />
      </div>

      <div className="config-field">
        <label className="config-label">Action</label>
        {loading ? (
          <div className="config-loading">
            <div className="config-spinner"></div>
            <span>Loading automations...</span>
          </div>
        ) : (
          <select
            className="config-select"
            value={data.actionId}
            onChange={(e) => handleActionChange(e.target.value)}
          >
            <option value="">Select an action...</option>
            {actions.map((action) => (
              <option key={action.id} value={action.id}>
                {action.label}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Dynamic parameter fields based on selected action */}
      {selectedAction && selectedAction.params.length > 0 && (
        <div className="config-field">
          <label className="config-label">Parameters</label>
          <div className="config-params">
            {selectedAction.params.map((param) => (
              <div key={param} className="config-param-row">
                <label className="config-param-label">{param}</label>
                <input
                  type="text"
                  className="config-input"
                  value={data.parameters[param] ?? ''}
                  onChange={(e) => handleParamChange(param, e.target.value)}
                  placeholder={`Enter ${param}...`}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
