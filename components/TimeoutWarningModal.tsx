import React, { useState, useEffect } from 'react';

interface TimeoutWarningModalProps {
  onStay: () => void;
  onLogout: () => void;
}

const TimeoutWarningModal: React.FC<TimeoutWarningModalProps> = ({ onStay, onLogout }) => {
    const [countdown, setCountdown] = useState(30);

    useEffect(() => {
        if (countdown <= 0) {
            // The main timer in index.tsx will handle the logout.
            // This is a fallback/visual cue.
            return;
        }

        const timer = setInterval(() => {
            setCountdown(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [countdown, onLogout]);


    return (
        <div className="timeout-modal-backdrop">
            <div className="timeout-modal-content">
                <h2>Session Timeout Warning</h2>
                <p>You will be logged out due to inactivity in:</p>
                <div className="countdown">{countdown} seconds</div>
                <div className="timeout-modal-buttons">
                    <button onClick={onStay} style={{backgroundColor: 'var(--primary-color)'}}>
                        Stay Logged In
                    </button>
                    <button onClick={onLogout} style={{backgroundColor: 'var(--surface-color-hover)', color: 'var(--text-color)'}}>
                        Log Out Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TimeoutWarningModal;