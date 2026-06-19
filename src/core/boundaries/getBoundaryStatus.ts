import type { BoundaryState, BoundaryStatus } from '../types';

const DEFAULT_BOUNDARIES: Record<string, BoundaryStatus> = {
  voiceBoundary: {
    name: 'voiceBoundary',
    state: 'preview',
    detail: 'Browser speech input with typed fallback.',
    available: true,
  },
  localAiBoundary: {
    name: 'localAiBoundary',
    state: 'preview',
    detail: 'Deterministic local parser with optional boundary hooks.',
    available: true,
  },
  contextBoundary: {
    name: 'contextBoundary',
    state: 'boundary',
    detail: 'Context retrieval boundary only.',
    available: false,
  },
  verificationBoundary: {
    name: 'verificationBoundary',
    state: 'implemented',
    detail: 'Local verifier path is implemented.',
    available: true,
  },
  evidenceBoundary: {
    name: 'evidenceBoundary',
    state: 'boundary',
    detail: 'Evidence-lock path is boundary-scoped.',
    available: false,
  },
  identityBoundary: {
    name: 'identityBoundary',
    state: 'boundary',
    detail: 'Identity and sponsored transaction path is boundary-scoped.',
    available: false,
  },
  sponsoredTxBoundary: {
    name: 'sponsoredTxBoundary',
    state: 'boundary',
    detail: 'Sponsored transaction path is boundary-scoped.',
    available: false,
  },
  proofBoundary: {
    name: 'proofBoundary',
    state: 'preview',
    detail: 'Proof surface is preview-scoped.',
    available: false,
  },
};

export function getBoundaryStatus(
  name: keyof typeof DEFAULT_BOUNDARIES,
  state?: BoundaryState,
  detail?: string,
): BoundaryStatus {
  const boundary = DEFAULT_BOUNDARIES[name];
  return {
    ...boundary,
    state: state ?? boundary.state,
    detail: detail ?? boundary.detail,
    available: boundary.available && (state ?? boundary.state) !== 'unavailable',
  };
}

export function getBoundaryDefaults() {
  return { ...DEFAULT_BOUNDARIES };
}
