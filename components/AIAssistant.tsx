
import React, { useState, useContext, useRef, useEffect } from 'react';
import { AppContext } from '../index';
// Fix: Import GoogleGenAI from the correct package
import { GoogleGenAI } from "@google/genai";

const fabStyles: React.CSSProperties = {
    position: 'fixed',
    bottom: '90px',
    right: '30px',
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    backgroundColor: 'var(--primary-color)',
    color: 'var(--bg-color)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '2rem',
    cursor: 'pointer',
    border: 'none',
    zIndex: 1001,
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
    transition: 'transform 0.2s ease-in-out',
};

const chatStyles: React.CSSProperties = {
    position: 'fixed',
    bottom: '160px',
    right: '30px',
    width: '400px',
    height: '500px',
    backgroundColor: 'var(--surface-color)',
    borderRadius: '12px',
    border: '1px solid var(--border-color)',
    boxShadow: '0 5px 25px rgba(0,0,0,0.5)',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 1000,
    transition: 'opacity 0.3s, transform 0.3s',
};

const chatHeaderStyles: React.CSSProperties = {
    padding: '1rem',
    borderBottom: '1px solid var(--border-color)',
    fontWeight: 600,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
};

const messageAreaStyles: React.CSSProperties = {
    flex: 1,
    padding: '1rem',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
};

const messageBubbleStyles = (isUser: boolean): React.CSSProperties => ({
    padding: '0.75rem 1rem',
    borderRadius: '12px',
    maxWidth: '80%',
    alignSelf: isUser ? 'flex-end' : 'flex-start',
    backgroundColor: isUser ? 'var(--primary-color)' : 'var(--surface-color-hover)',
    color: isUser ? 'var(--bg-color)' : 'var(--text-color)',
    lineHeight: 1.5,
});

const inputAreaStyles: React.CSSProperties = {
    display: 'flex',
    padding: '1rem',
    borderTop: '1px solid var(--border-color)',
    gap: '0.5rem',
};

const AIAssistant: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [prompt, setPrompt] = useState('');
    const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([]);
    const context = useContext(AppContext);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = async () => {
        if (!prompt.trim() || isLoading || !context) return;

        const userMessage = { text: prompt, isUser: true };
        setMessages(prev => [...prev, userMessage]);
        const currentPrompt = prompt;
        setPrompt('');
        setIsLoading(true);

        try {
            // FIX: Implement Gemini API call directly as a placeholder for backend integration.
            // This makes the component functional for demonstration purposes.
            // NOTE: In a production environment, API keys should be handled by a secure backend.
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

            const logSnapshot = context.logs.map(log => `[${log.timestamp}][${log.level}] ${log.message}`).join('\n') || 'No logs available.';
            const trafficSummary = context.stats
                ? `Current Down: ${(context.stats.down / 1000).toFixed(2)} Mbps | Current Up: ${(context.stats.up / 1000).toFixed(2)} Mbps | Total Down: ${context.stats.totalDown.toFixed(2)} MB | Total Up: ${context.stats.totalUp.toFixed(2)} MB`
                : 'No active traffic data.';

            const systemInstruction = "You are an AI security co-pilot for a post-quantum private network client. Your purpose is to analyze logs and network traffic data to provide clear, concise insights to a security operator. Answer the user's query based on the provided context.";
            
            const fullPrompt = `
                SYSTEM CONTEXT:
                ---
                LOGS:
                ${logSnapshot}
                ---
                TRAFFIC:
                ${trafficSummary}
                ---
                
                USER QUERY: ${currentPrompt}
            `;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: fullPrompt,
                config: {
                    systemInstruction: systemInstruction,
                }
            });
            
            const aiMessage = { text: response.text, isUser: false };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error("AI Assistant call failed:", error);
            const errorMessageText = error instanceof Error ? error.message : "Sorry, I couldn't process that request. Please check your API key and network connection.";
            const errorMessage = { text: errorMessageText, isUser: false };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <button
                style={{ ...fabStyles, transform: isOpen ? 'rotate(45deg)' : 'none' }}
                onClick={() => setIsOpen(!isOpen)}
                aria-label={isOpen ? "Close AI Assistant" : "Open AI Assistant"}
                aria-expanded={isOpen}
            >
                {isOpen ? '×' : '🤖'}
            </button>
            {isOpen && (
                <div style={{...chatStyles, opacity: isOpen ? 1 : 0, transform: isOpen ? 'translateY(0)' : 'translateY(20px)'}} role="log" aria-live="polite">
                    <header style={chatHeaderStyles}>
                        <span>AI Security Co-pilot</span>
                        <button onClick={() => setIsOpen(false)} style={{background: 'none', border: 'none', color: 'var(--text-color-secondary)', fontSize: '1.5rem', cursor: 'pointer'}}>&times;</button>
                    </header>
                    <div style={messageAreaStyles}>
                        <div style={messageBubbleStyles(false)}>System interface active. I am here to provide clarity on security events and system telemetry. How may I assist your analysis?</div>
                        {messages.map((msg, index) => (
                            <div key={index} style={messageBubbleStyles(msg.isUser)}>{msg.text}</div>
                        ))}
                        {isLoading && <div style={messageBubbleStyles(false)}>Analyzing...</div>}
                        <div ref={messagesEndRef} />
                    </div>
                    <div style={inputAreaStyles}>
                        <input
                            type="text"
                            placeholder="Ask about security events..."
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            disabled={isLoading}
                            aria-label="Your message to the AI assistant"
                        />
                        <button onClick={handleSend} disabled={isLoading || !prompt.trim()}>Send</button>
                    </div>
                </div>
            )}
        </>
    );
};

export default AIAssistant;
