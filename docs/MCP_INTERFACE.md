# MCP Interface Scaffold

This document describes the intended MCP surface for Miasma Atlas. It is an interface scaffold, not a production server.

## Intended tools

- `miasma.scan_memory_action`
- `miasma.map_memory_path`
- `miasma.quarantine_memory`
- `miasma.get_scan_artifact`
- `miasma.verify_quarantine_proof`
- `miasma.request_seal_unlock`
- `miasma.get_sui_receipt`
- `miasma.evaluate_skill_manifest`
- `miasma.record_skill_use`

## Scope

- The agent runtime builds a `MemoryActionContext`.
- The skill firewall checks the manifest and permission context before execution.
- The MCP surface would expose scan, map, quarantine, and receipt retrieval operations.

## Current status

- No production MCP server is implemented here.
- The local UI and domain models act as the scaffold.
- Local verifier mode remains the working default.

## Future work

Later work can map these tool names to real MCP handlers without changing the underlying quarantine semantics.
