import { invoke } from "@tauri-apps/api/core"

const uninstallPythonPackage = async (
  packageName: string,
  projectPath: string,
) => {
  await invoke("uninstall_python_package", { packageName, projectPath })
}

export default uninstallPythonPackage