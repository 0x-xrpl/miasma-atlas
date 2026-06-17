export function scanMemoryAction(text: string) {
  return {
    blocked: text.toLowerCase().includes('hidden instruction'),
    text,
  };
}

