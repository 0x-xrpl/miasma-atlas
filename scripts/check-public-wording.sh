#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
files=(
  "$repo_root/README.md"
  "$repo_root/docs/ARCHITECTURE.md"
  "$repo_root/docs/CODEX_RULES.md"
  "$repo_root/docs/EVIDENCE_PATH.md"
  "$repo_root/docs/FINAL_REQUIREMENTS.md"
  "$repo_root/docs/MIASMA_PRODUCTION_TRUTH.md"
  "$repo_root/docs/PUBLIC_WORDING_POLICY.md"
  "$repo_root/docs/SKILL_FIREWALL.md"
  "$repo_root/docs/THREAT_MODEL.md"
  "$repo_root/docs/ZK_QUARANTINE_PROOF.md"
  "$repo_root/move/README.md"
)

legacy_terms='Pizza|PIZZA|pizza|Roulette|roulette|Spin|spin|Badge|badge|Fragment|fragment|NFT|nft|Bitcoin|bitcoin|wheel|Miasma Atlas|MIASMA_ATLAS'
positioning_terms='hackathon-ready|judge-ready|winning|Sui Overflow|competitor|before HTML prototype|before TSX port|hackathon|prototype|demo|Ready'
overclaim_terms='production-live|mainnet-ready|fully deployed|real Seal encryption live|real Walrus upload live|live Nitro execution|full ZKML verification|Nitro|NITRO|AWS|TEE|enclave|builder proof|acknowledgement|verification layer|generic wallet assistant|generic AI chat wallet|intent engine'

check_group() {
  local label="$1"
  local pattern="$2"
  local matched

  if matched="$(grep -nE "$pattern" "${files[@]}" 2>/dev/null || true)"; then
    :
  fi

  if [[ -n "$matched" ]]; then
    printf '[FAIL] %s terms found:\n%s\n' "$label" "$matched"
    return 1
  fi

  printf '[PASS] %s terms not found.\n' "$label"
}

echo '[INFO] Checking public wording across README.md and docs/*.md'

check_group 'Legacy' "$legacy_terms"
check_group 'Positioning' "$positioning_terms"
check_group 'Overclaim' "$overclaim_terms"

echo '[PASS] Public wording check passed.'
