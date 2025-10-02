import React, { useState, useEffect, useContext } from 'react';
import { AppContext, PQC_ALGORITHMS, QRNG_SOURCES, KEY_AUGMENTATION_OPTIONS } from '../index';

import ConnectionDetails from './ConnectionDetails';
import TrafficStats from './TrafficStats';
import TrafficChart from './TrafficChart';
import LogPanel from './LogPanel';
import TeamPanel from './TeamPanel';
import SettingsPanel from './SettingsPanel';
import ApiStatusPanel from './ApiStatusPanel';
import EdgeSecOpsPanel from './EdgeSecOpsPanel';
import MPCWalletPanel from './MPCWalletPanel';
import AIAssistant from './AIAssistant';
import SecureConnectionDiagram from './SecureConnectionDiagram';
import StatusIndicator from './StatusIndicator';

export interface ActiveConnectionParams {
    pqcAlgorithm: string;
    qrngSource: string;
    keyAugmentation: string;
    tlsVersion?: string;
    cipherSuite?: string;
}

const ClientView: React.FC = () => {
    const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
    const [activeParams, setActiveParams] = useState<ActiveConnectionParams | null>(null);
    const [meshEnabled, setMeshEnabled] = useState(false);
    const [trafficData, setTrafficData] = useState<number[]>(new Array(30).fill(0));
    const context = useContext(AppContext);

    useEffect(() => {
        let trafficInterval: number;
        if (connectionStatus === 'connected' && context) {
            trafficInterval = window.setInterval(() => {
                const newDownSpeed = Math.random() * 800 + 100; // random kbps
                const newUpSpeed = Math.random() * 200 + 50;
                setTrafficData(prev => [...prev.slice(1), newDownSpeed + newUpSpeed]);
                context.setStats(prev => ({
                    down: newDownSpeed,
                    up: newUpSpeed,
                    totalDown: prev.totalDown + (newDownSpeed / 8 / 1000), // MB
                    totalUp: prev.totalUp + (newUpSpeed / 8 / 1000)
                }));
            }, 1000);
        }
        return () => clearInterval(trafficInterval);
    }, [connectionStatus, context]);
    
    const handleConnect = async () => {
        if (!context) return;
        setConnectionStatus('connecting');
        const { addLog, appSettings } = context;
        
        const selectedPqc = appSettings.pqcAlgorithm === 'auto' ? 'kyber1024' : appSettings.pqcAlgorithm;
        const selectedQrng = appSettings.qrngSource === 'auto' ? 'anu' : appSettings.qrngSource;

        const currentParams: ActiveConnectionParams = {
            pqcAlgorithm: selectedPqc,
            qrngSource: selectedQrng,
            keyAugmentation: appSettings.keyAugmentation,
        };

        addLog('SYSTEM', 'Initiating secure connection...');
        await new Promise(r => setTimeout(r, 500));
        
        if (appSettings.autoTlsEnabled) {
            addLog('INFO', 'Negotiating optimal TLS settings...');
            currentParams.tlsVersion = 'TLS 1.3';
            currentParams.cipherSuite = 'TLS_AES_256_GCM_SHA384';
            await new Promise(r => setTimeout(r, 500));
        }
        
        if (currentParams.keyAugmentation !== 'none') {
            addLog('INFO', `Requesting augmentation key from ${KEY_AUGMENTATION_OPTIONS[currentParams.keyAugmentation].name}...`);
             await new Promise(r => setTimeout(r, 600));
        }

        addLog('INFO', `Sourcing entropy from ${QRNG_SOURCES[selectedQrng].name}...`);
        await new Promise(r => setTimeout(r, 500));
        
        addLog('INFO', `Performing PQC handshake (${PQC_ALGORITHMS[selectedPqc].name})...`);
        await new Promise(r => setTimeout(r, 1000));

        addLog('INFO', 'Verifying server signature (Dilithium)...');
        await new Promise(r => setTimeout(r, 800));

        addLog('SYSTEM', 'Secure connection established to GCP concentrator.');
        setConnectionStatus('connected');
        setActiveParams(currentParams);
    };

    const handleDisconnect = () => {
        if (!context) return;
        setConnectionStatus('disconnected');
        setActiveParams(null);
        setTrafficData(new Array(30).fill(0));
        setMeshEnabled(false);
        context.setStats({ up: 0, down: 0, totalUp: 0, totalDown: 0 });
        context.addLog('SYSTEM', 'Connection terminated by user.');
    };
    
    const getStatusText = () => {
        switch(connectionStatus) {
            case 'connected': return 'Connection Secured';
            case 'connecting': return 'Establishing Handshake...';
            case 'disconnected': return 'Awaiting Connection';
        }
    }

    if (!context) return null;
    const { stats } = context;

    return (
        <div className="client-view-layout">
            <header className="client-header">
                <h1>Operator Control Plane</h1>
            </header>
            
            <div className="control-panel">
                <div>
                    { connectionStatus === 'disconnected' && <button onClick={handleConnect}>Connect to Concentrator</button> }
                    { connectionStatus === 'connecting' && <button disabled>Connecting...</button> }
                    { connectionStatus === 'connected' && <button onClick={handleDisconnect} style={{backgroundColor: 'var(--danger-color)'}}>Disconnect</button> }
                </div>
                <StatusIndicator status={connectionStatus} text={getStatusText()} />
            </div>

            <div className="dashboard-grid">
                <div className="grid-col-span-3">
                    <TrafficChart data={trafficData} />
                </div>
                <div className="card grid-col-span-2">
                     <SecureConnectionDiagram isConnected={connectionStatus === 'connected'} meshEnabled={meshEnabled} />
                </div>
                
                <TeamPanel isConnected={connectionStatus === 'connected'} meshEnabled={meshEnabled} onMeshToggle={setMeshEnabled} />

                <div className="grid-col-span-2">
                     <ConnectionDetails activeParams={activeParams} />
                </div>
                <TrafficStats stats={stats} />
                
                <div className="grid-col-span-2">
                    <LogPanel />
                </div>
                
                <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
                    <SettingsPanel />
                    <ApiStatusPanel isConnected={connectionStatus === 'connected'} />
                </div>
                
                <div className="grid-col-span-2">
                    <EdgeSecOpsPanel isConnected={connectionStatus === 'connected'} />
                </div>
                
                <MPCWalletPanel />
            </div>

            <AIAssistant />
        </div>
    );
};

export default ClientView;
