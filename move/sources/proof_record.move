module miasma_atlas::proof_record {
    public struct ProofRecord has store {
        verified: bool,
    }

    public fun is_verified(record: &ProofRecord): bool {
        record.verified
    }
}

