use std::process;

fn main() {
    let mut args = std::env::args().skip(1);
    let mut input = None;

    while let Some(arg) = args.next() {
        if arg == "--input" {
            input = args.next();
        }
    }

    let Some(input) = input else {
        eprintln!("usage: cargo run -- --input fixtures/<memory>.json");
        process::exit(1);
    };

    match miasma_atlas_verifier::run_verifier(&input) {
        Ok(artifact) => {
            println!("{}", artifact.to_json());
        }
        Err(error) => {
            eprintln!("{error}");
            process::exit(1);
        }
    }
}
