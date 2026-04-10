import { Moon, Sun, Monitor, RefreshCw, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  darkMode: boolean;
  onToggleDark: () => void;
  onRefreshPlayer: () => void;
  totalFiles: number;
  totalSize: string;
}

export function Header({ darkMode, onToggleDark, onRefreshPlayer, totalFiles, totalSize }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <Monitor className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-card-foreground">Predvajalnik</h1>
            <p className="text-xs text-muted-foreground">Upravljalec medijev</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4" />
            <span>{totalFiles} datotek</span>
          </div>
          <span>•</span>
          <span>{totalSize}</span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onRefreshPlayer}
            className="gap-1.5"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Osveži VLC</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleDark}
            className="h-9 w-9"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </header>
  );
}
