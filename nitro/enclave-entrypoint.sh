#!/usr/bin/env sh
set -eu

# Scaffold only: this is the expected enclave entrypoint shape.
# In a production build, the verifier binary would be mounted or copied into the image.

VERIFIER_BIN="${VERIFIER_BIN:-/app/verifier/miasma-atlas-verifier}"
REQUEST_FILE="${REQUEST_FILE:-/app/vsock-request.example.json}"

if [ ! -x "$VERIFIER_BIN" ]; then
  echo "Nitro scaffold: verifier binary not found at $VERIFIER_BIN" >&2
  echo "Mount the Rust verifier binary here in a production image." >&2
  exit 1
fi

if [ ! -f "$REQUEST_FILE" ]; then
  echo "Nitro scaffold: request file not found at $REQUEST_FILE" >&2
  exit 1
fi

exec "$VERIFIER_BIN" --input "$REQUEST_FILE"
