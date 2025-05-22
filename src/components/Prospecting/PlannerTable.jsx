import React from 'react';

const tableContainerStyle = {
  marginTop: '48px',
};

const headingStyle = {
  fontSize: '22px',
  fontWeight: 'bold',
  borderBottom: '4px solid #FFD700',
  paddingBottom: '8px',
  marginBottom: '20px',
  display: 'inline-block',
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  borderRadius: '12px',
  overflow: 'hidden',
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
};

const thStyle = {
  textAlign: 'left',
  padding: '16px',
  backgroundColor: '#f3f3f3',
  fontSize: '14px',
  color: '#555',
  borderBottom: '1px solid #ddd',
};

const tdStyle = {
  padding: '16px',
  fontSize: '15px',
  color: '#333',
  borderBottom: '1px solid #eee',
};

const rowHoverStyle = {
  backgroundColor: '#fafafa',
  transition: 'background-color 0.2s',
};

const PlannerTable = ({ campaign }) => {
  return (
    <div style={tableContainerStyle}>
      <h3 style={headingStyle}>📋 Campaign Planner Overview</h3>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Day</th>
            <th style={thStyle}>Time</th>
            <th style={thStyle}>Channel</th>
            <th style={thStyle}>Summary</th>
          </tr>
        </thead>
        <tbody>
          {campaign.map((step, index) => (
            <tr
              key={index}
              style={index % 2 === 0 ? {} : rowHoverStyle}
            >
              <td style={tdStyle}>{step.day}</td>
              <td style={tdStyle}>{step.time}</td>
              <td style={tdStyle}>{step.channel}</td>
              <td style={tdStyle}>
                {step.message.length > 60
                  ? `${step.message.slice(0, 60)}...`
                  : step.message}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PlannerTable;
