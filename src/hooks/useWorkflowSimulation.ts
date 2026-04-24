// src/hooks/useWorkflowSimulation.ts - Beautiful formatted output
import { useCallback } from 'react';
import { useWorkflowStore } from '../store/workflowStore';

export const useWorkflowSimulation = () => {
  const { nodes, edges, getWorkflowJSON } = useWorkflowStore();

  const simulate = useCallback(async (): Promise<{
    success: boolean;
    steps: any[];
    logs: string[];
  }> => {
    const logs: string[] = [];
    
    const startNode = nodes.find(n => n.data.type === 'start');
    if (!startNode) {
      logs.push('❌ No Start node found in workflow!');
      return { success: false, steps: [], logs };
    }
    
    if (edges.length === 0 && nodes.length > 1) {
      logs.push('❌ No connections found! Connect nodes first.');
      return { success: false, steps: [], logs };
    }
    
    // Header
    logs.push(`╔══════════════════════════════════════════════════════════════╗`);
    logs.push(`║              🚀 WORKFLOW SIMULATION STARTED 🚀               ║`);
    logs.push(`╚══════════════════════════════════════════════════════════════╝`);
    logs.push(`⏰ Time: ${new Date().toLocaleTimeString()}`);
    logs.push(`📊 Workflow Statistics: ${nodes.length} nodes, ${edges.length} connections`);
    logs.push(``);
    
    // Build execution order
    const nodeMap = new Map(nodes.map(n => [n.id, n]));
    const edgeMap = new Map();
    edges.forEach(edge => {
      edgeMap.set(edge.source, edge.target);
    });
    
    const executionOrder: any[] = [];
    let currentNode: any = startNode;
    const visited = new Set();
    
    while (currentNode && !visited.has(currentNode.id) && executionOrder.length < nodes.length) {
      visited.add(currentNode.id);
      executionOrder.push(currentNode);
      const nextNodeId = edgeMap.get(currentNode.id);
      if (nextNodeId) {
        currentNode = nodeMap.get(nextNodeId);
      } else {
        break;
      }
    }
    
    // Execution Order
    logs.push(`📋 Execution Order:`);
    executionOrder.forEach((node, idx) => {
      const emoji = node.data.type === 'start' ? '🚀' : 
                    node.data.type === 'task' ? '📋' : 
                    node.data.type === 'approval' ? '✅' : 
                    node.data.type === 'automated' ? '⚡' : '🏁';
      logs.push(`   ${idx + 1}. ${emoji} ${node.data.title} (${node.data.type})`);
    });
    logs.push(``);
    
    logs.push(`╔══════════════════════════════════════════════════════════════╗`);
    logs.push(`║                    📝 EXECUTION LOG 📝                        ║`);
    logs.push(`╚══════════════════════════════════════════════════════════════╝`);
    logs.push(``);
    
    let successfulSteps = 0;
    let failedSteps = 0;
    
    // Execute each step
    for (let i = 0; i < executionOrder.length; i++) {
      const node = executionOrder[i];
      const nodeData = node.data;
      const stepNumber = i + 1;
      
      logs.push(`┌─────────────────────────────────────────────────────────────┐`);
      logs.push(`│ STEP ${stepNumber}: ${nodeData.type.toUpperCase()} NODE                                      │`);
      logs.push(`├─────────────────────────────────────────────────────────────┤`);
      logs.push(`│ 📍 Node ID: ${node.id.slice(0, 8)}...`);
      logs.push(`│ 📛 Title: ${nodeData.title}`);
      logs.push(`│ 🔧 Type: ${nodeData.type}`);
      logs.push(`├─────────────────────────────────────────────────────────────┤`);
      
      let stepSuccess = true;
      
      switch (nodeData.type) {
        case 'start':
          logs.push(`│ ✅ Action: Workflow initiated`);
          logs.push(`│ 💬 Message: Starting workflow execution`);
          logs.push(`│ ⏱️  Status: COMPLETED`);
          successfulSteps++;
          break;
          
        case 'task':
          logs.push(`│ 📋 Task Details:`);
          logs.push(`│    - Description: ${nodeData.description || 'No description'}`);
          logs.push(`│    - Assignee: ${nodeData.assignee || 'Unassigned'}`);
          logs.push(`│    - Due Date: ${nodeData.dueDate || 'Not set'}`);
          logs.push(`│ ✅ Status: Task assigned successfully`);
          logs.push(`│ ⏱️  Status: COMPLETED`);
          successfulSteps++;
          break;
          
        case 'approval':
          logs.push(`│ 👥 Approval Details:`);
          logs.push(`│    - Approver Role: ${nodeData.approverRole || 'Manager'}`);
          logs.push(`│    - Auto-approve Threshold: ${nodeData.autoApproveThreshold || 1}`);
          logs.push(`│    - Status: Pending approval`);
          logs.push(`│ ✅ Status: Approval request sent`);
          logs.push(`│ ⏱️  Status: COMPLETED`);
          successfulSteps++;
          break;
          
        case 'automated':
          logs.push(`│ 🤖 Automated Action:`);
          logs.push(`│    - Action: ${nodeData.actionLabel || 'Send Email'}`);
          logs.push(`│    - Action ID: ${nodeData.actionId || 'send_email'}`);
          if (nodeData.parameters) {
            if (nodeData.parameters.to) logs.push(`│    - To: ${nodeData.parameters.to}`);
            if (nodeData.parameters.subject) logs.push(`│    - Subject: ${nodeData.parameters.subject}`);
            if (nodeData.parameters.body) logs.push(`│    - Body: ${nodeData.parameters.body.substring(0, 30)}...`);
          }
          logs.push(`│ ✅ Status: Action executed successfully`);
          logs.push(`│ ⏱️  Status: COMPLETED`);
          successfulSteps++;
          break;
          
        case 'end':
          logs.push(`│ 🏁 Completion Details:`);
          logs.push(`│    - Message: ${nodeData.endMessage || 'Workflow completed successfully!'}`);
          logs.push(`│    - Summary: Workflow execution finished`);
          logs.push(`│ ✅ Status: WORKFLOW COMPLETE`);
          logs.push(`│ ⏱️  Status: COMPLETED`);
          successfulSteps++;
          break;
          
        default:
          logs.push(`│ ⚠️ Unknown node type: ${nodeData.type}`);
          logs.push(`│ ❌ Status: FAILED`);
          failedSteps++;
          stepSuccess = false;
      }
      
      logs.push(`└─────────────────────────────────────────────────────────────┘`);
      logs.push(``);
    }
    
    // Summary
    const totalTime = (executionOrder.length * 0.5).toFixed(1);
    const allSuccess = failedSteps === 0;
    
    logs.push(`╔══════════════════════════════════════════════════════════════╗`);
    logs.push(`║                    📊 SIMULATION SUMMARY 📊                  ║`);
    logs.push(`╚══════════════════════════════════════════════════════════════╝`);
    logs.push(`📈 Total Steps Executed: ${executionOrder.length}`);
    logs.push(`✅ Successful Steps: ${successfulSteps}`);
    logs.push(`❌ Failed Steps: ${failedSteps}`);
    logs.push(`🕐 Total Execution Time: ~${totalTime} seconds (simulated)`);
    logs.push(``);
    
    if (allSuccess) {
      logs.push(`╔══════════════════════════════════════════════════════════════╗`);
      logs.push(`║                    ✅ WORKFLOW SUCCESSFUL ✅                  ║`);
      logs.push(`║              All nodes executed without errors               ║`);
      logs.push(`╚══════════════════════════════════════════════════════════════╝`);
    } else {
      logs.push(`╔══════════════════════════════════════════════════════════════╗`);
      logs.push(`║                    ❌ WORKFLOW FAILED ❌                      ║`);
      logs.push(`║              Some nodes failed to execute                    ║`);
      logs.push(`╚══════════════════════════════════════════════════════════════╝`);
    }
    
    return { 
      success: allSuccess, 
      steps: executionOrder.map((node, idx) => ({
        step: idx + 1,
        nodeId: node.id,
        nodeType: node.data.type,
        nodeTitle: node.data.title,
        status: 'completed',
        message: `Executed ${node.data.type}: ${node.data.title}`,
        timestamp: new Date()
      })),
      logs 
    };
  }, [nodes, edges, getWorkflowJSON]);

  return { simulate };
};