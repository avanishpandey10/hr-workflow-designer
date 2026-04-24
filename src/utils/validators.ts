// src/utils/validators.ts
import { WorkflowNode, WorkflowEdge } from '../store/workflowStore';

// Validate task node data
export const validateTaskNode = (data: any): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!data.title || data.title.trim() === '') {
    errors.push('Title is required');
  }
  if (!data.assignee || data.assignee.trim() === '') {
    errors.push('Assignee is required');
  }
  if (!data.dueDate) {
    errors.push('Due date is required');
  }
  
  return { valid: errors.length === 0, errors };
};

// Validate approval node data
export const validateApprovalNode = (data: any): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!data.title || data.title.trim() === '') {
    errors.push('Title is required');
  }
  if (!data.approverRole) {
    errors.push('Approver role is required');
  }
  if (data.autoApproveThreshold < 0 || data.autoApproveThreshold > 10) {
    errors.push('Auto-approve threshold must be between 0 and 10');
  }
  
  return { valid: errors.length === 0, errors };
};

// Validate automated node data
export const validateAutomatedNode = (data: any): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!data.title || data.title.trim() === '') {
    errors.push('Title is required');
  }
  if (!data.actionId) {
    errors.push('Action is required');
  }
  
  return { valid: errors.length === 0, errors };
};

// Validate end node data
export const validateEndNode = (data: any): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!data.title || data.title.trim() === '') {
    errors.push('Title is required');
  }
  
  return { valid: errors.length === 0, errors };
};

// Validate start node data
export const validateStartNode = (data: any): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!data.title || data.title.trim() === '') {
    errors.push('Title is required');
  }
  
  return { valid: errors.length === 0, errors };
};

// Validate entire workflow
export const validateWorkflow = (nodes: WorkflowNode[], edges: WorkflowEdge[]): { valid: boolean; errors: string[]; warnings: string[] } => {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Check for empty workflow
  if (nodes.length === 0) {
    errors.push('Workflow is empty');
    return { valid: false, errors, warnings };
  }
  
  // Check for start node
  const hasStart = nodes.some(n => n.data.type === 'start');
  if (!hasStart) errors.push('Start node is missing');
  
  // Check for end node
  const hasEnd = nodes.some(n => n.data.type === 'end');
  if (!hasEnd) errors.push('End node is missing');
  
  // Check for connections
  if (edges.length === 0 && nodes.length > 1) {
    errors.push('No connections found between nodes');
  }
  
  // Check for disconnected nodes
  const connectedNodes = new Set<string>();
  edges.forEach(edge => {
    connectedNodes.add(edge.source);
    connectedNodes.add(edge.target);
  });
  
  const disconnectedNodes = nodes.filter(n => !connectedNodes.has(n.id) && n.data.type !== 'start');
  if (disconnectedNodes.length > 0) {
    warnings.push(`${disconnectedNodes.length} node(s) are not connected to the workflow`);
  }
  
  // Validate each node's data
  nodes.forEach(node => {
    const nodeData = node.data;
    
    switch (nodeData.type) {
      case 'task':
        const taskValidation = validateTaskNode(nodeData);
        if (!taskValidation.valid) {
          warnings.push(`Task "${nodeData.title}": ${taskValidation.errors.join(', ')}`);
        }
        break;
      case 'approval':
        const approvalValidation = validateApprovalNode(nodeData);
        if (!approvalValidation.valid) {
          warnings.push(`Approval "${nodeData.title}": ${approvalValidation.errors.join(', ')}`);
        }
        break;
      case 'automated':
        const autoValidation = validateAutomatedNode(nodeData);
        if (!autoValidation.valid) {
          warnings.push(`Automated step "${nodeData.title}": ${autoValidation.errors.join(', ')}`);
        }
        break;
    }
  });
  
  return { valid: errors.length === 0, errors, warnings };
};