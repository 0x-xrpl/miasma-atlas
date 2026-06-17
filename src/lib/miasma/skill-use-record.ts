import type { AgentFlightRecord } from './agent-flight-recorder';
import type { SkillManifest } from './skill-manifest';
import type { ToolPermissionContext } from './tool-permission-context';
import type { ShadowExecutionResult } from './shadow-execution';

export type SkillUseRecord = {
  recordId: string;
  skillId: string;
  skillName: string;
  manifestHash: string;
  toolPermissionContext: ToolPermissionContext;
  shadowExecutionResult: ShadowExecutionResult;
  flightRecord: AgentFlightRecord;
  blocked: true;
  fundsMoved: 0;
  policyStatus: 'blocked';
  memoryPath: readonly string[];
  proposedAmount: number;
  skillManifest: SkillManifest;
};
