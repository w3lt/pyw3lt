import { invoke } from "@tauri-apps/api/core";

export default async function createProject(payload: {
  name: string
  location: string
  pythonVersion: string
}) {
  const { name, location, pythonVersion } = payload;
  await invoke("create_project", { name, location, pythonVersion });
}