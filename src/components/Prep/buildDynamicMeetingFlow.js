import { meetingFlowComponents } from './MeetingFlowComponents';

export function buildDynamicMeetingFlow(inputs) {
  return meetingFlowComponents
    .filter((step) => step.conditions(inputs))
    .map((step) => ({
      title: step.title,
      questions: step.questions,
    }));
}
