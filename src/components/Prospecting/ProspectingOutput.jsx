import React, { useState, useRef, useEffect } from 'react';
import TouchpointCard from './TouchpointCard';
import PlannerTable from './PlannerTable';

const containerStyle = {
  backgroundColor: '#f9fafb',
  minHeight: '100vh',
  padding: '40px 20px',
};

const innerStyle = {
  maxWidth: '960px',
  margin: '0 auto',
  backgroundColor: '#ffffff',
  borderRadius: '20px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  padding: '40px',
};

const headerStyle = {
  fontSize: '28px',
  fontWeight: 'bold',
  marginBottom: '30px',
  borderBottom: '4px solid #FFD700',
  display: 'inline-block',
  paddingBottom: '10px',
};

const labelStyle = {
  fontSize: '18px',
  fontWeight: '600',
  color: '#333',
  marginBottom: '10px',
  display: 'block',
};

const textareaStyle = {
  width: '100%',
  padding: '16px',
  fontSize: '16px',
  borderRadius: '12px',
  border: '1px solid #ccc',
  backgroundColor: '#f5f5f5',
  height: '100px',
  resize: 'none',
  boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.06)',
};

const buttonStyle = {
  marginTop: '16px',
  backgroundColor: '#FFD700',
  color: '#fff',
  fontWeight: '600',
  padding: '12px 24px',
  borderRadius: '12px',
  border: 'none',
  cursor: 'pointer',
  boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
};

const chatBubbleStyle = {
  padding: '12px 16px',
  borderRadius: '16px',
  maxWidth: '80%',
  marginBottom: '12px',
  whiteSpace: 'pre-wrap',
  lineHeight: '1.5',
  fontSize: '15px',
};

const userBubble = {
  ...chatBubbleStyle,
  backgroundColor: '#e0f0ff',
  alignSelf: 'flex-end',
};

const alfredBubble = {
  ...chatBubbleStyle,
  backgroundColor: '#f0f0f0',
  alignSelf: 'flex-start',
};

const chatContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  marginTop: '24px',
  maxHeight: '400px',
  overflowY: 'auto',
  paddingRight: '8px',
};

const ProspectingOutput = ({ campaignData }) => {
  const [askText, setAskText] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loadingReply, setLoadingReply] = useState(false);
  const chatBottomRef = useRef(null);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory]);

  const handleAskAlfred = async () => {
    if (!askText.trim()) return;

    const updatedChat = [...chatHistory, { sender: 'user', text: askText }];
    setChatHistory(updatedChat);
    setAskText('');
    setLoadingReply(true);

    try {
      const response = await fetch('https://alfred-backend-jmf7.onrender.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: askText }),
      });

      const data = await response.json();
      const reply = data.reply || 'Sorry, something went wrong.';

      setChatHistory(prev => [...prev, { sender: 'alfred', text: reply }]);
    } catch (err) {
      console.error('❌ Ask Alfred failed:', err);
      setChatHistory(prev => [...prev, { sender: 'alfred', text: 'Something went wrong.' }]);
    } finally {
      setLoadingReply(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={innerStyle}>
        <h2 style={headerStyle}>🚀 Alfred’s Campaign Plan</h2>

        {campaignData.map((touchpoint, index) => (
          <TouchpointCard
            key={index}
            day={touchpoint.day}
            time={touchpoint.time}
            channel={touchpoint.channel}
            message={touchpoint.message}
            coachingTip={touchpoint.coachingTip}
          />
        ))}

        <PlannerTable campaign={campaignData} />

        {/* Ask Alfred chat assistant */}
        <div style={{ marginTop: '50px' }}>
          <h3 style={labelStyle}>💬 Ask Alfred</h3>

          {/* Chat history */}
          <div style={chatContainerStyle}>
            {chatHistory.map((msg, idx) => (
              <div key={idx} style={msg.sender === 'user' ? userBubble : alfredBubble}>
                {msg.sender === 'alfred' && '🧤 '}
                <strong>{msg.sender === 'user' ? 'You' : 'Alfred'}:</strong> <br />
                {msg.text}
              </div>
            ))}
            <div ref={chatBottomRef} />
          </div>

          {/* Input box at bottom */}
          <div style={{ marginTop: '24px' }}>
            <textarea
              id="alfredFollowUp"
              placeholder="e.g., Can you rewrite Step 2 to sound more direct?"
              style={textareaStyle}
              value={askText}
              onChange={(e) => setAskText(e.target.value)}
            />

            <button style={buttonStyle} onClick={handleAskAlfred} disabled={loadingReply}>
              {loadingReply ? 'Thinking...' : '🔍 Ask Alfred'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProspectingOutput;
