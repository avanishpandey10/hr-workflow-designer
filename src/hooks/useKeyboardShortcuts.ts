// src/hooks/useKeyboardShortcuts.ts
import { useEffect, useCallback } from 'react';
import { useWorkflowStore } from '../store/workflowStore';

export const useKeyboardShortcuts = () => {
  const { selectedNodeId, deleteNode, undo, redo, canUndo, canRedo, saveToHistory } = useWorkflowStore();

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Delete selected node
    if (event.key === 'Delete' && selectedNodeId) {
      event.preventDefault();
      deleteNode(selectedNodeId);
    }
    
    // Undo (Ctrl+Z)
    if ((event.ctrlKey || event.metaKey) && event.key === 'z' && !event.shiftKey) {
      event.preventDefault();
      if (canUndo()) undo();
    }
    
    // Redo (Ctrl+Y or Ctrl+Shift+Z)
    if ((event.ctrlKey || event.metaKey) && (event.key === 'y' || (event.shiftKey && event.key === 'z'))) {
      event.preventDefault();
      if (canRedo()) redo();
    }
    
    // Save (Ctrl+S)
    if ((event.ctrlKey || event.metaKey) && event.key === 's') {
      event.preventDefault();
      saveToHistory();
    }
  }, [selectedNodeId, deleteNode, undo, redo, canUndo, canRedo, saveToHistory]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
};