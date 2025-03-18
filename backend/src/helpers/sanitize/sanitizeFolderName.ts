export function sanitizeFolderName(name: string) {
  return name.replace(/[^a-zA-Z0-9-_]/g, "");
}
