import type { AgenticActionSession } from '../types';

const sessions = new Map<string, AgenticActionSession>();

export function loadSession(sessionId: string) {
  return sessions.get(sessionId) ?? null;
}

export function saveSession(session: AgenticActionSession) {
  sessions.set(session.sessionId, session);
  return session;
}

export function listSessions() {
  return Array.from(sessions.values());
}
