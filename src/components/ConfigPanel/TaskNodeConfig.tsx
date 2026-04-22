/**
 * Task Node Configuration Form
 * Title (required), description, assignee, due date, custom fields
 */


import { useWorkflowStore } from '../../hooks/useWorkflowStore';
import type { TaskNodeData, KeyValuePair } from '../../types/workflow';

interface Props {
  nodeId: string;
  data: TaskNodeData;
}

export function TaskNodeConfig({ nodeId, data }: Props) {
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);

  const update = (partial: Partial<TaskNodeData>) => {
    updateNodeData(nodeId, partial);
  };

  const addCustomField = () => {
    update({ customFields: [...data.customFields, { key: '', value: '' }] });
  };

  const updateCustomField = (index: number, field: keyof KeyValuePair, value: string) => {
    const updated = data.customFields.map((f, i) =>
      i === index ? { ...f, [field]: value } : f
    );
    update({ customFields: updated });
  };

  const removeCustomField = (index: number) => {
    update({ customFields: data.customFields.filter((_, i) => i !== index) });
  };

  return (
    <div className="config-form">
      <div className="config-field">
        <label className="config-label">
          Title <span className="config-required">*</span>
        </label>
        <input
          type="text"
          className={`config-input ${!data.title.trim() ? 'config-input-error' : ''}`}
          value={data.title}
          onChange={(e) => update({ title: e.target.value })}
          placeholder="e.g., Complete Background Check"
        />
        {!data.title.trim() && (
          <p className="config-error-msg">Title is required</p>
        )}
      </div>

      <div className="config-field">
        <label className="config-label">Description</label>
        <textarea
          className="config-textarea"
          value={data.description}
          onChange={(e) => update({ description: e.target.value })}
          placeholder="Describe this task..."
          rows={3}
        />
      </div>

      <div className="config-row">
        <div className="config-field flex-1">
          <label className="config-label">Assignee</label>
          <input
            type="text"
            className="config-input"
            value={data.assignee}
            onChange={(e) => update({ assignee: e.target.value })}
            placeholder="e.g., HR Manager"
          />
        </div>

        <div className="config-field flex-1">
          <label className="config-label">Due Date</label>
          <input
            type="date"
            className="config-input"
            value={data.dueDate}
            onChange={(e) => update({ dueDate: e.target.value })}
          />
        </div>
      </div>

      <div className="config-field">
        <div className="config-label-row">
          <label className="config-label">Custom Fields</label>
          <button className="config-add-btn" onClick={addCustomField} type="button">
            + Add
          </button>
        </div>
        {data.customFields.length === 0 && (
          <p className="config-empty">No custom fields.</p>
        )}
        {data.customFields.map((pair, idx) => (
          <div key={idx} className="config-kv-row">
            <input
              type="text"
              className="config-input config-input-sm"
              value={pair.key}
              onChange={(e) => updateCustomField(idx, 'key', e.target.value)}
              placeholder="Field name"
            />
            <input
              type="text"
              className="config-input config-input-sm"
              value={pair.value}
              onChange={(e) => updateCustomField(idx, 'value', e.target.value)}
              placeholder="Value"
            />
            <button
              className="config-remove-btn"
              onClick={() => removeCustomField(idx)}
              type="button"
              title="Remove"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
