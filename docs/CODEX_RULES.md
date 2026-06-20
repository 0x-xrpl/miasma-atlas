# MIASMA Coding Rules

MIASMA is the only project focus.

MIASMA is an Agentic Web memory-action quarantine protocol.

Before an AI agent uses a skill or moves money, MIASMA maps the memory path that caused the action, verifies the path, locks sensitive evidence, and blocks poisoned execution before funds move.

Always optimize for:

- smallest safe diffs
- lowest token usage
- maximum product quality
- maximum technical credibility
- working local evaluation first
- clear Sui-native architecture
- no broken build
- no unused over-engineering in the main app
- no accidental external reference copying
- no legacy remnants

Never copy external reference code.
Never copy external reference UI.
Never copy external reference logos.
Never import anything from `reference/` or any previous seed project archive.
Never use reference material at runtime.
Never make the final app look like Shell, Audric, NVRAM, Remora, or any other project.
Use benchmark concepts only as strategic inspiration reflected in the MIASMA architecture.

Do not make AWS, Nitro, Seal, Walrus, Groth16, Enoki, or MCP mandatory for the first local UI boot.
Implement them cleanly first.
Implement them step by step after the MIASMA UI, Rust verifier, and Sui QuarantineReceipt path are stable.

Main first-screen evaluation:

- Agent wants to pay 900 USDC
- Memory path: vendor_policy_v3.txt -> payment_rules.md -> Pay Vendor
- Hidden instruction contamination detected
- Action: BLOCKED
- Funds moved: 0
- Verified path: Memory hash -> Rust verifier -> Nitro enclave verifier -> Seal locked evidence -> Walrus artifact ref -> Groth16 quarantine proof -> Sui QuarantineReceipt

MIASMA is not:

- generic wallet UI
- generic payment assistant
- Audric clone
- generic AI wallet
- generic risk dashboard
- generic intent engine
- generic Walrus storage app
- DeFi strategy race
- payroll lending app
- model validator network
- place memory app

MIASMA is:

- AI memory-action quarantine protocol
- agent skill execution firewall
- memory contamination map
- pre-execution safety layer for agentic finance
