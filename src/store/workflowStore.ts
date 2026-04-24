// src/store/workflowStore.ts - FINAL FIXED VERSION
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

export type NodeType = 'start' | 'task' | 'approval' | 'automated' | 'end';

export interface Position {
  x: number;
  y: number;
}

export interface WorkflowNode {
  id: string;
  type: NodeType;
  position: Position;
  data: any;
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  animated?: boolean;
  sourceHandle?: string | null;
  targetHandle?: string | null;
  style?: any;
  type?: string;
}

interface WorkflowStore {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  selectedNodeId: string | null;
  history: { nodes: WorkflowNode[]; edges: WorkflowEdge[] }[];
  historyIndex: number;
  
  addNode: (type: NodeType, position: Position) => void;
  updateNodeData: (nodeId: string, data: any) => void;
  updateNodePosition: (nodeId: string, position: Position) => void;
  deleteNode: (nodeId: string) => void;
  setSelectedNodeId: (nodeId: string | null) => void;
  addEdge: (source: string, target: string) => void;
  deleteEdge: (edgeId: string) => void;
  setEdges: (edges: WorkflowEdge[] | ((prev: WorkflowEdge[]) => WorkflowEdge[])) => void;
  saveToHistory: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  getWorkflowJSON: () => { nodes: WorkflowNode[]; edges: WorkflowEdge[] };
  importWorkflow: (nodes: WorkflowNode[], edges: WorkflowEdge[]) => void;
  clearWorkflow: () => void;
  autoConnect: () => void;
  removeDuplicateEdges: () => number;
}

const getDefaultDataForType = (type: NodeType): any => {
  switch (type) {
    case 'start': 
      return { title: '🚀 Workflow Start', type: 'start', metadata: {} };
    case 'task': 
      return { title: '📋 Review Documents', description: 'Collect and verify documents', assignee: 'hr@company.com', dueDate: new Date().toISOString().split('T')[0], type: 'task', customFields: {} };
    case 'approval': 
      return { title: '✅ Manager Approval', approverRole: 'Manager', autoApproveThreshold: 1, type: 'approval' };
    case 'automated': 
      return { title: '⚡ Send Email', actionId: 'send_email', actionLabel: 'Send Email', parameters: {}, type: 'automated' };
    case 'end': 
      return { title: '🏁 Process Complete', endMessage: 'Workflow completed successfully', showSummary: true, type: 'end' };
    default: 
      return { title: 'New Node', type: 'task' };
  }
};

export const useWorkflowStore = create<WorkflowStore>()(
  persist(
    (set, get) => ({
      nodes: [],
      edges: [],
      selectedNodeId: null,
      history: [],
      historyIndex: -1,

      saveToHistory: () => {
        const { nodes, edges, history, historyIndex } = get();
        try {
          const newHistory = history.slice(0, historyIndex + 1);
          newHistory.push({ 
            nodes: JSON.parse(JSON.stringify(nodes)), 
            edges: JSON.parse(JSON.stringify(edges)) 
          });
          set({ history: newHistory, historyIndex: newHistory.length - 1 });
        } catch (error) {
          console.error("Failed to save to history:", error);
        }
      },

      undo: () => {
        const { history, historyIndex } = get();
        if (historyIndex > 0 && history[historyIndex - 1]) {
          const previous = history[historyIndex - 1];
          set({ 
            nodes: previous.nodes || [], 
            edges: previous.edges || [], 
            historyIndex: historyIndex - 1 
          });
        }
      },

      redo: () => {
        const { history, historyIndex } = get();
        if (historyIndex < history.length - 1 && history[historyIndex + 1]) {
          const next = history[historyIndex + 1];
          set({ 
            nodes: next.nodes || [], 
            edges: next.edges || [], 
            historyIndex: historyIndex + 1 
          });
        }
      },

      canUndo: () => get().historyIndex > 0,
      canRedo: () => get().historyIndex < get().history.length - 1,

      addNode: (type, position) => {
        const newNode: WorkflowNode = {
          id: uuidv4(),
          type,
          position,
          data: getDefaultDataForType(type)
        };
        set((state) => ({ nodes: [...state.nodes, newNode] }));
        get().saveToHistory();
      },

      updateNodeData: (nodeId, data) => {
        set((state) => ({
          nodes: state.nodes.map((node) =>
            node.id === nodeId ? { ...node, data: { ...node.data, ...data } } : node
          )
        }));
        get().saveToHistory();
      },

      updateNodePosition: (nodeId, position) => {
        set((state) => ({
          nodes: state.nodes.map((node) => node.id === nodeId ? { ...node, position } : node)
        }));
      },

      deleteNode: (nodeId) => {
        set((state) => ({
          nodes: state.nodes.filter((n) => n.id !== nodeId),
          edges: state.edges.filter((e) => e.source !== nodeId && e.target !== nodeId),
          selectedNodeId: state.selectedNodeId === nodeId ? null : state.selectedNodeId
        }));
        get().saveToHistory();
      },

      setSelectedNodeId: (nodeId) => set({ selectedNodeId: nodeId }),

      addEdge: (source, target) => {
        const newEdge: WorkflowEdge = {
          id: `${source}-${target}-${Date.now()}`,
          source,
          target,
          animated: true
        };
        set((state) => ({ edges: [...state.edges, newEdge] }));
        get().saveToHistory();
      },

      deleteEdge: (edgeId) => {
        set((state) => ({ edges: state.edges.filter((e) => e.id !== edgeId) }));
        get().saveToHistory();
      },

      setEdges: (edges) => {
        if (typeof edges === 'function') {
          set((state) => ({ edges: edges(state.edges) }));
        } else {
          set({ edges });
        }
        get().saveToHistory();
      },

      getWorkflowJSON: () => {
        const { nodes, edges } = get();
        return { nodes, edges: Array.isArray(edges) ? edges : [] };
      },

      importWorkflow: (nodes, edges) => {
        set({ nodes, edges: Array.isArray(edges) ? edges : [] });
        get().saveToHistory();
      },

      clearWorkflow: () => {
        set({ nodes: [], edges: [], selectedNodeId: null });
        get().saveToHistory();
      },

      // ✅ FIXED: Replaces all edges instead of adding
      autoConnect: () => {
        const { nodes } = get();
        if (nodes.length < 2) {
          alert("❌ Need at least 2 nodes to connect!");
          return;
        }
        
        // Sort nodes by their Y position (top to bottom)
        const sortedNodes = [...nodes].sort((a, b) => a.position.y - b.position.y);
        const newEdges: WorkflowEdge[] = [];
        
        // Create connections between consecutive nodes
        for (let i = 0; i < sortedNodes.length - 1; i++) {
          const sourceNode = sortedNodes[i];
          const targetNode = sortedNodes[i + 1];
          
          newEdges.push({
            id: `auto-${sourceNode.id}-${targetNode.id}-${Date.now()}`,
            source: sourceNode.id,
            target: targetNode.id,
            animated: true,
            style: { stroke: '#3b82f6', strokeWidth: 2 }
          });
        }
        
        // ✅ REPLACE all edges (don't add to existing)
        set({ edges: newEdges });
        
        console.log(`✅ Auto-connected: ${newEdges.length} edges created`);
        alert(`✅ Connected ${newEdges.length} node pairs!\n\nFor ${nodes.length} nodes, expected ${nodes.length - 1} connections.`);
        
        get().saveToHistory();
      },

      // ✅ NEW: Remove duplicate edges
      removeDuplicateEdges: () => {
        const { edges } = get();
        const uniqueEdges: WorkflowEdge[] = [];
        const edgeKeys = new Set<string>();
        
        edges.forEach(edge => {
          const key = `${edge.source}-${edge.target}`;
          if (!edgeKeys.has(key)) {
            edgeKeys.add(key);
            uniqueEdges.push(edge);
          }
        });
        
        const removedCount = edges.length - uniqueEdges.length;
        if (removedCount > 0) {
          set({ edges: uniqueEdges });
          get().saveToHistory();
          console.log(`✅ Removed ${removedCount} duplicate edges`);
        }
        return removedCount;
      },
    }),
    {
      name: 'workflow-storage',
    }
  )
);