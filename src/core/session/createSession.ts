import type { AgenticActionSession, ParsedIntent } from '../types';
import { loadSession, saveSession } from './sessionStore';

let sessionCounter = 0;

function createSessionId() {
  sessionCounter += 1;
  return `session_${Date.now().toString(36)}_${sessionCounter.toString(36)}`;
}

export function createSession(intent: ParsedIntent, sessionId?: string): AgenticActionSession {
  const existing = sessionId ? loadSession(sessionId) : null;
  const now = new Date().toISOString();
  const session: AgenticActionSession = existing
    ? {
        ...existing,
        updatedAt: now,
        intent,
      }
    : {
        sessionId: sessionId ?? createSessionId(),
        createdAt: now,
        updatedAt: now,
        status: 'preview',
        intent,
        preview: null,
      };

  return saveSession(session);
}
