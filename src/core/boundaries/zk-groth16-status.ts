const zkGroth16Status = {
  "state": "verified",
  "detail": "ZK verification passed. Proof hash: 8fa1594c65d102c142f16df968ab18f910007c03324788092bea98497f82291a.",
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
