pub fn detect_contamination(memory_path: &[String]) -> Vec<String> {
    let joined = memory_path.join(" ").to_lowercase();
    if joined.contains("hidden instruction") || joined.contains("contamination") {
        vec!["hidden instruction contamination".to_string()]
    } else {
        vec!["no hidden instruction contamination".to_string()]
    }
}

#[allow(dead_code)]
pub fn is_poisoned(memory_path: &[String]) -> bool {
    detect_contamination(memory_path)
        .iter()
        .any(|item| item == "hidden instruction contamination")
}
