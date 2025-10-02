import React from 'react';
import StatusIndicator from './StatusIndicator';

const P2PView: React.FC = () => {
    return (
        <div className="card" style={{ textAlign: 'center', padding: '4rem' }}>
            <h2 className="card-header" style={{fontSize: '1.5rem'}}>Peer-to-Peer (P2P) Mode</h2>
            <StatusIndicator status="disconnected" text="Feature Under Development" />
            <p style={{ color: 'var(--text-color-secondary)', marginTop: '1rem' }}>
                This panel will allow for establishing direct, end-to-end encrypted connections with other QPN-0+ clients.
            </p>
            <div style={{marginTop: '2rem'}}>
                <input type="text" placeholder="Enter Peer ID or IP Address" style={{maxWidth: '400px', margin: '0 auto'}}/>
                <button disabled style={{marginTop: '1rem'}}>Initiate Handshake</button>
            </div>
        </div>
    );
};

export default P2PView;
