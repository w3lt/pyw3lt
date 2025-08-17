use std::process::Command;
use crate::commands::pypi::PackageInfo;

pub fn query_package_info(name: String, project_path: String) -> PackageInfo {
    let client = reqwest::blocking::Client::new();
    let url = format!("https://pypi.org/pypi/{}/json", name);
    match client.get(&url).send() {
        Ok(resp) => {
            if let Ok(json) = resp.json::<serde_json::Value>() {
                let author = json["info"]["author"].as_str().unwrap_or("").to_string();
                let version = json["info"]["version"].as_str().unwrap_or("").to_string();
                let description = json["info"]["summary"].as_str().map(|s| s.to_string());
                let installed_version = get_installed_version(&name, &project_path);

                PackageInfo {
                    name,
                    author,
                    version,
                    description,
                    installed_version,
                }
            } else {
                PackageInfo {
                    name: "".to_string(),
                    author: "".to_string(),
                    version: String::new(),
                    description: None,
                    installed_version: None,
                }
            }
        }
        Err(_) => PackageInfo {
            name: "".to_string(),
            author: "".to_string(),
            version: String::new(),
            description: None,
            installed_version: None,
        },
    }
}

/// Returns the installed version of a Python package using uv, if available.
pub fn get_installed_version(name: &str, project_path: &str) -> Option<String> {
    let output = Command::new("uv")
        .args(["pip", "show", name])
        .args(["--python", ".venv/bin/python"])
        .current_dir(project_path)
        .output()
        .ok()?; // if the command fails, return None

    if !output.status.success() {
        return None;
    }

    let stdout = String::from_utf8_lossy(&output.stdout);

    // `uv pip show <pkg>` prints lines like:
    // Name: requests
    // Version: 2.32.3
    for line in stdout.lines() {
        if let Some(rest) = line.strip_prefix("Version:") {
            return Some(rest.trim().to_string());
        }
    }

    None
}