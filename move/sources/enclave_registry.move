module miasma_atlas::enclave_registry {
    public struct EnclaveRegistry has store {
        active: bool,
    }

    public fun is_active(registry: &EnclaveRegistry): bool {
        registry.active
    }
}

