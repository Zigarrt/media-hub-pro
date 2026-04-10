export type FileStatus = "active" | "expiring-soon" | "expired";

export interface MediaFile {
  id: string;
  name: string;
  folder: string;
  path: string;
  type: "image" | "video";
  size: number;
  uploadedAt: Date;
  expiresAt: Date;
  duration: number; // days
}

export function getFileStatus(file: MediaFile): FileStatus {
  const now = new Date();
  const remaining = file.expiresAt.getTime() - now.getTime();
  if (remaining <= 0) return "expired";
  const total = file.expiresAt.getTime() - file.uploadedAt.getTime();
  if (remaining / total < 0.2) return "expiring-soon";
  return "active";
}

export function getTimeRemaining(file: MediaFile): number {
  return Math.max(0, (file.expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

export function getProgress(file: MediaFile): number {
  const total = file.expiresAt.getTime() - file.uploadedAt.getTime();
  const remaining = file.expiresAt.getTime() - Date.now();
  return Math.max(0, Math.min(100, (remaining / total) * 100));
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

export const STATUS_LABELS: Record<FileStatus, string> = {
  active: "Aktivno",
  "expiring-soon": "Poteče kmalu",
  expired: "Potečeno",
};
