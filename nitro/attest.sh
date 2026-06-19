#!/usr/bin/env sh
set -eu

ATTESTATION_BIN="${NITRO_ATTESTATION_BIN:-${ATTESTATION_BIN:-/app/bin/nitro-attest}}"
ATTESTATION_OUTPUT_PATH="${NITRO_ATTESTATION_OUTPUT_PATH:-${ATTESTATION_OUTPUT_PATH:-}}"

if [ ! -x "$ATTESTATION_BIN" ]; then
  echo "PRODUCTION GATE FAILED: Nitro Enclave runtime required to generate attestation document" >&2
  exit 1
fi

if [ -n "$ATTESTATION_OUTPUT_PATH" ]; then
  "$ATTESTATION_BIN" > "$ATTESTATION_OUTPUT_PATH"
else
  "$ATTESTATION_BIN"
fi
