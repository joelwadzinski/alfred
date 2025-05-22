import React from 'react';
import ProspectingOutput from '../components/Prospecting/ProspectingOutput';

const campaignData = [
  {
    day: 1,
    time: '7:15 AM (Tuesday)',
    channel: 'Email',
    message: 'Hi Chris, I work with small business owners in the Florida roofing space...',
    coachingTip: 'Send early — response rates spike before 8 AM, especially on Tuesdays and Thursdays.'
  },
  {
    day: 3,
    time: '10:00 AM',
    channel: 'Live Call + Voicemail',
    message: 'Hi Chris, this is Joel from [Bank], I saw you run XYZ Roofing...',
    coachingTip: 'Late morning = peak answer rates. Leave voicemail only if no answer.'
  },
  {
    day: 5,
    time: '11:30 AM',
    channel: 'SMS',
    message: 'Hi Chris, just wanted to see if that cash flow challenge is still a priority...',
    coachingTip: 'SMS reply rates are strongest around lunch. Keep it short and clear.'
  },
  {
    day: 7,
    time: '8:00 AM',
    channel: 'LinkedIn Message',
    message: 'Hey Chris, sent a couple notes your way — figured I’d say hello here too...',
    coachingTip: 'LinkedIn messages perform best before the day starts or after 5 PM.'
  },
  {
    day: 10,
    time: 'N/A',
    channel: 'Handwritten Note',
    message: 'Chris – just wanted to drop a personal line on how we help folks like you get paid faster...',
    coachingTip: 'Old-school works. Send on Day 10 for a warm close or surprise touch.'
  }
];

const ProspectingPreview = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <ProspectingOutput campaignData={campaignData} />
    </div>
  );
};

export default ProspectingPreview;
