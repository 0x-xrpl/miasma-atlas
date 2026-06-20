# Public Wording Policy

This policy defines how MIASMA should describe implementation status in public documentation.

## Core rule

Public documentation should sound strong and complete, but it must describe the exact implemented boundary.

Avoid weak or unfinished-sounding wording when a stronger accurate phrase exists.

## Preferred wording

Use strong but honest phrases such as:

- locally operational
- build passing
- wired
- implemented boundary
- verified surface
- local verification path implemented
- sample implementation
- interface defined
- artifact-reference path defined
- evidence-lock path defined
- proof surface implemented
- verifier boundary implemented
- runtime boundary wired
- documented runtime path
- implementation boundary
- evaluation path
- canonical scenario

## Replacement guide

| Avoid | Prefer |
| --- | --- |
| scaffolded | implemented boundary |
| prototype | sample implementation |
| placeholder | sample value |
| demo scenario | canonical evaluation scenario |
| demo flow | evaluation flow |
| future work | out of scope |
| working vs scaffolded | implemented boundaries and verified surfaces |
| planned integration | interface defined |
| not implemented | outside current implementation boundary |

For Seal, Walrus, Nitro, Groth16, and MCP, do not overclaim. Prefer:

- interface defined
- boundary implemented
- sample path implemented
- verification surface documented
- implementation boundary defined

## Approved public summary

“MIASMA is locally operational across its documented memory-action verification path. The canonical evaluation scenario is fixed, the verifier boundary is implemented, the skill firewall is wired, the Sui QuarantineReceipt module builds, and the evidence-lock, artifact-reference, proof, enclave, and tool-interface surfaces are defined as implementation boundaries.”

