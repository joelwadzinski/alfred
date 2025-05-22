import React, { useState } from 'react';
import { generateCampaign } from '../api/generateCampaign';
import { parseCampaignOutput } from '../utils/parseCampaignOutput';
import ProspectingOutput from '../components/Prospecting/ProspectingOutput';

const frameworkSnippets = {
  hookValueProofCTA: {
    label: 'Hook → Value → Proof → CTA',
    description: 'Relevant hook, value, proof, CTA'
  },
  softFollowUp: {
    label: 'Soft Touch Follow-Up',
    description: 'Warm follow-up referencing last message'
  },
  patternInterrupt: {
    label: 'Pattern Interrupt',
    description: 'Disrupt autopilot with a curveball'
  },
  urgencyReframe: {
    label: 'Urgency Reframe',
    description: 'Frame lost time or missed opportunity'
  },
  phoneCall: {
    label: 'Phone Call Framework',
    description: 'Live call script with urgency, value, CTA'
  },
  voicemail: {
    label: 'Voicemail Framework',
    description: 'Quick, effective voicemail structure'
  },
  email: {
    label: 'Email Framework',
    description: 'Email format: hook, value, bridge, CTA'
  },
  video: {
    label: 'Video Message Framework',
    description: 'Entertain, educate, and CTA in 60s'
  }
};

const styles = {
  container: {
    backgroundColor: '#f9fafb',
    minHeight: '100vh',
    padding: '40px 20px',
  },
  formBox: {
    maxWidth: '800px',
    margin: '0 auto',
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    padding: '40px',
  },
  heading: {
    fontSize: '26px',
    fontWeight: 'bold',
    marginBottom: '30px',
    borderBottom: '4px solid #FFD700',
    display: 'inline-block',
    paddingBottom: '10px',
  },
  label: {
    fontWeight: '600',
    display: 'block',
    marginBottom: '6px',
    color: '#333',
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    fontSize: '16px',
    borderRadius: '10px',
    border: '1px solid #ccc',
    backgroundColor: '#fdfdfd',
    marginBottom: '20px',
  },
  select: {
    width: '100%',
    padding: '12px 14px',
    fontSize: '16px',
    borderRadius: '10px',
    border: '1px solid #ccc',
    backgroundColor: '#fdfdfd',
    marginBottom: '20px',
  },
  checkboxGroup: {
    marginBottom: '24px',
  },
  checkboxLabel: {
    marginRight: '16px',
    fontSize: '14px',
    display: 'inline-block',
    marginBottom: '8px',
  },
  toggleRow: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px',
    gap: '10px',
  },
  button: {
    backgroundColor: '#FFD700',
    color: '#fff',
    padding: '14px 28px',
    fontSize: '16px',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    boxShadow: '0 3px 6px rgba(0,0,0,0.1)',
  },
  outputBox: {
    whiteSpace: 'pre-wrap',
    fontFamily: 'monospace',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    marginTop: '40px',
  },
  helperText: {
    color: '#666',
    marginTop: '-14px',
    marginBottom: '14px',
    display: 'block',
    fontSize: '13px',
  },
};

const ProspectingForm = () => {
  const [inputs, setInputs] = useState({
    goal: '',
    industry: '',
    geography: '',
    persona: '',
    companySize: '',
    contactName: '',
    channels: [],
    tone: '',
    includePainPoint: false,
    painPoint: '',
    includeStats: false,
    mentionProductLine: false,
    productLine: '',
    selectedFrameworks: [],
    numTouches: 5 //
  });

  const [loading, setLoading] = useState(false);
  const [campaignOutput, setCampaignOutput] = useState('');
  const [parsedOutput, setParsedOutput] = useState([]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      if (name === 'channels') {
        setInputs((prev) => ({
          ...prev,
          channels: checked
            ? [...prev.channels, value]
            : prev.channels.filter((ch) => ch !== value),
        }));
      } else {
        setInputs((prev) => ({
          ...prev,
          [name]: checked
        }));
      }
    } else {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleToggle = (name) => {
    setInputs((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    console.log('🟡 Form submitted. Sending data to backend:', inputs);

    try {
      const result = await generateCampaign(inputs);
      console.log('🟢 Received result from backend:', result);

      if (result) {
        setCampaignOutput(result);
        setParsedOutput(parseCampaignOutput(result));
      } else {
        setCampaignOutput('');
        setParsedOutput([]);
      }
    } catch (err) {
      console.error('❌ Error during campaign generation:', err);
      setCampaignOutput('Error generating campaign.');
      setParsedOutput([]);
    }

    setLoading(false);
  };

  const toggleFramework = (key) => {
    setInputs((prev) => {
      const frameworks = prev.selectedFrameworks.includes(key)
        ? prev.selectedFrameworks.filter(f => f !== key)
        : [...prev.selectedFrameworks, key];
      return { ...prev, selectedFrameworks: frameworks };
    });
  };

  return (
    <div style={styles.container}>
      <div style={styles.formBox}>
        <h2 style={styles.heading}>🛠️ Build a Campaign with Alfred</h2>
        <form onSubmit={handleSubmit}>
          {/* Campaign Goal */}
          <label style={styles.label}>Campaign Goal</label>
          <select name="goal" onChange={handleChange} style={styles.select} required>
            <option value="">Select a goal</option>
            <option value="Book a Meeting">Book a Meeting</option>
            <option value="Re-engage">Re-engage</option>
            <option value="Nurture">Nurture</option>
            <option value="Upsell">Upsell</option>
          </select>

          {/* Industry */}
          <label style={styles.label}>Industry</label>
          <input type="text" name="industry" placeholder="e.g., Roofing, Law, Healthcare" onChange={handleChange} style={styles.input} required />

          {/* Geography (Optional) */}
          <label style={styles.label}>Geography (optional)</label>
          <input type="text" name="geography" placeholder="e.g., Florida, Midwest" onChange={handleChange} style={styles.input} />

          {/* Persona */}
          <label style={styles.label}>Target Role / Persona</label>
          <input type="text" name="persona" placeholder="e.g., Owner, CFO, Controller" onChange={handleChange} style={styles.input} required />

          {/* Company Size */}
          <label style={styles.label}>Company Size (based on number of employees)</label>
          <select name="companySize" onChange={handleChange} style={styles.select}>
            <option value="">Select size</option>
            <option value="Micro">Micro (1–10 employees)</option>
            <option value="Small">Small (11–50 employees)</option>
            <option value="Midsize">Midsize (51–250 employees)</option>
            <option value="Large">Large (250+ employees)</option>
          </select>

          {/* Contact Name / LinkedIn */}
          <label style={styles.label}>Contact Name or LinkedIn URL (optional)</label>
          <input type="text" name="contactName" onChange={handleChange} style={styles.input} />

          {/* Number of Touches */}
          <label style={styles.label}>Number of Campaign Touches</label>
          <select
            name="numTouches"
            onChange={handleChange}
            value={inputs.numTouches}
            style={styles.select}
          >
            <option value="5">Default (5 touches)</option>
            <option value="3">3 touches</option>
            <option value="7">7 touches</option>
            <option value="10">10 touches</option>
          </select>

          {/* Channels */}
          <div style={styles.checkboxGroup}>
            <label style={styles.label}>Preferred Channels:</label>
            {[
              'Phone',
              'Voicemail',
              'Email',
              'SMS',
              'Video Script',
              'Face-to-Face Talking Points',
              'LinkedIn Message',
              'Handwritten Note'
            ].map((channel) => (
              <label key={channel} style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="channels"
                  value={channel}
                  onChange={handleChange}
                />{' '}
                {channel}
              </label>
            ))}
          </div>

          {/* Framework Selection */}
          <h4 style={{ ...styles.label, marginTop: '30px' }}>Best In Class Frameworks to Include:</h4>
          <div style={styles.checkboxGroup}>
            {Object.entries(frameworkSnippets).map(([key, snippet]) => (
              <label key={key} style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={inputs.selectedFrameworks.includes(key)}
                  onChange={() => toggleFramework(key)}
                />
                {snippet.label}
              </label>
            ))}
          </div>

          {/* Tone */}
          <label style={styles.label}>Tone</label>
          <select name="tone" onChange={handleChange} style={styles.select} required>
            <option value="">Select a tone</option>
            <option value="Professional">Professional</option>
            <option value="Friendly">Friendly</option>
            <option value="Bold">Bold</option>
            <option value="Consultative">Consultative</option>
          </select>

          {/* Optional Enhancements Section Title */}
          <h4 style={{ ...styles.label, marginTop: '30px' }}>Optional Enhancements:</h4>

          {/* Toggle: Include Pain Point or Offer */}
          <div style={styles.toggleRow}>
            <input
                type="checkbox"
                checked={inputs.includePainPoint}
                onChange={() => handleToggle('includePainPoint')}
            />
            <label style={{ fontWeight: '500' }}>Include Pain Point or Offer</label>
            <input
              type="text"
              name="painPoint"
              placeholder="e.g., Cash flow tied up in receivables, Waived fees"
              onChange={handleChange}
              value={inputs.painPoint}
              style={{ ...styles.input, flex: 2, marginBottom: 0 }}
            />
          </div>

          {/* Include Stats Toggle */}
          <div style={styles.toggleRow}>
            <input type="checkbox" checked={inputs.includeStats} onChange={() => handleToggle('includeStats')} />
            <label style={{ fontWeight: '500' }}>Include stats or benchmarks</label>
          </div>

          {/* Mention Product Line Toggle + Input */}
          <div style={styles.toggleRow}>
            <input
                type="checkbox"
                checked={inputs.mentionProductLine}
                onChange={() => handleToggle('mentionProductLine')}
            />
            <label style={{ fontWeight: '500' }}>Mention product line XYZ</label>
            <input
              type="text"
              name="productLine"
              placeholder="e.g., Fast Funding Program, SBA Loan, Payee Positive Pay"
              onChange={handleChange}
              value={inputs.productLine}
              style={{ ...styles.input, flex: 2, marginBottom: 0 }}
            />
          </div>

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Generating...' : 'Generate Campaign'}
          </button>
        </form>

        {parsedOutput.length > 0 && (
          <ProspectingOutput campaignData={parsedOutput} />
        )}
      </div>
    </div>
  );
};

export default ProspectingForm;
