import React, { useState, ReactNode } from 'react';

interface LegalScreenProps {
  title: string;
  content: ReactNode;
  onAccept: () => void;
}

const containerStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
  animation: 'fadeIn 0.5s',
};

const boxStyles: React.CSSProperties = {
  width: '100%',
  maxWidth: '700px',
  padding: '2.5rem',
  backgroundColor: 'var(--surface-color)',
  borderRadius: '12px',
  border: '1px solid var(--border-color)',
  textAlign: 'center',
  boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
};

const titleStyles: React.CSSProperties = {
  fontFamily: "'Roboto Mono', monospace",
  fontSize: '2rem',
  color: 'var(--primary-color)',
  marginBottom: '1.5rem',
};

const LegalScreen: React.FC<LegalScreenProps> = ({ title, content, onAccept }) => {
  const [hasAgreed, setHasAgreed] = useState(false);

  return (
    <div style={containerStyles}>
      <div style={boxStyles}>
        <h1 style={titleStyles}>{title}</h1>
        <div className="legal-content-box">
          {content}
        </div>
        <div className="agree-checkbox">
          <input
            type="checkbox"
            id="agree-checkbox"
            checked={hasAgreed}
            onChange={(e) => setHasAgreed(e.target.checked)}
          />
          <label htmlFor="agree-checkbox">I have read and agree to the above terms.</label>
        </div>
        <button onClick={onAccept} disabled={!hasAgreed}>
          I Agree
        </button>
      </div>
    </div>
  );
};

export default LegalScreen;