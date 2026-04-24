// src/services/api.ts - Fixed version (no external type imports)

// Types defined locally
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
  status: string;
  message: string;
  timestamp: Date;
}

export interface SimulationResult {
  success: boolean;
  steps: SimulationStep[];
  errors?: string[];
}

interface WorkflowNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: any;
}

interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  animated?: boolean;
}

// Mock automation actions
const mockAutomations: AutomationAction[] = [
  { 
    id: 'send_email', 
    label: 'Send Email', 
    params: ['to', 'subject', 'body'], 
    description: 'Send an email notification to specified recipient' 
  },
  { 
    id: 'generate_doc', 
    label: 'Generate Document', 
    params: ['template', 'recipient', 'format'], 
    description: 'Generate a PDF or DOCX document from template' 
  },
  { 
    id: 'create_ticket', 
    label: 'Create Support Ticket', 
    params: ['priority', 'department', 'description'], 
    description: 'Create a ticket in support system' 
  },
  { 
    id: 'slack_notification', 
    label: 'Send Slack Notification', 
    params: ['channel', 'message'], 
    description: 'Send a message to Slack channel' 
  },
  { 
    id: 'webhook_call', 
    label: 'Call Webhook', 
    params: ['url', 'method', 'payload'], 
    description: 'Make an HTTP request to external service' 
  },
];

// Mock API service
export const mockApi = {
  // GET /automations - Returns all mock automation actions
  getAutomations: async (): Promise<AutomationAction[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...mockAutomations]);
      }, 500);
    });
  },

  // GET /automations/:id - Get specific action by ID
  getActionById: (actionId: string): AutomationAction | undefined => {
    return mockAutomations.find(a => a.id === actionId);
  },

  // POST /simulate - Simulates workflow execution
  simulateWorkflow: async (workflow: { nodes: WorkflowNode[]; edges: WorkflowEdge[] }): Promise<SimulationResult> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Find start node
        const startNode = workflow.nodes.find(n => n.data?.type === 'start');
        if (!startNode) {
          resolve({
            success: false,
            steps: [],
            errors: ['No start node found in workflow']
          });
          return;
        }

        // Build step-by-step execution log
        const steps: SimulationStep[] = [];
        let stepCount = 0;
        
        // Simple linear execution based on node order
        for (const node of workflow.nodes) {
          stepCount++;
          const nodeData = node.data;
          let message = '';
          
          // Generate step message based on node type
          switch (nodeData?.type) {
            case 'start':
              message = `Workflow "${nodeData.title || 'Start'}" initiated successfully`;
              break;
            case 'task':
              message = `Task "${nodeData.title || 'Task'}" assigned to ${nodeData.assignee || 'pending'}`;
              if (nodeData.dueDate) message += ` (Due: ${nodeData.dueDate})`;
              break;
            case 'approval':
              message = `Approval request sent to ${nodeData.approverRole || 'Manager'}`;
              break;
            case 'automated':
              message = `Executed automation: ${nodeData.actionLabel || 'Unknown action'}`;
              break;
            case 'end':
              message = nodeData.endMessage || 'Workflow completed successfully';
              break;
            default:
              message = `Executed ${nodeData?.type || 'unknown'} node: ${nodeData?.title || 'Node'}`;
          }
          
          steps.push({
            step: stepCount,
            nodeId: node.id,
            nodeType: nodeData?.type || 'unknown',
            nodeTitle: nodeData?.title || 'Untitled',
            status: 'completed',
            message: message,
            timestamp: new Date()
          });
          
          if (nodeData?.type === 'end') break;
        }
        
        resolve({
          success: true,
          steps,
          errors: undefined
        });
      }, 1000);
    });
  },

  // POST /execute - Executes a specific automation action
  executeAction: async (actionId: string, parameters: Record<string, any>): Promise<{ success: boolean; message: string; data?: any }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const action = mockAutomations.find(a => a.id === actionId);
        
        if (!action) {
          resolve({
            success: false,
            message: `Action ${actionId} not found`
          });
          return;
        }
        
        resolve({
          success: true,
          message: `${action.label} executed successfully`,
          data: {
            executedAt: new Date().toISOString(),
            actionId: actionId,
            parameters: parameters,
            result: `Mock execution of ${action.label} completed`
          }
        });
      }, 1000);
    });
  },

  // POST /validate - Validates workflow structure
  validateWorkflow: async (nodes: WorkflowNode[], edges: WorkflowEdge[]): Promise<{ valid: boolean; errors: string[]; warnings: string[] }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const errors: string[] = [];
        const warnings: string[] = [];
        
        // Check for start node
        const hasStart = nodes.some(n => n.data?.type === 'start');
        if (!hasStart) errors.push('Workflow must have a Start node');
        
        // Check for end node
        const hasEnd = nodes.some(n => n.data?.type === 'end');
        if (!hasEnd) errors.push('Workflow must have an End node');
        
        // Check for disconnected nodes
        const connectedNodeIds = new Set<string>();
        edges.forEach(edge => {
          connectedNodeIds.add(edge.source);
          connectedNodeIds.add(edge.target);
        });
        
        const disconnectedNodes = nodes.filter(n => !connectedNodeIds.has(n.id) && n.data?.type !== 'start');
        if (disconnectedNodes.length > 0) {
          warnings.push(`${disconnectedNodes.length} node(s) are disconnected from the workflow`);
        }
        
        // Check for empty workflow
        if (nodes.length === 0) {
          errors.push('Workflow is empty');
        }
        
        resolve({ 
          valid: errors.length === 0, 
          errors, 
          warnings 
        });
      }, 500);
    });
  }
};