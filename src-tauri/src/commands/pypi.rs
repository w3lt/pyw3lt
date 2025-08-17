use serde::Serialize;
use tauri::command;

use crate::utils;

#[derive(Serialize)]
pub struct PackageInfo {
    name: String,
    author: String,
    version: String,
    description: Option<String>,
}

#[command]
pub async fn search_packages(query: String, result_number: Option<usize>) -> Result<Vec<PackageInfo>, String> {
    let result_number = result_number.unwrap_or(10);

    tauri::async_runtime::spawn_blocking(move || {
        let results = utils::pypi::search_packages(&query, result_number);
        let client = reqwest::blocking::Client::new();

        results
            .into_iter()
            .map(|(name, _score)| {
                let url = format!("https://pypi.org/pypi/{}/json", name);
                match client.get(&url).send() {
                    Ok(resp) => {
                        if let Ok(json) = resp.json::<serde_json::Value>() {
                            let author = json["info"]["author"].as_str().unwrap_or("").to_string();
                            let version = json["info"]["version"].as_str().unwrap_or("").to_string();
                            let description = json["info"]["summary"].as_str().map(|s| s.to_string());

                            PackageInfo {
                                name,
                                author,
                                version,
                                description,
                            }
                        } else {
                            PackageInfo {
                                name: "".to_string(),
                                author: "".to_string(),
                                version: String::new(),
                                description: None,
                            }
                        }
                    }
                    Err(_) => PackageInfo {
                        name: "".to_string(),
                        author: "".to_string(),
                        version: String::new(),
                        description: None,
                    },
                }
            })
            .filter(|info| info.name != "")
            .collect::<Vec<PackageInfo>>()
    })
        .await
        .map_err(|e| e.to_string())
}

#[command]
pub async fn sync_package_list() -> Result<(), String> {
    tauri::async_runtime::spawn_blocking(move || {
        utils::pypi::sync_package_list().unwrap()
    })
        .await
        .map_err(|e| e.to_string())
}

#[command]
pub async fn get_last_sync_time() -> Result<usize, String> {
    tauri::async_runtime::spawn_blocking(move || {
        utils::pypi::get_last_sync_time().unwrap()
    })
        .await
        .map_err(|e| e.to_string())
}