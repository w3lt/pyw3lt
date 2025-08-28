use std::{
    io::{BufRead, BufReader, Error},
    process::{Command, Stdio},
};

pub fn spawn_lsp_process(app_handle: tauri::AppHandle) -> Result<(), Error> {
    println!("pylsp starting on ws://127.0.0.1:30000");
    let mut child = Command::new("pylsp")
        .stdin(Stdio::piped()) // no stdin needed for ws
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()?;

    let stdout = child.stdout.take().unwrap();
    let reader = BufReader::new(stdout);
    let mut lines = reader.lines();

    let app_handle_clone = app_handle.clone();
    tokio::spawn(async move {
        while let Some(Ok(line)) = lines.next() {
            println!("pylsp: {}", line);
            app_handle_clone.emit_all("lsp-log", line).unwrap();
        }
    });

    Ok(())
}
