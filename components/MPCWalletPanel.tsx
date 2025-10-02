import React from 'react';

const detailRowStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.5rem 0',
    borderBottom: '1px solid var(--border-color)',
};

const labelStyle: React.CSSProperties = {
    color: 'var(--text-color-secondary)',
    fontWeight: 600,
};

const valueStyle: React.CSSProperties = {
    fontFamily: "'Roboto Mono', monospace",
    color: 'var(--text-color)',
    textAlign: 'right',
};

const MPCWalletPanel: React.FC = () => {
    
    const details = {
        'Wallet ID': 'mpc-org-alpha-primary',
        'Status': 'Secured & Active',
        'Total Shards': '3 of 5',
        'Threshold': '2/3',
        'Associated Members': 'You, J. Doe, A. Smith',
    };

    return (
        <div className="card">
            <h3 className="card-header">MPC Wallet Status</h3>
            <div>
                {Object.entries(details).map(([key, value]) => (
                    <div key={key} style={detailRowStyle}>
                        <span style={labelStyle}>{key}</span>
                        <span style={{...valueStyle, color: key === 'Status' ? 'var(--success-color)' : 'var(--text-color)'}}>
                            {value}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MPCWalletPanel;