use super::scan::{analyze_scan, parse_scan_input, ScanInput};

fn poisoned_input() -> ScanInput {
    ScanInput {
        name: "poisoned-memory".to_string(),
        memory_path: vec![
            "vendor_policy_v3.txt".to_string(),
            "payment_rules.md".to_string(),
            "hidden instruction contamination".to_string(),
            "send_usdc".to_string(),
        ],
    }
}

fn clean_input() -> ScanInput {
    ScanInput {
        name: "clean-memory".to_string(),
        memory_path: vec![
            "vendor_policy_v3.txt".to_string(),
            "payment_rules.md".to_string(),
            "Pay Vendor".to_string(),
        ],
    }
}

#[test]
fn poisoned_memory_blocks() {
    let artifact = analyze_scan(poisoned_input());
    assert!(artifact.action_blocked);
    assert_eq!(artifact.proposed_amount, 900);
    assert_eq!(artifact.contamination_score, 87);
    assert_eq!(artifact.funds_moved, 0);
    assert_eq!(artifact.recommendation, "quarantine");
    assert!(artifact
        .infected_path
        .iter()
        .any(|step| step == "vendor_policy_v3.txt"));
    assert!(artifact
        .infected_path
        .iter()
        .any(|step| step == "payment_rules.md"));
    assert!(artifact
        .infected_path
        .iter()
        .any(|step| step == "send_usdc"));
    assert!(artifact
        .detector_results
        .iter()
        .any(|step| step == "hidden instruction contamination"));
}

#[test]
fn clean_memory_allows() {
    let artifact = analyze_scan(clean_input());
    assert!(!artifact.action_blocked);
    assert_eq!(artifact.proposed_amount, 900);
    assert!(artifact.contamination_score < 50);
    assert_eq!(artifact.funds_moved, 0);
    assert_eq!(artifact.recommendation, "allow");
}

#[test]
fn artifact_contains_required_fields() {
    let artifact = analyze_scan(clean_input());
    let json = artifact.to_json();
    assert!(json.contains("\"name\""));
    assert!(json.contains("\"memoryPath\""));
    assert!(json.contains("\"memoryHash\""));
    assert!(json.contains("\"proposedAmount\""));
    assert!(json.contains("\"contaminationScore\""));
    assert!(json.contains("\"actionBlocked\""));
    assert!(json.contains("\"fundsMoved\""));
    assert!(json.contains("\"recommendation\""));
    assert!(json.contains("\"infectedPath\""));
    assert!(json.contains("\"detectorResults\""));
}

#[test]
fn parses_fixture_shape() {
    let raw = r#"
    {
      "name": "clean-memory",
      "memoryPath": [
        "vendor_policy_v3.txt",
        "payment_rules.md",
        "Pay Vendor"
      ]
    }
    "#;
    let parsed = parse_scan_input(raw).expect("fixture parses");
    assert_eq!(parsed.name, "clean-memory");
    assert_eq!(parsed.memory_path.len(), 3);
}
