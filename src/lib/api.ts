import { MediaFile } from "./types";

const API_BASE = window.location.origin;

export async function fetchFolders(): Promise<string[]> {
  const res = await fetch(`${API_BASE}/api/folders`);
  if (!res.ok) throw new Error("Napaka pri pridobivanju map");
  return res.json();
}

export async function fetchFiles(): Promise<MediaFile[]> {
  const res = await fetch(`${API_BASE}/api/files`);
  if (!res.ok) throw new Error("Napaka pri pridobivanju datotek");
  const data = await res.json();

  return data.map((f: any) => {
    const uploadedAt = f.uploadedAt ? new Date(f.uploadedAt * 1000) : new Date();
    const duration = f.duration || 30;
    const expiresAt = new Date(uploadedAt.getTime() + duration * 24 * 60 * 60 * 1000);
    return {
      id: f.path,
      name: f.name,
      folder: f.folder,
      path: f.path,
      type: f.type as "image" | "video",
      size: f.size,
      uploadedAt,
      expiresAt,
      duration,
    };
  });
}

export async function uploadFile(file: File, folder: string, duration: number): Promise<void> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("target_folder", folder);
  formData.append("duration", String(duration));

  const res = await fetch(`${API_BASE}/api/upload`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Upload ni uspel" }));
    throw new Error(err.error || "Upload ni uspel");
  }
}

export async function deleteFile(path: string): Promise<void> {
  const res = await fetch(`${API_BASE}/api/delete`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Brisanje ni uspelo" }));
    throw new Error(err.error || "Brisanje ni uspelo");
  }
}

export async function createFolder(name: string): Promise<void> {
  const res = await fetch(`${API_BASE}/api/create-folder`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Ustvarjanje mape ni uspelo" }));
    throw new Error(err.error || "Ustvarjanje mape ni uspelo");
  }
}

export async function refreshVLC(): Promise<void> {
  const res = await fetch(`${API_BASE}/api/refresh-vlc`, { method: "POST" });
  if (!res.ok) throw new Error("Osvežitev VLC ni uspela");
}

export async function deleteFolder(name: string): Promise<void> {
  const res = await fetch(`${API_BASE}/api/delete-folder`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Brisanje mape ni uspelo" }));
    throw new Error(err.error || "Brisanje mape ni uspelo");
  }
}

export async function reorderFiles(orderedPaths: string[]): Promise<void> {
  const res = await fetch(`${API_BASE}/api/reorder-files`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ order: orderedPaths }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Preureditev ni uspela" }));
    throw new Error(err.error || "Preureditev ni uspela");
  }
}

export async function reorderFolders(orderedFolders: string[]): Promise<void> {
  const res = await fetch(`${API_BASE}/api/reorder-folders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ order: orderedFolders }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Preureditev map ni uspela" }));
    throw new Error(err.error || "Preureditev map ni uspela");
  }
}
