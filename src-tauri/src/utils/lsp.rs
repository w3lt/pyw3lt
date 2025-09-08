use std::{
    io::{BufRead, BufReader, Error, Read},
    process::{ChildStdin, Command, Stdio},
    sync::{Arc, Mutex},
};

use tauri::Emitter;

pub struct LspState {
    pub stdin: Arc<Mutex<ChildStdin>>,
}

pub fn spawn_lsp_process(app_handle: tauri::AppHandle) -> Result<Arc<Mutex<ChildStdin>>, Error> {
    println!("pylsp starting");
    let mut child = Command::new("pylsp")
        .stdin(Stdio::piped()) // no stdin needed for ws
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()?;

    let stdin = child.stdin.take().expect("Failed to open stdin");
    let stdout = child.stdout.take().unwrap();
    let mut reader = BufReader::new(stdout);

    let app_handle_clone = app_handle.clone();
    tauri::async_runtime::spawn(async move {
        loop {
            let mut content_length: Option<usize> = None;
            let mut header = String::new();

            loop {
                header.clear();
                if reader.read_line(&mut header).unwrap() == 0 {
                    break; // EOF
                }
                if header == "\r\n" {
                    break; // End of headers
                }
                if let Some(len_str) = header.strip_prefix("Content-Length: ") {
                    content_length = len_str.trim().parse::<usize>().ok();
                }
            }

            if let Some(len) = content_length {
                let mut body = vec![0; len];
                reader.read_exact(&mut body).unwrap();
                let msg = String::from_utf8_lossy(&body).to_string();
                // Emit the LSP message to the frontend
                app_handle_clone.emit("lsp-message", msg).unwrap();
            }
        }
    });

    Ok(Arc::new(Mutex::new(stdin)))
}

