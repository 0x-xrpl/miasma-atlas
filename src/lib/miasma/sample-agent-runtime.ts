import { demoMemoryActionContext } from './memory-action-context';
import { demoSkillManifest } from './skill-manifest';
import { demoToolPermissionContext } from './tool-permission-context';
import { recordAgentFlight } from './agent-flight-recorder';
import { shadowExecute } from './shadow-execution';
import { agentRuntimeSteps, type AgentRuntime } from './agent-runtime';
import type { SkillUseRecord } from './skill-use-record';

const shadowExecutionResult = shadowExecute('pay 900 USDC to vendor', 'blocked', 'contaminated memory path');

const skillUseRecord: SkillUseRecord = {
  recordId: 'skill-use-local-scaffold',
  skillId: demoSkillManifest.skillId,
  skillName: demoSkillManifest.skillName,
  manifestHash: demoSkillManifest.skillHash,
  toolPermissionContext: demoToolPermissionContext,
  shadowExecutionResult,
  flightRecord: recordAgentFlight('Gate', 'skill use blocked before execution'),
  blocked: true,
  fundsMoved: 0,
  policyStatus: 'blocked',
  memoryPath: demoMemoryActionContext.memoryPath,
  proposedAmount: demoMemoryActionContext.proposedAmount,
  skillManifest: demoSkillManifest,
};

export const sampleAgentRuntime: AgentRuntime & { skillUseRecord: SkillUseRecord } = {
  runtimeId: 'local-agent-runtime',
  steps: agentRuntimeSteps,
  memoryActionContext: demoMemoryActionContext,
  skillManifest: demoSkillManifest,
  toolPermissionContext: demoToolPermissionContext,
  skillUseRequest: {
    skillId: demoSkillManifest.skillId,
    skillName: demoSkillManifest.skillName,
    memoryActionContext: demoMemoryActionContext,
    proposedAction: 'pay 900 USDC to vendor',
    requestedPermission: demoToolPermissionContext.requestedPermission,
  },
  shadowExecutionResult,
  flightRecord: skillUseRecord.flightRecord,
  blocked: true,
  skillUseRecord,
};
