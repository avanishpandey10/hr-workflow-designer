// src/utils/helpers.ts
import { WorkflowNode, WorkflowEdge } from '../store/workflowStore';

// Generate unique ID
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Format date for display
export const formatDate = (date: string): string => {
  if (!date) return 'Not set';
  return new Date(date).toLocaleDateString();
};

// Validate email format
export const isValidEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Deep clone an object
export const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

// Find node by ID
export const findNodeById = (nodes: WorkflowNode[], id: string): WorkflowNode | undefined => {
  return nodes.find(node => node.id === id);
};

// Find edge between two nodes
export const findEdgeBetween = (edges: WorkflowEdge[], sourceId: string, targetId: string): WorkflowEdge | undefined => {
  return edges.find(edge => edge.source === sourceId && edge.target === targetId);
};

// Get nodes connected to a specific node
export const getConnectedNodes = (nodes: WorkflowNode[], edges: WorkflowEdge[], nodeId: string): WorkflowNode[] => {
  const connectedIds = new Set<string>();
  edges.forEach(edge => {
    if (edge.source === nodeId) connectedIds.add(edge.target);
    if (edge.target === nodeId) connectedIds.add(edge.source);
  });
  return nodes.filter(node => connectedIds.has(node.id));
};

// Validate workflow structure
export const validateWorkflowStructure = (nodes: WorkflowNode[], edges: WorkflowEdge[]): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // Check for start node
  const hasStart = nodes.some(n => n.data.type === 'start');
  if (!hasStart) errors.push('Missing Start node');
  
  // Check for end node
  const hasEnd = nodes.some(n => n.data.type === 'end');
  if (!hasEnd) errors.push('Missing End node');
  
  // Check for disconnected nodes
  const connectedNodes = new Set<string>();
  edges.forEach(edge => {
    connectedNodes.add(edge.source);
    connectedNodes.add(edge.target);
  });
  
  const disconnectedNodes = nodes.filter(n => !connectedNodes.has(n.id) && n.data.type !== 'start');
  if (disconnectedNodes.length > 0) {
    errors.push(`${disconnectedNodes.length} node(s) are disconnected`);
  }
  
  return { valid: errors.length === 0, errors };
};

// Get node type color
export const getNodeTypeColor = (type: string): string => {
  switch (type) {
    case 'start': return '#10b981';
    case 'task': return '#3b82f6';
    case 'approval': return '#f59e0b';
    case 'automated': return '#8b5cf6';
    case 'end': return '#ef4444';
    default: return '#6b7280';
  }
};

// Get node type icon
export const getNodeTypeIcon = (type: string): string => {
  switch (type) {
    case 'start': return '🚀';
    case 'task': return '📋';
    case 'approval': return '✅';
    case 'automated': return '⚡';
    case 'end': return '🏁';
    default: return '📦';
  }
};

// Truncate text
export const truncateText = (text: string, maxLength: number = 50): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Download JSON file
export const downloadJSON = (data: any, filename: string): void => {
  const dataStr = JSON.stringify(data, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', filename);
  linkElement.click();
};

// Read JSON file
export const readJSONFile = (file: File): Promise<any> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        resolve(data);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
};

// Debounce function for performance
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

// Check if object is empty
export const isEmpty = (obj: object): boolean => {
  return Object.keys(obj).length === 0;
};

// Capitalize first letter
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};