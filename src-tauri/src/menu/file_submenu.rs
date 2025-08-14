use tauri::{menu::{MenuItemBuilder, Submenu, SubmenuBuilder}, App, Emitter, Result, Runtime};

use tauri_plugin_dialog::DialogExt;

const OPEN_PROJECT_ID: &str = "open_project";
const NEW_PROJECT_ID: &str = "new_project";

pub fn build_file_submenu<R: Runtime>(app: &mut App<R>) -> Result<Submenu<R>> {
    let open_project = MenuItemBuilder::new("Open Project")
        .id(OPEN_PROJECT_ID)
        .accelerator("CmdOrCtrl+O")
        .build(app)?;

    let new_project = MenuItemBuilder::new("New Project")
        .id(NEW_PROJECT_ID)
        .accelerator("CmdOrCtrl+N")
        .build(app)?;

    SubmenuBuilder::new(app, "File")
        .items(&[
            &new_project,
            &open_project
        ])
        .build()
}

pub fn handle_open_project_event<R: Runtime>(app: &mut App<R>) {
    app.on_menu_event(|app_handle, event| {
        if event.id() == OPEN_PROJECT_ID {
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

pub fn handle_new_project_event<R: Runtime>(app: &mut App<R>) {
    app.on_menu_event(|app_handle, event| {
        if event.id() == NEW_PROJECT_ID {
            app_handle.emit("new-project", ()).unwrap();
        }
    })
}
