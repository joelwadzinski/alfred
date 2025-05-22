import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { buildDynamicMeetingFlow } from './buildDynamicMeetingFlow';

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

const PrepForm = () => {
  const [formData, setFormData] = useState({
    meetingGoal: '',
    customGoal: '',
    industry: '',
    companyName: '',
    companyWebsite: '',
    contactName: '',
    contactRole: '',
    companySize: '',
    relationshipStatus: '',
  });

  const [loading, setLoading] = useState(false);
  const [prepResult, setPrepResult] = useState('');
  const [dynamicMeetingFlow, setDynamicMeetingFlow] = useState([]);
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
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...formData,
      finalGoal: formData.customGoal || formData.meetingGoal,
    };

    try {
      const response = await fetch('http://localhost:5000/api/prep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      setPrepResult(data.result);

      try {
        const dynamicFlow = buildDynamicMeetingFlow({
          meetingGoal: formData.customGoal || formData.meetingGoal,
          industry: formData.industry,
          contactRole: formData.contactRole,
          companySize: formData.companySize || 'Midsize',
          relationshipStatus: formData.relationshipStatus || 'New',
        });

        setDynamicMeetingFlow(dynamicFlow);
      } catch (flowError) {
        console.error('❌ buildDynamicMeetingFlow failed:', flowError);
      }

    } catch (err) {
      console.error('❌ Prep generation failed:', err);
      alert('Something went wrong generating the prep.');
    }

    setLoading(false);
  };

  const handleQuestionChange = (stepIndex, questionIndex, newText) => {
    setDynamicMeetingFlow((prevFlow) => {
      const updatedFlow = [...prevFlow];
      updatedFlow[stepIndex].questions[questionIndex] = newText;
      return updatedFlow;
    });
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
        <h1>📋 Alfred Meeting Prep</h1>

        <form onSubmit={handleSubmit}>
          <label style={labelStyle}>Meeting Goal</label>
          <select style={inputStyle} name="meetingGoal" value={formData.meetingGoal} onChange={handleChange}>
            <option value="">-- Select Goal --</option>
            <option value="Uncover needs and establish next steps">Uncover needs and establish next steps</option>
            <option value="Effectively pitch and move to next steps">Effectively pitch and move to next steps</option>
            <option value="Build trust and deepen relationship">Build trust and deepen relationship</option>
            <option value="Renew or expand business">Renew or expand business</option>
          </select>

          <label style={labelStyle}>Or type your own meeting goal</label>
          <input style={inputStyle} name="customGoal" value={formData.customGoal} onChange={handleChange} />

          <label style={labelStyle}>Company Industry</label>
          <input style={inputStyle} name="industry" value={formData.industry} onChange={handleChange} />

          <label style={labelStyle}>Company Name</label>
          <input style={inputStyle} name="companyName" value={formData.companyName} onChange={handleChange} />

          <label style={labelStyle}>Company Website</label>
          <input style={inputStyle} name="companyWebsite" value={formData.companyWebsite} onChange={handleChange} />

          <label style={labelStyle}>Contact Name(s) or LinkedIn URLs</label>
          <input style={inputStyle} name="contactName" value={formData.contactName} onChange={handleChange} />

          <label style={labelStyle}>Contact Role</label>
          <input style={inputStyle} name="contactRole" value={formData.contactRole} onChange={handleChange} />

          <label style={labelStyle}>Company Size</label>
          <select style={inputStyle} name="companySize" value={formData.companySize} onChange={handleChange}>
            <option value="">-- Select Size --</option>
            <option value="Micro">Micro (1–10 employees)</option>
            <option value="Small">Small (11–50 employees)</option>
            <option value="Midsize">Midsize (51–250 employees)</option>
            <option value="Large">Large (250+ employees)</option>
          </select>

          <label style={labelStyle}>Relationship Status</label>
          <select style={inputStyle} name="relationshipStatus" value={formData.relationshipStatus} onChange={handleChange}>
            <option value="">-- Select Status --</option>
            <option value="New">New</option>
            <option value="Existing">Existing</option>
          </select>

          <button type="submit" style={buttonStyle} disabled={loading}>
            {loading ? 'Generating...' : 'Generate Meeting Prep'}
          </button>
        </form>

        {prepResult && (
          <div style={resultBoxStyle}>
            <h2 style={{ marginBottom: '20px' }}>📋 Your Meeting Briefing</h2>
            <div style={{ lineHeight: '1.7', fontSize: '16px', paddingBottom: '24px' }}>
              <ReactMarkdown>{prepResult}</ReactMarkdown>
            </div>

            <div style={chatContainerStyle}>
              {chatHistory.map((msg, idx) => (
                <div key={idx} style={msg.sender === 'user' ? userBubble : alfredBubble}>
                  <strong>{msg.sender === 'user' ? 'You' : '🧤 Alfred'}:</strong> <br />
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
                placeholder="e.g., What are some meaningful questions I can ask to uncover real need?"
                onChange={(e) => setAskText(e.target.value)}
              />
              <button style={buttonStyle} onClick={handleAskAlfred} disabled={loadingReply}>
                {loadingReply ? 'Thinking...' : '🔍 Ask Alfred'}
              </button>
            </div>

            {dynamicMeetingFlow.length > 0 && (
              <div style={{ marginTop: '40px' }}>
                <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>🧭 Suggested Meeting Flow</h2>
                {dynamicMeetingFlow.map((step, index) => (
                  <div key={index} style={{ marginBottom: '24px' }}>
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      color: '#DAA520',
                      borderBottom: '2px solid #DAA520',
                      paddingBottom: '4px'
                    }}>
                      {step.title}
                    </h3>
                    <ul style={{ paddingLeft: '20px', marginTop: '10px' }}>
                      {step.questions.map((q, i) => (
                        <li key={i} style={{ marginBottom: '6px' }}>
                          <textarea
                            style={{
                              width: '100%',
                              padding: '8px',
                              borderRadius: '8px',
                              fontSize: '14px',
                              border: '1px solid #ccc',
                              marginBottom: '6px'
                            }}
                            value={q}
                            onChange={(e) => handleQuestionChange(index, i, e.target.value)}
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PrepForm;
