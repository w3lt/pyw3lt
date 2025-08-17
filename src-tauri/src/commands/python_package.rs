use std::process::Command;
use serde::Deserialize;
use tauri::{command};
use crate::commands::pypi::PackageInfo;
use crate::utils::pypi::query_package_info;

#[derive(Deserialize)]
struct PipPackage {
    name: String,
    version: String,
}

#[command]
pub async fn list_installed_packages(project_path: String) -> Result<Vec<PackageInfo>, String> {
    tauri::async_runtime::spawn_blocking(move || {
        let output = Command::new("uv")
            .args([
                "pip",
                "list",
                "--format", "json",
                "--python", ".venv/bin/python",
            ])
            .current_dir(project_path)
            .output()
            .map_err(|e| format!("Failed to run uv: {}", e))?;

        if !output.status.success() {
            return Err(format!(
                "uv pip list failed: {}",
                String::from_utf8_lossy(&output.stderr)
            ));
        }

        // Parse JSON
        let packages: Vec<PipPackage> = serde_json::from_slice(&output.stdout)
            .map_err(|e| format!("Failed to parse JSON: {}", e))?;

        let results: Vec<PackageInfo> = packages
            .into_iter()
            .map(|p| query_package_info(p.name))
            .collect();

        Ok(results)
    })
        .await
        .map_err(|e| format!("Failed to execute uv list: {}", e))?
}

/// Installs a Python package using uv.
#[command]
pub async fn install_python_package(
    package_name: String,
    version: Option<String>,
    project_path: String,
) -> Result<(), String> {
    let version_str = version.map_or(String::new(), |v| format!("=={}", v));
    let full_package_name = format!("{}{}", package_name, version_str);

    tauri::async_runtime::spawn_blocking(move || {
        let status = Command::new("uv")
            .args(&["add", &full_package_name])
            .current_dir(project_path)
            .status()
            .map_err(|e| format!("Failed to start uv: {}", e))?;

        if status.success() {
            Ok(())
        } else {
            Err(format!("uv exited with status: {}", status))
        }
    })
    .await
    .map_err(|e| e.to_string())?
}