import React from 'react';

interface TermsModalProps {
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

const TermsModal: React.FC<TermsModalProps> = ({ onClose }) => {
  return (
    <div style={modalStyles} onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="terms-title">
      <div style={modalContentStyles} onClick={(e) => e.stopPropagation()}>
        <button style={closeButtonStyles} onClick={onClose} aria-label="Close modal">&times;</button>
        <h2 id="terms-title" style={h2Styles}>Terms of Service</h2>
        <p style={pStyles}>
            <strong>1. Usage Agreement:</strong> This software, QPN-0+, is an interactive simulation and architectural blueprint. It is provided for demonstration and educational purposes only.
        </p>
        <p style={pStyles}>
            <strong>2. No Warranty:</strong> This software is provided "as is", without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose and noninfringement.
        </p>
        <p style={pStyles}>
            <strong>3. Limitation of Liability:</strong> In no event shall the authors or copyright holders be liable for any claim, damages or other liability, whether in an action of contract, tort or otherwise, arising from, out of or in connection with the software or the use or other dealings in the software.
        </p>
        <p style={pStyles}>
            <strong>4. Production Use:</strong> This software is not intended for use in a production environment. Do not use it to transmit sensitive or confidential information. The cryptographic and networking functions are simulations and do not provide real-world security.
        </p>
      </div>
    </div>
  );
};

export default TermsModal;
