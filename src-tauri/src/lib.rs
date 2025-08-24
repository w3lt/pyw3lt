mod commands;
mod models;
mod menu;
mod utils;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn log(message: &str) {
    println!("{}", message);
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::async_runtime::spawn(async {
        utils::lsp::spawn_lsp_process().await;
    });

    tauri::Builder::default()
        .setup(|app| {
            menu::menu::create_menu(app)?;
            Ok(())
        })
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .invoke_handler(tauri::generate_handler![
            log,
            commands::fs::list_dir,
            commands::fs::get_home_dir,
            commands::project::create_project,
            commands::python::list_versions,
            commands::file::read_file,
            commands::file::save_file,
            commands::event::open_project,
            commands::pypi::search_packages,
            commands::pypi::sync_package_list,
            commands::pypi::get_last_sync_time,
            commands::python_package::list_installed_packages,
            commands::python_package::install_python_package,
            commands::python_package::uninstall_python_package,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
