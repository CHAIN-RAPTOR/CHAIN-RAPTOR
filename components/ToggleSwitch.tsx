import React from 'react';

interface ToggleSwitchProps {
  label: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  disabled?: boolean;
}

const toggleContainerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
};

const switchStyle: React.CSSProperties = {
  position: 'relative',
  display: 'inline-block',
  width: '50px',
  height: '28px',
};

const sliderStyle: React.CSSProperties = {
  position: 'absolute',
  cursor: 'pointer',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: '#444',
  transition: '0.4s',
  borderRadius: '28px',
};

const knobStyle: React.CSSProperties = {
  position: 'absolute',
  content: '""',
  height: '20px',
  width: '20px',
  left: '4px',
  bottom: '4px',
  backgroundColor: 'white',
  transition: '0.4s',
  borderRadius: '50%',
};

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ label, enabled, onChange, disabled = false }) => {
  return (
    <label 
        style={{...toggleContainerStyle, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1}} 
        title={disabled ? "Unavailable" : label}
    >
      <span>{label}</span>
      <div style={switchStyle}>
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => onChange(e.target.checked)}
          style={{ opacity: 0, width: 0, height: 0 }}
          disabled={disabled}
        />
        <span
          style={{
            ...sliderStyle,
            backgroundColor: enabled && !disabled ? 'var(--primary-color)' : '#444',
            cursor: disabled ? 'not-allowed' : 'pointer',
          }}
        ></span>
        <span
          style={{
            ...knobStyle,
            transform: enabled && !disabled ? 'translateX(22px)' : 'translateX(0)',
          }}
        ></span>
      </div>
    </label>
  );
};

export default ToggleSwitch;