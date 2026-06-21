# Security Model

MIASMA is a pre-wallet memory-action quarantine layer.

## Threat model

- The input may be a poisoned memory path.
- The agent may produce a valid-looking action draft.
- The exposure may be sliced across multiple drafts.
- The visible transaction preview may look ordinary while the causal path is contaminated.

## Poisoned memory

- Poisoned memory includes policy files, tool context, prior agent state, or repeated draft behavior.
- MIASMA checks the memory-action path before the wallet boundary.
- The path is treated as suspect until verified.

## Sliced exposure

- Sliced exposure is a pattern where the total risk is distributed across smaller-looking drafts.
- MIASMA detects the pattern before signing.
- The demo sample shows projected exposure even though no transfer is allowed.

## Pre-wallet boundary

- The dangerous request is blocked before wallet approval.
- No signature is requested for the contaminated path.
- No submit happens for the contaminated path.
- `funds moved` stays `0`.

## Safe receipt only

- The only on-chain transaction is the safe quarantine receipt.
- The receipt records metadata about the blocked scan.
- It does not carry `Coin<SUI>` or `Coin<USDC>`.
- It does not execute transfer or settlement logic.

## Security guarantees

- No dangerous transaction is signed.
- No USDC or SUI transfer is submitted.
- No vendor settlement is executed.
- No fake digest is claimed.
- The blocked path remains blocked.
