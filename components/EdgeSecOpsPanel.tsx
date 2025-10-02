import React, { useState, useEffect } from 'react';

interface EdgeSecOpsPanelProps {
    isConnected: boolean;
}

const findingListStyle: React.CSSProperties = {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    height: '180px', // Fixed height
    overflow: 'hidden',
    position: 'relative',
};

const findingItemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.4rem 0',
    animation: 'fadeIn 0.5s ease-out',
};

const getStatusColor = (level: 'OK' | 'WARN' | 'INFO') => {
    switch (level) {
        case 'WARN': return 'var(--warning-color)';
        case 'INFO': return 'var(--primary-color)';
        case 'OK':
        default: return 'var(--success-color)';
    }
}

// FIX: Explicitly type the `allFindings` array to ensure the `level` property matches the state's type.
const allFindings: { level: 'OK' | 'WARN' | 'INFO'; message: string }[] = [
    { level: 'OK', message: 'Packet integrity verified (SHA-256)' },
    { level: 'OK', message: 'PQC handshake compliant with NIST FIPS 203' },
    { level: 'OK', message: 'QRNG entropy levels nominal' },
    { level: 'INFO', message: 'TLS 1.3 session keys rotated successfully' },
    { level: 'OK', message: 'No DNS leaks detected' },
    { level: 'WARN', message: 'Slight latency increase detected on node 3' },
    { level: 'OK', message: 'Dilithium5 signature verification passed' },
    { level: 'INFO', message: 'NIST API connection healthy' },
    { level: 'OK', message: 'Inbound/outbound traffic ratio is normal' },
];

const EdgeSecOpsPanel: React.FC<EdgeSecOpsPanelProps> = ({ isConnected }) => {
    const [findings, setFindings] = useState<{level: 'OK' | 'WARN' | 'INFO'; message: string}[]>([]);

    useEffect(() => {
        let interval: number;
        if (isConnected) {
            // Initial findings
            setFindings([
                { level: 'INFO', message: 'Edge AI monitoring engaged...' },
                { level: 'OK', message: 'System nominal. Awaiting traffic...' }
            ]);

            interval = window.setInterval(() => {
                const nextFinding = allFindings[Math.floor(Math.random() * allFindings.length)];
                setFindings(prev => [nextFinding, ...prev].slice(0, 5));
            }, 3000);
        } else {
            setFindings([]);
        }

        return () => clearInterval(interval);

    }, [isConnected]);

    const getIcon = (level: 'OK' | 'WARN' | 'INFO') => {
        switch (level) {
            case 'WARN': return '⚠️';
            case 'INFO': return 'ℹ️';
            case 'OK': return '✅';
            default: return '➡️';
        }
    }

    return (
        <div className="card">
            <h3 className="card-header">Edge SecOps AI Analysis</h3>
            <ul style={findingListStyle}>
                {isConnected && findings.length > 0 ? (
                    findings.map((finding, index) => (
                        <li key={index} style={findingItemStyle}>
                            <span style={{color: getStatusColor(finding.level)}}>{getIcon(finding.level)}</span>
                            <span>{finding.message}</span>
                        </li>
                    ))
                ) : (
                    <div style={{color: 'var(--text-color-secondary)', textAlign: 'center', paddingTop: '3rem'}}>
                        Awaiting connection to begin analysis...
                    </div>
                )}
            </ul>
        </div>
    );
};

export default EdgeSecOpsPanel;
