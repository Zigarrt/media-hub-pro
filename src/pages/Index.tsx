import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Header } from "@/components/Header";
import { UploadSection } from "@/components/UploadSection";
import { FilterBar } from "@/components/FilterBar";
import { SortableFileCard } from "@/components/SortableFileCard";
import { DeleteModal } from "@/components/DeleteModal";
import { MOCK_FILES, MOCK_FOLDERS } from "@/lib/mock-data";
import { MediaFile, getFileStatus, formatFileSize, FileStatus } from "@/lib/types";
import * as api from "@/lib/api";
import { Loader2, FolderOpen } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";

const isDev = import.meta.env.DEV || window.location.hostname.includes("lovable.app");

export default function Index() {
  const [darkMode, setDarkMode] = useState(false);
  const [files, setFiles] = useState<MediaFile[]>(isDev ? MOCK_FILES : []);
  const [folders, setFolders] = useState<string[]>(isDev ? MOCK_FOLDERS : []);
  const [search, setSearch] = useState("");
  const [folderFilter, setFolderFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<MediaFile | null>(null);
  const [loading, setLoading] = useState(!isDev);
  const [fileOrder, setFileOrder] = useState<string[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const loadData = useCallback(async () => {
    if (isDev) return;
    try {
      setLoading(true);
      const [fetchedFolders, fetchedFiles] = await Promise.all([
        api.fetchFolders(),
        api.fetchFiles(),
      ]);
      setFolders(fetchedFolders);
      setFiles(fetchedFiles);
      // Preserve existing order or use API order
      setFileOrder(fetchedFiles.map((f: MediaFile) => f.id));
    } catch (err) {
      console.error("Napaka pri nalaganju podatkov:", err);
      toast.error("Ni mogoče povezati s strežnikom. Prikazujem demo podatke.");
      setFolders(MOCK_FOLDERS);
      setFiles(MOCK_FILES);
      setFileOrder(MOCK_FILES.map((f) => f.id));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const toggleDark = useCallback(() => {
    setDarkMode((d) => {
      document.documentElement.classList.toggle("dark", !d);
      return !d;
    });
  }, []);

  const handleUpload = useCallback(async (file: File, folder: string, duration: number) => {
    if (isDev) {
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
      toast.success(`"${file.name}" uspešno naložena v mapo "${folder}"`);
      return;
    }

    try {
      await api.uploadFile(file, folder, duration);
      toast.success(`"${file.name}" uspešno naložena v mapo "${folder}"`);
      await loadData();
    } catch (err: any) {
      toast.error(err.message || "Napaka pri nalaganju");
    }
  }, [loadData]);

  const handleCreateFolder = useCallback(async (name: string) => {
    if (isDev) {
      setFolders((prev) => [...prev, name]);
      toast.success(`Mapa "${name}" je bila ustvarjena`);
      return;
    }

    try {
      await api.createFolder(name);
      toast.success(`Mapa "${name}" je bila ustvarjena`);
      await loadData();
    } catch (err: any) {
      toast.error(err.message || "Napaka pri ustvarjanju mape");
    }
  }, [loadData]);

  const handleDeleteFolder = useCallback(async (name: string) => {
    if (isDev) {
      setFolders((prev) => prev.filter((f) => f !== name));
      toast.success(`Mapa "${name}" je bila izbrisana`);
      return;
    }

    try {
      await api.deleteFolder(name);
      toast.success(`Mapa "${name}" je bila izbrisana`);
      await loadData();
    } catch (err: any) {
      toast.error(err.message || "Napaka pri brisanju mape");
    }
  }, [loadData]);

  const folderFileCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    folders.forEach((f) => (counts[f] = 0));
    files.forEach((f) => (counts[f.folder] = (counts[f.folder] || 0) + 1));
    return counts;
  }, [files, folders]);

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;

    if (isDev) {
      setFiles((prev) => prev.filter((f) => f.id !== deleteTarget.id));
      toast.success(`"${deleteTarget.name}" izbrisana`);
      setDeleteTarget(null);
      return;
    }

    try {
      await api.deleteFile(deleteTarget.path);
      toast.success(`"${deleteTarget.name}" izbrisana`);
      setDeleteTarget(null);
      await loadData();
    } catch (err: any) {
      toast.error(err.message || "Napaka pri brisanju");
    }
  }, [deleteTarget, loadData]);

  const handleReorderFiles = useCallback(async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = fileOrder.indexOf(active.id as string);
    const newIndex = fileOrder.indexOf(over.id as string);
    const newOrder = arrayMove(fileOrder, oldIndex, newIndex);
    setFileOrder(newOrder);

    if (!isDev) {
      try {
        // Map IDs back to paths for the backend
        const orderedPaths = newOrder
          .map((id) => files.find((f) => f.id === id)?.path)
          .filter(Boolean) as string[];
        await api.reorderFiles(orderedPaths);
        toast.success("Vrstni red datotek posodobljen");
      } catch (err: any) {
        toast.error(err.message || "Napaka pri preurejanju");
      }
    }
  }, [fileOrder, files]);

  const handleReorderFolders = useCallback(async (newFolders: string[]) => {
    setFolders(newFolders);
    if (!isDev) {
      try {
        await api.reorderFolders(newFolders);
        toast.success("Vrstni red map posodobljen");
      } catch (err: any) {
        toast.error(err.message || "Napaka pri preurejanju map");
      }
    }
  }, []);

  const handleRefresh = useCallback(async () => {
    if (isDev) {
      toast.success("Predvajalnik VLC je bil osvežen!");
      return;
    }
    try {
      await api.refreshVLC();
      toast.success("Predvajalnik VLC je bil osvežen!");
    } catch (err: any) {
      toast.error(err.message || "Napaka pri osvežitvi VLC");
    }
  }, []);

  const filtered = useMemo(() => {
    return files.filter((f) => {
      if (search && !f.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (folderFilter && f.folder !== folderFilter) return false;
      if (statusFilter && getFileStatus(f) !== (statusFilter as FileStatus)) return false;
      return true;
    });
  }, [files, search, folderFilter, statusFilter]);

  const orderedFiltered = useMemo(() => {
    if (fileOrder.length === 0) return filtered;
    return [...filtered].sort((a, b) => {
      const ai = fileOrder.indexOf(a.id);
      const bi = fileOrder.indexOf(b.id);
      return (ai === -1 ? Infinity : ai) - (bi === -1 ? Infinity : bi);
    });
  }, [filtered, fileOrder]);

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

      <main className="container mx-auto px-4 py-8 space-y-8 max-w-6xl">
        <UploadSection folders={folders} onUpload={handleUpload} onCreateFolder={handleCreateFolder} onDeleteFolder={handleDeleteFolder} folderFileCounts={folderFileCounts} onReorderFolders={handleReorderFolders} />
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          folderFilter={folderFilter}
          onFolderChange={setFolderFilter}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          folders={folders}
        />

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="w-10 h-10 animate-spin mb-4" />
            <p className="text-lg">Nalagam datoteke...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <FolderOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-xl font-semibold">Ni najdenih datotek</p>
            <p className="text-base mt-2">Spremeni filtre ali naloži novo datoteko.</p>
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleReorderFiles}>
            <SortableContext items={orderedFiltered.map((f) => f.id)} strategy={rectSortingStrategy}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {orderedFiltered.map((file) => (
                  <SortableFileCard key={file.id} file={file} onDelete={setDeleteTarget} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}

        {isDev && (
          <div className="text-center py-6">
            <span className="inline-block bg-accent text-accent-foreground text-sm font-medium px-4 py-2 rounded-full">
              Demo način — za produkcijo zgradi in poženi s Flask backendom
            </span>
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
