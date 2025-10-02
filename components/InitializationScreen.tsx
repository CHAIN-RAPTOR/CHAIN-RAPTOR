import React, { useState, useEffect, useContext } from 'react';
import { AppContext, DeploymentEnvironment } from '../index';

interface InitializationScreenProps {
  onInitialized: () => void;
  onFailure: (message: string) => void;
}

const initContainerStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
  animation: 'fadeIn 0.5s',
};

const initBoxStyles: React.CSSProperties = {
  width: '100%',
  maxWidth: '600px',
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

type StepStatus = 'pending' | 'running' | 'done' | 'failed';

interface Step {
    label: string;
    status: StepStatus;
    isSecurityCheck: boolean;
    failureReason?: string;
}

const getInitialSteps = (environment: DeploymentEnvironment): Step[] => {
    let mpcServiceHost = 'GCP MPC service';
    let remoteEndpointHost = 'GCP remote endpoint';

    if (environment === DeploymentEnvironment.Cyberellum) {
        mpcServiceHost = 'Cyberellum MPC service';
        remoteEndpointHost = 'Cyberellum remote endpoint';
    } else if (environment === DeploymentEnvironment.Airgapped) {
        mpcServiceHost = 'local network MPC endpoint';
        remoteEndpointHost = 'On-Premise endpoint';
    }

    return [
        { label: 'Initializing local systems...', status: 'pending', isSecurityCheck: false },
        { label: 'Scanning for conflicting VPN clients...', status: 'pending', isSecurityCheck: true, failureReason: 'A conflicting VPN client (e.g., split-tunneling) was detected. All other VPNs must be disabled.' },
        { label: 'Checking for known malware signatures...', status: 'pending', isSecurityCheck: true, failureReason: 'A known malicious software signature was detected on this endpoint. Connection terminated.' },
        { label: 'Verifying critical process integrity (EdgeSecOpsAI)...', status: 'pending', isSecurityCheck: true, failureReason: 'A critical security process (EdgeSecOpsAI) is not running. Please restart the application.' },
        { label: `Establishing secure link to ${mpcServiceHost}...`, status: 'pending', isSecurityCheck: false },
        { label: 'Generating user signature for MPC wallet...', status: 'pending', isSecurityCheck: false },
        { label: 'Awaiting local Edge AI co-signature...', status: 'pending', isSecurityCheck: false },
        { label: `Awaiting ${remoteEndpointHost} co-signature...`, status: 'pending', isSecurityCheck: false },
        { label: 'MPC Wallet unlocked. Finalizing...', status: 'pending', isSecurityCheck: false },
    ];
};

const StatusIcon: React.FC<{ status: StepStatus }> = ({ status }) => {
    switch (status) {
        case 'running':
            return <div className="init-spinner" aria-label="In progress"></div>;
        case 'done':
            return <span role="img" aria-label="Completed">✅</span>;
        case 'failed':
            return <span role="img" aria-label="Failed">❌</span>;
        case 'pending':
        default:
            return <span role="img" aria-label="Pending">⚪</span>;
    }
};

const InitializationScreen: React.FC<InitializationScreenProps> = ({ onInitialized, onFailure }) => {
    const context = useContext(AppContext);
    const [steps, setSteps] = useState<ReturnType<typeof getInitialSteps>>([]);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (!context) return;

        const initialStepsForEnv = getInitialSteps(context.deploymentEnvironment);
        setSteps(initialStepsForEnv);
        
        const processSteps = async () => {
            for (let i = 0; i < initialStepsForEnv.length; i++) {
                const currentStep = initialStepsForEnv[i];
                // Set step to running
                setSteps(prev => prev.map((step, index) => index === i ? { ...step, status: 'running' } : step));
                
                await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 400));

                // Security Check simulation
                if (currentStep.isSecurityCheck) {
                    const complianceFailed = Math.random() < 0.05; // 5% chance of failure per check
                    if (complianceFailed) {
                        const failureReason = currentStep.failureReason || "Endpoint security compliance check failed.";
                        setSteps(prev => prev.map((step, index) => index === i ? { ...step, status: 'failed' } : step));
                        await new Promise(resolve => setTimeout(resolve, 1000)); // Pause to show error
                        onFailure(failureReason);
                        return; // Stop the process
                    }
                }
                
                // Set step to done
                setSteps(prev => prev.map((step, index) => index === i ? { ...step, status: 'done' } : step));
                setProgress(((i + 1) / initialStepsForEnv.length) * 100);
            }
            
            // Final delay before transitioning
            await new Promise(resolve => setTimeout(resolve, 1000));
            onInitialized();
        };

        processSteps();
    }, [onInitialized, onFailure, context]);

    if (!context) return null;

    return (
        <div style={initContainerStyles}>
            <div style={initBoxStyles}>
                <h1 style={titleStyles}>Initializing Secure Terminal</h1>
                <p style={subtitleStyles}>Please wait while we configure your secure environment.</p>
                
                <ul className="init-step-list">
                    {steps.map((step, index) => (
                        <li key={index} className={`init-step ${step.status}`}>
                            <div className="init-status-icon">
                                <StatusIcon status={step.status} />
                            </div>
                            <span>{step.label}</span>
                        </li>
                    ))}
                </ul>
                
                <div className="progress-bar-container">
                    <div className="progress-bar" style={{ width: `${progress}%` }}></div>
                </div>
            </div>
        </div>
    );
};

export default InitializationScreen;