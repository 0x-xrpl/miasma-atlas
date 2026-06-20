<div align="center">

# MIASMA

### Pre-execution memory-action quarantine for agentic Sui actions

Small actions became a micro-drain pattern.  
MIASMA blocked the sequence before wallet approval.  
**Funds moved: 0.**

<img src="https://img.shields.io/static/v1?label=LOCAL_RUST_VERIFIER&message=passing&color=36F7DF&labelColor=0B1114" />
<img src="https://img.shields.io/static/v1?label=SUI_MOVE_BUILD&message=passing&color=4DA3FF&labelColor=0B1114" />
<img src="https://img.shields.io/static/v1?label=SKILL_FIREWALL&message=enabled&color=FF5B50&labelColor=0B1114" />
<img src="https://img.shields.io/static/v1?label=FUNDS_MOVED&message=0&color=FFFFFF&labelColor=0B1114" />

</div>

## Five-second incident

```txt
Small actions became a micro-drain pattern.
MIASMA blocked the sequence before wallet approval.
Funds moved: 0.
```

## Incident summary

| Field | Value |
|---|---|
| Agent action | DeepBook / Sui micro-action sequence |
| Pattern | 5 USDC × 10 attempts |
| Projected movement | 50 USDC |
| Contamination score | 87 |
| Quarantine threshold | 70 |
| Decision | BLOCKED |
| Wallet approval | Not requested |
| Sui submit | Not submitted |
| Transaction digest | None - blocked before execution |
| Funds moved | 0 |

## Problem

AI agents are starting to act on-chain.
Wallets show what will be signed.
Policies can limit budgets or protocols.
Neither proves whether the memory that caused the action was poisoned.

A small action can look harmless.
A sequence of small actions can become a micro-drain.

## Solution

MIASMA verifies the memory-action path before wallet approval.
If the path is poisoned, MIASMA blocks the sequence, generates evidence, and prevents wallet approval and Sui submit.

## Blocked vs clean

| Step | Poisoned micro-drain sequence | Clean test action |
|---|---|---|
| Agent creates draft | Yes | Yes |
| Memory-action path scan | Yes | Yes |
| Contamination score | 87 | Low |
| Threshold | 70 | 70 |
| Decision | BLOCKED | ALLOW |
| Wallet approval | Not requested | Requested |
| User signature | Not requested | User approves |
| Sui submit | Not submitted | Submitted |
| Transaction digest | None | Captured |
| Evidence capsule | Generated | Generated |
| Funds moved | 0 | Only after clean approval |

## Product flow

```mermaid
flowchart LR
  A[Agent draft] --> B[Memory-action path]
  B --> C[Local Rust verifier]
  C --> D[MIASMA decision]
  D -->|Blocked| E[Wallet approval skipped]
  D -->|Allowed| F[Wallet approval]
  F --> G[Sui submit]
  G --> H[Digest captured]
  E --> I[Funds moved: 0]
```

## What works today

| Surface | Status |
|---|---|
| Local Rust verifier | Working |
| Poisoned / clean fixtures | Working |
| Quarantine decision semantics | Working |
| Evidence capsule generation | Working |
| Sui QuarantineReceipt module | Move build passing |
| Groth16 prove + verify | Live locally |
| Skill firewall | Wired |
| Wallet approval gating | Wired |

## Production truth

| Surface | Status |
|---|---|
| Blocked poisoned action digest | None, because it is never submitted |
| Walrus upload | Only real when configured |
| Seal encryption | Only real when configured |
| Sui anchor | Only real when configured |
| Nitro / TEE attestation | Only real in an actual Nitro runtime |
| Mainnet claims | Not claimed |

## Commands

```bash
npm run check:core
npm run evidence:capsule
npm run zk:verify
npm run build
```

Other existing scripts:

- `npm run evidence:seal` - real Seal gate, requires config
- `npm run evidence:walrus` - real Walrus gate, requires config
- `npm run evidence:anchor` - real Sui capsule anchor gate, requires config
- `npm run tee:verify` - real Nitro/TEE verifier, fails closed without a real attestation document
- `npm run move:build` - Move build for the receipt module

## Commercial path

| Segment | What it supports |
|---|---|
| Agent apps | Protected action scan API / SDK |
| Protocols | Pre-execution integration before Move calls and DeFi actions |
| Teams | Workspace console, incident archive, audit trail |
| Evidence users | Capsule verification and encrypted artifact access |
| Ecosystem | Safer autonomous Sui activity |

## Built through Sui

MIASMA is the result of a year of learning with Sui.

After Sui Overflow 2025, I spent the year learning, building, and participating across the Sui Japan ecosystem.

Through the Build on Sui: Move Workshop Series, community events, builder sessions, and Sui x ONE Samurai Tokyo Builders' Arena, I learned not only the technology, but also the people, culture, and direction of Sui.

I also kept building across AI and Web3 hackathons, receiving three awards along the way.

MIASMA is my answer to what Sui will need next:
a pre-execution memory-action boundary for the agentic Sui era.

Thank you to the Sui community.
I will keep building.

## Final line

Agents can act.
MIASMA can block.
Funds moved: 0.

