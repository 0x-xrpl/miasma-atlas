# Archived Internal Research: Verifier Target

This note is archived internal research. It is not part of the MIASMA public product story.

Local verifier mode is the operating default. The isolated target notes below are retained only for historical context.

## Target flow

Parent EC2 / host
→ sends `MemoryActionContext` over vSock
→ isolated target runs the Rust verifier
→ isolated target emits `MiasmaScanArtifact`
→ artifact is signed or prepared for signing
→ sensitive evidence remains Seal locked
→ artifact ref is stored through Walrus
→ Sui QuarantineReceipt records hash/ref/score/decision

## What vSock does

vSock is the transport between the parent host and isolated target. It is the channel that would carry the memory-action request into the isolated boundary and bring the scan result back out.

## What an enclave-signed artifact means

An isolated-target-signed artifact means the verifier result was produced inside the isolated boundary and then signed or prepared for signing before it leaves the target. This is the target model only; no production signing is implemented here.

## What PCR / attestation would prove

PCRs and attestation would prove the enclave ran the expected code image and booted in the expected trust state. This sample implementation does not fabricate attestation documents or PCR values.

## Current status

- Local verifier mode is implemented
- isolated target mode is the historical execution target
- No external deployment is implemented
- No isolated-target signature is produced here
- No attestation document is produced here

## Next integration boundary

Later work can wire the host request path, build the isolated target, collect attestation, and attach the target output to the same Seal / Walrus / Groth16 / Sui receipt flow without changing the public artifact semantics.
