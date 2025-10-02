import React from 'react';

interface AboutModalProps {
  onClose: () => void;
}

const modalStyles: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    padding: '2rem',
};

const modalContentStyles: React.CSSProperties = {
    backgroundColor: '#2c2c2c',
    padding: '2rem',
    borderRadius: '12px',
    maxWidth: '700px',
    maxHeight: '80vh',
    overflowY: 'auto',
    border: '1px solid #444',
    animation: 'fadeIn 0.3s ease-out',
    color: '#e0e0e0'
};

const closeButtonStyles: React.CSSProperties = {
    position: 'absolute',
    top: '15px',
    right: '15px',
    background: 'none',
    border: 'none',
    color: '#a0a0a0',
    fontSize: '1.5rem',
    cursor: 'pointer',
};

const h2Styles: React.CSSProperties = {
    color: '#00f2a1',
    marginBottom: '1rem',
    fontFamily: "'Roboto Mono', monospace",
};

const pStyles: React.CSSProperties = {
    marginBottom: '1rem',
    lineHeight: '1.6',
};

const AboutModal: React.FC<AboutModalProps> = ({ onClose }) => {
  return (
    <div style={modalStyles} onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="about-title">
      <div style={modalContentStyles} onClick={(e) => e.stopPropagation()}>
        <button style={closeButtonStyles} onClick={onClose} aria-label="Close modal">&times;</button>
        <h2 id="about-title" style={h2Styles}>About QPN-0+</h2>
        <p style={pStyles}>
          <strong>QPN-0+ (Post-Quantum Private Network - Zero Trust)</strong> is an architectural blueprint and interactive client for a next-generation security platform. It operates on a foundational Zero Trust philosophy, integrating NIST-standardized Post-Quantum Cryptography (PQC) and a Gemini-powered AI security co-pilot.
        </p>
        <p style={pStyles}>
          This application is the native desktop client, which acts as a secure control plane and monitoring interface for a powerful, stateless backend concentrator. The architecture is designed for deployment on Google Cloud, private cloud, or airgapped environments. It demonstrates advanced capabilities including point-to-point, client/server, and sophisticated multi-team mesh networking, all orchestrated by the backend.
        </p>
        <p style={pStyles}>
          By integrating with a backend that leverages <strong>Gemini and Vertex AI</strong>, the system is transformed from a passive data protector into a proactive, intelligent security co-pilot, capable of real-time analysis, automated compliance, and expert insight.
        </p>
      </div>
    </div>
  );
};

export default AboutModal;