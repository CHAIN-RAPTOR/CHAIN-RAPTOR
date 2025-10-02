import React, { useContext } from 'react';
import { AppContext, PQC_ALGORITHMS, AdminSettings } from '../index';

// Simulated data for AI models
// FIX: Per coding guidelines, removed deprecated model 'gemini-1.5-pro'.
const AI_MODELS = {
    'gemini-2.5-flash': 'Gemini 2.5 Flash (Balanced)',
};

const AdminDashboard: React.FC = () => {
    const context = useContext(AppContext);
    if (!context) return null;

    const { logs, adminSettings, setAdminSettings } = context;

    const criticalLogs = logs.filter(log => log.level === 'ERROR' || log.level === 'WARN');

    const handleSettingChange = (setting: keyof AdminSettings, value: string) => {
        setAdminSettings(prev => ({ ...prev, [setting]: value }));
    };

    // Helper to get color for log levels
    const getLevelColor = (level: 'WARN' | 'ERROR') => {
        return level === 'WARN' ? 'var(--warning-color)' : 'var(--danger-color)';
    };

    return (
        <div className="admin-dashboard-layout">
            <h2 className="admin-header">System Administration Dashboard</h2>
            
            <div className="card">
                <h3 className="card-header">High-Level System Statistics</h3>
                <div className="admin-stats-grid">
                    <div className="stat-card-admin">
                        <span className="stat-value-admin">1,204</span>
                        <span className="stat-label-admin">Total Active Connections</span>
                    </div>
                    <div className="stat-card-admin">
                        <span className="stat-value-admin">15.2 TB</span>
                        <span className="stat-label-admin">Total Data Processed (24h)</span>
                    </div>
                    <div className="stat-card-admin">
                        <span className="stat-value-admin">1.1M</span>
                        <span className="stat-label-admin">PQC Handshakes (24h)</span>
                    </div>
                    <div className="stat-card-admin">
                        <span className="stat-value-admin">8,452</span>
                        <span className="stat-label-admin">AI Queries (24h)</span>
                    </div>
                </div>
            </div>

            <div className="admin-grid-two-col">
                <div className="card">
                    <h3 className="card-header">System-Wide Settings</h3>
                    <div className="settings-grid">
                        <div className="settings-group">
                            <label htmlFor="default-pqc-select">Default PQC Algorithm</label>
                            <select 
                                id="default-pqc-select"
                                value={adminSettings.defaultPqcAlgorithm}
                                onChange={(e) => handleSettingChange('defaultPqcAlgorithm', e.target.value)}
                            >
                                {/* FIX: Render the 'name' property of the value object, not the object itself. */}
                                {Object.entries(PQC_ALGORITHMS).map(([key, value]) => (
                                    <option key={key} value={key}>{value.name}</option>
                                ))}
                            </select>
                            <p className="setting-description">Sets the default PQC algorithm for all new client connections.</p>
                        </div>
                        <div className="settings-group">
                            <label htmlFor="ai-model-select">AI Co-pilot Model</label>
                            <select 
                                id="ai-model-select"
                                value={adminSettings.aiModel}
                                onChange={(e) => handleSettingChange('aiModel', e.target.value)}
                            >
                                {Object.entries(AI_MODELS).map(([key, value]) => (
                                    <option key={key} value={key}>{value}</option>
                                ))}
                            </select>
                            <p className="setting-description">Selects the underlying model for the AI Security Co-pilot.</p>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <h3 className="card-header">Recent Critical Logs</h3>
                    <div className="critical-logs-container">
                        {criticalLogs.length > 0 ? (
                            criticalLogs.slice().reverse().map(log => (
                                <div key={log.id} className="critical-log-entry">
                                    {/* FIX: Add a type assertion because TypeScript doesn't narrow the type of `log.level` after the `filter` operation. This is safe because `criticalLogs` is guaranteed to only contain logs with 'WARN' or 'ERROR' levels. */}
                                    <span style={{ color: getLevelColor(log.level as 'WARN' | 'ERROR'), fontWeight: 'bold' }}>[{log.level}]</span>
                                    <span>{log.message}</span>
                                    <span className="log-timestamp">{log.timestamp}</span>
                                </div>
                            ))
                        ) : (
                            <p style={{ color: 'var(--text-color-secondary)', textAlign: 'center' }}>No critical logs found.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;