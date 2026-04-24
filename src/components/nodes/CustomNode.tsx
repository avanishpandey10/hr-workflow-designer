// src/components/nodes/CustomNode.tsx - Complete working version
import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { useWorkflowStore } from '../../store/workflowStore';
import { NodeFormModal } from '../forms/NodeFormModal';

interface CustomNodeProps {
  id: string;
  data: any;
  selected: boolean;
}

export const CustomNode: React.FC<CustomNodeProps> = ({ id, data, selected }) => {
  const [showForm, setShowForm] = useState(false);
  const { setSelectedNodeId, updateNodeData } = useWorkflowStore();

  const handleNodeClick = () => {
    setSelectedNodeId(id);
    setShowForm(true);
  };

  const getNodeColor = (): string => {
    switch (data.type) {
      case 'start': return '#10b981';
      case 'task': return '#3b82f6';
      case 'approval': return '#f59e0b';
      case 'automated': return '#8b5cf6';
      case 'end': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* IMPORTANT: Handle must be directly in the node component with proper props */}
      <Handle
        type="target"
        position={Position.Top}
        id="target-handle"
        style={{
          background: '#ffffff',
          border: `2px solid ${getNodeColor()}`,
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          cursor: 'crosshair',
          top: '-6px',
        }}
        isConnectable={true}
      />
      
      {/* Node Body */}
      <div
        onClick={handleNodeClick}
        style={{
          padding: '12px 16px',
          borderRadius: '8px',
          border: `2px solid ${selected ? getNodeColor() : '#d1d5db'}`,
          backgroundColor: selected ? `${getNodeColor()}10` : 'white',
          boxShadow: selected ? `0 0 0 2px ${getNodeColor()}20` : '0 2px 4px rgba(0,0,0,0.1)',
          cursor: 'pointer',
          minWidth: '180px',
          transition: 'all 0.2s'
        }}
      >
        <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{data.title || 'Node'}</div>
        {data.type === 'task' && data.assignee && (
          <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>👤 {data.assignee}</div>
        )}
        {data.type === 'task' && data.dueDate && (
          <div style={{ fontSize: '10px', color: '#ef4444', marginTop: '2px' }}>📅 Due: {data.dueDate}</div>
        )}
        {data.type === 'approval' && data.approverRole && (
          <div style={{ fontSize: '11px', color: '#d97706', marginTop: '4px' }}>👥 Approver: {data.approverRole}</div>
        )}
        {data.type === 'automated' && data.actionLabel && (
          <div style={{ fontSize: '11px', color: '#8b5cf6', marginTop: '4px' }}>⚡ Action: {data.actionLabel}</div>
        )}
        {data.type === 'end' && data.endMessage && (
          <div style={{ fontSize: '10px', color: '#6b7280', marginTop: '4px' }}>💬 {data.endMessage}</div>
        )}
        <div style={{ fontSize: '10px', color: '#9ca3af', marginTop: '8px', textTransform: 'capitalize' }}>
          {data.type}
        </div>
      </div>
      
      {/* Bottom Handle - Output */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="source-handle"
        style={{
          background: '#ffffff',
          border: `2px solid ${getNodeColor()}`,
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          cursor: 'crosshair',
          bottom: '-6px',
        }}
        isConnectable={true}
      />
      
      <NodeFormModal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        nodeId={id}
        nodeData={data}
        onUpdate={(newData) => updateNodeData(id, newData)}
      />
    </div>
  );
};