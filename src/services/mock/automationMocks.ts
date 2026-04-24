// src/services/mock/automationMocks.ts
export interface AutomationAction {
  id: string;
  label: string;
  params: string[];
  description: string;
  category?: string;
}

export const automationActions: AutomationAction[] = [
  {
    id: 'send_email',
    label: 'Send Email',
    params: ['to', 'subject', 'body'],
    description: 'Send an email notification',
    category: 'communication'
  },
  {
    id: 'generate_doc',
    label: 'Generate Document',
    params: ['template', 'recipient', 'format'],
    description: 'Generate a PDF document',
    category: 'document'
  },
  {
    id: 'create_ticket',
    label: 'Create Ticket',
    params: ['priority', 'department', 'description'],
    description: 'Create a support ticket',
    category: 'support'
  },
  {
    id: 'slack_notification',
    label: 'Slack Notification',
    params: ['channel', 'message'],
    description: 'Send a Slack message',
    category: 'communication'
  },
  {
    id: 'webhook_call',
    label: 'Webhook Call',
    params: ['url', 'method', 'payload'],
    description: 'Call an external webhook',
    category: 'integration'
  },
  {
    id: 'update_database',
    label: 'Update Database',
    params: ['table', 'record_id', 'data'],
    description: 'Update database records',
    category: 'data'
  },
  {
    id: 'schedule_meeting',
    label: 'Schedule Meeting',
    params: ['calendar', 'attendees', 'duration', 'title'],
    description: 'Schedule a calendar meeting',
    category: 'calendar'
  }
];

export const getAutomationsByCategory = (category: string): AutomationAction[] => {
  return automationActions.filter(a => a.category === category);
};

export const getActionById = (id: string): AutomationAction | undefined => {
  return automationActions.find(a => a.id === id);
};