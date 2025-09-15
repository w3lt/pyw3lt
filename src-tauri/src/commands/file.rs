use tauri::command;
use std::fs;
use std::fs::File;
use std::path::PathBuf;

#[command]
pub async fn save_file(path: String, content: String) -> Result<(), String> {
    tauri::async_runtime::spawn_blocking(move || {
        println!("{} {}", path, content);
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

#[command]
/// Creates a new empty file at the specified path with the given file name.
pub fn create_file(parent_path: String, file_name: String) -> Result<(), String> {
    let mut path = PathBuf::from(parent_path);
    path.push(file_name);

    File::create(&path)
        .map(|_| ())
        .map_err(|e| e.to_string())
}

#[command]
pub fn create_dir(parent_path: String, dir_name: String) -> Result<(), String> {
    let mut path = PathBuf::from(parent_path);
    path.push(dir_name);

    fs::create_dir(&path)
        .map(|_| ())
        .map_err(|e| e.to_string())
}

#[command]
pub fn delete_path(path: String) -> Result<(), String> {
    let path_buf = PathBuf::from(path);

    if path_buf.is_dir() {
        fs::remove_dir_all(&path_buf).map_err(|e| e.to_string())
    } else if path_buf.is_file() {
        fs::remove_file(&path_buf).map_err(|e| e.to_string())
    } else if path_buf.exists() {
        Err("Unsupported file type".to_string())
    } else {
        Err("Path does not exist".to_string())
    }
}