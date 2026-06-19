# Agentic Action Core

This repository keeps one reusable action core inside `src/core`.

## Flow order

1. Create or load a session.
2. Parse user intent.
3. Check boundary status.
4. Build a safe preview.
5. Evaluate policy.
6. Return blocked output if unsafe.
7. Return preview or confirmation-required output if not explicitly confirmed.
8. Map to a Sui action object only when the flow is confirmed and safe.
9. Create a receipt preview.

## Public API

`src/core/index.ts` exports:

- `createSession`
- `runAgenticActionFlow`
- `parseIntent`
- `createTransferPreview`
- `createDeepBookPreview`
- `createTransitPreview`
- `evaluatePolicy`
- `mapIntentToSuiAction`
- `createReceiptPreview`
- `getBoundaryStatus`

## Status words

- `implemented`
- `preview`
- `boundary`
- `blocked`
- `unavailable`

## Funds moved

`fundsMoved` stays `0` in preview, confirmation-required, and blocked results.
Real execution still requires explicit confirmation plus real safe wallet/client plumbing.

## Boundary map

The core exposes typed boundary status for voice, local AI, context, verification, evidence, identity, sponsored transactions, and proof.
Missing integrations return typed boundary values instead of throwing.
