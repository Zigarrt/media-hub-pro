import { useState, useMemo, useCallback } from "react";
import { toast } from "sonner";
import { Header } from "@/components/Header";
import { UploadSection } from "@/components/UploadSection";
import { FilterBar } from "@/components/FilterBar";
import { FileCard } from "@/components/FileCard";
import { DeleteModal } from "@/components/DeleteModal";
import { MOCK_FILES, MOCK_FOLDERS } from "@/lib/mock-data";
import { MediaFile, getFileStatus, formatFileSize, FileStatus } from "@/lib/types";

export default function Index() {
  const [darkMode, setDarkMode] = useState(false);
  const [files, setFiles] = useState<MediaFile[]>(MOCK_FILES);
  const [search, setSearch] = useState("");
  const [folderFilter, setFolderFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<MediaFile | null>(null);

  const toggleDark = useCallback(() => {
    setDarkMode((d) => {
      document.documentElement.classList.toggle("dark", !d);
      return !d;
    });
  }, []);

  const handleUpload = useCallback((file: File, folder: string, duration: number) => {
    const now = new Date();
    const newFile: MediaFile = {
      id: crypto.randomUUID(),
      name: file.name,
      folder,
      path: `${folder}/${file.name}`,
      type: file.name.toLowerCase().endsWith(".mp4") ? "video" : "image",
      size: file.size,
      uploadedAt: now,
      expiresAt: new Date(now.getTime() + duration * 24 * 60 * 60 * 1000),
      duration,
    };
    setFiles((prev) => [newFile, ...prev]);
    toast.success(`"${file.name}" uspešno naložena v ${folder}`);
  }, []);

  const handleDelete = useCallback(() => {
    if (!deleteTarget) return;
    setFiles((prev) => prev.filter((f) => f.id !== deleteTarget.id));
    toast.success(`"${deleteTarget.name}" izbrisana`);
    setDeleteTarget(null);
  }, [deleteTarget]);

  const handleRefresh = useCallback(() => {
    toast.success("Predvajalnik VLC je bil osežen!");
  }, []);

  const filtered = useMemo(() => {
    return files.filter((f) => {
      if (search && !f.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (folderFilter && f.folder !== folderFilter) return false;
      if (statusFilter && getFileStatus(f) !== (statusFilter as FileStatus)) return false;
      return true;
    });
  }, [files, search, folderFilter, statusFilter]);

  const totalSize = useMemo(() => {
    return formatFileSize(files.reduce((sum, f) => sum + f.size, 0));
  }, [files]);

  return (
    <div className="min-h-screen bg-background">
      <Header
        darkMode={darkMode}
        onToggleDark={toggleDark}
        onRefreshPlayer={handleRefresh}
        totalFiles={files.length}
        totalSize={totalSize}
      />

      <main className="container mx-auto px-4 py-6 space-y-6 max-w-6xl">
        <UploadSection folders={MOCK_FOLDERS} onUpload={handleUpload} />
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          folderFilter={folderFilter}
          onFolderChange={setFolderFilter}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          folders={MOCK_FOLDERS}
        />

        {filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg font-medium">Ni najdenih datotek</p>
            <p className="text-sm mt-1">Spremeni filtre ali naloži novo datoteko.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((file) => (
              <FileCard key={file.id} file={file} onDelete={setDeleteTarget} />
            ))}
          </div>
        )}
      </main>

      <DeleteModal
        file={deleteTarget}
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
