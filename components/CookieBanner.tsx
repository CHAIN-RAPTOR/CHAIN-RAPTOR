import React, { useState } from 'react';

const CookieBanner: React.FC = () => {
    const [isVisible, setIsVisible] = useState(true);

    const handleAccept = () => {
        // In a real app, you'd set a cookie here.
        // For this simulation, we just hide the banner.
        setIsVisible(false);
    };

    if (!isVisible) {
        return null;
    }

    return (
        <div className="cookie-banner">
            <p>
                We collect telemetry and log data to maintain security, provide robust enhancements, and ensure the integrity of our systems. This information is secured via a private, post-quantum enhanced blockchain ledger. By continuing, you agree to this data collection.
            </p>
            <button onClick={handleAccept}>Accept & Continue</button>
        </div>
    );
};

export default CookieBanner;
