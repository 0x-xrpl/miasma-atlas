#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const zkRoot = path.join(repoRoot, 'zk');
const generatedRoot = path.join(zkRoot, 'generated');
const sampleInputPath = path.join(zkRoot, 'quarantine_threshold', 'sample_input.json');
const proofStatusPath = path.join(repoRoot, 'src', 'core', 'boundaries', 'zk-groth16-status.ts');
const circomBin = path.join(repoRoot, 'node_modules', '.bin', 'circom');
const snarkjsBin = path.join(repoRoot, 'node_modules', '.bin', 'snarkjs');

const circuitName = 'quarantine_threshold';
const circuitSource = path.join(zkRoot, 'circuits', `${circuitName}.circom`);
const circuitR1csPath = path.join(generatedRoot, `${circuitName}.r1cs`);
const circuitWasmPath = path.join(generatedRoot, `${circuitName}.wasm`);
const circuitSymPath = path.join(generatedRoot, `${circuitName}.sym`);
const witnessInputPath = path.join(generatedRoot, `${circuitName}.input.json`);
const witnessPath = path.join(generatedRoot, `${circuitName}.wtns`);
const pot0Path = path.join(generatedRoot, `${circuitName}.pot0.ptau`);
const pot1Path = path.join(generatedRoot, `${circuitName}.pot1.ptau`);
const potFinalPath = path.join(generatedRoot, `${circuitName}.pot_final.ptau`);
const zkey0Path = path.join(generatedRoot, `${circuitName}.zkey`);
const zkeyFinalPath = path.join(generatedRoot, `${circuitName}.final.zkey`);
const verificationKeyPath = path.join(generatedRoot, `${circuitName}.verification_key.json`);
const proofPath = path.join(generatedRoot, `${circuitName}.proof.json`);
const publicSignalsPath = path.join(generatedRoot, `${circuitName}.public.json`);
const statusJsonPath = path.join(generatedRoot, `${circuitName}.status.json`);

function usage() {
  console.error('Usage: node scripts/zk-groth16.mjs <build|prove|verify>');
  process.exit(1);
}

function ensureTool(pathToTool, label) {
  if (!fs.existsSync(pathToTool)) {
    throw new Error(`${label} not found at ${pathToTool}. Run npm install first.`);
  }
}

function run(tool, args, input) {
  const result = spawnSync(tool, args, {
    cwd: repoRoot,
    stdio: ['pipe', 'inherit', 'inherit'],
    input,
    encoding: 'utf8',
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    throw new Error(`Command failed: ${tool} ${args.join(' ')}`);
  }
}

function cleanGenerated() {
  fs.rmSync(generatedRoot, { recursive: true, force: true });
  fs.mkdirSync(generatedRoot, { recursive: true });
  fs.rmSync(path.join(repoRoot, `${circuitName}.r1cs`), { force: true });
  fs.rmSync(path.join(repoRoot, `${circuitName}.wasm`), { force: true });
  fs.rmSync(path.join(repoRoot, `${circuitName}.sym`), { force: true });
}

function readSampleInput() {
  const sample = JSON.parse(fs.readFileSync(sampleInputPath, 'utf8'));
  return {
    blocked: sample.action_blocked ? 1 : 0,
  };
}

function fileHash(filePath) {
  const hash = createHash('sha256');
  hash.update(fs.readFileSync(filePath));
  return hash.digest('hex');
}

function writeProofStatus(state, detail, extra = {}) {
  const payload = {
    state,
    detail,
    available: state !== 'unavailable',
    ...extra,
    assets: {
      circuit: path.relative(repoRoot, circuitSource),
      r1cs: path.relative(repoRoot, circuitR1csPath),
      wasm: path.relative(repoRoot, circuitWasmPath),
      sym: path.relative(repoRoot, circuitSymPath),
      zkey: path.relative(repoRoot, zkeyFinalPath),
      verificationKey: path.relative(repoRoot, verificationKeyPath),
      witness: path.relative(repoRoot, witnessPath),
      proof: path.relative(repoRoot, proofPath),
      publicSignals: path.relative(repoRoot, publicSignalsPath),
    },
  };

  fs.writeFileSync(
    proofStatusPath,
    `const zkGroth16Status = ${JSON.stringify(payload, null, 2)} as const;\n\nexport default zkGroth16Status;\n`,
  );
  fs.writeFileSync(statusJsonPath, `${JSON.stringify(payload, null, 2)}\n`);
}

function build() {
  ensureTool(circomBin, 'circom');
  ensureTool(snarkjsBin, 'snarkjs');
  cleanGenerated();

  run(circomBin, [circuitSource, '--r1cs', '--wasm', '--sym']);
  fs.renameSync(path.join(repoRoot, `${circuitName}.r1cs`), circuitR1csPath);
  fs.renameSync(path.join(repoRoot, `${circuitName}.wasm`), circuitWasmPath);
  fs.renameSync(path.join(repoRoot, `${circuitName}.sym`), circuitSymPath);
  run(snarkjsBin, ['powersoftau', 'new', 'bn128', '4', pot0Path, '-v']);
  run(snarkjsBin, ['powersoftau', 'contribute', pot0Path, pot1Path], 'hey-sui-zk-build\n');
  run(snarkjsBin, ['powersoftau', 'prepare', 'phase2', pot1Path, potFinalPath, '-v']);
  run(snarkjsBin, ['groth16', 'setup', circuitR1csPath, potFinalPath, zkey0Path]);
  run(snarkjsBin, ['zkey', 'contribute', zkey0Path, zkeyFinalPath], 'hey-sui-zk-build\n');
  run(snarkjsBin, ['zkey', 'export', 'verificationkey', zkeyFinalPath, verificationKeyPath]);

  writeProofStatus('unavailable', 'ZK/Groth16 proving assets are built. Run npm run zk:prove to generate a verified proof.');

  console.log('ZK build complete.');
}

function prove() {
  if (!fs.existsSync(zkeyFinalPath) || !fs.existsSync(verificationKeyPath) || !fs.existsSync(circuitWasmPath)) {
    build();
  }

  ensureTool(snarkjsBin, 'snarkjs');

  fs.writeFileSync(witnessInputPath, `${JSON.stringify(readSampleInput(), null, 2)}\n`);
  run(snarkjsBin, ['wtns', 'calculate', circuitWasmPath, witnessInputPath, witnessPath]);
  run(snarkjsBin, ['groth16', 'prove', zkeyFinalPath, witnessPath, proofPath, publicSignalsPath]);
  run(snarkjsBin, ['groth16', 'verify', verificationKeyPath, publicSignalsPath, proofPath]);

  const proofHash = fileHash(proofPath);
  writeProofStatus('verified', `ZK verification passed. Proof hash: ${proofHash}.`, {
    proofHash,
    publicSignalsHash: fileHash(publicSignalsPath),
  });
  console.log('ZK proof generated and verified.');
}

function verify() {
  if (!fs.existsSync(proofPath) || !fs.existsSync(publicSignalsPath)) {
    prove();
    return;
  }

  ensureTool(snarkjsBin, 'snarkjs');
  run(snarkjsBin, ['groth16', 'verify', verificationKeyPath, publicSignalsPath, proofPath]);

  const proofHash = fileHash(proofPath);
  writeProofStatus('verified', `ZK verification passed. Proof hash: ${proofHash}.`, {
    proofHash,
    publicSignalsHash: fileHash(publicSignalsPath),
  });
  console.log('ZK verification passed.');
}

const command = process.argv[2];
if (!command) {
  usage();
}

try {
  if (command === 'build') {
    build();
  } else if (command === 'prove') {
    prove();
  } else if (command === 'verify') {
    verify();
  } else {
    usage();
  }
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exit(1);
}
