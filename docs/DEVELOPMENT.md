# Development

MIASMA uses a standalone HTML page as the public source of truth.

## Public page architecture

- The visible site is served directly from root `index.html`.
- The page is intentionally not converted to React.
- `src/main.tsx`, `src/App.tsx`, and `src/styles.css` do not control the public page.
- This keeps the deployed output visually identical to the standalone HTML.

## Vercel deployment notes

- The repo is Vite/static compatible.
- Vercel should import the repository directly and build from the root project.
- The public page should resolve from `/`.
- Assets for the demo live under stable paths such as `public/samples`.

## Sample loader behavior

- The sample loader reads the poisoned memory sample from `public/samples`.
- The replay stays local until the user explicitly loads and scans it.
- The blocked scan does not submit a transfer.
- The sample is used to demonstrate sliced exposure detection and `funds moved = 0`.

## Wallet connect behavior

- The page supports Wallet Standard authorization.
- Wallet connect is for controlled access only.
- The blocked path must remain unapproved and unsigned.
- No dangerous transfer is requested by the demo flow.

## zkLogin prompt behavior

- The zkLogin prompt prepares identity authorization only.
- It does not imply a transfer.
- It does not bypass the quarantine boundary.
- It is part of the demo path for safe receipt preparation.

## Safe receipt roadmap

- The Move package under `contracts/miasma_receipt` records blocked-scan metadata.
- The TypeScript helper under `scripts/record_receipt.ts` shows how to publish the safe receipt on Testnet.
- The on-chain digest is optional and requires a configured package ID and gas.
- The receipt path is separate from the blocked action path.
