import type { ParsedIntent, TransitPreview } from '../types';

export function createTransitPreview(
  intent: ParsedIntent,
  executionMode: TransitPreview['executionMode'],
): TransitPreview {
  return {
    kind: 'transit',
    executionMode,
    fundsMoved: 0,
    label: intent.normalizedIntent,
  };
}
