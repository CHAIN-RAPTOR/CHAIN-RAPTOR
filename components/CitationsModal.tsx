import React from 'react';

interface CitationsModalProps {
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

const h3Styles: React.CSSProperties = {
    color: '#e0e0e0',
    marginTop: '1.5rem',
    marginBottom: '0.5rem',
    borderBottom: '1px solid #444',
    paddingBottom: '0.5rem'
};

const pStyles: React.CSSProperties = {
    marginBottom: '1rem',
    lineHeight: '1.6',
};

const aStyles: React.CSSProperties = {
    color: '#00f2a1',
    textDecoration: 'none',
};

const CitationsModal: React.FC<CitationsModalProps> = ({ onClose }) => {
  return (
    <div style={modalStyles} onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="citations-title">
      <div style={modalContentStyles} onClick={(e) => e.stopPropagation()}>
        <button style={closeButtonStyles} onClick={onClose} aria-label="Close modal">&times;</button>
        <h2 id="citations-title" style={h2Styles}>Citations & Source Validation</h2>
        
        <h3 style={h3Styles}>AI & Cloud Architecture</h3>
        <p style={pStyles}>
            The architectural principles and AI capabilities of this project are made possible by the technologies available within the Google Cloud ecosystem. The AI Security Co-pilot is powered by Google's Gemini models via the Vertex AI Platform.
        </p>
        <p style={pStyles}>
            <a href="https://cloud.google.com/vertex-ai" target="_blank" rel="noopener noreferrer" style={aStyles}>
                Learn more about Google Cloud's Vertex AI Platform.
            </a>
        </p>

        <h3 style={h3Styles}>Post-Quantum Cryptography (PQC)</h3>
        <p style={pStyles}>
            The PQC algorithms modeled in this simulation (e.g., Kyber, Dilithium) are based on the standards selected by the U.S. National Institute of Standards and Technology (NIST) PQC standardization process.
        </p>
        <p style={pStyles}>
            <a href="https://csrc.nist.gov/projects/post-quantum-cryptography" target="_blank" rel="noopener noreferrer" style={aStyles}>
                NIST Post-Quantum Cryptography Project
            </a>
        </p>
        
        <h3 style={h3Styles}>Quantum Random Number Generation (QRNG)</h3>
        <p style={pStyles}>
            The concept of using a true quantum random number generator is based on services like the one provided by the Australian National University (ANU).
        </p>
        <p style={pStyles}>
            <a href="https://qrng.anu.edu.au/" target="_blank" rel="noopener noreferrer" style={aStyles}>
                ANU Quantum Random Numbers
            </a>
        </p>

      </div>
    </div>
  );
};

export default CitationsModal;
