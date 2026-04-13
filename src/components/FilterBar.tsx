import { Search, Filter } from "lucide-react";
import { FileStatus, STATUS_LABELS } from "@/lib/types";

interface FilterBarProps {
  search: string;
  onSearchChange: (v: string) => void;
  folderFilter: string;
  onFolderChange: (v: string) => void;
  statusFilter: string;
  onStatusChange: (v: string) => void;
  folders: string[];
}

export function FilterBar({
  search, onSearchChange,
  folderFilter, onFolderChange,
  statusFilter, onStatusChange,
  folders,
}: FilterBarProps) {
  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm p-5 animate-fade-in">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="🔍 Iskanje po imenu datoteke..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-input bg-background text-base text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            <select
              value={folderFilter}
              onChange={(e) => onFolderChange(e.target.value)}
              className="pl-12 pr-10 py-3 rounded-xl border border-input bg-background text-base text-foreground focus:outline-none focus:ring-2 focus:ring-ring appearance-none"
            >
              <option value="">Vse mape</option>
              {folders.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="px-4 py-3 rounded-xl border border-input bg-background text-base text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">Vsi statusi</option>
            {(Object.entries(STATUS_LABELS) as [FileStatus, string][]).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
