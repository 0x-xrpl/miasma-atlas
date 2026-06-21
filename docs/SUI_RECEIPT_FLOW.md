# Sui Receipt Flow

MIASMA uses Sui Testnet by default for the safe receipt demo.

## Why Testnet

- The blocked scan itself is local and does not need chain access.
- Testnet is the safest default for a first receipt publish or record run.
- The receipt transaction only records metadata for a blocked scan.
- Mainnet is compatible with the same Move module and helper, but it should only be used when the operator has intentionally configured a funded signer and real gas.

## Why the blocked scan does not need assets

- The public demo blocks the dangerous memory-action path before any transfer.
- The scan and receipt metadata are plain strings, hashes, booleans, and counters.
- No coin object is required to represent the blocked decision.
- The receipt transaction can describe the blocked scan without moving assets.

## Why an on-chain digest requires gas

- Any submitted Sui transaction needs gas.
- The receipt flow is safe because it only creates or shares a receipt object and emits metadata.
- The transaction still has to be signed and executed, so a funded account is required to get a digest.
- If the transaction is not executed, there is no digest to show in SuiVision.

## Why the receipt transaction is safe

- The Move module records blocked-scan metadata only.
- It does not accept `Coin<SUI>` or `Coin<USDC>`.
- It does not call `transfer`, `splitCoins`, `paySui`, or `payAllSui`.
- The receipt object stores the blocked state, risk score, projected exposure, detector result, sample hash or digest, and creation metadata.
- `funds moved` remains `0`.

## How to view the digest

- The helper prints the transaction digest when the receipt is successfully executed.
- The SuiVision Testnet link format is:

```text
https://suivision.xyz/txblock/<digest>?network=testnet
```

- Replace `<digest>` with the real transaction digest printed by the helper.

## Helper environment variables

- `SUI_RECEIPT_PACKAGE_ID`: published package ID for `miasma_receipt`
- `SUI_RECEIPT_SIGNER_MNEMONIC` or `SUI_RECEIPT_SIGNER_SECRET_KEY`: signer for execution
- `SUI_RECEIPT_NETWORK`: defaults to `testnet`
- `SUI_RECEIPT_SAMPLE_HASH`
- `SUI_RECEIPT_SAMPLE_DIGEST`
- `SUI_RECEIPT_PROJECTED_EXPOSURE`
- `SUI_RECEIPT_DETECTOR_RESULT`
- `SUI_RECEIPT_RISK_SCORE`
- `SUI_RECEIPT_BLOCKED`
- `SUI_RECEIPT_CREATED_AT_MS`

The helper uses safe defaults for the blocked scan path and never submits a transfer.
