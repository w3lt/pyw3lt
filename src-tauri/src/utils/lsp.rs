use std::process::{Child, Command, Stdio};

pub fn spawn_lsp_process() -> Child {
    println!("pylsp starting on ws://127.0.0.1:30000");
    Command::new("pylsp")
        .arg("--ws")
        .arg("--port")
        .arg("30000")
        .stdin(Stdio::null()) // no stdin needed for ws
        .stdout(Stdio::inherit())
        .stderr(Stdio::inherit())
        .spawn()
        .expect("Failed to start pylsp process")
}
