import { useCallback, useRef, useState } from "react";
import { Upload, Image, Film, FolderPlus, Check, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface UploadSectionProps {
  folders: string[];
  onUpload: (file: File, folder: string, duration: number) => void;
  onCreateFolder: (name: string) => void;
  onDeleteFolder?: (name: string) => void;
  folderFileCounts?: Record<string, number>;
}

const DURATION_OPTIONS = [
  { label: "1 dan", value: 1 },
  { label: "7 dni", value: 7 },
  { label: "14 dni", value: 14 },
  { label: "30 dni", value: 30 },
];

export function UploadSection({ folders, onUpload, onCreateFolder, onDeleteFolder, folderFileCounts = {} }: UploadSectionProps) {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState(folders[0] || "");
  const [selectedDuration, setSelectedDuration] = useState(7);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) validateAndSet(file);
  }, []);

  const validateAndSet = (file: File) => {
    const valid = /\.(png|jpg|jpeg|mp4)$/i.test(file.name);
    if (!valid) {
      toast.error("Nepodprt format! Dovoljeni: PNG, JPG, JPEG, MP4");
      return;
    }
    setSelectedFile(file);
  };

  const handleSubmit = () => {
    if (!selectedFile || !selectedFolder) {
      toast.error("Izberi datoteko in mapo!");
      return;
    }
    onUpload(selectedFile, selectedFolder, selectedDuration);
    setSelectedFile(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleCreateFolder = () => {
    const name = newFolderName.trim().toLowerCase().replace(/\s+/g, "-");
    if (!name) {
      toast.error("Vpiši ime mape!");
      return;
    }
    if (folders.includes(name)) {
      toast.error("Mapa s tem imenom že obstaja!");
      return;
    }
    onCreateFolder(name);
    setSelectedFolder(name);
    setNewFolderName("");
    setShowNewFolder(false);
  };

  const isVideo = selectedFile?.name.toLowerCase().endsWith(".mp4");

  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm p-6 sm:p-8 animate-fade-in">
      <h2 className="text-xl font-bold text-card-foreground mb-5">📤 Naloži datoteko</h2>

      {/* Drop zone */}
      <div
        className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer ${
          dragOver
            ? "border-primary bg-accent"
            : "border-border hover:border-primary/50 hover:bg-accent/50"
        }`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,video/mp4"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && validateAndSet(e.target.files[0])}
        />
        {selectedFile ? (
          <div className="flex flex-col items-center gap-3">
            {isVideo ? (
              <Film className="w-14 h-14 text-primary" />
            ) : (
              <Image className="w-14 h-14 text-primary" />
            )}
            <p className="text-lg font-semibold text-card-foreground">{selectedFile.name}</p>
            <p className="text-base text-muted-foreground">
              {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <Upload className="w-14 h-14 text-muted-foreground" />
            <p className="text-lg text-muted-foreground">
              Povleci datoteko sem ali <span className="text-primary font-semibold">klikni za izbiro</span>
            </p>
            <p className="text-base text-muted-foreground">Podprti formati: PNG, JPG, MP4</p>
          </div>
        )}
      </div>

      {/* Folder + Duration */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-6">
        <div>
          <label className="text-base font-semibold text-card-foreground mb-2 block">📁 Ciljna mapa</label>
          <div className="flex gap-2">
            <select
              value={selectedFolder}
              onChange={(e) => setSelectedFolder(e.target.value)}
              className="flex-1 rounded-xl border border-input bg-background px-4 py-3 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {folders.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
            {onDeleteFolder && selectedFolder && (folderFileCounts[selectedFolder] || 0) === 0 && (
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  if (confirm(`Ali res želiš izbrisati mapo "${selectedFolder}"?`)) {
                    onDeleteFolder(selectedFolder);
                    setSelectedFolder(folders.filter(f => f !== selectedFolder)[0] || "");
                  }
                }}
                className="px-4 py-3 h-auto text-destructive hover:bg-destructive hover:text-destructive-foreground"
                title="Izbriši prazno mapo"
              >
                <Trash2 className="w-5 h-5" />
              </Button>
            )}
            <Button
              variant="outline"
              size="lg"
              onClick={() => setShowNewFolder(!showNewFolder)}
              className="px-4 py-3 h-auto"
              title="Ustvari novo mapo"
            >
              <FolderPlus className="w-5 h-5" />
            </Button>
          </div>

          {showNewFolder && (
            <div className="flex gap-2 mt-3 animate-fade-in">
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Ime nove mape..."
                className="flex-1 rounded-xl border border-input bg-background px-4 py-3 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                onKeyDown={(e) => e.key === "Enter" && handleCreateFolder()}
                autoFocus
              />
              <Button
                variant="default"
                size="lg"
                onClick={handleCreateFolder}
                className="px-4 py-3 h-auto gap-2"
              >
                <Check className="w-5 h-5" />
                Ustvari
              </Button>
            </div>
          )}
        </div>

        <div>
          <label className="text-base font-semibold text-card-foreground mb-2 block">⏱️ Trajanje predvajanja</label>
          <div className="grid grid-cols-2 gap-2">
            {DURATION_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSelectedDuration(opt.value)}
                className={`px-4 py-3 rounded-xl text-base font-semibold transition-colors ${
                  selectedDuration === opt.value
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-secondary text-secondary-foreground hover:bg-accent"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <Button onClick={handleSubmit} size="lg" className="w-full mt-6 gap-3 text-lg py-4 h-auto" disabled={!selectedFile}>
        <Upload className="w-6 h-6" />
        Naloži in posodobi predvajalnik
      </Button>
    </div>
  );
}
