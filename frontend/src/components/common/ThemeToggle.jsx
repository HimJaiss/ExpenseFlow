import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";
export default function ThemeToggle() {
  const { dark, toggle } = useTheme();
  return <button className="icon-button" onClick={toggle} title={dark ? "Switch to light theme" : "Switch to dark theme"} aria-label="Toggle theme">{dark ? <Sun size={18}/> : <Moon size={18}/>}</button>;
}
