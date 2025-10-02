import React from 'react';
import ToggleSwitch from './ToggleSwitch';

interface TeamPanelProps {
  meshEnabled: boolean;
  onMeshToggle: (enabled: boolean) => void;
  isConnected: boolean;
}

const teamMembers = [
    { name: 'You (Operator_01)', ip: '192.168.1.101', online: true },
    { name: 'Jane Doe (Security Lead)', ip: '10.0.5.23', online: true },
    { name: 'Alex Smith (DevOps)', ip: '10.0.8.41', online: false },
    { name: 'Robert Brown (Analyst)', ip: '192.168.1.125', online: true },
];

const TeamPanel: React.FC<TeamPanelProps> = ({ isConnected, meshEnabled, onMeshToggle }) => {
    const otherMembersOnline = teamMembers.some(member => member.online && !member.name.startsWith('You'));
    
    // Mesh can only be enabled if connected and other members are online.
    const canEnableMesh = isConnected && otherMembersOnline;

    return (
        <div className="card">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
                <h3 className="card-header" style={{marginBottom: 0}}>Multi-Target Team</h3>
                 <ToggleSwitch 
                    label="Enable Mesh" 
                    enabled={meshEnabled && canEnableMesh}
                    onChange={onMeshToggle}
                    disabled={!canEnableMesh}
                 />
            </div>
            <ul className="team-list">
                {teamMembers.map(member => (
                    <li key={member.name} className="team-list-item">
                        <div className="team-member-info">
                             <div className={`team-status-dot ${member.online ? 'online' : 'offline'}`} title={member.online ? 'Online' : 'Offline'}></div>
                             <div>
                                <span>{member.name}</span>
                                <span style={{fontSize: '0.8rem', color: 'var(--text-color-secondary)', display: 'block'}}>{member.ip}</span>
                             </div>
                        </div>
                        <span style={{color: member.online ? 'var(--success-color)' : 'var(--text-color-secondary)'}}>
                            {member.online ? 'Online' : 'Offline'}
                        </span>
                    </li>
                ))}
            </ul>
             <p style={{fontSize: '0.85rem', color: 'var(--text-color-secondary)', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)'}}>
                {!isConnected 
                    ? 'Connect to the network to enable team features.' 
                    : !otherMembersOnline 
                        ? 'Mesh unavailable: No other team members are online.' 
                        : 'Mesh available: Toggle to create a secure multi-target connection.'
                }
            </p>
        </div>
    );
};

export default TeamPanel;