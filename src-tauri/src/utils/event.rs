use tauri::{AppHandle, Emitter, Runtime};
use tauri_plugin_dialog::DialogExt;

pub fn open_project_picker<R: Runtime>(app_handle: AppHandle<R>) {
    #[cfg(any(target_os = "macos", target_os = "windows", target_os = "linux"))]
    {
        app_handle.dialog().file().pick_folder(move |result| {
            if let Some(path) = result {
                // Send to frontend
                let path_str = path.to_string();
                app_handle.emit("project-selected", path_str).unwrap();
            }
        });
    }
}