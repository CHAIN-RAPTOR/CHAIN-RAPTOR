import React, { useState, useEffect, useRef, useContext } from 'react';
import StatusIndicator from './StatusIndicator';
import { AppContext, PQC_ALGORITHMS } from '../index';

interface Telemetry {
    activeConnections: number;
    cpuLoad: number; // percentage
    memUsage: number; // percentage
    totalDataProcessed: number; // GB
    handshakesPerSec: number;
}

interface ConnectedClient {
    id: string;
    ip: string;
    pqcAlgorithm: string;
    connectedSince: number; // timestamp
}

const ServerView: React.FC = () => {
    const [isListening, setIsListening] = useState(false);
    const [telemetry, setTelemetry] = useState<Telemetry>({
        activeConnections: 0,
        cpuLoad: 0,
        memUsage: 0,
        totalDataProcessed: 0,
        handshakesPerSec: 0,
    });
    const [clients, setClients] = useState<ConnectedClient[]>([]);
    const webSocketRef = useRef<WebSocket | null>(null);
    const context = useContext(AppContext);

    const formatDuration = (startTime: number) => {
        const seconds = Math.floor((Date.now() - startTime) / 1000);
        const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
        const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${h}:${m}:${s}`;
    };

    const stopServer = () => {
        if (webSocketRef.current) {
            webSocketRef.current.close();
            webSocketRef.current = null;
        }
        setIsListening(false);
        setClients([]);
        setTelemetry({
            activeConnections: 0,
            cpuLoad: 0,
            memUsage: 0,
            totalDataProcessed: 0,
            handshakesPerSec: 0,
        });
        context?.addLog('SYSTEM', 'Concentrator has stopped listening.');
    };

    const startServer = () => {
        context?.addLog('SYSTEM', 'Concentrator is starting...');
        
        // --- BACKEND INTEGRATION POINT ---
        // This section should establish a WebSocket connection to the backend telemetry service.
        // The simulation logic has been removed. This code is commented out for standalone
        // frontend operation.
        
        /*
        // const sessionToken = "GET_SESSION_TOKEN_FROM_CONTEXT_OR_STORAGE";
        // const socket = new WebSocket(`wss://your-backend-url/api/v1/server/telemetry?token=${sessionToken}`);
        // webSocketRef.current = socket;

        // socket.onopen = () => {
        //     setIsListening(true);
        //     context?.addLog('SYSTEM', 'Connected to telemetry stream. Listening for incoming PQC connections.');
        // };

        // socket.onmessage = (event) => {
        //     const data = JSON.parse(event.data);
        //     if (data.type === 'telemetry_update') {
        //         setTelemetry(data.payload);
        //     } else if (data.type === 'client_list_update') {
        //         setClients(data.payload);
        //         setTelemetry(prev => ({ ...prev, activeConnections: data.payload.length }));
        //     } else if (data.type === 'log_entry') {
        //          context?.addLog(data.payload.level, `[CONCENTRATOR] ${data.payload.message}`);
        //     }
        // };

        // socket.onclose = () => {
        //     setIsListening(false);
        //     context?.addLog('SYSTEM', 'Telemetry connection lost.');
        //     webSocketRef.current = null;
        // };

        // socket.onerror = (error) => {
        //     console.error('WebSocket Error:', error);
        //     context?.addLog('ERROR', 'Telemetry WebSocket connection error.');
        //     setIsListening(false);
        //     webSocketRef.current = null;
        // };
        */
        
        // For now, we just set the state to indicate it's "running"
        setIsListening(true);
        context?.addLog('WARN', 'Server view is running in OFFLINE mode. No real backend telemetry is available.');
        // --- END BACKEND INTEGRATION POINT ---
    };

    // --- REMOVED SIMULATION LOGIC ---
    // The previous useEffect hook containing simulation logic has been removed
    // to make this component backend-ready. All updates should come from the
    // WebSocket `onmessage` handler.

    if (!isListening) {
        return (
            <div className="card" style={{ textAlign: 'center', padding: '4rem' }}>
                <h2 className="card-header" style={{ fontSize: '1.5rem' }}>Server / Concentrator Mode</h2>
                <StatusIndicator status="disconnected" text="Currently Inactive" />
                <p style={{ color: 'var(--text-color-secondary)', marginTop: '1rem' }}>
                    Activate the server to begin listening for incoming client connections and monitor live telemetry.
                </p>
                <div style={{ marginTop: '2rem' }}>
                    <button onClick={startServer}>Start Listening on Port 443</button>
                </div>
            </div>
        );
    }

    const { activeConnections, cpuLoad, memUsage, totalDataProcessed, handshakesPerSec } = telemetry;
    
    return (
        <>
            <div className="card">
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h2 className="card-header" style={{marginBottom: 0}}>Concentrator Telemetry</h2>
                        <StatusIndicator status="connected" text="Active and Listening (Offline Mode)" />
                    </div>
                    <button onClick={stopServer} style={{backgroundColor: 'var(--danger-color)'}}>Stop Server</button>
                </div>
            </div>
            <div className="server-dashboard-grid">
                <div className="card telemetry-card">
                    <div className="telemetry-value">{activeConnections}</div>
                    <div className="telemetry-label">Active Connections</div>
                </div>
                 <div className="card telemetry-card">
                    <div className="telemetry-value">{handshakesPerSec}/s</div>
                    <div className="telemetry-label">PQC Handshakes</div>
                </div>
                <div className="card telemetry-card">
                    <div className="telemetry-value">{totalDataProcessed.toFixed(2)} GB</div>
                    <div className="telemetry-label">Total Data Processed</div>
                </div>
                <div className="card telemetry-card">
                    <div className="telemetry-value" style={{color: cpuLoad > 90 ? 'var(--danger-color)' : 'var(--primary-color)'}}>{cpuLoad.toFixed(1)}%</div>
                    <div className="telemetry-label">CPU Load</div>
                    <div className="telemetry-progress-bar"><div className="telemetry-progress-bar-inner" style={{width: `${cpuLoad}%`, backgroundColor: cpuLoad > 90 ? 'var(--danger-color)' : 'var(--primary-color)'}}></div></div>
                </div>
                 <div className="card telemetry-card">
                    <div className="telemetry-value" style={{color: memUsage > 90 ? 'var(--danger-color)' : 'var(--primary-color)'}}>{memUsage.toFixed(1)}%</div>
                    <div className="telemetry-label">Memory Usage</div>
                    <div className="telemetry-progress-bar"><div className="telemetry-progress-bar-inner" style={{width: `${memUsage}%`, backgroundColor: memUsage > 90 ? 'var(--danger-color)' : 'var(--primary-color)'}}></div></div>
                </div>
            </div>
             <div className="card">
                <h3 className="card-header">Connected Clients ({clients.length})</h3>
                <ul className="client-list">
                    {clients.length > 0 ? clients.map(client => (
                        <li key={client.id} className="client-list-item">
                            <div>
                                <div style={{fontFamily: 'var(--font-family-mono)'}}>{client.ip}</div>
                                <div style={{fontSize: '0.8rem', color: 'var(--text-color-secondary)'}}>{client.pqcAlgorithm}</div>
                            </div>
                            <span style={{color: 'var(--text-color-secondary)', fontFamily: 'var(--font-family-mono)'}}>{formatDuration(client.connectedSince)}</span>
                        </li>
                    )) : (
                        <p style={{color: 'var(--text-color-secondary)', textAlign: 'center'}}>Awaiting client connections...</p>
                    )}
                </ul>
            </div>
        </>
    );
};

export default ServerView;