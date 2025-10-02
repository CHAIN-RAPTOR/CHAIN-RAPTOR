import React from 'react';

interface SecureConnectionDiagramProps {
    isConnected: boolean;
    meshEnabled: boolean;
}

const teamMembers = [
    { name: 'J. Doe', online: true },
    { name: 'A. Smith', online: false },
    { name: 'R. Brown', online: true },
];

const SecureConnectionDiagram: React.FC<SecureConnectionDiagramProps> = ({ isConnected, meshEnabled }) => {
    
    const onlineTeam = ['You', ...teamMembers.filter(m => m.online).map(m => m.name)];

    const renderAliceAndBob = () => (
        <>
            <text x="500" y="40" className="diagram-sub-label" style={{fill: 'var(--primary-color)'}}>Quantum Key Distribution Channel</text>
            <text x="500" y="215" className="diagram-sub-label">Quantum measurement disturbs the system, revealing eavesdroppers.</text>
            
            {/* Alice */}
            <g className="diagram-node-group" transform="translate(150, 125)">
                <circle cx="0" cy="0" r="45" className="diagram-node-circle" />
                <text x="0" y="5" className="diagram-node-label">Alice</text>
            </g>

            {/* Bob */}
             <g className="diagram-node-group" transform="translate(850, 125)">
                <circle cx="0" cy="0" r="45" className="diagram-node-circle" />
                <text x="0" y="5" className="diagram-node-label">Bob</text>
            </g>

            {/* Connection Line */}
            <line x1="195" y1="125" x2="805" y2="125" className="diagram-connection-line" />
            
            {/* Eve */}
             <g className="diagram-node-group" transform="translate(500, 125)">
                <circle cx="0" cy="0" r="25" className="diagram-eve-node-circle" />
                <text x="0" y="5" className="diagram-eve-label">Eve</text>
            </g>
        </>
    );
    
    const renderMesh = () => {
        const numMembers = onlineTeam.length;
        const radius = 90;
        const center = { x: 500, y: 125 };

        return (
             <>
                <text x="500" y="40" className="diagram-sub-label" style={{fill: 'var(--primary-color)'}}>Multi-Target PQC Mesh Network</text>
                {onlineTeam.map((member, i) => {
                    const angle = (i / numMembers) * 2 * Math.PI - Math.PI / 2;
                    const isCenterNode = member === 'You';
                    const x = isCenterNode ? center.x : center.x + Math.cos(angle) * 350;
                    const y = isCenterNode ? center.y : center.y + Math.sin(angle) * radius;

                    return (
                        <React.Fragment key={member}>
                            {!isCenterNode && (
                                <line x1={center.x} y1={center.y} x2={x} y2={y} className="diagram-connection-line" />
                            )}
                             <g className="diagram-node-group" transform={`translate(${x}, ${y})`}>
                                <circle cx="0" cy="0" r={isCenterNode ? 50 : 40} className="diagram-node-circle" />
                                <text x="0" y="5" className="diagram-node-label" style={{fontSize: isCenterNode ? '20px': '16px'}}>{member}</text>
                            </g>
                        </React.Fragment>
                    );
                })}
            </>
        );
    };

    const renderContent = () => {
        if (!isConnected) {
            return <text x="500" y="135" className="diagram-placeholder-text">Awaiting secure connection...</text>;
        }
        if (meshEnabled) {
            return renderMesh();
        }
        return renderAliceAndBob();
    }


    return (
        <div className="secure-diagram-container">
            <svg className="diagram-svg" viewBox="0 0 1000 250" preserveAspectRatio="xMidYMid meet">
                <defs>
                    <path id="wavePath" d="M0,25 C250,0,250,50,500,25 C750,0,750,50,1000,25" />
                </defs>
                <use href="#wavePath" y="50" className="diagram-bg-wave" />
                <use href="#wavePath" y="100" className="diagram-bg-wave" />
                <use href="#wavePath" y="150" className="diagram-bg-wave" />

                {renderContent()}

            </svg>
        </div>
    );
};

export default SecureConnectionDiagram;
