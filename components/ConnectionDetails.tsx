import React, { useState, useEffect } from 'react';
import StatusIndicator from './StatusIndicator';
import { PQC_ALGORITHMS, QRNG_SOURCES, KEY_AUGMENTATION_OPTIONS } from '../index';
import { ActiveConnectionParams } from './ClientView';

interface ConnectionDetailsProps {
    activeParams: ActiveConnectionParams | null;
}

const detailRowStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.75rem 0',
    borderBottom: '1px solid var(--border-color)',
};

const labelStyle: React.CSSProperties = {
    color: 'var(--text-color-secondary)',
    fontWeight: 600,
};

const valueStyle: React.CSSProperties = {
    fontFamily: "'Roboto Mono', monospace",
    color: 'var(--text-color)',
};


const ConnectionDetails: React.FC<ConnectionDetailsProps> = ({ activeParams }) => {
    const [duration, setDuration] = useState('00:00:00');
    const isConnected = !!activeParams;

    useEffect(() => {
        let interval: number;
        if (isConnected) {
            const startTime = Date.now();
            interval = window.setInterval(() => {
                const seconds = Math.floor((Date.now() - startTime) / 1000);
                const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
                const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
                const s = (seconds % 60).toString().padStart(2, '0');
                setDuration(`${h}:${m}:${s}`);
            }, 1000);
        } else {
            setDuration('00:00:00');
        }
        return () => clearInterval(interval);
    }, [isConnected]);
    
    const details = [
        { label: 'Concentrator IP', value: isConnected ? '34.132.98.211' : 'N/A' },
        { label: 'PQC KEM', value: isConnected ? PQC_ALGORITHMS[activeParams.pqcAlgorithm].name : 'N/A' },
        { label: 'QRNG Source', value: isConnected ? QRNG_SOURCES[activeParams.qrngSource].name : 'N/A' },
        ...(activeParams?.keyAugmentation && activeParams.keyAugmentation !== 'none' ? [{ label: 'Key Augmentation', value: KEY_AUGMENTATION_OPTIONS[activeParams.keyAugmentation].name }] : []),
        ...(activeParams?.tlsVersion ? [{ label: 'TLS Version', value: activeParams.tlsVersion }] : []),
        ...(activeParams?.cipherSuite ? [{ label: 'Cipher Suite', value: activeParams.cipherSuite }] : []),
        { label: 'Session Duration', value: isConnected ? duration : 'N/A' },
    ];


    return (
        <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 className="card-header" style={{marginBottom: 0}}>Secure Connection Details</h3>
                <StatusIndicator 
                    status={isConnected ? 'connected' : 'connecting'} 
                    text={isConnected ? 'Secure' : '...'} 
                />
            </div>
            <div>
                {details.map(({label, value}) => (
                     <div key={label} style={detailRowStyle}>
                        <span style={labelStyle}>{label}</span>
                        <span style={valueStyle}>{value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ConnectionDetails;
