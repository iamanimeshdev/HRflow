/**
 * useValidation Hook
 * 
 * Wraps the pure validation utility with store integration.
 * Applies validation results as visual error indicators on nodes.
 */

import { useCallback } from 'react';
import { useWorkflowStore } from './useWorkflowStore';
import { validateWorkflow } from '../utils/validation';
import type { ValidationResult } from '../types/workflow';

export function useValidation() {
  const nodes = useWorkflowStore((s) => s.nodes);
  const edges = useWorkflowStore((s) => s.edges);
  const applyValidationErrors = useWorkflowStore((s) => s.applyValidationErrors);
  const clearValidationErrors = useWorkflowStore((s) => s.clearValidationErrors);
  const validationResult = useWorkflowStore((s) => s.validationResult);

  const validate = useCallback((): ValidationResult => {
    const result = validateWorkflow(nodes, edges);
    applyValidationErrors(result);
    return result;
  }, [nodes, edges, applyValidationErrors]);

  const clearErrors = useCallback(() => {
    clearValidationErrors();
  }, [clearValidationErrors]);

  return {
    validate,
    clearErrors,
    validationResult,
    isValid: validationResult?.isValid ?? null,
  };
}
