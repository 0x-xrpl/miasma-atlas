export function evaluateSkillManifest(name: string) {
  return {
    allowed: name.length > 0,
    name,
  };
}

