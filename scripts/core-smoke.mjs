import { createRequire } from 'node:module';
import { mkdtempSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';
import assert from 'node:assert/strict';

const repoRoot = new URL('..', import.meta.url).pathname;
const tsc = join(repoRoot, 'node_modules', '.bin', 'tsc');
const outDir = mkdtempSync(join(tmpdir(), 'miasma-core-smoke-'));

try {
  execFileSync(
    tsc,
    [
      '--module',
      'CommonJS',
      '--target',
      'ES2022',
      '--moduleResolution',
      'Node',
      '--esModuleInterop',
      '--skipLibCheck',
      '--rootDir',
      'src',
      '--outDir',
      outDir,
      'src/core/index.ts',
    ],
    { cwd: repoRoot, stdio: 'inherit' },
  );

  const require = createRequire(import.meta.url);
  const { runAgenticActionFlow } = require(join(outDir, 'core', 'index.js'));

  const previewTransfer = runAgenticActionFlow('send 10 SUI to 0xabc', {
    demoRecipientAddress: '0xtest_wallet',
  });
  assert.equal(previewTransfer.policy.blocked, false);
  assert.equal(previewTransfer.policy.confirmationRequired, true);
  assert.equal(previewTransfer.executionMode, 'preview');
  assert.equal(previewTransfer.fundsMoved, 0);
  assert.equal(previewTransfer.receipt.fundsMoved, 0);

  const confirmedTransfer = runAgenticActionFlow('send 10 SUI to 0xabc', {
    confirmed: true,
  });
  assert.equal(confirmedTransfer.policy.blocked, false);
  assert.equal(confirmedTransfer.executionMode, 'confirmed');
  assert.equal(confirmedTransfer.fundsMoved, 0);
  assert.equal(confirmedTransfer.receipt.fundsMoved, 0);
  assert.ok(confirmedTransfer.action);

  const unknownIntent = runAgenticActionFlow('banana clouds forever');
  assert.equal(unknownIntent.policy.blocked, true);
  assert.equal(unknownIntent.fundsMoved, 0);
  assert.equal(unknownIntent.receipt.fundsMoved, 0);

  const contaminated = runAgenticActionFlow('send 10 SUI to 0xabc', {
    boundaryStates: { contextBoundary: 'blocked' },
  });
  assert.equal(contaminated.policy.blocked, true);
  assert.equal(contaminated.fundsMoved, 0);

  const suspiciousRecipient = runAgenticActionFlow('send 10 SUI to suspicious wallet');
  assert.equal(suspiciousRecipient.policy.blocked, true);
  assert.equal(suspiciousRecipient.fundsMoved, 0);

  const invalidAmount = runAgenticActionFlow('send 0 SUI to 0xabc');
  assert.equal(invalidAmount.policy.blocked, true);
  assert.equal(invalidAmount.fundsMoved, 0);

  console.log('core smoke checks passed');
} finally {
  rmSync(outDir, { recursive: true, force: true });
}
