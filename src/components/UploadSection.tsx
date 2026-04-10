import { useCallback, useRef, useState } from "react";
import { Upload, Image, Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface UploadSectionProps {
  folders: string[];
  onUpload: (file: File, folder: string, duration: number) => void;
}

const DURATION_OPTIONS = [
  { label: "1 dan", value: 1 },
  { label: "7 dni", value: 7 },
  { label: "14 dni", value: 14 },
  { label: "30 dni", value: 30 },
];

export function UploadSection({ folders, onUpload }: UploadSectionProps) {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState(folders[0] || "");
  const [selectedDuration, setSelectedDuration] = useState(7);
  const [customDuration, setCustomDuration] = useState("");
  const [useCustom, setUseCustom] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
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
    const dur = useCustom ? parseInt(customDuration) || 7 : selectedDuration;
    onUpload(selectedFile, selectedFolder, dur);
    setSelectedFile(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const isVideo = selectedFile?.name.toLowerCase().endsWith(".mp4");

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm p-6 animate-fade-in">
      <h2 className="text-base font-semibold text-card-foreground mb-4">Naloži datoteko</h2>

      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
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
          <div className="flex flex-col items-center gap-2">
            {isVideo ? (
              <Film className="w-10 h-10 text-primary" />
            ) : (
              <Image className="w-10 h-10 text-primary" />
            )}
            <p className="font-medium text-card-foreground">{selectedFile.name}</p>
            <p className="text-sm text-muted-foreground">
              {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className="w-10 h-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Povleci datoteko sem ali <span className="text-primary font-medium">klikni za izbiro</span>
            </p>
            <p className="text-xs text-muted-foreground">PNG, JPG, JPEG, MP4</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        <div>
          <label className="text-sm font-medium text-card-foreground mb-1.5 block">Ciljna mapa</label>
          <select
            value={selectedFolder}
            onChange={(e) => setSelectedFolder(e.target.value)}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {folders.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-card-foreground mb-1.5 block">Trajanje predvajanja</label>
          {!useCustom ? (
            <div className="flex gap-1.5 flex-wrap">
              {DURATION_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSelectedDuration(opt.value)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    selectedDuration === opt.value
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-accent"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
              <button
                onClick={() => setUseCustom(true)}
                className="px-3 py-1.5 rounded-md text-sm font-medium bg-secondary text-secondary-foreground hover:bg-accent transition-colors"
              >
                Po meri
              </button>
            </div>
          ) : (
            <div className="flex gap-2 items-center">
              <input
                type="number"
                min={1}
                max={365}
                value={customDuration}
                onChange={(e) => setCustomDuration(e.target.value)}
                placeholder="Št. dni"
                className="w-24 rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <span className="text-sm text-muted-foreground">dni</span>
              <button
                onClick={() => { setUseCustom(false); setCustomDuration(""); }}
                className="text-sm text-primary hover:underline"
              >
                Nazaj
              </button>
            </div>
          )}
        </div>
      </div>

      <Button onClick={handleSubmit} className="w-full mt-4 gap-2" disabled={!selectedFile}>
        <Upload className="w-4 h-4" />
        Naloži in posodobi predvajalnik
      </Button>
    </div>
  );
}
