// src/components/sidebar/Sidebar.tsx - With WORKING Quick Templates
import React from 'react';
import { useWorkflowStore } from '../../store/workflowStore';
import { v4 as uuidv4 } from 'uuid';

export const Sidebar: React.FC = () => {
  const { addNode, clearWorkflow, importWorkflow, nodes } = useWorkflowStore();

  const nodeTypes = [
    { type: 'start', label: 'Start Node', emoji: '🚀', desc: 'Workflow entry point' },
    { type: 'task', label: 'Task Node', emoji: '📋', desc: 'Human actionable task' },
    { type: 'approval', label: 'Approval Node', emoji: '✅', desc: 'Manager/HR approval' },
    { type: 'automated', label: 'Automated Step', emoji: '⚡', desc: 'System triggered action' },
    { type: 'end', label: 'End Node', emoji: '🏁', desc: 'Workflow completion' },
  ];

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  // ========== QUICK TEMPLATES - FULLY FUNCTIONAL ==========

  // Template 1: Employee Onboarding
  const loadOnboardingTemplate = () => {
    // Clear existing workflow
    clearWorkflow();
    
    // Create unique IDs for each node
    const startId = uuidv4();
    const taskId = uuidv4();
    const approvalId = uuidv4();
    const autoId = uuidv4();
    const endId = uuidv4();
    
    // Create all nodes with proper positions
    const nodes = [
      { 
        id: startId, 
        type: 'start', 
        position: { x: 100, y: 50 }, 
        data: { 
          title: '🚀 Employee Onboarding Start', 
          type: 'start', 
          metadata: { department: 'HR', priority: 'High' }
        } 
      },
      { 
        id: taskId, 
        type: 'task', 
        position: { x: 100, y: 200 }, 
        data: { 
          title: '📋 Collect Employee Documents', 
          description: 'Gather ID proof, address proof, offer letter, and educational certificates',
          assignee: 'hr_ops@company.com', 
          dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0], 
          type: 'task', 
          customFields: { 'Priority': 'High', 'Department': 'HR' }
        } 
      },
      { 
        id: approvalId, 
        type: 'approval', 
        position: { x: 100, y: 350 }, 
        data: { 
          title: '✅ HR Manager Approval', 
          approverRole: 'Manager', 
          autoApproveThreshold: 1, 
          type: 'approval' 
        } 
      },
      { 
        id: autoId, 
        type: 'automated', 
        position: { x: 100, y: 500 }, 
        data: { 
          title: '⚡ Send Welcome Email', 
          actionId: 'send_email', 
          actionLabel: 'Send Email', 
          parameters: { 
            to: 'newemployee@company.com', 
            subject: 'Welcome to the Team!', 
            body: 'We are excited to have you onboard. Please complete your profile setup.'
          }, 
          type: 'automated' 
        } 
      },
      { 
        id: endId, 
        type: 'end', 
        position: { x: 100, y: 650 }, 
        data: { 
          title: '🏁 Onboarding Complete', 
          endMessage: 'Welcome aboard! Access granted. Please complete your profile.', 
          showSummary: true, 
          type: 'end' 
        } 
      }
    ];
    
    // Create edges connecting all nodes in sequence
    const edges = [
      { id: `e-${startId}-${taskId}`, source: startId, target: taskId, animated: true, style: { stroke: '#3b82f6', strokeWidth: 2 } },
      { id: `e-${taskId}-${approvalId}`, source: taskId, target: approvalId, animated: true, style: { stroke: '#3b82f6', strokeWidth: 2 } },
      { id: `e-${approvalId}-${autoId}`, source: approvalId, target: autoId, animated: true, style: { stroke: '#3b82f6', strokeWidth: 2 } },
      { id: `e-${autoId}-${endId}`, source: autoId, target: endId, animated: true, style: { stroke: '#3b82f6', strokeWidth: 2 } }
    ];
    
    importWorkflow(nodes, edges);
    setTimeout(() => {
      alert('✅ Employee Onboarding template loaded!\n\n5 nodes with 4 connections created.\n\nClick "Test Workflow" to simulate.');
    }, 100);
  };

  // Template 2: Leave Approval
  const loadLeaveApprovalTemplate = () => {
    clearWorkflow();
    
    const startId = uuidv4();
    const taskId = uuidv4();
    const approval1Id = uuidv4();
    const approval2Id = uuidv4();
    const autoId = uuidv4();
    const endId = uuidv4();
    
    const nodes = [
      { 
        id: startId, type: 'start', position: { x: 100, y: 50 }, 
        data: { title: '🚀 Leave Request Submitted', type: 'start', metadata: { leaveType: 'Annual', days: '5' } } 
      },
      { 
        id: taskId, type: 'task', position: { x: 100, y: 200 }, 
        data: { 
          title: '📋 Verify Leave Balance', 
          description: 'Check available leave balance and team coverage',
          assignee: 'hr@company.com', 
          dueDate: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0], 
          type: 'task', 
          customFields: { 'Leave Type': 'Annual', 'Days Requested': '5' }
        } 
      },
      { 
        id: approval1Id, type: 'approval', position: { x: 100, y: 350 }, 
        data: { title: '✅ Department Manager', approverRole: 'Manager', autoApproveThreshold: 1, type: 'approval' } 
      },
      { 
        id: approval2Id, type: 'approval', position: { x: 100, y: 500 }, 
        data: { title: '✅ HR Approval', approverRole: 'HRBP', autoApproveThreshold: 1, type: 'approval' } 
      },
      { 
        id: autoId, type: 'automated', position: { x: 100, y: 650 }, 
        data: { 
          title: '⚡ Update Calendar & Notify', 
          actionId: 'schedule_meeting', 
          actionLabel: 'Schedule Meeting', 
          parameters: { calendar: 'Outlook', attendees: 'team@company.com', duration: '30', title: 'Leave Handover' }, 
          type: 'automated' 
        } 
      },
      { 
        id: endId, type: 'end', position: { x: 100, y: 800 }, 
        data: { title: '🏁 Leave Approved', endMessage: 'Leave request approved and calendar updated.', showSummary: true, type: 'end' } 
      }
    ];
    
    const edges = [
      { id: `e-${startId}-${taskId}`, source: startId, target: taskId, animated: true },
      { id: `e-${taskId}-${approval1Id}`, source: taskId, target: approval1Id, animated: true },
      { id: `e-${approval1Id}-${approval2Id}`, source: approval1Id, target: approval2Id, animated: true },
      { id: `e-${approval2Id}-${autoId}`, source: approval2Id, target: autoId, animated: true },
      { id: `e-${autoId}-${endId}`, source: autoId, target: endId, animated: true }
    ];
    
    importWorkflow(nodes, edges);
    setTimeout(() => {
      alert('✅ Leave Approval template loaded!\n\n6 nodes with 5 connections created.\n\nClick "Test Workflow" to simulate.');
    }, 100);
  };

  // Template 3: Document Verification
  const loadDocumentVerificationTemplate = () => {
    clearWorkflow();
    
    const startId = uuidv4();
    const taskId = uuidv4();
    const approvalId = uuidv4();
    const autoId = uuidv4();
    const endId = uuidv4();
    
    const nodes = [
      { 
        id: startId, type: 'start', position: { x: 100, y: 50 }, 
        data: { title: '🚀 Document Submission Received', type: 'start', metadata: { documentType: 'Identity', source: 'Portal' } } 
      },
      { 
        id: taskId, type: 'task', position: { x: 100, y: 200 }, 
        data: { 
          title: '📋 Initial Document Review', 
          description: 'Verify document authenticity, check for completeness, and validate information',
          assignee: 'verification@company.com', 
          dueDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0], 
          type: 'task', 
          customFields: { 'Document Type': 'Identity', 'Verification Level': 'Standard' }
        } 
      },
      { 
        id: approvalId, type: 'approval', position: { x: 100, y: 350 }, 
        data: { title: '✅ Quality Assurance Check', approverRole: 'Director', autoApproveThreshold: 1, type: 'approval' } 
      },
      { 
        id: autoId, type: 'automated', position: { x: 100, y: 500 }, 
        data: { 
          title: '⚡ Generate Verification Certificate', 
          actionId: 'generate_doc', 
          actionLabel: 'Generate Document', 
          parameters: { template: 'verification_template', recipient: 'user@company.com', format: 'PDF' }, 
          type: 'automated' 
        } 
      },
      { 
        id: endId, type: 'end', position: { x: 100, y: 650 }, 
        data: { title: '🏁 Verification Complete', endMessage: 'Documents verified successfully. Certificate generated.', showSummary: true, type: 'end' } 
      }
    ];
    
    const edges = [
      { id: `e-${startId}-${taskId}`, source: startId, target: taskId, animated: true },
      { id: `e-${taskId}-${approvalId}`, source: taskId, target: approvalId, animated: true },
      { id: `e-${approvalId}-${autoId}`, source: approvalId, target: autoId, animated: true },
      { id: `e-${autoId}-${endId}`, source: autoId, target: endId, animated: true }
    ];
    
    importWorkflow(nodes, edges);
    setTimeout(() => {
      alert('✅ Document Verification template loaded!\n\n5 nodes with 4 connections created.\n\nClick "Test Workflow" to simulate.');
    }, 100);
  };

  return (
    <div style={{ width: '280px', background: 'white', borderRight: '1px solid #e5e7eb', padding: '16px', overflowY: 'auto', height: '100%' }}>
      {/* Node Library Section */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>📦</span> Node Library
        </h2>
        <p style={{ fontSize: '11px', color: '#6b7280', marginBottom: '16px' }}>Drag to canvas</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {nodeTypes.map((node) => (
            <div
              key={node.type}
              draggable
              onDragStart={(e) => onDragStart(e, node.type)}
              style={{ 
                padding: '10px 12px', 
                borderRadius: '8px', 
                border: '1px solid #e5e7eb', 
                background: '#f9fafb', 
                cursor: 'grab',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f3f4f6';
                e.currentTarget.style.transform = 'translateX(4px)';
                e.currentTarget.style.borderColor = '#3b82f6';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f9fafb';
                e.currentTarget.style.transform = 'translateX(0)';
                e.currentTarget.style.borderColor = '#e5e7eb';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '20px' }}>{node.emoji}</span>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '13px' }}>{node.label}</div>
                  <div style={{ fontSize: '10px', color: '#6b7280' }}>{node.desc}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Templates Section - FULLY WORKING */}
      <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '2px solid #e5e7eb' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>📋</span> Quick Templates
        </h3>
        <p style={{ fontSize: '10px', color: '#6b7280', marginBottom: '12px' }}>
          Click to load pre-built workflow
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {/* Template 1: Employee Onboarding */}
          <button 
            onClick={loadOnboardingTemplate}
            style={{ 
              padding: '10px 12px', 
              backgroundColor: '#f0fdf4', 
              border: '1px solid #bbf7d0', 
              borderRadius: '8px', 
              fontSize: '12px', 
              cursor: 'pointer', 
              textAlign: 'left',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
            onMouseEnter={(e) => { 
              e.currentTarget.style.backgroundColor = '#dcfce7'; 
              e.currentTarget.style.transform = 'translateX(4px)';
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={(e) => { 
              e.currentTarget.style.backgroundColor = '#f0fdf4'; 
              e.currentTarget.style.transform = 'translateX(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <span style={{ fontSize: '18px' }}>🎓</span>
            <div>
              <div style={{ fontWeight: '600' }}>Employee Onboarding</div>
              <div style={{ fontSize: '10px', color: '#6b7280' }}>Start → Collect Docs → HR Approval → Email → End</div>
            </div>
          </button>
          
          {/* Template 2: Leave Approval */}
          <button 
            onClick={loadLeaveApprovalTemplate}
            style={{ 
              padding: '10px 12px', 
              backgroundColor: '#fefce8', 
              border: '1px solid #fef08a', 
              borderRadius: '8px', 
              fontSize: '12px', 
              cursor: 'pointer', 
              textAlign: 'left',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
            onMouseEnter={(e) => { 
              e.currentTarget.style.backgroundColor = '#fef08a'; 
              e.currentTarget.style.transform = 'translateX(4px)';
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={(e) => { 
              e.currentTarget.style.backgroundColor = '#fefce8'; 
              e.currentTarget.style.transform = 'translateX(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <span style={{ fontSize: '18px' }}>🏖️</span>
            <div>
              <div style={{ fontWeight: '600' }}>Leave Approval</div>
              <div style={{ fontSize: '10px', color: '#6b7280' }}>Start → Verify → Manager → HR → Calendar → End</div>
            </div>
          </button>
          
          {/* Template 3: Document Verification */}
          <button 
            onClick={loadDocumentVerificationTemplate}
            style={{ 
              padding: '10px 12px', 
              backgroundColor: '#eff6ff', 
              border: '1px solid #bfdbfe', 
              borderRadius: '8px', 
              fontSize: '12px', 
              cursor: 'pointer', 
              textAlign: 'left',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
            onMouseEnter={(e) => { 
              e.currentTarget.style.backgroundColor = '#dbeafe'; 
              e.currentTarget.style.transform = 'translateX(4px)';
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={(e) => { 
              e.currentTarget.style.backgroundColor = '#eff6ff'; 
              e.currentTarget.style.transform = 'translateX(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <span style={{ fontSize: '18px' }}>📄</span>
            <div>
              <div style={{ fontWeight: '600' }}>Document Verification</div>
              <div style={{ fontSize: '10px', color: '#6b7280' }}>Start → Review → QA → Certificate → End</div>
            </div>
          </button>
        </div>
        
        {/* Info note */}
        <div style={{ 
          marginTop: '12px', 
          padding: '8px', 
          backgroundColor: '#f3f4f6', 
          borderRadius: '6px',
          fontSize: '9px',
          color: '#6b7280',
          textAlign: 'center'
        }}>
          💡 Templates auto-create full workflows<br/>
          Click "Test Workflow" after loading
        </div>
      </div>
    </div>
  );
};