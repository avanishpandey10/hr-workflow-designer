// src/types/workflow.ts

export type NodeType = 'start' | 'task' | 'approval' | 'automated' | 'end';

export interface Position {
  x: number;
  y: number;
}

// Base interface for all nodes
export interface BaseNodeData {
  id?: string;
  title: string;
  type: NodeType;
  onUpdate?: (data: any) => void;
}

// Start Node
export interface StartNodeData extends BaseNodeData {
  type: 'start';
  metadata?: Record<string, any>;
}

// Task Node
export interface TaskNodeData extends BaseNodeData {
  type: 'task';
  description: string;
  assignee: string;
  dueDate: string;
  customFields?: Record<string, string>;
}

// Approval Node
export interface ApprovalNodeData extends BaseNodeData {
  type: 'approval';
  approverRole: 'Manager' | 'HRBP' | 'Director';
  autoApproveThreshold: number;
}

// Automated Node
export interface AutomatedNodeData extends BaseNodeData {
  type: 'automated';
  actionId: string;
  actionLabel: string;
  parameters: Record<string, any>;
}

// End Node
export interface EndNodeData extends BaseNodeData {
  type: 'end';
  endMessage: string;
  showSummary: boolean;
}

export type WorkflowNodeData = 
  | StartNodeData 
  | TaskNodeData 
  | ApprovalNodeData 
  | AutomatedNodeData 
  | EndNodeData;

export interface WorkflowNode {
  id: string;
  type: NodeType;
  position: Position;
  data: WorkflowNodeData;
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  animated?: boolean;
}

export interface AutomationAction {
  id: string;
  label: string;
  params: string[];
  description: string;
}

export interface SimulationStep {
  step: number;
  nodeId: string;
  nodeType: string;
  nodeTitle: string;
  status: 'pending' | 'executing' | 'completed' | 'failed';
  message: string;
  timestamp: Date;
}

export interface SimulationResult {
  success: boolean;
  steps: SimulationStep[];
  errors?: string[];
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}