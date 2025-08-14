mod commands;
mod models;
mod menu;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn log(message: &str) {
    println!("{}", message);
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            menu::menu::create_menu(app)?;
            Ok(())
        })
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            log,
            commands::fs::list_dir,
            commands::fs::read_file,
            commands::fs::get_home_dir,
            commands::project::create_project,
            commands::python::list_versions,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
