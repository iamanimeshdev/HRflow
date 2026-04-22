/**
 * Toolbar — Top action bar for workflow operations.
 * 
 * Actions: Validate, Run Workflow, Export JSON, Import JSON
 * Also displays workflow name (editable).
 */

import React, { useRef, useState } from 'react';
import {
  CheckCircle,
  PlayCircle,
  Download,
  Upload,
  AlertTriangle,
  Loader2,
  Trash2,
} from 'lucide-react';
import { useWorkflowStore } from '../../hooks/useWorkflowStore';
import { useValidation } from '../../hooks/useValidation';
import { simulateWorkflow } from '../../api/mockApi';
import { serializeWorkflow, downloadWorkflowJSON, importWorkflowJSON } from '../../utils/serializer';

export function Toolbar() {
  const nodes = useWorkflowStore((s) => s.nodes);
  const edges = useWorkflowStore((s) => s.edges);
  const workflowName = useWorkflowStore((s) => s.workflowName);
  const setWorkflowName = useWorkflowStore((s) => s.setWorkflowName);
  const isSimulating = useWorkflowStore((s) => s.isSimulating);
  const setIsSimulating = useWorkflowStore((s) => s.setIsSimulating);
  const setSimulationLogs = useWorkflowStore((s) => s.setSimulationLogs);
  const setShowSimulation = useWorkflowStore((s) => s.setShowSimulation);
  const loadWorkflow = useWorkflowStore((s) => s.loadWorkflow);
  const clearWorkflow = useWorkflowStore((s) => s.clearWorkflow);

  const { validate, validationResult } = useValidation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'warning') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // ── Validate ──
  const handleValidate = () => {
    const result = validate();
    if (result.isValid) {
      showToast('Workflow is valid! ✓', 'success');
    } else {
      const errorCount = result.errors.filter((e) => e.severity === 'error').length;
      const warnCount = result.errors.filter((e) => e.severity === 'warning').length;
      showToast(
        `${errorCount} error${errorCount !== 1 ? 's' : ''}${warnCount > 0 ? `, ${warnCount} warning${warnCount !== 1 ? 's' : ''}` : ''}`,
        errorCount > 0 ? 'error' : 'warning'
      );
    }
  };

  // ── Run Simulation ──
  const handleSimulate = async () => {
    const result = validate();
    if (!result.isValid) {
      showToast('Fix validation errors before running', 'error');
      return;
    }

    setIsSimulating(true);
    setShowSimulation(true);
    setSimulationLogs([]);

    try {
      const logs = await simulateWorkflow(nodes, edges);
      setSimulationLogs(logs);
      showToast(`Simulation complete — ${logs.length} steps`, 'success');
    } catch {
      showToast('Simulation failed', 'error');
    } finally {
      setIsSimulating(false);
    }
  };

  // ── Export ──
  const handleExport = () => {
    const workflow = serializeWorkflow(nodes, edges, workflowName);
    downloadWorkflowJSON(workflow);
    showToast('Workflow exported!', 'success');
  };

  // ── Import ──
  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const workflow = await importWorkflowJSON(file);
      loadWorkflow(workflow.nodes, workflow.edges, workflow.name);
      showToast(`Imported "${workflow.name}"`, 'success');
    } catch {
      showToast('Invalid workflow file', 'error');
    }

    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <header className="toolbar">
      <div className="toolbar-left">
        <input
          type="text"
          className="toolbar-name-input"
          value={workflowName}
          onChange={(e) => setWorkflowName(e.target.value)}
          placeholder="Workflow name..."
        />
        <span className="toolbar-node-count">
          {nodes.length} node{nodes.length !== 1 ? 's' : ''} · {edges.length} edge{edges.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="toolbar-actions">
        <button
          className="toolbar-btn toolbar-btn-secondary"
          onClick={handleValidate}
          title="Validate workflow"
        >
          {validationResult?.isValid === false ? (
            <AlertTriangle size={16} className="text-amber-500" />
          ) : (
            <CheckCircle size={16} />
          )}
          <span>Validate</span>
        </button>

        <button
          className="toolbar-btn toolbar-btn-primary"
          onClick={handleSimulate}
          disabled={isSimulating}
          title="Run workflow simulation"
        >
          {isSimulating ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <PlayCircle size={16} />
          )}
          <span>{isSimulating ? 'Running...' : 'Run Workflow'}</span>
        </button>

        <div className="toolbar-divider" />

        <button
          className="toolbar-btn toolbar-btn-ghost"
          onClick={handleExport}
          title="Export as JSON"
          disabled={nodes.length === 0}
        >
          <Download size={16} />
          <span>Export</span>
        </button>

        <button
          className="toolbar-btn toolbar-btn-ghost"
          onClick={() => fileInputRef.current?.click()}
          title="Import from JSON"
        >
          <Upload size={16} />
          <span>Import</span>
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImport}
          className="hidden"
        />

        <div className="toolbar-divider" />

        <button
          className="toolbar-btn toolbar-btn-danger"
          onClick={clearWorkflow}
          title="Clear canvas"
          disabled={nodes.length === 0}
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className={`toolbar-toast toast-${toast.type}`}>
          {toast.type === 'success' && <CheckCircle size={16} />}
          {toast.type === 'error' && <AlertTriangle size={16} />}
          {toast.type === 'warning' && <AlertTriangle size={16} />}
          <span>{toast.message}</span>
        </div>
      )}
    </header>
  );
}
