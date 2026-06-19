#!/usr/bin/env sh
set -eu

if ! command -v nitro-cli >/dev/null 2>&1; then
  echo "Nitro CLI unavailable: run this on an AWS Nitro Enclave parent instance." >&2
  exit 1
fi

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker unavailable: install Docker on the parent instance first." >&2
  exit 1
fi

DOCKER_URI="${NITRO_DOCKER_URI:-hey-sui-nitro:latest}"
EIF_PATH="${NITRO_EIF_PATH:-hey-sui.eif}"
ENCLAVE_MODE="${NITRO_ENCLAVE_MODE:-attest}"
ENCLAVE_CID="${NITRO_ENCLAVE_CID:-16}"
CPU_COUNT="${NITRO_CPU_COUNT:-2}"
MEMORY_MIB="${NITRO_MEMORY_MIB:-1024}"
SOURCE_PATH="${NITRO_ATTESTATION_SOURCE_PATH:-/tmp/hey-sui-nitro-attestation.cbor}"
DOCUMENT_PATH="${NITRO_ATTESTATION_DOCUMENT_PATH:-/tmp/attestation.cbor}"
EXPECTED_PCRS_JSON="${NITRO_EXPECTED_PCRS_JSON:-$(cat nitro/expected-pcrs.example.json)}"

echo "Amazon Linux parent-instance sequence:"
echo "1) Build the enclave image and EIF:"
echo "   NITRO_DOCKER_URI=$DOCKER_URI NITRO_EIF_PATH=$EIF_PATH NITRO_ENCLAVE_MODE=$ENCLAVE_MODE npm run tee:build-enclave"
echo "2) Run the enclave:"
echo "   NITRO_EIF_PATH=$EIF_PATH NITRO_CPU_COUNT=$CPU_COUNT NITRO_MEMORY_MIB=$MEMORY_MIB NITRO_ENCLAVE_CID=$ENCLAVE_CID npm run tee:run-enclave"
echo "3) Capture the real attestation document from enclave output:"
echo "   nitro-cli console --enclave-id <real-enclave-id> > $SOURCE_PATH"
echo "4) Export it to the verifier path:"
echo "   NITRO_ATTESTATION_SOURCE_PATH=$SOURCE_PATH NITRO_ATTESTATION_DOCUMENT_PATH=$DOCUMENT_PATH npm run tee:capture"
echo "5) Verify against the expected PCR template:"
echo "   NITRO_ATTESTATION_DOCUMENT_PATH=$DOCUMENT_PATH NITRO_EXPECTED_PCRS_JSON='$EXPECTED_PCRS_JSON' npm run tee:verify"
