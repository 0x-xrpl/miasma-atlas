# Evidence Path

Miasma does not put raw memory evidence on-chain. The public receipt stores hashes, refs, scores, and decisions. Sensitive evidence is modeled as Seal-locked and referenced through a Walrus artifact path.

## What is public

- `memoryHash`
- `scanArtifactHash`
- `publicArtifactRef`
- `walrusBlobRef`
- `proposedAmount`
- `fundsMoved`
- `contaminationScore`
- `decision`
- `recommendation`

## What stays hidden

- raw memory payloads
- sensitive evidence contents
- execution-time secrets

## Current implementation boundary

- `src/lib/miasma/evidence-path.ts` defines the frontend evidence-path model
- `src/lib/miasma/sample-evidence-path.ts` provides the local sample refs
- `src/lib/miasma/quarantine-receipt.ts` carries the public receipt fields
- `move/sources/quarantine_receipt.move` defines the on-chain receipt object

## Status

- Seal is implemented as a locked evidence layer
- Walrus is implemented as an artifact reference layer
- Groth16 is still pending and not implemented here
- Nitro is not implemented here

## Next integration boundary

Later integration can replace the local sample values with real Seal locking, Walrus storage, and proof plumbing while keeping the same public receipt semantics.
