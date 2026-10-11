import { Bell, Search, ChevronDown } from "lucide-react";
import ThemeToggle from "../common/ThemeToggle";
import { useAuth } from "../../hooks/useAuth";
export default function Navbar() {
  const { user } = useAuth();
  return <header className="topbar"><div className="crumb"><span>Workspace</span><span className="crumb-slash">/</span><strong>{user?.role === "director" ? "Director portal" : user?.role === "accounts" ? "Accounts portal" : "Employee portal"}</strong></div><div className="topbar-actions"><div className="topbar-search"><Search size={16}/><span>ExpenseFlow</span><kbd>⌘ K</kbd></div><ThemeToggle/><button className="icon-button notification-button" aria-label="Notifications"><Bell size={18}/><i/></button><div className="topbar-user"><div className="avatar avatar-small">{user?.name?.split(" ").map(n=>n[0]).slice(0,2).join("")}</div><ChevronDown size={15}/></div></div></header>;
}
