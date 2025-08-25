use crate::commands::pypi::PackageInfo;
use crate::utils::python_package::query_package_info;
use std::fs;
use std::path::Path;
use std::process::Command;
use tauri::command;
use toml::Value;

#[command]
pub async fn list_installed_packages(project_path: String) -> Result<Vec<PackageInfo>, String> {
    tauri::async_runtime::spawn_blocking(move || {
        let pyproject_path = Path::new(&project_path).join("pyproject.toml");

        let content = fs::read_to_string(&pyproject_path)
            .map_err(|e| format!("Failed to read pyproject.toml: {}", e))?;

        let parsed: Value = toml::from_str(&content)
            .map_err(|e| format!("Failed to parse pyproject.toml: {}", e))?;

        // Get dependencies (this depends on backend, here assuming PEP 621 layout)
        let mut results: Vec<PackageInfo> = Vec::new();

        if let Some(dependencies) = parsed
            .get("project")
            .and_then(|proj| proj.get("dependencies"))
            .and_then(|d| d.as_array())
        {
            for dep in dependencies {
                if let Some(dep_str) = dep.as_str() {
                    let parts: Vec<&str> = dep_str.split("==").collect();
                    let name = parts[0].trim().to_string();
                    let version = if parts.len() > 1 {
                        Some(parts[1].trim().to_string())
                    } else {
                        None
                    };
                    let mut package_info = query_package_info(name, project_path.clone());
                    package_info.installed_version = if version.is_some() {
                        version
                    } else {
                        Option::from(package_info.version.clone())
                    };
                    results.push(package_info);
                }
            }
        }

        results.sort_by(|p1, p2| p1.name.cmp(&p2.name));

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
            .args(["add", &full_package_name])
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

#[command]
pub async fn uninstall_python_package(
    package_name: String,
    project_path: String,
) -> Result<(), String> {
    tauri::async_runtime::spawn_blocking(move || {
        let status = Command::new("uv")
            .args(["remove", &package_name])
            .args(["--python", ".venv/bin/python"])
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

