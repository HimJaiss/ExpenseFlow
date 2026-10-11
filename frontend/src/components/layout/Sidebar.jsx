import { NavLink } from "react-router-dom";
import { LayoutDashboard, FilePlus2, Files, ClipboardCheck, Archive, WalletCards, ReceiptText, LogOut, ShieldCheck } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { initials } from "../../utils/formatters";
const employeeLinks = [{to:"/dashboard",label:"Overview",icon:LayoutDashboard},{to:"/vouchers/new",label:"Create voucher",icon:FilePlus2},{to:"/vouchers",label:"My vouchers",icon:Files}];
const directorLinks = [{to:"/dashboard",label:"Overview",icon:LayoutDashboard},{to:"/approvals",label:"Pending approvals",icon:ClipboardCheck},{to:"/vouchers",label:"All vouchers",icon:Files}];
const accountsLinks = [{to:"/dashboard",label:"Overview",icon:LayoutDashboard},{to:"/vouchers",label:"All vouchers",icon:Archive}];
export default function Sidebar() {
  const { user, logout } = useAuth();
  const links = user?.role === "director" ? directorLinks : user?.role === "accounts" ? accountsLinks : employeeLinks;
  return <aside className="sidebar">
    <div className="brand"><div className="brand-mark"><WalletCards size={22}/></div><div><strong>ExpenseFlow</strong><small>WORKSPACE</small></div></div>
    <div className="workspace-label">WORKSPACE</div>
    <nav className="nav-links">{links.map(({to,label,icon:Icon}) => <NavLink end={to === "/dashboard"} to={to} key={to} className={({isActive}) => `nav-link ${isActive ? "active" : ""}`}><Icon size={18}/><span>{label}</span>{label === "Pending approvals" && <span className="nav-pip"/>}</NavLink>)}</nav>
    <div className="sidebar-bottom">
      <div className="secure-note"><ShieldCheck size={18}/><div><strong>Secure workspace</strong><span>Role-based access enabled</span></div></div>
      <div className="profile-mini"><div className="avatar">{initials(user?.name)}</div><div className="profile-copy"><strong>{user?.name}</strong><span>{user?.role === "director" ? "Director" : user?.role === "accounts" ? "Accounts team" : user?.department || "Employee"}</span></div><button className="logout-button" title="Sign out" onClick={logout}><LogOut size={17}/></button></div>
    </div>
  </aside>;
}
