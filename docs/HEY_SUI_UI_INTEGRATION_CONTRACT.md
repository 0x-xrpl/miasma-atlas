# MIASMA UI Integration Contract

This contract keeps the wireframe easy to replace later without changing the semantic flow.

## Data contract

Each flow in the shared flow source provides:

- `id`
- `tabLabel`
- `command`
- `readFields`
- `verifyFields`
- `sessionStatus`
- `sessionFields`

## Component contract

The app shell should render these regions in order:

- Header
- Flow selector
- Input panel
- AI Reads panel
- Miasma Verifies panel
- Sui Action Session panel

## Required public wording

- MIASMA
- Say it or type it. MIASMA reads before value moves.
- Top up. Trade. Block.
- Funds moved: 0

## Hidden transfer flow

The hidden transfer block flow must keep the current local scan artifact semantics:

- `proposedAmount: 900`
- `fundsMoved: 0`
- `contaminationScore: 87`
- `actionBlocked: true`
- `recommendation: quarantine`
- `infectedPath` includes `vendor_policy_v3.txt`, `payment_rules.md`, and `send_usdc`
- `detectorResults` includes hidden instruction contamination

## Replacement rule

If the UI changes later, update the flow data module first and keep the panels generic.
The layout should remain a plain shell, not a dense proof surface.
