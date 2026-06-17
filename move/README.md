# Miasma Move Package

This package defines the minimal on-chain `QuarantineReceipt` object for pre-execution quarantine decisions.

`QuarantineReceipt` records the verifier result before execution, so `funds_moved` stays `0` and does not imply that any payment already happened.

It is intentionally small:

- the receipt object is shared as a Sui object
- the module emits a `QuarantineReceiptCreated` event
- the receipt fields line up with the local `MiasmaScanArtifact` and frontend scaffold

Later, this object can be linked to Seal, Walrus, Groth16, and Nitro without changing the core meaning of the receipt.
