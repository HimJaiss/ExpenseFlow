import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import AppLayout from "./components/layout/AppLayout";
import Login from "./pages/auth/Login";
import Unauthorized from "./pages/auth/Unauthorized";
import NotFound from "./pages/auth/NotFound";
import Dashboard from "./pages/shared/Dashboard";
import CreateVoucher from "./pages/employee/CreateVoucher";
import MyVouchers from "./pages/employee/MyVouchers";
import PendingApprovals from "./pages/director/PendingApprovals";
import VoucherPrintView from "./pages/accounts/VoucherPrintView";
function Guard({ children, roles }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="app-loading"><div className="loading-mark">EF</div><span>Loading your workspace…</span></div>;
  if (!user) return <Navigate to="/login" replace/>;
  if (roles && !roles.includes(user.role)) return <Navigate to="/unauthorized" replace/>;
  return children;
}
function HomeRedirect(){const {user,loading}=useAuth();if(loading)return <div className="app-loading">Loading…</div>;return <Navigate to={user?"/dashboard":"/login"} replace/>;}
function RouterApp(){return <Routes><Route path="/" element={<HomeRedirect/>}/><Route path="/login" element={<Login/>}/><Route path="/unauthorized" element={<Guard><Unauthorized/></Guard>}/><Route element={<Guard><AppLayout/></Guard>}><Route path="/dashboard" element={<Dashboard/>}/><Route path="/vouchers" element={<MyVouchers/>}/><Route path="/vouchers/new" element={<Guard roles={["employee"]}><CreateVoucher/></Guard>}/><Route path="/vouchers/:id/edit" element={<Guard roles={["employee"]}><CreateVoucher/></Guard>}/><Route path="/approvals" element={<Guard roles={["director"]}><PendingApprovals/></Guard>}/><Route path="/print/:id" element={<VoucherPrintView/>}/></Route><Route path="*" element={<NotFound/>}/></Routes>}
export default function App(){return <ThemeProvider><AuthProvider><BrowserRouter><RouterApp/></BrowserRouter></AuthProvider></ThemeProvider>}
