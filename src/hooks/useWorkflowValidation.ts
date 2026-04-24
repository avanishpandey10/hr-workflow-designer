import { useCallback } from 'react';
import { useWorkflowStore } from '../store/workflowStore';

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export const useWorkflowValidation = () => {
  const { nodes, edges } = useWorkflowStore();

  const validate = useCallback((): ValidationResult => {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (nodes.length === 0) {
      errors.push('Workflow is empty. Add at least one node.');
      return { valid: false, errors, warnings };
    }

    const startNode = nodes.find(n => n.data.type === 'start');
    if (!startNode) {
      errors.push('❌ START NODE MISSING: Workflow must have a Start node.');
    }

    const endNode = nodes.find(n => n.data.type === 'end');
    if (!endNode) {
      errors.push('❌ END NODE MISSING: Workflow must have an End node.');
    }

    if (edges.length === 0 && nodes.length > 1) {
      errors.push('❌ NO CONNECTIONS: Nodes are not connected.');
    }

    const connectedNodes = new Set([...edges.map(e => e.source), ...edges.map(e => e.target)]);
    const disconnectedNodes = nodes.filter(n => !connectedNodes.has(n.id) && n.data.type !== 'start');
    if (disconnectedNodes.length > 0) {
      warnings.push(`⚠️ DISCONNECTED NODES: ${disconnectedNodes.length} node(s) are not connected.`);
    }

    // ✅ NEW: LOGICAL ORDER VALIDATION - Check execution order
    if (startNode && edges.length > 0) {
      // Build execution order by traversing edges from start node
      const nodeMap = new Map(nodes.map(n => [n.id, n]));
      const edgeMap = new Map();
      edges.forEach(edge => {
        edgeMap.set(edge.source, edge.target);
      });
      
      const executionOrder: any[] = [];
      let current: any = startNode;
      const visited = new Set();
      
      while (current && !visited.has(current.id) && executionOrder.length < nodes.length) {
        visited.add(current.id);
        executionOrder.push(current);
        const nextId = edgeMap.get(current.id);
        if (nextId) {
          current = nodeMap.get(nextId);
        } else {
          break;
        }
      }
      
      // Check logical sequence
      let foundTask = false;
      let foundApproval = false;
      let foundAutomated = false;
      let foundEnd = false;
      let previousNodeType = '';
      let hasOrderIssue = false;
      
      for (let i = 0; i < executionOrder.length; i++) {
        const node = executionOrder[i];
        const nodeType = node.data.type;
        
        // Check if Start is first
        if (i === 0 && nodeType !== 'start') {
          errors.push(`❌ LOGICAL ERROR: First node should be Start node, but found "${node.data.title}" (${nodeType}).`);
          hasOrderIssue = true;
        }
        
        // Check if End is last
        if (i === executionOrder.length - 1 && nodeType !== 'end') {
          errors.push(`❌ LOGICAL ERROR: Last node should be End node, but found "${node.data.title}" (${nodeType}).`);
          hasOrderIssue = true;
        }
        
        // Check sequence: Start → Task → Approval → Automated → End
        if (nodeType === 'task') {
          foundTask = true;
          if (foundApproval) {
            warnings.push(`⚠️ LOGICAL ERROR: Task "${node.data.title}" appears after Approval. Tasks should come before approvals.`);
            hasOrderIssue = true;
          }
          if (foundAutomated) {
            warnings.push(`⚠️ LOGICAL ERROR: Task "${node.data.title}" appears after Automated step.`);
            hasOrderIssue = true;
          }
        }
        
        if (nodeType === 'approval') {
          foundApproval = true;
          if (!foundTask && executionOrder.length > 1) {
            warnings.push(`⚠️ LOGICAL ERROR: Approval "${node.data.title}" appears before any Task. Reviews should happen before approvals.`);
            hasOrderIssue = true;
          }
          if (foundAutomated) {
            warnings.push(`⚠️ LOGICAL ERROR: Approval "${node.data.title}" appears after Automated step.`);
            hasOrderIssue = true;
          }
        }
        
        if (nodeType === 'automated') {
          foundAutomated = true;
          if (!foundApproval && foundTask) {
            warnings.push(`⚠️ LOGICAL ERROR: Automated step "${node.data.title}" appears before Approval. Automated actions usually come after approvals.`);
            hasOrderIssue = true;
          }
        }
        
        if (nodeType === 'end') {
          foundEnd = true;
          if (i !== executionOrder.length - 1) {
            errors.push(`❌ LOGICAL ERROR: End node "${node.data.title}" is not at the end of the workflow.`);
            hasOrderIssue = true;
          }
        }
        
        previousNodeType = nodeType;
      }
      
      // Check if all required node types are present in correct order
      const hasTask = nodes.some(n => n.data.type === 'task');
      const hasApproval = nodes.some(n => n.data.type === 'approval');
      const hasAutomated = nodes.some(n => n.data.type === 'automated');
      
      if (hasTask && !foundTask && executionOrder.length > 1) {
        warnings.push(`⚠️ Task nodes exist but are not reachable from Start node.`);
      }
      
      if (hasApproval && !foundApproval && executionOrder.length > 1) {
        warnings.push(`⚠️ Approval nodes exist but are not reachable from Start node.`);
      }
      
      if (hasAutomated && !foundAutomated && executionOrder.length > 1) {
        warnings.push(`⚠️ Automated nodes exist but are not reachable from Start node.`);
      }
    }

    // Validate each node's required fields
    nodes.forEach((node: any) => {
      const nodeData = node.data;
      
      if (nodeData.type === 'task') {
        if (!nodeData.assignee || nodeData.assignee.trim() === '') {
          warnings.push(`⚠️ Task "${nodeData.title}" has no assignee.`);
        }
        if (!nodeData.dueDate) {
          warnings.push(`⚠️ Task "${nodeData.title}" has no due date.`);
        }
      }
      
      if (nodeData.type === 'approval') {
        if (!nodeData.approverRole) {
          warnings.push(`⚠️ Approval "${nodeData.title}" has no approver role.`);
        }
      }
      
      if (nodeData.type === 'automated') {
        if (!nodeData.actionId) {
          warnings.push(`⚠️ Automated step "${nodeData.title}" has no action selected.`);
        }
      }
    });

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }, [nodes, edges]);

  return { validate };
};