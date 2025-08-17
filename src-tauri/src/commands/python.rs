use std::process::{Command, Stdio};
use tauri::command;

#[command]
pub async fn list_versions() -> Result<Vec<String>, String> {
    // Common python executables to check
    let python_names = ["python", "python3", "python3.12", "python3.11", "python3.10"];

    tauri::async_runtime::spawn_blocking(move || {
        let mut versions = Vec::new();
        for name in &python_names {
            let output = Command::new(name)
                .arg("--version")
                .stdout(Stdio::piped())
                .stderr(Stdio::piped())
                .output();

            match output {
                Ok(out) => {
                    let stdout = String::from_utf8_lossy(&out.stdout);
                    let stderr = String::from_utf8_lossy(&out.stderr);
                    let version_str = if !stdout.is_empty() { stdout } else { stderr };

                    if version_str.to_lowercase().contains("python") {
                        // Extract version number, e.g., "Python 3.12.0" -> "3.12"
                        if let Some(v) = version_str.split_whitespace().nth(1) {
                            let major_minor: String = v.split('.').take(2).collect::<Vec<_>>().join(".");
                            versions.push(major_minor);
                        }
                    }
                }
                Err(_) => continue, // executable not found
            }
        }

        // Remove duplicates and sort
        versions.sort();
        versions.dedup();

        Ok(versions)
    })
        .await
        .map_err(|e| e.to_string())?
}