# Core Reuse Guide

UI stays product-specific. The core stays reusable.

## Use the core for

- intent parsing
- previews
- policy evaluation
- session creation
- receipt previews
- boundary status

## Keep outside the core

- product branding
- button labels
- flow copy
- UI layout

## Reuse rule

Hey Sui and future Miasma-style flows should call the same parser, policy engine, preview builders, boundary objects, and receipt builders.
Do not duplicate those paths in product-specific code.

## Extending the core

Add new product behavior as configuration or small adapters first.
Only add a new branch when a real behavior differs.

## Safe default

If an intent is unclear or a required slot is missing, the core must fail safe and keep `fundsMoved` at `0`.
Missing confirmation stays preview / confirmation-required, not blocked.
