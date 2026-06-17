import type { MiasmaMemoryActionContext } from './memory-action-context';
import type { SkillManifest } from './skill-manifest';
import type { ToolPermissionContext } from './tool-permission-context';
import type { ShadowExecutionResult } from './shadow-execution';
import type { AgentFlightRecord } from './agent-flight-recorder';

export const agentRuntimeSteps = [
  'Observe',
  'Bind',
  'Retrieve',
  'Map',
  'Verify',
  'Seal',
  'Prove',
  'Store',
  'Gate',
  'Receipt',
  'Learn',
] as const;

export type AgentRuntimeStep = (typeof agentRuntimeSteps)[number];

export type SkillUseRequest = {
  skillId: string;
  skillName: string;
  memoryActionContext: MiasmaMemoryActionContext;
  proposedAction: string;
  requestedPermission: string;
};

export type AgentRuntime = {
  runtimeId: string;
  steps: readonly AgentRuntimeStep[];
  memoryActionContext: MiasmaMemoryActionContext;
  skillManifest: SkillManifest;
  toolPermissionContext: ToolPermissionContext;
  skillUseRequest: SkillUseRequest;
  shadowExecutionResult: ShadowExecutionResult;
  flightRecord: AgentFlightRecord;
  blocked: true;
};
