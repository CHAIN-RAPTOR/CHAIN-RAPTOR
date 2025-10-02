import React, { useState } from 'react';

interface SignUpScreenProps {
  onSuccess: () => void;
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

const SignUpScreen: React.FC<SignUpScreenProps> = ({ onSuccess }) => {
  const [organization, setOrganization] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 12) {
        setError('Password must be at least 12 characters long.');
        return;
    }
    if (!organization || !username || !password) {
        setError('All fields are required.');
        return;
    }

    setIsLoading(true);

    // Mock registration
    setTimeout(() => {
        onSuccess();
        setIsLoading(false);
    }, 1000);
  };

  return (
    <div style={authContainerStyles}>
      <div style={authBoxStyles}>
        <h1 style={titleStyles}>Register Operator</h1>
        <p style={subtitleStyles}>Create your secure operator account.</p>
        <form style={formStyles} onSubmit={handleSignUp}>
          <div>
            <label htmlFor="organization" style={labelStyles}>Organization</label>
            <input id="organization" type="text" value={organization} onChange={(e) => setOrganization(e.target.value)} />
          </div>
          <div>
            <label htmlFor="username" style={labelStyles}>Username</label>
            <input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div>
            <label htmlFor="password" style={labelStyles}>Password</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button type="submit" disabled={isLoading} style={{ marginTop: '1rem' }}>
            {isLoading ? 'Registering...' : 'Proceed to Policies'}
          </button>
          <div id="error-message" style={errorStyles} aria-live="assertive">
            {error}
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpScreen;