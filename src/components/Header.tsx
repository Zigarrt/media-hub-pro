import { Moon, Sun, Monitor, RefreshCw, HardDrive, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logout, useAuth } from "@/lib/auth";

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
      <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-6xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
            <Monitor className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-card-foreground">Predvajalnik</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-0.5">
              <HardDrive className="w-4 h-4" />
              <span>{totalFiles} datotek • {totalSize}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="lg"
            onClick={onRefreshPlayer}
            className="gap-2 text-base px-5 py-3 h-auto"
          >
            <RefreshCw className="w-5 h-5" />
            <span className="hidden sm:inline">Osveži predvajalnik</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleDark}
            className="h-12 w-12"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={async () => {
              await logout();
              useAuth.getState().setUser(null);
            }}
            className="h-12 w-12 text-muted-foreground hover:text-destructive"
            title="Odjava"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
