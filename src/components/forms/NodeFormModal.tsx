// src/components/forms/NodeFormModal.tsx - Fixed version
import React, { useState, useEffect } from 'react';
import { mockApi } from '../../services/api';

// Local type definitions
interface AutomationAction {
  id: string;
  label: string;
  params: string[];
  description: string;
}

interface NodeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodeId: string;
  nodeData: any;
  onUpdate: (data: any) => void;
}

export const NodeFormModal: React.FC<NodeFormModalProps> = ({
  isOpen,
  onClose,
  nodeData,
  onUpdate
}) => {
  const [actions, setActions] = useState<AutomationAction[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (nodeData.type === 'automated') {
      loadActions();
    }
  }, [nodeData.type]);

  const loadActions = async () => {
    setLoading(true);
    try {
      const fetchedActions = await mockApi.getAutomations();
      setActions(fetchedActions);
    } catch (error) {
      console.error('Failed to load actions:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateField = (name: string, value: any): string => {
    if (name === 'title' && !value) return 'Title is required';
    if (nodeData.type === 'task') {
      if (name === 'assignee' && !value) return 'Assignee is required';
      if (name === 'dueDate' && !value) return 'Due date is required';
    }
    if (nodeData.type === 'approval') {
      if (name === 'approverRole' && !value) return 'Approver role is required';
    }
    if (nodeData.type === 'automated') {
      if (name === 'actionId' && !value) return 'Action is required';
    }
    return '';
  };

  const handleFieldChange = (field: string, value: any) => {
    const error = validateField(field, value);
    setErrors(prev => ({ ...prev, [field]: error }));
    onUpdate({ [field]: value });
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '24px',
        width: '500px',
        maxWidth: '90%',
        maxHeight: '80vh',
        overflow: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>Edit {nodeData.type} Node</h2>
          <button onClick={onClose} style={{ fontSize: '24px', cursor: 'pointer', background: 'none', border: 'none' }}>×</button>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>Title *</label>
          <input
            type="text"
            value={nodeData.title || ''}
            onChange={(e) => handleFieldChange('title', e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: `1px solid ${errors.title ? '#ef4444' : '#d1d5db'}`,
              borderRadius: '6px'
            }}
          />
          {errors.title && <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.title}</div>}
        </div>

        {nodeData.type === 'task' && (
          <>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>Description</label>
              <textarea
                value={nodeData.description || ''}
                onChange={(e) => handleFieldChange('description', e.target.value)}
                rows={3}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px' }}
              />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>Assignee *</label>
              <input
                type="text"
                value={nodeData.assignee || ''}
                onChange={(e) => handleFieldChange('assignee', e.target.value)}
                placeholder="hr@company.com"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: `1px solid ${errors.assignee ? '#ef4444' : '#d1d5db'}`,
                  borderRadius: '6px'
                }}
              />
              {errors.assignee && <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.assignee}</div>}
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>Due Date *</label>
              <input
                type="date"
                value={nodeData.dueDate || ''}
                onChange={(e) => handleFieldChange('dueDate', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: `1px solid ${errors.dueDate ? '#ef4444' : '#d1d5db'}`,
                  borderRadius: '6px'
                }}
              />
              {errors.dueDate && <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.dueDate}</div>}
            </div>
          </>
        )}

        {nodeData.type === 'approval' && (
          <>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>Approver Role *</label>
              <select
                value={nodeData.approverRole || 'Manager'}
                onChange={(e) => handleFieldChange('approverRole', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: `1px solid ${errors.approverRole ? '#ef4444' : '#d1d5db'}`,
                  borderRadius: '6px'
                }}
              >
                <option value="Manager">Manager</option>
                <option value="HRBP">HRBP</option>
                <option value="Director">Director</option>
              </select>
              {errors.approverRole && <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.approverRole}</div>}
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>Auto-approve Threshold</label>
              <input
                type="number"
                value={nodeData.autoApproveThreshold || 1}
                onChange={(e) => handleFieldChange('autoApproveThreshold', parseInt(e.target.value))}
                min="0"
                max="10"
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px' }}
              />
            </div>
          </>
        )}

        {nodeData.type === 'automated' && (
          <>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>Action *</label>
              <select
                value={nodeData.actionId || ''}
                onChange={(e) => {
                  const selectedAction = actions.find(a => a.id === e.target.value);
                  if (selectedAction) {
                    handleFieldChange('actionId', selectedAction.id);
                    handleFieldChange('actionLabel', selectedAction.label);
                    const initialParams: Record<string, any> = {};
                    selectedAction.params.forEach(param => { initialParams[param] = ''; });
                    handleFieldChange('parameters', initialParams);
                  }
                }}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: `1px solid ${errors.actionId ? '#ef4444' : '#d1d5db'}`,
                  borderRadius: '6px'
                }}
                disabled={loading}
              >
                <option value="">{loading ? 'Loading...' : 'Select an action...'}</option>
                {actions.map(action => (
                  <option key={action.id} value={action.id}>{action.label}</option>
                ))}
              </select>
              {errors.actionId && <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.actionId}</div>}
            </div>
            {nodeData.parameters && Object.entries(nodeData.parameters).map(([key, value]) => (
              <div key={key} style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500', textTransform: 'capitalize' }}>{key}</label>
                <input
                  type="text"
                  value={value as string}
                  onChange={(e) => handleFieldChange('parameters', { ...nodeData.parameters, [key]: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px' }}
                />
              </div>
            ))}
          </>
        )}

        {nodeData.type === 'end' && (
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>End Message</label>
            <textarea
              value={nodeData.endMessage || ''}
              onChange={(e) => handleFieldChange('endMessage', e.target.value)}
              rows={2}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px' }}
            />
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
          <button
            onClick={onClose}
            style={{ flex: 1, padding: '10px', backgroundColor: '#f3f4f6', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              // Check if there are any errors
              const hasErrors = Object.values(errors).some(e => e);
              if (!hasErrors) {
                onClose();
              } else {
                alert('Please fix the errors before saving');
              }
            }}
            style={{ flex: 1, padding: '10px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};