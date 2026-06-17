#!/usr/bin/env sh
set -eu

if ! command -v nitro-cli >/dev/null 2>&1; then
  echo "Nitro CLI unavailable: cannot build EIF in this environment." >&2
  exit 1
fi

nitro-cli build-enclave --docker-uri miasma-atlas-nitro:latest --output-file miasma-atlas.eif
