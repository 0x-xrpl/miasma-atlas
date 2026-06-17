module miasma_atlas::skill_manifest {
    public struct SkillManifest has store {
        enabled: bool,
    }

    public fun is_enabled(manifest: &SkillManifest): bool {
        manifest.enabled
    }
}

