# Nitro Verifier Target

Local verifier mode is the operating default. Nitro Enclave mode is the isolated execution target for the same verifier boundary.

## Target flow

Parent EC2 / host
→ sends `MemoryActionContext` over vSock
→ Nitro Enclave runs the Rust verifier
→ enclave emits `MiasmaScanArtifact`
→ artifact is signed or prepared for signing
→ sensitive evidence remains Seal locked
→ artifact ref is stored through Walrus
→ Sui QuarantineReceipt records hash/ref/score/decision

## What vSock does

vSock is the transport between the parent host and enclave. It is the channel that would carry the memory-action request into the isolated Nitro boundary and bring the scan result back out.

## What an enclave-signed artifact means

An enclave-signed artifact means the verifier result was produced inside the Nitro boundary and then signed or prepared for signing before it leaves the enclave. This is the target model only; no production Nitro signing is implemented here.

## What PCR / attestation would prove

PCRs and attestation would prove the enclave ran the expected code image and booted in the expected trust state. This sample implementation does not fabricate attestation documents or PCR values.

## Current status

- Local verifier mode is implemented
- Nitro Enclave mode is the isolated execution target
- No AWS deployment is implemented
- No enclave signature is produced here
- No attestation document is produced here

## Next integration boundary

Later work can wire the host request path, build an EIF, collect real attestation, and attach the enclave output to the same Seal / Walrus / Groth16 / Sui receipt flow without changing the public artifact semantics.
