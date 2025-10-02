import React, { useState, useContext } from 'react';
import { AppContext, DeploymentEnvironment } from '../index';

interface SignInScreenProps {
  onAuthSuccess: () => void;
}

const authContainerStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
  animation: 'fadeIn 0.5s',
};

const authBoxStyles: React.CSSProperties = {
  width: '100%',
  maxWidth: '400px',
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

const formStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  textAlign: 'left',
};

const labelStyles: React.CSSProperties = {
  fontSize: '0.9rem',
  fontWeight: 600,
  color: 'var(--text-color-secondary)',
};

const errorStyles: React.CSSProperties = {
    color: 'var(--danger-color)',
    marginTop: '1rem',
    minHeight: '1.2em'
};

const SignInScreen: React.FC<SignInScreenProps> = ({ onAuthSuccess }) => {
  const [username, setUsername] = useState('operator_01');
  const [password, setPassword] = useState('***********');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const context = useContext(AppContext);

  if (!context) return null;
  const { deploymentEnvironment, setDeploymentEnvironment } = context;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Mock authentication
    setTimeout(() => {
      if (username && password) {
        onAuthSuccess();
      } else {
        setError('Please enter both username and password.');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div style={authContainerStyles}>
      <div style={authBoxStyles}>
        <h1 style={titleStyles}>Operator Sign In</h1>
        <p style={subtitleStyles}>Enter your credentials to proceed to 2FA.</p>
        <form style={formStyles} onSubmit={handleLogin}>
          <div>
            <label htmlFor="deployment" style={labelStyles}>Deployment Environment</label>
            <select
                id="deployment"
                value={deploymentEnvironment}
                onChange={(e) => setDeploymentEnvironment(e.target.value as DeploymentEnvironment)}
            >
                {Object.values(DeploymentEnvironment).map(env => (
                    <option key={env} value={env}>{env}</option>
                ))}
            </select>
          </div>
          <div>
            <label htmlFor="username" style={labelStyles}>Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              aria-describedby="error-message"
            />
          </div>
          <div>
            <label htmlFor="password" style={labelStyles}>Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-describedby="error-message"
            />
          </div>
          <button type="submit" disabled={isLoading} style={{ marginTop: '1rem' }}>
            {isLoading ? 'Verifying...' : 'Continue'}
          </button>
          <div id="error-message" style={errorStyles} aria-live="assertive">
            {error}
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignInScreen;