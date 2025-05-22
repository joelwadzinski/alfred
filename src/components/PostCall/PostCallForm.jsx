import React, { useState, useEffect, useRef } from 'react';
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

const labelStyle = {
  fontWeight: '600',
  marginBottom: '6px',
  display: 'block',
  fontSize: '14px',
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

const resultBoxStyle = {
  marginTop: '40px',
  backgroundColor: '#ffffff',
  padding: '30px',
  borderRadius: '16px',
  border: '1px solid #ccc',
  fontSize: '15px',
  lineHeight: '1.6',
};

const chatContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  marginTop: '40px',
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

const PostCallForm = () => {
  const [inputs, setInputs] = useState({
    meetingOutcome: '',
    customOutcome: '',
    contactName: '',
    contactRole: '',
    companyName: '',
    industry: '',
    meetingNotes: '',
    bankerActions: '',
    clientActions: ''
  });

  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [askText, setAskText] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loadingReply, setLoadingReply] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult('');

    try {
      const response = await fetch('http://localhost:5000/api/post-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputs),
      });

      const data = await response.json();
      setResult(data.result);
    } catch (error) {
      console.error('❌ Follow-up generation failed:', error);
      setResult("Something went wrong generating Alfred's response.");
    } finally {
      setLoading(false);
    }
  };

  const handleAskAlfred = async () => {
    if (!askText.trim()) return;

    const updatedChat = [...chatHistory, { sender: 'user', text: askText }];
    setChatHistory(updatedChat);
    setAskText('');
    setLoadingReply(true);

    try {
      const response = await fetch('http://localhost:5000/api/campaign/ask-alfred', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: askText }),
      });

      const data = await response.json();
      const reply = data.reply || 'Something went wrong.';
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
        <h1>📝 Post-Meeting Follow-Up</h1>

        <form onSubmit={handleSubmit}>
          <label style={labelStyle}>Meeting Outcome</label>
          <select style={inputStyle} name="meetingOutcome" value={inputs.meetingOutcome} onChange={handleChange}>
            <option value="">-- Select Outcome --</option>
            <option>Needs time to decide</option>
            <option>Requested pricing</option>
            <option>Not a fit</option>
            <option>Scheduling follow-up</option>
            <option>Sent to decision-maker</option>
          </select>

          <label style={labelStyle}>Custom Outcome (optional)</label>
          <input style={inputStyle} name="customOutcome" value={inputs.customOutcome} onChange={handleChange} />

          <label style={labelStyle}>Contact Name</label>
          <input style={inputStyle} name="contactName" value={inputs.contactName} onChange={handleChange} />

          <label style={labelStyle}>Contact Role</label>
          <input style={inputStyle} name="contactRole" value={inputs.contactRole} onChange={handleChange} />

          <label style={labelStyle}>Company Name</label>
          <input style={inputStyle} name="companyName" value={inputs.companyName} onChange={handleChange} required />

          <label style={labelStyle}>Industry</label>
          <input style={inputStyle} name="industry" value={inputs.industry} onChange={handleChange} />

          <label style={labelStyle}>Key Meeting Notes</label>
          <textarea style={inputStyle} name="meetingNotes" value={inputs.meetingNotes} onChange={handleChange} rows={4} />

          <label style={labelStyle}>Action Items for Banker</label>
          <textarea style={inputStyle} name="bankerActions" value={inputs.bankerActions} onChange={handleChange} rows={3} />

          <label style={labelStyle}>Action Items for Prospect / Client</label>
          <textarea style={inputStyle} name="clientActions" value={inputs.clientActions} onChange={handleChange} rows={3} />

          <button type="submit" style={buttonStyle} disabled={loading}>
            {loading ? 'Generating...' : 'Generate Follow-Up Plan'}
          </button>
        </form>

        {result && (
          <div style={resultBoxStyle}>
            <h2 style={{ marginBottom: '20px' }}>📋 Follow-Up Briefing</h2>
            <ReactMarkdown
              children={result}
              components={{
                h2: ({node, ...props}) => <h2 style={{ marginTop: '24px', fontSize: '20px' }} {...props} />,
                h3: ({node, ...props}) => <h3 style={{ marginTop: '16px', fontSize: '18px' }} {...props} />,
                p: ({node, ...props}) => <p style={{ marginBottom: '12px' }} {...props} />,
                li: ({node, ...props}) => <li style={{ marginBottom: '6px' }} {...props} />,
                ul: ({node, ...props}) => <ul style={{ paddingLeft: '20px', marginBottom: '12px' }} {...props} />,
                ol: ({node, ...props}) => <ol style={{ paddingLeft: '20px', marginBottom: '12px' }} {...props} />,
              }}
            />

            <div style={chatContainerStyle}>
              {chatHistory.map((msg, idx) => (
                <div key={idx} style={msg.sender === 'user' ? userBubble : alfredBubble}>
                  <strong>{msg.sender === 'user' ? 'You' : '🧤 Alfred'}:</strong><br />
                  {msg.text}
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <div style={{ marginTop: '24px' }}>
              <label style={labelStyle}>Ask Alfred a follow-up question:</label>
              <textarea
                style={inputStyle}
                value={askText}
                placeholder="e.g., How should I approach their CFO?"
                onChange={(e) => setAskText(e.target.value)}
              />
              <button style={buttonStyle} onClick={handleAskAlfred} disabled={loadingReply}>
                {loadingReply ? 'Thinking...' : '🔍 Ask Alfred'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCallForm;