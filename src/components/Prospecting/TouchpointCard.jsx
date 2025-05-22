import React, { useState } from 'react';

const cardStyle = {
  backgroundColor: '#ffffff',
  borderRadius: '16px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  padding: '24px',
  marginBottom: '24px',
};

const headingStyle = {
  fontSize: '18px',
  fontWeight: 'bold',
  marginBottom: '4px',
  borderBottom: '3px solid #FFD700',
  display: 'inline-block',
  paddingBottom: '4px',
};

const timeStyle = {
  fontSize: '14px',
  color: '#777',
  marginBottom: '16px',
};

const messageStyle = {
  fontSize: '16px',
  color: '#333',
  marginBottom: '16px',
  whiteSpace: 'pre-wrap',
  lineHeight: '1.6',
};

const tipBoxStyle = {
  backgroundColor: '#fffbea',
  borderLeft: '4px solid #FFD700',
  padding: '12px 16px',
  fontSize: '14px',
  fontStyle: 'italic',
  color: '#6b4c00',
  marginBottom: '20px',
  borderRadius: '8px',
};

const buttonRowStyle = {
  display: 'flex',
  gap: '12px',
  flexWrap: 'wrap',
  marginTop: '12px',
};

const buttonStyle = {
  padding: '8px 16px',
  fontSize: '14px',
  borderRadius: '12px',
  backgroundColor: '#f0f0f0',
  border: 'none',
  cursor: 'pointer',
  fontWeight: '500',
  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
};

const TouchpointCard = ({ day, time, channel, message, coachingTip }) => {
  const [currentMessage, setCurrentMessage] = useState(message);
  const [isRephrasing, setIsRephrasing] = useState(false);

  const rephraseMessage = async () => {
    setIsRephrasing(true);
    try {
      const response = await fetch('https://alfred-backend-jmf7.onrender.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: currentMessage,
          channel: channel // 👈 this is passed into the component already
        }),
      });
      const data = await response.json();
      setCurrentMessage(data.rephrased);
    } catch (err) {
      console.error('Rephrase failed', err);
      alert('Could not rephrase. Try again.');
    }
    setIsRephrasing(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentMessage);
    alert('Message copied to clipboard!');
  };

  return (
    <div style={cardStyle}>
      <div>
        <div style={headingStyle}>📅 Day {day} – {channel}</div>
        <div style={timeStyle}>🕐 Recommended Time: {time}</div>
      </div>

      <div style={messageStyle}>{currentMessage}</div>

      <div style={buttonRowStyle}>
        <button style={buttonStyle} onClick={rephraseMessage} disabled={isRephrasing}>
          🔁 {isRephrasing ? 'Rephrasing...' : 'Rephrase'}
        </button>
        <button style={buttonStyle} onClick={copyToClipboard}>📋 Copy</button>
        <button style={buttonStyle}>✏️ Edit</button>
        <button style={buttonStyle}>💾 Save</button>
        <button style={buttonStyle}>📤 Export</button>
      </div>

      {coachingTip && (
        <div style={tipBoxStyle}>
          {coachingTip}
        </div>
      )}
    </div>
  );
};

export default TouchpointCard;
