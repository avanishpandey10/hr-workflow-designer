// src/utils/constants.ts

// Node types
export const NODE_TYPES = {
  START: 'start',
  TASK: 'task',
  APPROVAL: 'approval',
  AUTOMATED: 'automated',
  END: 'end',
} as const;

// Node type labels
export const NODE_LABELS = {
  [NODE_TYPES.START]: 'Start Node',
  [NODE_TYPES.TASK]: 'Task Node',
  [NODE_TYPES.APPROVAL]: 'Approval Node',
  [NODE_TYPES.AUTOMATED]: 'Automated Step',
  [NODE_TYPES.END]: 'End Node',
} as const;

// Node type icons
export const NODE_ICONS = {
  [NODE_TYPES.START]: '🚀',
  [NODE_TYPES.TASK]: '📋',
  [NODE_TYPES.APPROVAL]: '✅',
  [NODE_TYPES.AUTOMATED]: '⚡',
  [NODE_TYPES.END]: '🏁',
} as const;

// Node type colors
export const NODE_COLORS = {
  [NODE_TYPES.START]: '#10b981',
  [NODE_TYPES.TASK]: '#3b82f6',
  [NODE_TYPES.APPROVAL]: '#f59e0b',
  [NODE_TYPES.AUTOMATED]: '#8b5cf6',
  [NODE_TYPES.END]: '#ef4444',
} as const;

// Node type descriptions
export const NODE_DESCRIPTIONS = {
  [NODE_TYPES.START]: 'Workflow entry point',
  [NODE_TYPES.TASK]: 'Human actionable task',
  [NODE_TYPES.APPROVAL]: 'Manager or HR approval step',
  [NODE_TYPES.AUTOMATED]: 'System-triggered action',
  [NODE_TYPES.END]: 'Workflow completion',
} as const;

// Default node data
export const DEFAULT_NODE_DATA = {
  [NODE_TYPES.START]: { title: 'Workflow Start', type: NODE_TYPES.START, metadata: {} },
  [NODE_TYPES.TASK]: { title: 'New Task', description: '', assignee: '', dueDate: '', type: NODE_TYPES.TASK, customFields: {} },
  [NODE_TYPES.APPROVAL]: { title: 'Approval Required', approverRole: 'Manager', autoApproveThreshold: 1, type: NODE_TYPES.APPROVAL },
  [NODE_TYPES.AUTOMATED]: { title: 'Automated Action', actionId: '', actionLabel: '', parameters: {}, type: NODE_TYPES.AUTOMATED },
  [NODE_TYPES.END]: { title: 'Workflow End', endMessage: 'Workflow completed successfully', showSummary: true, type: NODE_TYPES.END },
} as const;

// Available actions for automated nodes
export const AUTOMATION_ACTIONS = [
  { id: 'send_email', label: 'Send Email', params: ['to', 'subject', 'body'] },
  { id: 'generate_doc', label: 'Generate Document', params: ['template', 'recipient', 'format'] },
  { id: 'create_ticket', label: 'Create Support Ticket', params: ['priority', 'department'] },
  { id: 'slack_notification', label: 'Send Slack Notification', params: ['channel', 'message'] },
  { id: 'webhook_call', label: 'Call Webhook', params: ['url', 'method', 'payload'] },
] as const;

// Approver roles
export const APPROVER_ROLES = ['Manager', 'HRBP', 'Director'] as const;

// Keyboard shortcuts
export const KEYBOARD_SHORTCUTS = {
  DELETE: 'Delete',
  UNDO: 'Ctrl+Z',
  REDO: 'Ctrl+Y',
  SAVE: 'Ctrl+S',
  ZOOM_IN: 'Ctrl++',
  ZOOM_OUT: 'Ctrl+-',
} as const;

// API endpoints
export const API_ENDPOINTS = {
  GET_AUTOMATIONS: '/automations',
  POST_SIMULATE: '/simulate',
  POST_VALIDATE: '/validate',
  POST_EXECUTE: '/execute',
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  WORKFLOW_STORAGE: 'workflow-storage',
  USER_PREFERENCES: 'user-preferences',
} as const;

// Default workflow
export const DEFAULT_WORKFLOW = {
  nodes: [],
  edges: [],
};