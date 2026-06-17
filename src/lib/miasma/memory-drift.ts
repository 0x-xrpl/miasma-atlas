export function calculateMemoryDrift(memoryPath: readonly string[]) {
  return memoryPath.some((step) => /hidden|contamination|poison/i.test(step)) ? 'contaminated' : 'stable';
}

