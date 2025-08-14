use tauri::{menu::{MenuItemBuilder, Submenu, SubmenuBuilder}, App, Emitter, Result, Runtime};

use tauri_plugin_dialog::DialogExt;

pub fn build_file_submenu<R: Runtime>(app: &mut App<R>) -> Result<Submenu<R>> {
    let open_project = MenuItemBuilder::new("Open Project")
        .id("open_project")
        .accelerator("CmdOrCtrl+O")
        .build(app)?;

    SubmenuBuilder::new(app, "File").item(&open_project).build()
}

pub fn handle_open_project_event<R: Runtime>(app: &mut App<R>) {
    app.on_menu_event(|app_handle, event| {
        if event.id() == "open_project" {
            #[cfg(any(target_os = "macos", target_os = "windows", target_os = "linux"))]
            {
                let app_handle = app_handle.clone();
                app_handle.dialog().file().pick_folder(move |result| {
                    if let Some(path) = result {
                        // Send to frontend
                        let path_str = path.to_string();
                        app_handle.emit("project-selected", path_str).unwrap();
                    }
                });
            }
        }
    });
}
