const zkGroth16Status = {
  "state": "verified",
  "detail": "ZK verification passed. Proof hash: 9edfe57319c76eb195841d832ce404018cc5438bb42bdead393730aade29f491.",
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
