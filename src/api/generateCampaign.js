export async function generateCampaign(campaignInputs) {
  try {
    const response = await fetch('http://localhost:5000/api/campaign/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(campaignInputs),
    });

    const data = await response.json();
    return data.campaign;
  } catch (error) {
    console.error('Failed to fetch campaign:', error);
    throw error;
  }
}
