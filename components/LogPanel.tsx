import React, { useContext, useEffect, useRef } from 'react';
import { AppContext } from '../index';

const logContainerStyle: React.CSSProperties = {
  height: '300px',
  backgroundColor: 'var(--bg-color)',
  borderRadius: '8px',
  border: '1px solid var(--border-color)',
  padding: '1rem',
  overflowY: 'auto',
  fontFamily: "'Roboto Mono', monospace",
  fontSize: '0.875rem',
  color: 'var(--text-color)',
  display: 'flex',
  flexDirection: 'column-reverse',
};

const logContentStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column'
};

const getLevelColor = (level: 'INFO' | 'WARN' | 'ERROR' | 'SYSTEM') => {
  switch (level) {
    case 'WARN': return 'var(--warning-color)';
    case 'ERROR': return 'var(--danger-color)';
    case 'SYSTEM': return 'var(--primary-color)';
    default: return 'var(--text-color-secondary)';
  }
};

const LogPanel: React.FC = () => {
  const context = useContext(AppContext);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [context?.logs]);

  return (
    <div className="card">
        <h3 className="card-header">Activity Log</h3>
        <div style={logContainerStyle} ref={scrollRef}>
            <div style={logContentStyle} role="log" aria-live="polite">
                {context?.logs.slice().reverse().map(log => (
                    <div key={log.id} style={{ marginBottom: '0.25rem' }}>
                        <span style={{ color: 'var(--text-color-secondary)', marginRight: '0.5rem' }}>{log.timestamp}</span>
                        <span style={{ color: getLevelColor(log.level), fontWeight: 'bold', width: '60px', display: 'inline-block' }}>[{log.level}]</span>
                        <span style={{ whiteSpace: 'pre-wrap' }}>{log.message}</span>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};

export default LogPanel;
