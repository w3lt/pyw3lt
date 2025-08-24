use std::process::{Command, Stdio};

pub async fn spawn_lsp_process() {
    Command::new("pylsp")
        .arg("--ws")
        .arg("--port")
        .arg("30000")
        .stdin(Stdio::null()) // no stdin needed for ws
        .stdout(Stdio::inherit())
        .stderr(Stdio::inherit())
        .spawn()
        .expect("Failed to start pylsp process");

    println!("pylsp started on ws://127.0.0.1:30000");
}
