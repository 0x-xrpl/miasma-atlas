export const serverName = 'miasma-atlas-mcp';

export function describeServer() {
  return {
    name: serverName,
    tools: ['scan-memory-action', 'quarantine-memory', 'evaluate-skill-manifest', 'get-sui-receipt'],
  };
}

