import React, { useContext } from 'react';
import { AppContext, PQC_ALGORITHMS, QRNG_SOURCES, KEY_AUGMENTATION_OPTIONS, AppSettings } from '../index';
import ToggleSwitch from './ToggleSwitch';

const SettingsPanel: React.FC = () => {
    const context = useContext(AppContext);

    if (!context) return null;
    const { appSettings, setAppSettings } = context;

    const handleSettingChange = (setting: keyof AppSettings, value: string | boolean) => {
        setAppSettings(prev => ({...prev, [setting]: value}));
    };

    const renderSelect = (
        id: string, 
        label: string, 
        value: string, 
        options: { [key: string]: { name: string, description: string } }, 
        onChange: (val: string) => void
    ) => (
        <div className="settings-group">
            <label htmlFor={id}>{label}</label>
            <select id={id} value={value} onChange={e => onChange(e.target.value)}>
                {Object.entries(options).map(([key, opt]) => (
                    <option key={key} value={key}>{opt.name}</option>
                ))}
            </select>
            <p className="setting-description">{options[value].description}</p>
        </div>
    );

    return (
        <div className="card">
            <h3 className="card-header">Connection Configuration</h3>
            <div className="settings-grid">
                {renderSelect(
                    'pqc-select',
                    'PQC Algorithm',
                    appSettings.pqcAlgorithm,
                    PQC_ALGORITHMS,
                    (val) => handleSettingChange('pqcAlgorithm', val)
                )}

                {renderSelect(
                    'qrng-select',
                    'QRNG Source',
                    appSettings.qrngSource,
                    QRNG_SOURCES,
                    (val) => handleSettingChange('qrngSource', val)
                )}

                {renderSelect(
                    'key-aug-select',
                    'Key Exchange Augmentation',
                    appSettings.keyAugmentation,
                    KEY_AUGMENTATION_OPTIONS,
                    (val) => handleSettingChange('keyAugmentation', val)
                )}

                <div className="settings-group" style={{paddingTop: '1rem', borderTop: '1px solid var(--border-color)'}}>
                    <ToggleSwitch 
                        label="Auto-TLS Negotiation"
                        enabled={appSettings.autoTlsEnabled}
                        onChange={(val) => handleSettingChange('autoTlsEnabled', val)}
                    />
                    <p className="setting-description">Automatically select the most secure TLS version (e.g., 1.3) and cipher suite available for the transport layer.</p>
                </div>
            </div>
        </div>
    );
};

export default SettingsPanel;
