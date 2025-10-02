import React, { useState } from 'react';
import AboutModal from './AboutModal';
import WhitepaperModal from './WhitepaperModal';

const footerStyle: React.CSSProperties = {
  width: '100%',
  padding: '1rem 2rem',
  backgroundColor: 'var(--bg-color)',
  borderTop: '1px solid var(--border-color)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  color: 'var(--text-color-secondary)',
  fontSize: '0.9rem',
};

const linksStyle: React.CSSProperties = {
  display: 'flex',
  gap: '1.5rem',
};

const linkStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: 'var(--text-color-secondary)',
  cursor: 'pointer',
  textDecoration: 'underline',
};

type ModalType = 'about' | 'whitepaper' | null;

const Footer: React.FC = () => {
    const [activeModal, setActiveModal] = useState<ModalType>(null);

    const renderModal = () => {
        switch (activeModal) {
            case 'about':
                return <AboutModal onClose={() => setActiveModal(null)} />;
            case 'whitepaper':
                return <WhitepaperModal onClose={() => setActiveModal(null)} />;
            default:
                return null;
        }
    };

    return (
        <>
            <footer style={footerStyle}>
                <span>Cyberellum Technologies & Laboratory All Rights Reserved 2025</span>
                <div style={linksStyle}>
                    <button style={linkStyle} onClick={() => setActiveModal('about')}>About</button>
                    <button style={linkStyle} onClick={() => setActiveModal('whitepaper')}>White Paper</button>
                </div>
            </footer>
            {renderModal()}
        </>
    );
};

export default Footer;
