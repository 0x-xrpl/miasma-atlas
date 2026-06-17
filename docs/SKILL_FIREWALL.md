# Skill Firewall

Miasma protects agent skill execution before the skill runs.

The firewall checks:

- the memory path that led to the action
- the tool permission context
- the skill manifest

If contamination is detected, contaminated skill use is blocked and `fundsMoved` stays `0`.

## Current implementation boundary

- `src/lib/miasma/agent-runtime.ts`
- `src/lib/miasma/skill-manifest.ts`
- `src/lib/miasma/skill-use-record.ts`
- `src/lib/miasma/tool-permission-context.ts`
- `src/lib/miasma/shadow-execution.ts`
- `src/lib/miasma/sample-agent-runtime.ts`

## Runtime story

Agent tries to use a skill.
Miasma builds a `MemoryActionContext`.
Miasma maps the memory path that caused the action.
Verifier finds contamination.
Skill execution is blocked.
Funds moved: `0`.

## Receipt

The pre-execution block is recorded by the public receipt. The receipt stores hashes, refs, scores, and decisions, not raw memory.
