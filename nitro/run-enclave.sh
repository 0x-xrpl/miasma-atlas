#!/usr/bin/env sh
set -eu

if ! command -v nitro-cli >/dev/null 2>&1; then
  echo "Nitro CLI unavailable: cannot run enclave in this environment." >&2
  exit 1
fi

nitro-cli run-enclave --eif-path miasma-atlas.eif --cpu-count 2 --memory 1024 --enclave-cid 16
