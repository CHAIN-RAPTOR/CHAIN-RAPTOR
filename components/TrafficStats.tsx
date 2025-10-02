import React from 'react';

interface TrafficStatsProps {
    stats: {
        up: number; // kbps
        down: number; // kbps
        totalUp: number; // MB
        totalDown: number; // MB
    };
}

const statsContainer: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
    textAlign: 'center',
};

const statBox: React.CSSProperties = {
    padding: '1rem',
    backgroundColor: 'var(--bg-color)',
    borderRadius: '8px',
};

const statValue: React.CSSProperties = {
    fontSize: '1.5rem',
    fontFamily: "'Roboto Mono', monospace",
    color: 'var(--primary-color)',
    fontWeight: 700,
};

const statLabel: React.CSSProperties = {
    fontSize: '0.9rem',
    color: 'var(--text-color-secondary)',
    marginTop: '0.25rem',
    display: 'block',
};

const TrafficStats: React.FC<TrafficStatsProps> = ({ stats }) => {
    const formatSpeed = (kbps: number) => {
        if (kbps < 1000) return `${kbps.toFixed(1)} kbps`;
        return `${(kbps / 1000).toFixed(2)} Mbps`;
    };

    return (
        <div className="card">
            <h3 className="card-header">Traffic Statistics</h3>
            <div style={statsContainer}>
                <div style={statBox}>
                    <div style={statValue} aria-label={`Download speed ${formatSpeed(stats.down)}`}>
                        {formatSpeed(stats.down)}
                    </div>
                    <span style={statLabel}>Download</span>
                </div>
                <div style={statBox}>
                    <div style={statValue} aria-label={`Upload speed ${formatSpeed(stats.up)}`}>
                        {formatSpeed(stats.up)}
                    </div>
                    <span style={statLabel}>Upload</span>
                </div>
                <div style={statBox}>
                    <div style={statValue} aria-label={`Total data downloaded ${stats.totalDown.toFixed(2)} megabytes`}>
                        {stats.totalDown.toFixed(2)} MB
                    </div>
                    <span style={statLabel}>Total Down</span>
                </div>
                <div style={statBox}>
                    <div style={statValue} aria-label={`Total data uploaded ${stats.totalUp.toFixed(2)} megabytes`}>
                        {stats.totalUp.toFixed(2)} MB
                    </div>
                    <span style={statLabel}>Total Up</span>
                </div>
            </div>
        </div>
    );
};

export default TrafficStats;
