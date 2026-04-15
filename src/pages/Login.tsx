import { useState } from "react";
import { Monitor, LogIn, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { login, useAuth } from "@/lib/auth";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const setUser = useAuth((s) => s.setUser);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password) {
      setError("Vnesite uporabniško ime in geslo.");
      return;
    }

    setLoading(true);
    try {
      const result = await login(username.trim(), password);
      if (result.ok) {
        setUser(username.trim());
      } else {
        setError(result.error || "Prijava neuspešna.");
      }
    } catch {
      setError("Napaka pri povezavi s strežnikom.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mb-4">
            <Monitor className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Predvajalnik</h1>
          <p className="text-muted-foreground mt-1">Prijavite se za nadaljevanje</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium text-foreground">
              Uporabniško ime
            </label>
            <Input
              id="username"
              type="text"
              placeholder="ime.priimek"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-foreground">
              Geslo
            </label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full gap-2" size="lg" disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
            Prijava
          </Button>
        </form>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Avtentikacija prek Active Directory
        </p>
      </div>
    </div>
  );
}
