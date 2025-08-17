use serde::Serialize;
use tauri::command;

use crate::utils;
use crate::utils::python_package::query_package_info;

#[derive(Serialize)]
pub struct PackageInfo {
    pub(crate) name: String,
    pub(crate) author: String,
    pub(crate) version: String,
    pub(crate) description: Option<String>,
    /// The version of the package that is installed, if any.
    pub(crate) installed_version: Option<String>,
}

#[command]
pub async fn search_packages(query: String, result_number: Option<usize>, project_path: String) -> Result<Vec<PackageInfo>, String> {
    let result_number = result_number.unwrap_or(10);

    tauri::async_runtime::spawn_blocking(move || {
        let results = utils::pypi::search_packages(&query, result_number);

        results
            .into_iter()
            .map(|(name, _score)| {
                query_package_info(name.to_string(), project_path.clone())
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