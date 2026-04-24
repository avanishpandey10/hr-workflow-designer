// src/components/testing/TestPanel.tsx
import React from 'react';

interface TestPanelProps {
  isOpen: boolean;
  onClose: () => void;
  logs: string[];
}

export const TestPanel: React.FC<TestPanelProps> = ({ isOpen, onClose, logs }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: '#1e1e1e',
        borderRadius: '12px',
        padding: '20px',
        width: '800px',
        maxWidth: '95%',
        maxHeight: '85vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '16px',
          paddingBottom: '12px',
          borderBottom: '1px solid #333'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#fff' }}>🧪 Workflow Simulation Results</h2>
          <button 
            onClick={onClose} 
            style={{ 
              fontSize: '20px', 
              cursor: 'pointer', 
              background: 'none', 
              border: 'none', 
              color: '#fff',
              padding: '4px 8px',
              borderRadius: '4px'
            }}
          >
            ✕
          </button>
        </div>
        <div style={{
          fontFamily: 'monospace',
          fontSize: '12px',
          overflow: 'auto',
          maxHeight: '70vh',
          lineHeight: '1.5',
          backgroundColor: '#0a0a0a',
          borderRadius: '8px',
          padding: '16px'
        }}>
          {logs.map((log, i) => {
            // Color coding based on content
            let color = '#d4d4d4';
            if (log.includes('✅')) color = '#4ade80';
            else if (log.includes('❌')) color = '#ef4444';
            else if (log.includes('🚀')) color = '#60a5fa';
            else if (log.includes('📊')) color = '#fbbf24';
            else if (log.includes('╔') || log.includes('╚') || log.includes('║')) color = '#818cf8';
            else if (log.includes('┌') || log.includes('└') || log.includes('├') || log.includes('┐') || log.includes('┘') || log.includes('┤')) color = '#6b7280';
            else if (log.includes('STEP')) color = '#fbbf24';
            else if (log.includes('📍')) color = '#a78bfa';
            else if (log.includes('📛')) color = '#a78bfa';
            else if (log.includes('🔧')) color = '#a78bfa';
            
            return (
              <div key={i} style={{ 
                whiteSpace: 'pre-wrap',
                color: color,
                fontFamily: 'monospace'
              }}>
                {log}
              </div>
            );
          })}
        </div>
        <button
          onClick={onClose}
          style={{ 
            marginTop: '16px', 
            padding: '10px 20px', 
            backgroundColor: '#3b82f6', 
            color: 'white', 
            border: 'none', 
            borderRadius: '8px', 
            cursor: 'pointer',
            fontWeight: 'bold',
            alignSelf: 'center'
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};