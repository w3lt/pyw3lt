use crate::models::file_node::FileNode;
use std::{fs};
use std::path::PathBuf;
use tauri::command;

#[command]
pub fn list_dir(path: String) -> Vec<FileNode> {
    list_dir_recursive(PathBuf::from(path))
}

pub fn list_dir_recursive(path: PathBuf) -> Vec<FileNode> {
    let mut result = Vec::new();

    if let Ok(entries) = fs::read_dir(PathBuf::from(&path)) {
        for entry in entries.flatten() {
            let path = entry.path();
            let name = entry.file_name().to_string_lossy().to_string();
            let is_dir = path.is_dir();

            let children = if is_dir {
                Some(list_dir_recursive(path.clone()))
            } else {
                None
            };

            result.push(FileNode {
                name,
                path: path.to_string_lossy().to_string(),
                is_dir,
                children
            });
        }
    }

    result
}

#[command]
pub fn get_home_dir() -> Result<String, String> {
    match dirs::home_dir() {
        Some(path) => Ok(path.to_string_lossy().to_string()),
        None => Err("Failed to get home directory".to_string()),
    }
}
