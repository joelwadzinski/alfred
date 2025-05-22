export function parseCampaignOutput(rawOutput) {
  const blocks = rawOutput.split(/Step\s\d+/).slice(1);

  return blocks.map((block, index) => {
    const channel = block.match(/Channel:\s(.+)/)?.[1]?.trim() || '';
    const time = block.match(/Time to Send:\s(.+)/)?.[1]?.trim() || '';

    let message = '';
    let coachingTip = '';

    const messageStart = block.indexOf('Message:');
    const tipStart = block.search(/(💡|🧠|Why this works:)/i);

    if (messageStart !== -1 && tipStart !== -1) {
      message = block.substring(messageStart + 8, tipStart).trim();
      coachingTip = block.substring(tipStart)
        .replace(/^(💡|🧠)?\s*Why this works:?\s*/i, '')
        .trim();
    } else if (messageStart !== -1) {
      message = block.substring(messageStart + 8).trim();
    }

    return {
      day: index + 1,
      channel,
      time,
      message,
      coachingTip,
    };
  });
}
