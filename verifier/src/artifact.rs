pub struct MiasmaScanArtifact {
    pub name: String,
    pub memory_path: Vec<String>,
    pub memory_hash: String,
    pub proposed_amount: u64,
    pub contamination_score: u8,
    pub action_blocked: bool,
    pub funds_moved: u64,
    pub recommendation: String,
    pub infected_path: Vec<String>,
    pub detector_results: Vec<String>,
}

impl MiasmaScanArtifact {
    pub fn to_json(&self) -> String {
        format!(
            "{{\"name\":{},\"memoryPath\":{},\"memoryHash\":{},\"proposedAmount\":{},\"contaminationScore\":{},\"actionBlocked\":{},\"fundsMoved\":{},\"recommendation\":{},\"infectedPath\":{},\"detectorResults\":{}}}",
            json_string(&self.name),
            json_string_array(&self.memory_path),
            json_string(&self.memory_hash),
            self.proposed_amount,
            self.contamination_score,
            if self.action_blocked { "true" } else { "false" },
            self.funds_moved,
            json_string(&self.recommendation),
            json_string_array(&self.infected_path),
            json_string_array(&self.detector_results),
        )
    }
}

fn json_string(value: &str) -> String {
    format!("\"{}\"", value.replace('\\', "\\\\").replace('\"', "\\\""))
}

fn json_string_array(values: &[String]) -> String {
    let items = values.iter().map(|value| json_string(value)).collect::<Vec<_>>();
    format!("[{}]", items.join(","))
}
