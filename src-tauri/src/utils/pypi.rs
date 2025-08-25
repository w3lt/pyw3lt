use std::{fs, io::{self, Write}, path::PathBuf};
use fuzzy_matcher::FuzzyMatcher;
use fuzzy_matcher::skim::SkimMatcherV2;
use reqwest::blocking::get;

/// Returns the path to the local package list file (~/.pyw3lt/package-list)
fn package_list_path() -> PathBuf {
    dirs::home_dir()
        .expect("No home directory found")
        .join(".pyw3lt")
        .join("package-list")
}

fn sync_time_path() -> PathBuf {
    dirs::home_dir()
        .expect("No home directory found")
        .join(".pyw3lt")
        .join("sync-time")
}

/// Downloads the package list from PyPI and stores it locally
pub fn sync_package_list() -> io::Result<()> {
    let url = "https://pypi.org/simple/"; // This returns HTML with all package names
    println!("Downloading package list from {url} ...");

    let html = get(url)
        .expect("Failed to fetch package list")
        .text()
        .expect("Failed to read response text");

    // Extract package names from HTML
    let mut names = Vec::new();
    let mut search_start = 0;

    while let Some(tag_start) = html[search_start..].find("<a href=") {
        let tag_start = search_start + tag_start;
        // find '>' after <a href=...>
        if let Some(gt) = html[tag_start..].find('>') {
            let gt = tag_start + gt;
            if let Some(lt) = html[gt..].find('<') {
                let lt = gt + lt;
                let name = html[gt + 1..lt].trim();
                if !name.is_empty() {
                    names.push(name.to_string());
                }
                search_start = lt;
            } else {
                break;
            }
        } else {
            break;
        }
    }

    // ensure directory exists
    let path = package_list_path();
    if let Some(parent) = path.parent() {
        std::fs::create_dir_all(parent)?;
    }

    let mut file = std::fs::File::create(&path)?;
    for name in &names {
        writeln!(file, "{name}")?;
    }

    println!("Saved {} package names to {:?}", names.len(), path);

    // Save the timestamp of the last sync
    let sync_time_path = sync_time_path();
    if let Some(parent) = sync_time_path.parent() {
        std::fs::create_dir_all(parent)?;
    }
    let mut sync_file = std::fs::File::create(&sync_time_path)?;

    let sync_time = std::time::SystemTime::now();
    writeln!(sync_file, "{}", sync_time.duration_since(std::time::UNIX_EPOCH).unwrap().as_millis())?;

    Ok(())
}

pub fn search_packages(query: &str, result_number: usize) -> Vec<(String, i64)> {
    let path = package_list_path();
    let contents = fs::read_to_string(&path)
        .unwrap_or_else(|_| panic!("Could not read {:?}", path));

    let matcher = SkimMatcherV2::default();
    let mut results: Vec<(String, i64)> = contents
        .lines()
        .filter_map(|name| {
            matcher.fuzzy_match(name, query)
                .map(|score| (name.to_string(), score))
        })
        .collect();

    // sort by score descending
    results.sort_by(|a, b| b.1.cmp(&a.1));

    // return only the top N results
    results.into_iter().take(result_number).collect()
}

pub fn get_last_sync_time() -> Result<usize, String> {
    let sync_time_path = sync_time_path();
    match fs::read_to_string(sync_time_path) {
        Ok(content) => {
            content.trim().parse::<usize>().map_err(|e| e.to_string())
        }
        Err(e) => Err(format!("Failed to read sync time: {}", e)),
    }
}
