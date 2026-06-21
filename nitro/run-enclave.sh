#!/usr/bin/env sh
set -eu

if ! command -v nitro-cli >/dev/null 2>&1; then
  echo "Nitro CLI unavailable: cannot run enclave in this environment." >&2
  exit 1
fi

EIF_PATH="${NITRO_EIF_PATH:-hey-sui.eif}"
CPU_COUNT="${NITRO_CPU_COUNT:-2}"
MEMORY_MIB="${NITRO_MEMORY_MIB:-1024}"
ENCLAVE_CID="${NITRO_ENCLAVE_CID:-16}"

nitro-cli run-enclave \
  --eif-path "$EIF_PATH" \
  --cpu-count "$CPU_COUNT" \
  --memory "$MEMORY_MIB" \
  --enclave-cid "$ENCLAVE_CID"
