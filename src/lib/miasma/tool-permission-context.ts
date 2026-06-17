export type ToolPermissionTier = 'allowed' | 'blocked' | 'pending';

export type ToolPermissionContext = {
  requestedPermission: string;
  declaredPermission: string;
  asset: string;
  recipient: string;
  amount: number;
  riskTier: 'low' | 'medium' | 'high';
  policyStatus: ToolPermissionTier;
};

export const demoToolPermissionContext: ToolPermissionContext = {
  requestedPermission: 'transfer:usdc',
  declaredPermission: 'transfer:usdc',
  asset: 'USDC',
  recipient: 'vendor',
  amount: 900,
  riskTier: 'high',
  policyStatus: 'blocked',
};

export function isToolAllowed(context: ToolPermissionContext) {
  return context.policyStatus === 'allowed' && context.requestedPermission === context.declaredPermission;
}
