use tauri::command;
use std::fs;

#[command]
pub async fn save_file(path: String, content: String) -> Result<(), String> {
    tauri::async_runtime::spawn_blocking(move || {
        fs::write(path, content)
            .map_err(|e| format!("Failed to save file: {}", e))?;

        Ok(())
    })
        .await
        .map_err(|e| e.to_string())?
}

#[command]
pub fn read_file(path: String) -> Result<String, String> {
    match fs::read_to_string(&path) {
        Ok(contents) => Ok(contents),
        Err(err) => Err(format!("Failed to read file {}: {}", path, err)),
    }
}