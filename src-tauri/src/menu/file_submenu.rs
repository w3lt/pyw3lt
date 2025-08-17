use tauri::{menu::{MenuItemBuilder, Submenu, SubmenuBuilder}, App, Emitter, Result, Runtime};

use crate::utils::event::open_project_picker;

const OPEN_PROJECT_ID: &str = "open_project";
const NEW_PROJECT_ID: &str = "new_project";
const SAVE_FILE_ID: &str = "save_file";

pub fn build_file_submenu<R: Runtime>(app: &mut App<R>) -> Result<Submenu<R>> {
    let open_project = MenuItemBuilder::new("Open Project")
        .id(OPEN_PROJECT_ID)
        .accelerator("CmdOrCtrl+O")
        .build(app)?;

    let new_project = MenuItemBuilder::new("New Project")
        .id(NEW_PROJECT_ID)
        .accelerator("CmdOrCtrl+N")
        .build(app)?;

    let save_file = MenuItemBuilder::new("Save")
        .id(SAVE_FILE_ID)
        .accelerator("CmdOrCtrl+S")
        .build(app)?;

    SubmenuBuilder::new(app, "File")
        .items(&[
            &new_project,
            &open_project
        ])
        .separator()
        .item(&save_file)
        .build()
}

pub fn handle_open_project_event<R: Runtime>(app: &mut App<R>) {
    app.on_menu_event(|app_handle, event| {
        if event.id() == OPEN_PROJECT_ID {
            let app_handle = app_handle.clone();
            open_project_picker(app_handle);
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

pub fn handle_save_file_event<R: Runtime>(app: &mut App<R>) {
    app.on_menu_event(|app_handle, event| {
        if event.id() == SAVE_FILE_ID {
            // Emit save file event to frontend
            app_handle.emit("save-file", ()).unwrap();
        }
    });
}
