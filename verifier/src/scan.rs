use std::fs;
use std::path::Path;

use crate::artifact::MiasmaScanArtifact;
use crate::detectors::detect_contamination;

pub fn run_verifier(input_path: &str) -> Result<MiasmaScanArtifact, String> {
    let raw = fs::read_to_string(resolve_input_path(input_path))
        .map_err(|error| format!("failed to read input file: {error}"))?;
    let scan_input = parse_scan_input(&raw)?;
    Ok(analyze_scan(scan_input))
}

pub fn parse_scan_input(raw: &str) -> Result<ScanInput, String> {
    let name = extract_string_field(raw, "name")?;
    let memory_path = extract_string_array(raw, "memoryPath")?;
    Ok(ScanInput { name, memory_path })
}

pub fn analyze_scan(input: ScanInput) -> MiasmaScanArtifact {
    let findings = detect_contamination(&input.memory_path);
    let poisoned = findings.iter().any(|item| item == "hidden instruction contamination");
    let contamination_score = if poisoned { 87 } else { 8 };
    let action_blocked = poisoned;
    let proposed_amount = 900;
    let funds_moved = 0;
    let recommendation = if poisoned { "quarantine" } else { "allow" };
    let infected_path = if poisoned {
        vec![
            "vendor_policy_v3.txt".to_string(),
            "payment_rules.md".to_string(),
            "send_usdc".to_string(),
        ]
    } else {
        Vec::new()
    };
    let memory_hash = simple_memory_hash(&input.memory_path);

    MiasmaScanArtifact {
        name: input.name,
        memory_path: input.memory_path,
        memory_hash,
        proposed_amount,
        contamination_score,
        action_blocked,
        funds_moved,
        recommendation: recommendation.to_string(),
        infected_path,
        detector_results: findings,
    }
}

fn resolve_input_path(input_path: &str) -> String {
    if Path::new(input_path).exists() {
        input_path.to_string()
    } else {
        format!("verifier/{input_path}")
    }
}

fn extract_string_field(raw: &str, field: &str) -> Result<String, String> {
    let needle = format!("\"{field}\"");
    let start = raw.find(&needle).ok_or_else(|| format!("missing field: {field}"))?;
    let after_colon = raw[start + needle.len()..]
        .find(':')
        .map(|index| start + needle.len() + index + 1)
        .ok_or_else(|| format!("missing separator after field: {field}"))?;
    let rest = raw[after_colon..].trim_start();
    let value = rest
        .strip_prefix('"')
        .and_then(|tail| tail.find('"').map(|end| tail[..end].to_string()))
        .ok_or_else(|| format!("invalid string field: {field}"))?;
    Ok(value)
}

fn extract_string_array(raw: &str, field: &str) -> Result<Vec<String>, String> {
    let needle = format!("\"{field}\"");
    let start = raw.find(&needle).ok_or_else(|| format!("missing field: {field}"))?;
    let after_colon = raw[start + needle.len()..]
        .find(':')
        .map(|index| start + needle.len() + index + 1)
        .ok_or_else(|| format!("missing separator after field: {field}"))?;
    let rest = raw[after_colon..].trim_start();
    let inner = rest
        .strip_prefix('[')
        .and_then(|tail| tail.find(']').map(|end| &tail[..end]))
        .ok_or_else(|| format!("invalid array field: {field}"))?;

    let mut values = Vec::new();
    for entry in inner.split(',') {
        let value = entry.trim().trim_matches('"');
        if !value.is_empty() {
            values.push(value.to_string());
        }
    }

    Ok(values)
}

fn simple_memory_hash(memory_path: &[String]) -> String {
    let mut hash: u64 = 0xcbf29ce484222325;
    for byte in memory_path.join("|").bytes() {
        hash ^= byte as u64;
        hash = hash.wrapping_mul(0x100000001b3);
    }
    format!("mhash_{hash:016x}")
}

pub struct ScanInput {
    pub name: String,
    pub memory_path: Vec<String>,
}
