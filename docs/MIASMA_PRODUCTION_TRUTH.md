# MIASMA Production Truth

## Live / Working

- core action semantics
- `MemoryActionContext`
- `MiasmaScanArtifact`
- `fundsMoved`
- `capsuleHash`
- Groth16 prove / verify when `npm run zk:verify` passes
- evidence capsule generation when `npm run evidence:capsule` passes

## Live When Configured

- Walrus upload
- Seal encryption
- Sui capsule anchor

## Optional Runtime

- Nitro / TEE attestation verification only in a real Nitro runtime

## Not Claimed

- fake TEE verification
- fake Walrus blob id
- fake Seal policy id
- fake Sui digest for blocked action
- fake mainnet execution
- funds moved for blocked action

## Production Truth Table

| Surface | Truth |
|---|---|
| Blocked poisoned action digest | None, because it is never submitted |
| Walrus upload | Only real when configured |
| Seal encryption | Only real when configured |
| Sui anchor | Only real when configured |
| Nitro / TEE verification | Only real in actual Nitro runtime |
| Mainnet claims | Not claimed |

