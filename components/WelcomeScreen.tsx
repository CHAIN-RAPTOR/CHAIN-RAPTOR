import React from 'react';

interface WelcomeScreenProps {
  onSignIn: () => void;
  onSignUp: () => void;
}

const welcomeContainerStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
  textAlign: 'center',
  padding: '2rem',
  animation: 'fadeIn 1s ease-in-out',
};

const titleStyles: React.CSSProperties = {
  fontFamily: "'Roboto Mono', monospace",
  fontSize: 'clamp(2rem, 8vw, 4rem)',
  color: 'var(--primary-color)',
  textShadow: '0 0 15px var(--glow-color)',
  letterSpacing: '2px',
};

const subtitleStyles: React.CSSProperties = {
  fontSize: 'clamp(1rem, 3vw, 1.25rem)',
  color: 'var(--text-color-secondary)',
  margin: '1rem 0 2.5rem 0',
  maxWidth: '600px',
};

const buttonGroupStyles: React.CSSProperties = {
    display: 'flex',
    gap: '1rem',
};

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onSignIn, onSignUp }) => {
  return (
    <div style={welcomeContainerStyles}>
      <h1 style={titleStyles}>QPN-0+</h1>
      <p style={subtitleStyles}>
        A Google Cloud Native Post-Quantum Security Platform
      </p>
      <div style={buttonGroupStyles}>
        <button onClick={onSignIn}>
          Operator Sign In
        </button>
        <button onClick={onSignUp} style={{backgroundColor: 'var(--surface-color-hover)', color: 'var(--text-color)'}}>
          Register New Operator
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;