/**
 * Start Node Configuration Form
 * Title + key-value metadata pairs
 */


import { useWorkflowStore } from '../../hooks/useWorkflowStore';
import type { StartNodeData, KeyValuePair } from '../../types/workflow';

interface Props {
  nodeId: string;
  data: StartNodeData;
}

export function StartNodeConfig({ nodeId, data }: Props) {
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);

  const update = (partial: Partial<StartNodeData>) => {
    updateNodeData(nodeId, partial);
  };

  const addMetadata = () => {
    update({ metadata: [...data.metadata, { key: '', value: '' }] });
  };

  const updateMetadata = (index: number, field: keyof KeyValuePair, value: string) => {
    const updated = data.metadata.map((m, i) =>
      i === index ? { ...m, [field]: value } : m
    );
    update({ metadata: updated });
  };

  const removeMetadata = (index: number) => {
    update({ metadata: data.metadata.filter((_, i) => i !== index) });
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
          placeholder="e.g., Employee Onboarding Start"
        />
      </div>

      <div className="config-field">
        <div className="config-label-row">
          <label className="config-label">Metadata</label>
          <button className="config-add-btn" onClick={addMetadata} type="button">
            + Add
          </button>
        </div>
        {data.metadata.length === 0 && (
          <p className="config-empty">No metadata fields. Click "Add" to create one.</p>
        )}
        {data.metadata.map((pair, idx) => (
          <div key={idx} className="config-kv-row">
            <input
              type="text"
              className="config-input config-input-sm"
              value={pair.key}
              onChange={(e) => updateMetadata(idx, 'key', e.target.value)}
              placeholder="Key"
            />
            <input
              type="text"
              className="config-input config-input-sm"
              value={pair.value}
              onChange={(e) => updateMetadata(idx, 'value', e.target.value)}
              placeholder="Value"
            />
            <button
              className="config-remove-btn"
              onClick={() => removeMetadata(idx)}
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
