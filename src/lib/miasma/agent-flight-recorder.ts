export type AgentFlightRecord = {
  step: string;
  event: string;
  recordedAt: string;
};

export function recordAgentFlight(step: string, event: string): AgentFlightRecord {
  return {
    step,
    event,
    recordedAt: new Date().toISOString(),
  };
}
