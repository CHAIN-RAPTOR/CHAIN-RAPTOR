import React, { useState, useEffect, useCallback } from 'react';

interface ApiStatusPanelProps {
    isConnected: boolean;
}

type ApiStatus = 'OPERATIONAL' | 'DEGRADED' | 'ERROR' | 'IDLE';

interface Api {
    name: string;
    status: ApiStatus;
}

const APIS_TO_MONITOR = ['Gemini API', 'Q-MAS Orchestrator', 'NIST PQC Standards', 'Threat Intel Feed (TBD)'];

const ApiStatusPanel: React.FC<ApiStatusPanelProps> = ({ isConnected }) => {
    const [apiStatuses, setApiStatuses] = useState<Api[]>(
        APIS_TO_MONITOR.map(name => ({ name, status: 'IDLE' }))
    );

    const fetchApiStatus = useCallback(async () => {
        // --- BACKEND INTEGRATION POINT ---
        // This function should fetch the status from the backend API.
        // The simulation logic has been removed. This code is currently
        // commented out for standalone frontend operation.
        
        /*
        try {
            const response = await fetch('/api/v1/status/dependencies', {
                headers: {
                    // 'Authorization': `Bearer ${sessionToken}` // A valid session token MUST be included
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch API statuses');
            }
            const data = await response.json();
            setApiStatuses(data);
        } catch (error) {
            console.error("Failed to fetch API statuses:", error);
            // Set all to ERROR on failure to indicate a problem with the backend connection
            setApiStatuses(APIS_TO_MONITOR.map(name => ({ name, status: 'ERROR' })));
        }
        */

        // --- REMOVED SIMULATION LOGIC ---
        // For testing, you can temporarily set a static state:
        console.warn("API Status fetch is a placeholder. No real data is being fetched.");
        setApiStatuses(APIS_TO_MONITOR.map(name => ({ name, status: 'OPERATIONAL' })));
        
    }, []);

    useEffect(() => {
        let interval: number;
        if (isConnected) {
            fetchApiStatus(); // Initial fetch
            interval = window.setInterval(fetchApiStatus, 5000); // Poll every 5 seconds
        } else {
            setApiStatuses(APIS_TO_MONITOR.map(name => ({ name, status: 'IDLE' })));
        }

        return () => clearInterval(interval);
    }, [isConnected, fetchApiStatus]);

    const getStatusInfo = (status: ApiStatus): { className: string; color: string; text: string } => {
        switch(status) {
            case 'OPERATIONAL': return { className: 'success', color: 'var(--success-color)', text: 'Operational' };
            case 'DEGRADED': return { className: 'warning', color: 'var(--warning-color)', text: 'Degraded' };
            case 'ERROR': return { className: 'danger', color: 'var(--danger-color)', text: 'Error' };
            default: return { className: 'idle', color: 'var(--text-color-secondary)', text: 'Idle' };
        }
    }

    return (
        <div className="card">
            <h3 className="card-header">External API Status</h3>
            <ul className="api-status-list">
                {apiStatuses.map(api => {
                    const statusInfo = getStatusInfo(api.status);
                    return (
                        <li key={api.name} className="api-status-list-item">
                            <div className="api-info">
                                <div className={`api-status-dot ${statusInfo.className}`} title={statusInfo.text}></div>
                                <span>{api.name}</span>
                            </div>
                            <span style={{color: statusInfo.color, fontWeight: 600}}>
                                {statusInfo.text}
                            </span>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default ApiStatusPanel;