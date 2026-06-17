export type SkillRiskTier = 'low' | 'medium' | 'high';
export type SkillExecutionType = 'pre_execution' | 'shadow_execution';

export type SkillManifest = {
  skillId: string;
  skillName: string;
  skillHash: string;
  provider: string;
  version: string;
  riskTier: SkillRiskTier;
  requiredPermissions: readonly string[];
  allowedAssets: readonly string[];
  allowedRecipients: readonly string[];
  maxAmount: number;
  memoryDependencies: readonly string[];
  policyDependencies: readonly string[];
  executionType: SkillExecutionType;
  preExecutionRequired: true;
  quarantineRequiredIfContaminated: true;
};

export const demoSkillManifest: SkillManifest = {
  skillId: 'send_usdc',
  skillName: 'Send USDC',
  skillHash: 'skillhash_send_usdc_scaffold',
  provider: 'Miasma Atlas',
  version: '0.1.0',
  riskTier: 'high',
  requiredPermissions: ['transfer:usdc', 'read:policy'],
  allowedAssets: ['USDC'],
  allowedRecipients: ['vendor'],
  maxAmount: 900,
  memoryDependencies: ['vendor_policy_v3.txt', 'payment_rules.md'],
  policyDependencies: ['quarantine_rule_v1'],
  executionType: 'pre_execution',
  preExecutionRequired: true,
  quarantineRequiredIfContaminated: true,
};
