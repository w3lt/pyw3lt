use tauri::{menu::{AboutMetadata, MenuBuilder, SubmenuBuilder}, App, Runtime};
use crate::menu::file_submenu;

pub fn create_menu<R: Runtime>(app: &mut App<R>) -> tauri::Result<()> {
    let app_submenu = SubmenuBuilder::new(app, "Pymon")
        .about(Some(AboutMetadata {
            ..Default::default()
        }))
        .separator()
        .services()
        .separator()
        .hide()
        .hide_others()
        .quit()
        .build()?;

    let file_submenu = file_submenu::build_file_submenu(app)?;

    let menu = MenuBuilder::new(app)
        .items(&[&app_submenu, &file_submenu])
        .build()?;
    app.set_menu(menu)?;

    // Handle menu events
    file_submenu::handle_open_project_event(app);
    file_submenu::handle_new_project_event(app);
    file_submenu::handle_save_file_event(app);

    Ok(())
}