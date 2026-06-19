#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import cbor from 'cbor';
import { createHash } from 'node:crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

const attestationPath =
  process.env.NITRO_ATTESTATION_DOCUMENT_PATH ||
  process.env.VITE_NITRO_ATTESTATION_DOCUMENT_PATH ||
  '';

const expectedModuleId = process.env.NITRO_EXPECTED_MODULE_ID || '';
const expectedPcrsJson = process.env.NITRO_EXPECTED_PCRS_JSON || '';
const expectedPcrsPath = process.env.NITRO_EXPECTED_PCRS_PATH || '';

function fail(message) {
  console.error(message);
  process.exitCode = 1;
  return false;
}

function normalizeHex(value) {
  return String(value).replace(/^0x/i, '').toLowerCase();
}

function normalizeDoc(doc) {
  if (doc && typeof doc === 'object' && !Array.isArray(doc)) {
    return doc;
  }
  throw new Error('Nitro attestation document is not an object.');
}

function loadDocument(buffer) {
  try {
    return normalizeDoc(cbor.decodeFirstSync(buffer));
  } catch {
    try {
      return normalizeDoc(JSON.parse(buffer.toString('utf8')));
    } catch (error) {
      throw new Error('Nitro attestation document could not be parsed as CBOR or JSON.');
    }
  }
}

function getPcrEntries(doc) {
  const pcrs = doc.pcrs;
  if (Array.isArray(pcrs)) {
    return pcrs.map((entry) => ({
      index: Number(entry.index),
      value: normalizeHex(entry.value),
    }));
  }

  if (pcrs && typeof pcrs === 'object') {
    return Object.entries(pcrs).map(([index, value]) => ({
      index: Number(index),
      value: normalizeHex(value),
    }));
  }

  throw new Error('Nitro attestation document does not contain PCRs.');
}

function parseExpectedPcrs() {
  const rawExpectedPcrs = expectedPcrsPath
    ? fs.readFileSync(expectedPcrsPath, 'utf8')
    : expectedPcrsJson;

  if (!rawExpectedPcrs) {
    throw new Error('Expected PCR configuration is missing.');
  }

  const parsed = JSON.parse(rawExpectedPcrs);
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('Expected PCR configuration must be a JSON object.');
  }

  return Object.fromEntries(
    Object.entries(parsed).map(([index, value]) => [Number(index), normalizeHex(value)]),
  );
}

function verify() {
  if (!attestationPath) {
    return fail('PRODUCTION GATE FAILED: Nitro/TEE attestation document not configured');
  }

  if (!fs.existsSync(attestationPath)) {
    return fail(`PRODUCTION GATE FAILED: Nitro/TEE attestation document not found at ${attestationPath}`);
  }

  let expectedPcrs;
  try {
    expectedPcrs = parseExpectedPcrs();
  } catch (error) {
    return fail('PRODUCTION GATE FAILED: Nitro/TEE attestation PCRs not configured');
  }

  try {
    const raw = fs.readFileSync(attestationPath);
    const doc = loadDocument(raw);
    const pcrEntries = getPcrEntries(doc);

    if (expectedModuleId) {
      const moduleId = normalizeHex(doc.module_id ?? doc.moduleId ?? '');
      if (moduleId !== normalizeHex(expectedModuleId)) {
        return fail('PRODUCTION GATE FAILED: Nitro/TEE module_id mismatch');
      }
    }

    for (const [index, expectedValue] of Object.entries(expectedPcrs)) {
      const entry = pcrEntries.find((candidate) => candidate.index === Number(index));
      if (!entry) {
        return fail(`PRODUCTION GATE FAILED: Nitro/TEE PCR ${index} missing`);
      }
      if (entry.value !== expectedValue) {
        return fail(`PRODUCTION GATE FAILED: Nitro/TEE PCR ${index} mismatch`);
      }
    }

    const proofHash = createHash('sha256').update(raw).digest('hex');
    console.log('Nitro/TEE attestation verification passed.');
    console.log(`Attestation hash: ${proofHash}`);
    console.log(`Module ID: ${doc.module_id ?? doc.moduleId ?? 'unknown'}`);
    console.log(`Timestamp: ${doc.timestamp ?? 'unknown'}`);
    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return fail(`PRODUCTION GATE FAILED: Nitro/TEE attestation verification failed (${message})`);
  }
}

verify();
