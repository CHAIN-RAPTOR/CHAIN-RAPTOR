import React, { useState, useEffect, createContext, useCallback, ReactNode } from 'react';
import ReactDOM from 'react-dom/client';

import WelcomeScreen from './components/WelcomeScreen';
import SignInScreen from './components/SignInScreen';
import SignUpScreen from './components/SignUpScreen';
import LegalScreen from './components/LegalScreen';
import TwoFactorScreen from './components/TwoFactorScreen';
import InitializationScreen from './components/InitializationScreen';
import ClientView from './components/ClientView';
import TimeoutWarningModal from './components/TimeoutWarningModal';
import Footer from './components/Footer';
import CookieBanner from './components/CookieBanner';
import AdminDashboard from './components/AdminDashboard';
import P2PView from './components/P2PView';
import ServerView from './components/ServerView';

// SECTION: Type Definitions, Enums, and Constants

export interface LogEntry {
  id: number;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'SYSTEM';
  message: string;
}

export interface TrafficStats {
    up: number; // kbps
    down: number; // kbps
    totalUp: number; // MB
    totalDown: number; // MB
}

export enum DeploymentEnvironment {
    GCP = 'Google Cloud Platform (GCP)',
    Cyberellum = 'Cyberellum Private Cloud',
    Airgapped = 'Airgapped / On-Premise',
}

export const PQC_ALGORITHMS: { [key: string]: { name: string; description: string } } = {
    'auto': { name: 'Auto-Select', description: 'Automatically selects the best algorithm based on network quality and security requirements.' },
    'kyber1024': { name: 'Kyber-1024 (NIST L5)', description: 'A strong, lattice-based KEM providing NIST Level 5 security, suitable for long-term data protection.' },
    'frodo640': { name: 'FrodoKEM-640 (NIST L1)', description: 'A conservative, lattice-based KEM providing NIST Level 1 security, valued for its robust design.' },
};

export const QRNG_SOURCES: { [key: string]: { name: string; description: string } } = {
    'auto': { name: 'Auto-Select', description: 'Defaults to the highest-quality available hardware source for maximum entropy.' },
    'anu': { name: 'ANU QRNG (API)', description: 'Simulates using the Australian National University\'s quantum vacuum-based random number service.' },
    'idq': { name: 'ID Quantique (USB)', description: 'Simulates using a high-speed, hardware-based quantum random number generator.' },
    'trng3': { name: 'TrueRNG V3 (USB)', description: 'Simulates using a hardware random number generator based on avalanche noise.' },
};

export const KEY_AUGMENTATION_OPTIONS: { [key: string]: { name: string; description: string } } = {
    'none': { name: 'None', description: 'Uses only the primary PQC key exchange for the session key.' },
    'sd_pqkd': { name: 'AWS SD-PQKD (ETSI QKD 014)', description: 'This device acts as a Software-Defined PQKD endpoint. Augments the PQC handshake by integrating a secondary key from a simulated AWS-hosted, ETSI-compliant Quantum Key Distribution service.' },
};

export interface AppSettings {
    pqcAlgorithm: string;
    qrngSource: string;
    keyAugmentation: string;
    autoTlsEnabled: boolean;
}

export interface AdminSettings {
    defaultPqcAlgorithm: string;
    aiModel: string;
}

export interface AppContextType {
    logs: LogEntry[];
    addLog: (level: LogEntry['level'], message: string) => void;
    stats: TrafficStats;
    setStats: React.Dispatch<React.SetStateAction<TrafficStats>>;
    deploymentEnvironment: DeploymentEnvironment;
    setDeploymentEnvironment: (env: DeploymentEnvironment) => void;
    appSettings: AppSettings;
    setAppSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
    adminSettings: AdminSettings;
    setAdminSettings: React.Dispatch<React.SetStateAction<AdminSettings>>;
}

export const AppContext = createContext<AppContextType | null>(null);

const APP_SETTINGS_KEY = 'qpn-app-settings';
const DEPLOYMENT_ENV_KEY = 'qpn-deployment-env';
const ADMIN_SETTINGS_KEY = 'qpn-admin-settings';

// SECTION: Main Application Component

type AppState = 'welcome' | 'signin' | 'signup' | 'legal_tos' | 'legal_privacy' | '2fa_setup' | '2fa_verify' | 'initializing' | 'dashboard' | 'auth_failed';
export type View = 'client' | 'server' | 'p2p' | 'admin';


const SESSION_TIMEOUT = 15 * 60 * 1000; // 15 minutes
const TIMEOUT_WARNING_TIME = 30 * 1000; // 30 seconds before timeout

const App: React.FC = () => {
    const [appState, setAppState] = useState<AppState>('welcome');
    const [view, setView] = useState<View>('client');
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [stats, setStats] = useState<TrafficStats>({ up: 0, down: 0, totalUp: 0, totalDown: 0 });
    
    // State with localStorage persistence
    const [deploymentEnvironment, setDeploymentEnvironment] = useState<DeploymentEnvironment>(() => {
        const saved = localStorage.getItem(DEPLOYMENT_ENV_KEY);
        return saved ? JSON.parse(saved) : DeploymentEnvironment.GCP;
    });

    const [appSettings, setAppSettings] = useState<AppSettings>(() => {
        const saved = localStorage.getItem(APP_SETTINGS_KEY);
        return saved ? JSON.parse(saved) : {
            pqcAlgorithm: 'auto',
            qrngSource: 'auto',
            keyAugmentation: 'none',
            autoTlsEnabled: true
        };
    });

    const [adminSettings, setAdminSettings] = useState<AdminSettings>(() => {
        const saved = localStorage.getItem(ADMIN_SETTINGS_KEY);
        return saved ? JSON.parse(saved) : {
            defaultPqcAlgorithm: 'kyber1024',
            aiModel: 'gemini-2.5-flash',
        };
    });
    
    const [isTimeoutWarning, setIsTimeoutWarning] = useState(false);

    // Save settings to localStorage on change
    useEffect(() => {
        localStorage.setItem(DEPLOYMENT_ENV_KEY, JSON.stringify(deploymentEnvironment));
    }, [deploymentEnvironment]);

    useEffect(() => {
        localStorage.setItem(APP_SETTINGS_KEY, JSON.stringify(appSettings));
    }, [appSettings]);

    useEffect(() => {
        localStorage.setItem(ADMIN_SETTINGS_KEY, JSON.stringify(adminSettings));
    }, [adminSettings]);
    
    // Activity and Timeout Management
    const warningTimerRef = React.useRef<number | null>(null);
    const logoutTimerRef = React.useRef<number | null>(null);
    
    const stopTimers = useCallback(() => {
        if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
        if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
    }, []);

    const handleLogout = useCallback((message: string = 'User logged out.') => {
        addLog('SYSTEM', message);
        setAppState('welcome');
        setView('client');
        setIsTimeoutWarning(false);
        stopTimers();
    }, []);

    const startTimers = useCallback(() => {
        stopTimers();
        warningTimerRef.current = window.setTimeout(() => setIsTimeoutWarning(true), SESSION_TIMEOUT - TIMEOUT_WARNING_TIME);
        logoutTimerRef.current = window.setTimeout(() => handleLogout('Session timed out due to inactivity.'), SESSION_TIMEOUT);
    }, [handleLogout, stopTimers]);
    
    const resetTimers = useCallback(() => {
        startTimers();
    }, [startTimers]);

    useEffect(() => {
        const handleActivity = () => resetTimers();
        if (appState === 'dashboard') {
            startTimers();
            window.addEventListener('mousemove', handleActivity);
            window.addEventListener('keydown', handleActivity);
            return () => {
                stopTimers();
                window.removeEventListener('mousemove', handleActivity);
                window.removeEventListener('keydown', handleActivity);
            }
        }
    }, [appState, resetTimers, startTimers, stopTimers]);
    

    const addLog = useCallback((level: LogEntry['level'], message: string) => {
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
        setLogs(prevLogs => [...prevLogs.slice(-200), { id: Date.now(), timestamp, level, message }]);
    }, []);

    const renderDashboardView = () => {
        switch(view) {
            case 'client': return <ClientView />;
            case 'server': return <ServerView />;
            case 'p2p': return <P2PView />;
            case 'admin': return <AdminDashboard />;
            default: return <ClientView />;
        }
    }

    const renderAppState = () => {
        switch(appState) {
            case 'welcome':
                return <WelcomeScreen onSignIn={() => setAppState('signin')} onSignUp={() => setAppState('signup')} />;
            case 'signin':
                return <SignInScreen onAuthSuccess={() => setAppState('2fa_verify')} />;
            case 'signup':
                return <SignUpScreen onSuccess={() => setAppState('legal_tos')} />;
            case 'legal_tos':
                return <LegalScreen title="Terms of Service" content="This is a placeholder for Terms of Service content." onAccept={() => setAppState('legal_privacy')} />;
            case 'legal_privacy':
                return <LegalScreen title="Acceptable Use & Anti-Malice Policy" content="This is a placeholder for the Acceptable Use Policy." onAccept={() => setAppState('2fa_setup')} />;
            case '2fa_setup':
                return <TwoFactorScreen isSetup={true} onSuccess={() => setAppState('initializing')} />;
            case '2fa_verify':
                 return <TwoFactorScreen isSetup={false} onSuccess={() => setAppState('initializing')} />;
            case 'initializing':
                return <InitializationScreen onInitialized={() => { addLog('SYSTEM', `Operator signed in to ${deploymentEnvironment}`); setAppState('dashboard'); }} onFailure={(msg) => { addLog('ERROR', msg); setAppState('auth_failed'); }} />;
            case 'dashboard':
                return (
                    <div className="dashboard-layout">
                        <nav className="sidebar">
                            <div className="sidebar-logo">QPN-0+</div>
                            {(['client', 'server', 'p2p', 'admin'] as View[]).map(v => (
                                <button key={v} className={`sidebar-btn ${view === v ? 'active' : ''}`} onClick={() => setView(v)}>
                                    {v.charAt(0).toUpperCase() + v.slice(1)} Mode
                                </button>
                            ))}
                            <button className="sidebar-btn logout" onClick={() => handleLogout()}>Sign Out</button>
                        </nav>
                        <div className="dashboard-content">
                            {renderDashboardView()}
                        </div>
                    </div>
                );
            case 'auth_failed':
                 return <div className="card" style={{textAlign: 'center', color: 'var(--danger-color)'}}><h2>Authentication Failed</h2><p>A critical security check failed. Please restart the application.</p><button onClick={() => setAppState('welcome')} style={{marginTop: '1rem'}}>Return to Welcome</button></div>;
            default:
                return <WelcomeScreen onSignIn={() => setAppState('signin')} onSignUp={() => setAppState('signup')} />;
        }
    };

    const contextValue: AppContextType = {
        logs,
        addLog,
        stats,
        setStats,
        deploymentEnvironment,
        setDeploymentEnvironment,
        appSettings,
        setAppSettings,
        adminSettings,
        setAdminSettings,
    };

    return (
        <AppContext.Provider value={contextValue}>
            <div className="app-container">
                <main className="main-content-full">
                    {renderAppState()}
                </main>
                {appState === 'dashboard' && <Footer />}
                {appState === 'dashboard' && <CookieBanner />}
                {isTimeoutWarning && <TimeoutWarningModal onStay={resetTimers} onLogout={() => handleLogout()} />}
            </div>
        </AppContext.Provider>
    );
};

const rootElement = document.getElementById('root');
if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
}
