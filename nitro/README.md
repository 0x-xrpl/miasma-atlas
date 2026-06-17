# Nitro Verifier Target Scaffold

This directory documents the isolated Nitro Enclave target for the same Rust verifier boundary used locally.

It is not a production deployment. The local Rust verifier remains the working default.

## Files

- `Dockerfile` packages the verifier conceptually
- `enclave-entrypoint.sh` describes the enclave entrypoint
- `build-eif.sh` checks for `nitro-cli` and builds an EIF when available
- `run-enclave.sh` checks for `nitro-cli` and runs the enclave when available
- `vsock-request.example.json` shows the request shape

## Status

- Local verifier mode: implemented
- Nitro Enclave mode: scaffolded target
- Attestation and enclave signing: future work
