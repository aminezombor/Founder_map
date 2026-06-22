import { Moon, Sun } from "lucide-react";
import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";

interface AppShellProps {
  children: ReactNode;
  theme: "light" | "dark";
  onThemeToggle: () => void;
  variant?: "default" | "map";
}

const navItems = [
  { to: "/", label: "Hunter", end: true },
  { to: "/dashboard", label: "V2 Dashboard" },
  { to: "/map", label: "Map" },
  { to: "/world-state", label: "World State" },
  { to: "/council", label: "Council" },
  { to: "/methodology", label: "Methodology" },
  { to: "/data", label: "Data" },
  { to: "/settings", label: "Settings" }
];

export function AppShell({ children, theme, onThemeToggle, variant = "default" }: AppShellProps) {
  return (
    <div className="v2-shell">
      <header className="v2-topbar">
        <NavLink to="/" className="v2-brand" aria-label="Founder Map hunter">
          Founder Map
        </NavLink>
        <nav className="v2-nav" aria-label="Primary navigation">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => (isActive ? "active" : undefined)}>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <button type="button" className="v2-icon-button" onClick={onThemeToggle} title="Switch light / dark mode">
          {theme === "light" ? <Moon size={18} aria-hidden /> : <Sun size={18} aria-hidden />}
        </button>
      </header>
      <main className={`v2-main ${variant === "map" ? "map-main" : ""}`}>{children}</main>
    </div>
  );
}
