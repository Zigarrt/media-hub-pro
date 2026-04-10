import { Image, Film, Trash2, Calendar, Clock } from "lucide-react";
import { MediaFile, getFileStatus, getProgress, getTimeRemaining, formatFileSize, STATUS_LABELS } from "@/lib/types";
import { Progress } from "@/components/ui/progress";

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
    <div className="bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden animate-slide-up group">
      {/* Preview area */}
      <div className="h-32 bg-secondary flex items-center justify-center relative overflow-hidden">
        {file.type === "video" ? (
          <Film className="w-12 h-12 text-muted-foreground" />
        ) : (
          <Image className="w-12 h-12 text-muted-foreground" />
        )}
        <span className={`absolute top-2 right-2 text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[status]}`}>
          {STATUS_LABELS[status]}
        </span>
        <span className="absolute top-2 left-2 bg-card/80 backdrop-blur-sm text-xs font-medium text-card-foreground px-2 py-0.5 rounded-full">
          {file.folder}
        </span>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="min-w-0">
            <h3 className="font-medium text-sm text-card-foreground truncate">{file.name}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {formatFileSize(file.size)} • {file.type === "video" ? "Video" : "Slika"}
            </p>
          </div>
          <button
            onClick={() => onDelete(file)}
            className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Progress */}
        <div className="mb-3">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Preostalo</span>
            <span>{remaining > 0 ? `${Math.ceil(remaining)} dni` : "Potečeno"}</span>
          </div>
          <Progress value={progress} className={`h-1.5 ${progressColors[status]}`} />
        </div>

        {/* Dates */}
        <div className="flex flex-col gap-1 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3 h-3" />
            <span>Naloženo: {formatDate(file.uploadedAt)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3 h-3" />
            <span>Poteče: {formatDate(file.expiresAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
