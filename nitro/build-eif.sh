#!/usr/bin/env sh
set -eu

if ! command -v nitro-cli >/dev/null 2>&1; then
  echo "Nitro CLI unavailable: cannot build EIF in this environment." >&2
  exit 1
fi

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker unavailable: cannot build the enclave image on this instance." >&2
  exit 1
fi

DOCKER_CONTEXT="${NITRO_DOCKER_CONTEXT:-nitro}"
DOCKERFILE="${NITRO_DOCKERFILE:-nitro/Dockerfile}"
DOCKER_URI="${NITRO_DOCKER_URI:-hey-sui-nitro:latest}"
EIF_PATH="${NITRO_EIF_PATH:-hey-sui.eif}"
ENCLAVE_MODE="${NITRO_ENCLAVE_MODE:-verify}"

docker build \
  --build-arg "NITRO_ENCLAVE_MODE=${ENCLAVE_MODE}" \
  -f "$DOCKERFILE" \
  -t "$DOCKER_URI" \
  "$DOCKER_CONTEXT"

nitro-cli build-enclave --docker-uri "$DOCKER_URI" --output-file "$EIF_PATH"
