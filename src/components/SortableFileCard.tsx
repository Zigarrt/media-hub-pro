import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FileCard } from "./FileCard";
import { MediaFile } from "@/lib/types";
import { GripVertical } from "lucide-react";

interface SortableFileCardProps {
  file: MediaFile;
  onDelete: (file: MediaFile) => void;
}

export function SortableFileCard({ file, onDelete }: SortableFileCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: file.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : "auto" as any,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group/sortable">
      <button
        {...attributes}
        {...listeners}
        className="absolute top-2 left-2 z-10 p-1.5 rounded-lg bg-card/80 backdrop-blur-sm border border-border text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing opacity-0 group-hover/sortable:opacity-100 transition-opacity"
        title="Povleci za preureditev"
      >
        <GripVertical className="w-4 h-4" />
      </button>
      <FileCard file={file} onDelete={onDelete} />
    </div>
  );
}