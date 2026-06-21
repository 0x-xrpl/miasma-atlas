module miasma_receipt::miasma_receipt {
    public struct MiasmaReceipt has key, store {
        id: sui::object::UID,
        receipt_id: vector<u8>,
        sample_hash: vector<u8>,
        sample_digest: vector<u8>,
        projected_exposure: vector<u8>,
        detector_result: vector<u8>,
        risk_score: u64,
        blocked: bool,
        funds_moved: u64,
        network: vector<u8>,
        created_at_epoch: u64,
        created_at_ms_hint: u64,
    }

    public struct MiasmaReceiptRecorded has copy, drop {
        receipt_id: vector<u8>,
        sample_hash: vector<u8>,
        sample_digest: vector<u8>,
        projected_exposure: vector<u8>,
        detector_result: vector<u8>,
        risk_score: u64,
        blocked: bool,
        funds_moved: u64,
        network: vector<u8>,
        created_at_epoch: u64,
        created_at_ms_hint: u64,
    }

    public fun record_receipt(
        receipt_id: vector<u8>,
        sample_hash: vector<u8>,
        sample_digest: vector<u8>,
        projected_exposure: vector<u8>,
        detector_result: vector<u8>,
        risk_score: u64,
        blocked: bool,
        network: vector<u8>,
        created_at_ms_hint: u64,
        ctx: &mut sui::tx_context::TxContext,
    ) {
        let receipt = MiasmaReceipt {
            id: sui::object::new(ctx),
            receipt_id,
            sample_hash,
            sample_digest,
            projected_exposure,
            detector_result,
            risk_score,
            blocked,
            funds_moved: 0,
            network,
            created_at_epoch: sui::tx_context::epoch(ctx),
            created_at_ms_hint,
        };

        sui::event::emit(MiasmaReceiptRecorded {
            receipt_id: receipt.receipt_id,
            sample_hash: receipt.sample_hash,
            sample_digest: receipt.sample_digest,
            projected_exposure: receipt.projected_exposure,
            detector_result: receipt.detector_result,
            risk_score: receipt.risk_score,
            blocked: receipt.blocked,
            funds_moved: receipt.funds_moved,
            network: receipt.network,
            created_at_epoch: receipt.created_at_epoch,
            created_at_ms_hint: receipt.created_at_ms_hint,
        });

        sui::transfer::public_share_object(receipt);
    }
}
