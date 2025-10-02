import React from 'react';

type Status = 'connected' | 'connecting' | 'disconnected';

interface StatusIndicatorProps {
  status: Status;
  text: string;
}

const containerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  marginTop: '0.5rem',
};

const dotStyle: React.CSSProperties = {
  width: '12px',
  height: '12px',
  borderRadius: '50%',
  transition: 'background-color 0.3s, box-shadow 0.3s',
};

const textStyle: React.CSSProperties = {
  color: 'var(--text-color-secondary)',
  fontSize: '0.9rem',
};

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status, text }) => {
  const getStatusStyle = (): React.CSSProperties => {
    switch (status) {
      case 'connected':
        return {
          backgroundColor: 'var(--success-color)',
          boxShadow: '0 0 8px var(--success-color)',
        };
      case 'connecting':
        return {
          backgroundColor: 'var(--warning-color)',
          boxShadow: '0 0 8px var(--warning-color)',
          animation: 'pulse 1.5s infinite',
        };
      case 'disconnected':
      default:
        return {
          backgroundColor: 'var(--danger-color)',
        };
    }
  };

  return (
    <div style={containerStyle}>
      <div style={{ ...dotStyle, ...getStatusStyle() }} role="status" aria-label={`Status: ${status}`}></div>
      <span style={textStyle}>{text}</span>
    </div>
  );
};

export default StatusIndicator;
