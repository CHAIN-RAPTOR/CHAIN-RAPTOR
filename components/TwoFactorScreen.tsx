import React, { useState, useEffect } from 'react';

interface TwoFactorScreenProps {
  isSetup: boolean; // true for setup flow, false for login flow
  onSuccess: () => void;
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
  maxWidth: '420px',
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
  marginBottom: '0.5rem',
};

const subtitleStyles: React.CSSProperties = {
  color: 'var(--text-color-secondary)',
  marginBottom: '2rem',
};

const errorStyles: React.CSSProperties = {
    color: 'var(--danger-color)',
    marginTop: '1rem',
    minHeight: '1.2em'
};

// Simple placeholder SVG for QR Code
const QrCodePlaceholder = () => (
    <svg width="160" height="160" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <path fill="#333" d="M0 0h30v30H0z M10 10h10v10H10z M70 0h30v30H70z M80 10h10v10H80z M0 70h30v30H0z M10 80h10v10H10z"/>
        <path fill="#555" d="M40 0h10v10H40z M60 0h10v10H60z M0 40h10v10H0z M40 40h30v10H40z M0 60h10v10H0z M40 70h10v30H40z M70 40h10v20H70z M90 40h10v10H90z M60 60h10v10H60z M90 70h10v30H90z M50 90h30v10H50z"/>
    </svg>
);


const TwoFactorScreen: React.FC<TwoFactorScreenProps> = ({ isSetup, onSuccess }) => {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Mock verification
        setTimeout(() => {
            if (code === '123456') { // Simulate correct code
                onSuccess();
            } else {
                setError('Invalid authentication code.');
            }
            setIsLoading(false);
        }, 1000);
    };

    return (
        <div style={containerStyles}>
            <div style={boxStyles}>
                <h1 style={titleStyles}>Two-Factor Auth</h1>
                <p style={subtitleStyles}>
                    {isSetup 
                        ? 'Scan the QR code with your authenticator app.' 
                        : 'Enter the code from your authenticator app.'}
                </p>

                {isSetup && (
                    <div className="qr-code-placeholder">
                        <QrCodePlaceholder />
                    </div>
                )}
                
                <form onSubmit={handleSubmit}>
                    <p style={{...subtitleStyles, fontSize: '0.9rem', marginBottom: '1rem'}}>
                        {isSetup && 'Then, enter the 6-digit code to verify setup.'}
                    </p>
                    <input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                        maxLength={6}
                        placeholder="123456"
                        style={{textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.5rem'}}
                        aria-label="Six-digit authentication code"
                    />
                    <button type="submit" disabled={isLoading || code.length !== 6} style={{ marginTop: '1.5rem', width: '100%' }}>
                        {isLoading ? 'Verifying...' : 'Verify'}
                    </button>
                    <div style={errorStyles} aria-live="assertive">{error}</div>
                </form>
            </div>
        </div>
    );
};

export default TwoFactorScreen;