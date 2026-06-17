module miasma_atlas::evidence_access_policy {
    public fun can_access(blocked: bool): bool {
        !blocked
    }
}

