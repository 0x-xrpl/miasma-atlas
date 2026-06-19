template QuarantineThreshold() {
    signal input blocked;
    signal output allowed;
    allowed <== 1 - blocked;
}

component main = QuarantineThreshold();
