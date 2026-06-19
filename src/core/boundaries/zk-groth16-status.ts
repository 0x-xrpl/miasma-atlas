const zkGroth16Status = {
  "state": "verified",
  "detail": "ZK verification passed. Proof hash: 4c9a46c70c6c667171e0533ffc9684edc0fe449bc0b002bd1f86cd870294b00b.",
  "available": true,
  "assets": {
    "circuit": "zk/circuits/quarantine_threshold.circom",
    "r1cs": "zk/generated/quarantine_threshold.r1cs",
    "wasm": "zk/generated/quarantine_threshold.wasm",
    "sym": "zk/generated/quarantine_threshold.sym",
    "zkey": "zk/generated/quarantine_threshold.final.zkey",
    "verificationKey": "zk/generated/quarantine_threshold.verification_key.json",
    "witness": "zk/generated/quarantine_threshold.wtns",
    "proof": "zk/generated/quarantine_threshold.proof.json",
    "publicSignals": "zk/generated/quarantine_threshold.public.json"
  }
} as const;

export default zkGroth16Status;
