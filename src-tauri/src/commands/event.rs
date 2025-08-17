use tauri::{command, AppHandle};
use crate::utils::event::open_project_picker;

#[command]
pub fn open_project(app_handle: AppHandle) {
    open_project_picker(app_handle);
}