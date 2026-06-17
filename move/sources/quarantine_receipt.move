module miasma_atlas::quarantine_receipt {
    public struct QuarantineReceipt has key, store {
        id: sui::object::UID,
        receipt_id: vector<u8>,
        memory_hash: vector<u8>,
        scan_artifact_hash: vector<u8>,
        artifact_ref: vector<u8>,
        proposed_amount: u64,
        funds_moved: u64,
        contamination_score: u64,
        decision: vector<u8>,
        recommendation: vector<u8>,
        verifier: vector<u8>,
        created_at_ms_or_epoch: u64,
    }

    public struct QuarantineReceiptCreated has copy, drop {
        receipt_id: vector<u8>,
        memory_hash: vector<u8>,
        scan_artifact_hash: vector<u8>,
        proposed_amount: u64,
        funds_moved: u64,
        contamination_score: u64,
        decision: vector<u8>,
    }

    public fun create_quarantine_receipt(
        receipt_id: vector<u8>,
        memory_hash: vector<u8>,
        scan_artifact_hash: vector<u8>,
        artifact_ref: vector<u8>,
        proposed_amount: u64,
        contamination_score: u64,
        created_at_ms_or_epoch: u64,
        ctx: &mut sui::tx_context::TxContext,
    ) {
        let receipt = QuarantineReceipt {
            id: sui::object::new(ctx),
            receipt_id,
            memory_hash,
            scan_artifact_hash,
            artifact_ref,
            proposed_amount,
            funds_moved: 0,
            contamination_score,
            decision: b"blocked",
            recommendation: b"quarantine",
            verifier: b"local_rust_verifier",
            created_at_ms_or_epoch,
        };

        sui::event::emit(QuarantineReceiptCreated {
            receipt_id: receipt.receipt_id,
            memory_hash: receipt.memory_hash,
            scan_artifact_hash: receipt.scan_artifact_hash,
            proposed_amount: receipt.proposed_amount,
            funds_moved: receipt.funds_moved,
            contamination_score: receipt.contamination_score,
            decision: receipt.decision,
        });

        sui::transfer::public_share_object(receipt);
    }
}
