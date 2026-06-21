# Demo Flow

Use this as the judge-facing walkthrough.

## What to click

1. Open the live demo.
2. Click `Connect Sui Wallet`.
3. Continue with the zkLogin email prompt.
4. Click `Load poisoned memory sample`.
5. Click `MIASMA scan complete`.
6. Review the blocked result and receipt-ready path.
7. If Testnet receipt config is available, record the quarantine receipt.

## What should appear

- A blocked memory-action path.
- Projected exposure on the sample scan.
- `Funds moved: 0`.
- No dangerous wallet approval.
- No signed transfer.
- A safe receipt path for the blocked scan.

## What not to expect

- No USDC transfer.
- No SUI transfer.
- No vendor settlement.
- No fake SuiVision digest.
- No claim that Mainnet was executed unless it was actually configured and run.

## What proves the safety claim

- The blocked path is detected before approval.
- The wallet request is suppressed for the dangerous action.
- The visible outcome stays at `funds moved = 0`.
- The only on-chain action is the safe quarantine receipt when explicitly configured.
