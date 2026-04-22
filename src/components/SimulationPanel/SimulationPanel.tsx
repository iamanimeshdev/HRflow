/**
 * Simulation Panel — Step-by-step execution log display.
 * 
 * Shows after running "Run Workflow" in the toolbar.
 * Displays each step with status icons, messages, and timestamps.
 * Animates entries for a polished feel.
 */

import { X, CheckCircle, AlertTriangle, XCircle, Clock, Loader2 } from 'lucide-react';
import { useWorkflowStore } from '../../hooks/useWorkflowStore';
import type { SimulationLog } from '../../types/workflow';

const STATUS_CONFIG: Record<SimulationLog['status'], {
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  label: string;
}> = {
  success: {
    icon: <CheckCircle size={16} />,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    label: 'Success',
  },
  warning: {
    icon: <AlertTriangle size={16} />,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    label: 'Warning',
  },
  error: {
    icon: <XCircle size={16} />,
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
    label: 'Error',
  },
  running: {
    icon: <Loader2 size={16} className="animate-spin" />,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    label: 'Running',
  },
  pending: {
    icon: <Clock size={16} />,
    color: 'text-slate-400',
    bgColor: 'bg-slate-500/10',
    label: 'Pending',
  },
};

const NODE_TYPE_COLORS: Record<string, string> = {
  start: 'border-l-emerald-500',
  task: 'border-l-blue-500',
  approval: 'border-l-amber-500',
  automated: 'border-l-purple-500',
  end: 'border-l-rose-500',
};

export function SimulationPanel() {
  const simulationLogs = useWorkflowStore((s) => s.simulationLogs);
  const isSimulating = useWorkflowStore((s) => s.isSimulating);
  const showSimulation = useWorkflowStore((s) => s.showSimulation);
  const setShowSimulation = useWorkflowStore((s) => s.setShowSimulation);

  if (!showSimulation) return null;

  return (
    <div className="simulation-panel">
      {/* Header */}
      <div className="simulation-header">
        <div className="simulation-header-left">
          <h3 className="simulation-title">
            {isSimulating ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Running Simulation...
              </>
            ) : (
              <>Simulation Results</>
            )}
          </h3>
          {!isSimulating && simulationLogs.length > 0 && (
            <span className="simulation-count">
              {simulationLogs.length} step{simulationLogs.length !== 1 ? 's' : ''} completed
            </span>
          )}
        </div>
        <button
          className="simulation-close"
          onClick={() => setShowSimulation(false)}
          title="Close panel"
        >
          <X size={16} />
        </button>
      </div>

      {/* Logs */}
      <div className="simulation-body">
        {simulationLogs.length === 0 && !isSimulating && (
          <div className="simulation-empty">No simulation logs yet.</div>
        )}
        {simulationLogs.map((log, index) => {
          const config = STATUS_CONFIG[log.status];
          const borderColor = NODE_TYPE_COLORS[log.nodeType] || 'border-l-slate-500';

          return (
            <div
              key={`${log.nodeId}-${index}`}
              className={`simulation-log-entry border-l-3 ${borderColor} ${config.bgColor}`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="log-step-number">
                <span className="step-badge">{log.stepIndex + 1}</span>
              </div>
              <div className="log-content">
                <div className="log-header">
                  <span className="log-title">{log.nodeTitle}</span>
                  <span className={`log-status ${config.color}`}>
                    {config.icon}
                    <span>{config.label}</span>
                  </span>
                </div>
                <p className="log-message">{log.message}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
