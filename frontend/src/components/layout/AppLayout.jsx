import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
export default function AppLayout() { return <div className="app-shell"><Sidebar/><div className="main-shell"><Navbar/><main className="page-content"><Outlet/></main><footer className="app-footer"><span>© {new Date().getFullYear()} ExpenseFlow</span><span>Expense operations, made clear.</span></footer></div></div>; }
