// src/App.tsx - FINAL WORKING VERSION
import React, { useCallback, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
} from 'reactflow';
import type { Connection, Edge, Node } from 'reactflow';
import 'reactflow/dist/style.css';
import { useWorkflowStore } from './store/workflowStore';
import { CustomNode } from './components/nodes/CustomNode';
import { Sidebar } from './components/sidebar/Sidebar';
import { TestPanel } from './components/testing/TestPanel';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useWorkflowValidation } from './hooks/useWorkflowValidation';
import { useWorkflowSimulation } from './hooks/useWorkflowSimulation';

// nodeTypes outside component
const nodeTypes = {
  start: CustomNode,
  task: CustomNode,
  approval: CustomNode,
  automated: CustomNode,
  end: CustomNode,
};

function WorkflowCanvas() {
  const { 
    nodes, 
    edges, 
    setEdges, 
    updateNodePosition, 
    selectedNodeId, 
    setSelectedNodeId, 
    autoConnect, 
    undo, 
    redo, 
    canUndo, 
    canRedo, 
    clearWorkflow, 
    importWorkflow, 
    getWorkflowJSON,
    removeDuplicateEdges
  } = useWorkflowStore();
  
  const { validate } = useWorkflowValidation();
  const { simulate } = useWorkflowSimulation();
  const [showTestPanel, setShowTestPanel] = useState(false);
  const [simulationLogs, setSimulationLogs] = useState<string[]>([]);
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);

  useKeyboardShortcuts();

  const onConnect = useCallback(
    (params: Connection) => {
      console.log("Manual connection:", params);
      if (params.source && params.target) {
        const newEdge: Edge = {
          id: `edge-${params.source}-${params.target}-${Date.now()}`,
          source: params.source,
          target: params.target,
          animated: true,
          style: { stroke: '#3b82f6', strokeWidth: 2 },
          type: 'smoothstep',
        };
        setEdges((eds: Edge[]) => {
          const exists = eds.some(e => e.source === params.source && e.target === params.target);
          if (!exists) {
            return [...eds, newEdge];
          }
          return eds;
        });
      }
    },
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) return;

      const reactFlowBounds = document.querySelector('.react-flow')?.getBoundingClientRect();
      if (!reactFlowBounds) return;

      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };

      const { addNode } = useWorkflowStore.getState();
      addNode(type as any, position);
    },
    []
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    // Check if Ctrl key is pressed for multi-select
    const ctrlKey = (event as any).ctrlKey || (event as any).metaKey;
    if (ctrlKey) {
      setSelectedNodes(prev => 
        prev.includes(node.id) 
          ? prev.filter(id => id !== node.id)
          : [...prev, node.id]
      );
    } else {
      setSelectedNodes([node.id]);
    }
    setSelectedNodeId(node.id);
  }, []);

  const connectSelectedNodes = () => {
    if (selectedNodes.length === 2) {
      const [source, target] = selectedNodes;
      const newEdge: Edge = {
        id: `manual-${source}-${target}-${Date.now()}`,
        source,
        target,
        animated: true,
        style: { stroke: '#3b82f6', strokeWidth: 2 },
        type: 'smoothstep',
      };
      setEdges((eds: Edge[]) => {
        const exists = eds.some(e => e.source === source && e.target === target);
        if (!exists) {
          return [...eds, newEdge];
        }
        return eds;
      });
      setSelectedNodes([]);
      alert(`✅ Connected nodes!`);
    } else {
      alert(`Select 2 nodes (Ctrl+Click) to connect. Currently selected: ${selectedNodes.length}`);
    }
  };

  const handleValidate = async () => {
    const result = validate();
    alert(
      `${result.valid ? '✅ VALIDATION PASSED' : '❌ VALIDATION FAILED'}\n\n` +
      `Errors (${result.errors.length}):\n${result.errors.join('\n') || 'None'}\n\n` +
      `Warnings (${result.warnings.length}):\n${result.warnings.join('\n') || 'None'}`
    );
  };

  const handleSimulate = async () => {
    const result = await simulate();
    setSimulationLogs(result.logs);
    setShowTestPanel(true);
  };

  const handleExport = () => {
    const workflow = getWorkflowJSON();
    const dataStr = JSON.stringify(workflow, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', `workflow-${new Date().toISOString()}.json`);
    linkElement.click();
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const workflow = JSON.parse(e.target?.result as string);
        if (workflow.nodes && workflow.edges) {
          importWorkflow(workflow.nodes, workflow.edges);
          alert('✅ Workflow imported successfully!');
        }
      } catch (error) {
        alert('❌ Invalid workflow file');
      }
    };
    reader.readAsText(file);
  };

  const handleFixDuplicates = () => {
    const removed = removeDuplicateEdges();
    if (removed > 0) {
      alert(`✅ Removed ${removed} duplicate connection(s)!`);
    } else {
      alert(`✅ No duplicate connections found.`);
    }
  };

  const buttonStyle = (bgColor: string, disabled: boolean = false) => ({
    padding: '6px 12px',
    backgroundColor: disabled ? '#d1d5db' : bgColor,
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontSize: '12px',
    fontWeight: '500' as const
  });

  return (
    <div style={{ flex: 1, height: '100%', position: 'relative' }}>
      {/* Toolbar - All buttons properly placed */}
      <div style={{ 
        position: 'absolute', 
        top: 10, 
        right: 10, 
        zIndex: 10, 
        display: 'flex', 
        gap: 8, 
        background: 'white', 
        padding: '8px', 
        borderRadius: '8px', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        flexWrap: 'wrap'
      }}>
        <button onClick={autoConnect} style={buttonStyle('#9333ea')}>🔗 Auto-Connect</button>
        <button onClick={connectSelectedNodes} style={buttonStyle('#06b6d4')}>
          🔗 Connect Selected ({selectedNodes.length})
        </button>
        <button onClick={handleFixDuplicates} style={buttonStyle('#f59e0b')}>🧹 Fix Duplicates</button>
        <button onClick={handleValidate} style={buttonStyle('#10b981')}>✅ Validate</button>
        <button onClick={handleSimulate} style={buttonStyle('#3b82f6')}>🧪 Test</button>
        <button onClick={undo} disabled={!canUndo()} style={buttonStyle('#6b7280', !canUndo())}>↩️ Undo</button>
        <button onClick={redo} disabled={!canRedo()} style={buttonStyle('#6b7280', !canRedo())}>↪️ Redo</button>
        <button onClick={clearWorkflow} style={buttonStyle('#ef4444')}>🗑️ Clear</button>
        <button onClick={handleExport} style={buttonStyle('#8b5cf6')}>📤 Export</button>
        <label style={{ ...buttonStyle('#f59e0b'), cursor: 'pointer', display: 'inline-block' }}>
          📥 Import
          <input type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
        </label>
      </div>

      <ReactFlow
        nodes={nodes.map(node => ({ ...node, selected: node.id === selectedNodeId }))}
        edges={edges}
        onNodesChange={(changes) => {
          changes.forEach(change => {
            if (change.type === 'position' && change.position) {
              updateNodePosition(change.id, change.position);
            }
          });
        }}
        onEdgesChange={(changes) => {
          setEdges((eds: Edge[]) => {
            const updatedEdges = [...eds];
            changes.forEach(change => {
              if (change.type === 'remove') {
                const index = updatedEdges.findIndex(e => e.id === change.id);
                if (index !== -1) updatedEdges.splice(index, 1);
              }
            });
            return updatedEdges;
          });
        }}
        onConnect={onConnect}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        defaultEdgeOptions={{
          animated: true,
          style: { stroke: '#3b82f6', strokeWidth: 2 },
          type: 'smoothstep'
        }}
      >
        <Background gap={12} size={1} color="#e2e8f0" />
        <Controls />
        <MiniMap />
      </ReactFlow>

      <TestPanel isOpen={showTestPanel} onClose={() => setShowTestPanel(false)} logs={simulationLogs} />
      
      <div style={{ 
        position: 'absolute', 
        bottom: 10, 
        left: 10, 
        background: 'white', 
        padding: '8px 12px', 
        borderRadius: '8px', 
        fontSize: '12px', 
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)' 
      }}>
        💡 Drag nodes | Ctrl+Click to select 2 nodes | Click "Connect Selected" | Or drag from blue dots
      </div>
    </div>
  );
}

function App() {
  return (
    <ReactFlowProvider>
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#f3f4f6' }}>
        <header style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: 'white', padding: '12px 24px' }}>
          <h1 style={{ fontSize: '20px', fontWeight: 'bold' }}>🏢 HR Workflow Designer</h1>
          <p style={{ fontSize: '12px', marginTop: '2px' }}>Design, validate & test HR automation workflows</p>
        </header>
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          <Sidebar />
          <WorkflowCanvas />
        </div>
      </div>
    </ReactFlowProvider>
  );
}

export default App;