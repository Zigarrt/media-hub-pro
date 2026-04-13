import { useState } from "react";
import { Image, Film, Trash2, Calendar, Clock } from "lucide-react";
import { MediaFile, getFileStatus, getProgress, getTimeRemaining, formatFileSize, STATUS_LABELS } from "@/lib/types";
import { Progress } from "@/components/ui/progress";

function MediaPreview({ file }: { file: MediaFile }) {
  const [failed, setFailed] = useState(false);
  const src = `${window.location.origin}/media/${file.path}`;

  if (failed) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-secondary">
        {file.type === "video" ? (
          <Film className="w-14 h-14 text-muted-foreground" />
        ) : (
          <Image className="w-14 h-14 text-muted-foreground" />
        )}
      </div>
    );
  }

  if (file.type === "video") {
    return (
      <video
        src={src}
        className="w-full h-full object-cover"
        muted
        preload="metadata"
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <img
      src={src}
      alt={file.name}
      className="w-full h-full object-cover"
      onError={() => setFailed(true)}
    />
  );
}

interface FileCardProps {
  file: MediaFile;
  onDelete: (file: MediaFile) => void;
}

const statusColors = {
  active: "bg-success/15 text-success",
  "expiring-soon": "bg-warning/15 text-warning",
  expired: "bg-destructive/15 text-destructive",
};

const progressColors = {
  active: "[&>div]:bg-success",
  "expiring-soon": "[&>div]:bg-warning",
  expired: "[&>div]:bg-destructive",
};

export function FileCard({ file, onDelete }: FileCardProps) {
  const status = getFileStatus(file);
  const progress = getProgress(file);
  const remaining = getTimeRemaining(file);

  const formatDate = (d: Date) =>
    d.toLocaleDateString("sl-SI", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden animate-slide-up group">
      {/* Preview area */}
      <div className="h-44 bg-secondary flex items-center justify-center relative overflow-hidden">
        <MediaPreview file={file} />
        <span className={`absolute top-3 right-3 text-sm font-semibold px-3 py-1 rounded-full ${statusColors[status]}`}>
          {STATUS_LABELS[status]}
        </span>
        <span className="absolute top-3 left-3 bg-card/80 backdrop-blur-sm text-sm font-semibold text-card-foreground px-3 py-1 rounded-full">
          📁 {file.folder}
        </span>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="min-w-0">
            <h3 className="font-semibold text-base text-card-foreground truncate">{file.name}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {formatFileSize(file.size)} • {file.type === "video" ? "🎬 Video" : "🖼️ Slika"}
            </p>
          </div>
          <button
            onClick={() => onDelete(file)}
            className="p-2.5 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
            title="Izbriši datoteko"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Preostalo</span>
            <span className="font-semibold">{remaining > 0 ? `${Math.ceil(remaining)} dni` : "Potečeno"}</span>
          </div>
          <Progress value={progress} className={`h-2.5 rounded-full ${progressColors[status]}`} />
        </div>

        {/* Dates */}
        <div className="flex flex-col gap-1.5 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>Naloženo: {formatDate(file.uploadedAt)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>Poteče: {formatDate(file.expiresAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
