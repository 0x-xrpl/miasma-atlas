# MIASMA UI Direction

This document defines the plain wireframe shell for the current MIASMA interface.

## Purpose

The UI should show the runtime story in one glance:

- MIASMA
- Say it or type it. MIASMA reads before value moves.
- Top up. Trade. Block.
- Funds moved: 0

## Structure

Use four simple sections:

1. Input
2. AI Reads
3. Miasma Verifies
4. Sui Action Session

The flow selector should expose only the canonical evaluation flows:

- Transit top-up
- DeepBook trade
- Hidden transfer block

## Visual rule

The shell should stay plain and easy to replace later.
Use simple borders, clear labels, and static flow data.
Do not add dense proof walls or heavy visual treatment.

## Data source

The shared flow source defines the wireframe copy and states.
It should hold the command text, the read fields, the verifier checks, and the session fields.

## Semantic rule

Miasma stays internal as the verifier layer.
The public screen should keep the payment intent visible while showing that funds moved remain `0` during verification.
