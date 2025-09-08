use std::io::Write;
use tauri::{command, State};
use crate::utils::lsp::LspState;

#[command]
pub async fn send_lsp_message(state: State<'_, LspState>, msg: String) -> Result<(), String> {
    let mut stdin = state.stdin.lock().map_err(|_| "Failed to lock stdin")?;

    // LSP requires Content-Length header + 2x CRLF
    let content = format!(
        "Content-Length: {}\r\n\r\n{}",
        msg.len(),
        msg
    );

    stdin
        .write_all(content.as_bytes())
        .map_err(|e| format!("Failed to write to LSP stdin: {e}"))?;

    stdin.flush().map_err(|e| format!("Failed to flush stdin: {e}"))?;

    Ok(())
}