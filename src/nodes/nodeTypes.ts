/**
 * Node Type Registry
 * 
 * Maps node type strings to their React components.
 * This object is passed to React Flow's nodeTypes prop.
 * 
 * IMPORTANT: This must be defined outside of component render
 * to prevent React Flow from re-mounting nodes on every render.
 */

import type { NodeTypes } from '@xyflow/react';
import { StartNode } from './StartNode';
import { TaskNode } from './TaskNode';
import { ApprovalNode } from './ApprovalNode';
import { AutomatedStepNode } from './AutomatedStepNode';
import { EndNode } from './EndNode';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const nodeTypes: NodeTypes = {
  start: StartNode as any,
  task: TaskNode as any,
  approval: ApprovalNode as any,
  automated: AutomatedStepNode as any,
  end: EndNode as any,
};
