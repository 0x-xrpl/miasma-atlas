#!/usr/bin/env sh
set -eu

SOURCE_PATH="${NITRO_ATTESTATION_SOURCE_PATH:-${NITRO_ATTESTATION_INPUT_PATH:-}}"
OUTPUT_PATH="${NITRO_ATTESTATION_DOCUMENT_PATH:-${NITRO_ATTESTATION_OUTPUT_PATH:-}}"

if [ -z "$SOURCE_PATH" ] || [ -z "$OUTPUT_PATH" ]; then
  echo "PRODUCTION GATE FAILED: Nitro Enclave runtime required to generate attestation document" >&2
  exit 1
fi

if [ ! -f "$SOURCE_PATH" ]; then
  echo "PRODUCTION GATE FAILED: Nitro Enclave runtime required to generate attestation document" >&2
  exit 1
fi

cp "$SOURCE_PATH" "$OUTPUT_PATH"
echo "$OUTPUT_PATH"
