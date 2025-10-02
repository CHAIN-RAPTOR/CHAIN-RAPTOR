import React from 'react';

interface WhitepaperModalProps {
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
    maxWidth: '800px',
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

const WhitepaperModal: React.FC<WhitepaperModalProps> = ({ onClose }) => {
  return (
    <div style={modalStyles} onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="whitepaper-title">
      <div style={modalContentStyles} onClick={(e) => e.stopPropagation()}>
        <button style={closeButtonStyles} onClick={onClose} aria-label="Close modal">&times;</button>
        <h2 id="whitepaper-title" style={h2Styles}>QPN-0+ Technical White Paper</h2>
        
        <h3 style={h3Styles}>Abstract: A Decoupled, Multi-Agent Security Orchestration Engine</h3>
        <p style={pStyles}>
            QPN-0+ is a next-generation security platform built upon a decoupled, multi-agent system engine. The architecture separates the user-facing client from a powerful backend concentrator, which acts as a hybrid of physical and logical agents. This engine is orchestrated to provide comprehensive, intelligent, and autonomous operations across multiple domains including SecOps, DevOps, AIOps, and Quantum-Blockchain integration. The system leverages multiple LLMs via a secure backend for elastic compute and logic, ensuring a resilient and adaptive security posture.
        </p>

        <h3 style={h3Styles}>Dual AI Architecture</h3>
        <p style={pStyles}>
            The platform's intelligence is bifurcated between the client and the backend:
        </p>
        <p style={pStyles}>
            <strong>1. Edge SecOps AI (Client-Side):</strong> This is an autonomous local agent simulated on the client, responsible for real-time, continuous monitoring of the active connection state. It performs low-level assessments such as packet integrity checks, PQC compliance verification, and QRNG entropy analysis.
        </p>
        <p style={pStyles}>
            <strong>2. Command & Orchestration AI (Backend Service):</strong> The user's primary interface to the multi-agent system is a Gemini-powered agent accessed via a secure backend API. This backend service handles natural language queries, provides deep analysis of aggregated log and telemetry data, and orchestrates communication between various specialized SME agents. This protects sensitive API keys and allows for scalable, secure LLM integration.
        </p>

        <h3 style={h3Styles}>Immutable Ledger via Private Blockchain</h3>
        <p style={pStyles}>
            All telemetry, security logs, and critical system events, processed by the backend concentrator, are recorded on a private, post-quantum enhanced blockchain based on the Substrate framework. This creates an immutable, tamper-proof audit trail essential for forensic analysis, compliance, and maintaining the integrity of the Zero Trust architecture.
        </p>

        <h3 style={h3Styles}>Software-Defined Quantum Key Distribution (SD-PQKD)</h3>
        <p style={pStyles}>
            The QPN-0+ platform is designed to act as a Software-Defined PQKD endpoint, adhering to emerging ETSI standards (e.g., ETSI QKD 014). This functionality, orchestrated by the backend, augments the primary PQC key exchange by sourcing an additional, independently generated key from a trusted QKD service provider. This decoupled approach adds a powerful layer of cryptographic verification and resilience.
        </p>

        <h3 style={h3Styles}>API-Driven Ecosystem</h3>
        <p style={pStyles}>
            The backend's intelligence is enhanced through secure API connections to external, authoritative sources. These include real-time PQC standard updates from NIST, quantum randomness feeds from the ANU, and advanced analytical capabilities from Google's Vertex AI (Gemini). The client interacts with these services safely through the backend API gateway, ensuring the entire system remains at the cutting edge of security technology.
        </p>
      </div>
    </div>
  );
};

export default WhitepaperModal;