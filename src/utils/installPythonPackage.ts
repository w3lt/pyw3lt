import { invoke } from "@tauri-apps/api/core";

const installPythonPackage = async (
  packageName: string,
  projectPath: string,
  version?: string,
) => {
  await invoke("install_python_package", {
    packageName,
    projectPath,
    version
  })
}

export default installPythonPackage;