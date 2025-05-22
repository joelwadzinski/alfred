import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

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
  fontFamily: `'Helvetica Neue', sans-serif`,
};

const inputStyle = {
  width: '100%',
  marginBottom: '16px',
  padding: '16px',
  borderRadius: '12px',
  border: '1px solid #ccc',
  backgroundColor: '#f5f5f5',
  fontSize: '16px',
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

const labelStyle = {
  fontSize: '18px',
  fontWeight: '600',
  color: '#333',
  marginBottom: '10px',
  display: 'block',
};

const chatContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  marginTop: '24px',
};

const chatBubbleStyle = {
  padding: '12px 16px',
  borderRadius: '16px',
  maxWidth: '80%',
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

const markdownStyles = {
  h2: { fontSize: '20px', marginTop: '20px' },
  h3: { fontSize: '18px', marginTop: '18px' },
  p: { marginBottom: '12px' },
  li: { 
    marginBottom: '6px',
    lineHeight: '1.6',
    display: 'list-item',
    listStyleType: 'decimal',
    paddingLeft: '4px',
  },
  ol: { paddingLeft: '20px', marginBottom: '12px' },
  ul: { paddingLeft: '20px', marginBottom: '12px' },
};

const IndustryExpertise = () => {
  const [industry, setIndustry] = useState('');
  const [geography, setGeography] = useState('');
  const [size, setSize] = useState('');
  const [messageHistory, setMessageHistory] = useState([]);
  const [initialReport, setInitialReport] = useState(null);
  const [input, setInput] = useState('');
  const [chatStarted, setChatStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const chatBottomRef = useRef(null);

  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messageHistory]);

  const startChat = async (e) => {
    e.preventDefault();
    const firstMessage = `Preparing your analysis of the relevant information for ${size} ${industry} companies in ${geography}.`;
    const newHistory = [{ role: 'user', content: firstMessage }];
    setMessageHistory(newHistory);
    setChatStarted(true);
    setLoading(true);

    try {
      const response = await fetch('https://alfred-backend-jmf7.onrender.com/api/industry-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageHistory: newHistory }),
      });
      const data = await response.json();
      const assistantMessage = { role: 'assistant', content: data.result };
      setInitialReport(assistantMessage);
      setMessageHistory([...newHistory, assistantMessage]);
    } catch (err) {
      const errorMessage = { role: 'assistant', content: 'Something went wrong.' };
      setInitialReport(errorMessage);
      setMessageHistory([...newHistory, errorMessage]);
    }

    setLoading(false);
  };

  const sendFollowUp = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newHistory = [...messageHistory, { role: 'user', content: input }];
    setMessageHistory(newHistory);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('https://alfred-backend-jmf7.onrender.com/api/industry-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageHistory: newHistory }),
      });
      const data = await response.json();
      setMessageHistory([...newHistory, { role: 'assistant', content: data.result }]);
    } catch (err) {
      setMessageHistory([...newHistory, { role: 'assistant', content: 'Something went wrong.' }]);
    }

    setLoading(false);
  };

  return (
    <div style={containerStyle}>
      <div style={innerStyle}>
        <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '30px', borderBottom: '4px solid #FFD700', display: 'inline-block', paddingBottom: '10px' }}>
          🧠 Industry Expertise
        </h2>

        <form onSubmit={startChat}>
          <label style={labelStyle}>Industry</label>
          <input
            style={inputStyle}
            type="text"
            placeholder="e.g., Roofing"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
          />
          <label style={labelStyle}>Geography (optional)</label>
          <input
            style={inputStyle}
            type="text"
            placeholder="e.g., Florida"
            value={geography}
            onChange={(e) => setGeography(e.target.value)}
          />
          <label style={labelStyle}>Company Size</label>
          <input
            style={inputStyle}
            type="text"
            placeholder="e.g., $2M"
            value={size}
            onChange={(e) => setSize(e.target.value)}
          />
          <button type="submit" style={buttonStyle}>Get Alfred’s Analysis</button>
        </form>

        {chatStarted && (
          <>
            {initialReport && (
              <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #ddd', marginTop: '24px' }}>
                <ReactMarkdown components={{
                  h2: props => <h2 style={markdownStyles.h2} {...props} />,
                  h3: props => <h3 style={markdownStyles.h3} {...props} />,
                  p: props => <p style={markdownStyles.p} {...props} />,
                  li: props => <li style={markdownStyles.li} {...props} />,
                  ol: props => <ol style={markdownStyles.ol} {...props} />,
                  ul: props => <ul style={markdownStyles.ul} {...props} />
                }}>
                  {initialReport.content}
                </ReactMarkdown>
              </div>
            )}

            {loading && (
              <div style={{ marginTop: '32px', fontStyle: 'italic', color: '#555' }}>
                🧤 Alfred is preparing your response...
              </div>
            )}

            {messageHistory.length > 2 && (
              <>
                <h3 style={{ marginTop: '40px', marginBottom: '8px' }}>💬 Ask Alfred</h3>
                <div style={chatContainerStyle}>
                  {messageHistory.slice(2).map((msg, idx) => (
                    <div key={idx} style={msg.role === 'user' ? userBubble : alfredBubble}>
                      <strong>{msg.role === 'user' ? 'You' : '🧤 Alfred'}:</strong><br />
                      {msg.role === 'assistant'
                        ? <ReactMarkdown components={{
                            p: props => <p style={markdownStyles.p} {...props} />,
                            li: props => <li style={markdownStyles.li} {...props} />,
                            ol: props => <ol style={markdownStyles.ol} {...props} />,
                            ul: props => <ul style={markdownStyles.ul} {...props} />
                          }}>{msg.content}</ReactMarkdown>
                        : msg.content}
                    </div>
                  ))}
                  <div ref={chatBottomRef} />
                </div>
              </>
            )}

            {!loading && initialReport && (
              <form onSubmit={sendFollowUp}>
                <label style={labelStyle}>Ask a follow-up question</label>
                <textarea
                  style={inputStyle}
                  rows={3}
                  placeholder="e.g., How does this differ in winter?"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <button type="submit" style={buttonStyle} disabled={loading}>
                  {loading ? 'Thinking...' : '🔍 Ask Alfred'}
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default IndustryExpertise;