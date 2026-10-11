import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Download, Plus, FileText, Clock3, CheckCircle2, CircleX } from "lucide-react";
import PageHeader from "../../components/layout/PageHeader";
import DashboardMetricCard from "../../components/charts/DashboardMetricCard";
import FilterBar from "../../components/vouchers/FilterBar";
import VoucherTable from "../../components/vouchers/VoucherTable";
import VoucherDetailModal from "../../components/vouchers/VoucherDetailModal";
import Button from "../../components/common/Button";
import { useVouchers } from "../../hooks/useVouchers";
import { useAuth } from "../../hooks/useAuth";
import { exportCsv } from "../../utils/exportHelpers";
import { money } from "../../utils/formatters";
import { voucherApi } from "../../services/api";
export default function MyVouchers(){
  const navigate=useNavigate();const {user}=useAuth();const [filters,setFilters]=useState({search:"",status:"All",category:"All",from:"",to:"",minAmount:"",maxAmount:""});const [selected,setSelected]=useState(null);
  const params=useMemo(()=>Object.fromEntries(Object.entries(filters).filter(([k,v])=>v&&v!=="All")),[filters]);const {vouchers,loading,error,reload}=useVouchers(params);
  const total=vouchers.reduce((a,v)=>a+v.amount,0);
  const action=async(v)=>{if(window.confirm(`Submit ${v.voucherNumber} for approval?`)){try{await voucherApi.submit(v._id);await reload();}catch(e){alert(e.response?.data?.message||"Unable to submit voucher.");}}};
  const del=async(v)=>{if(window.confirm(`Delete draft ${v.voucherNumber}? This cannot be undone.`)){try{await voucherApi.remove(v._id);await reload();}catch(e){alert(e.response?.data?.message||"Unable to delete voucher.");}}};
  return <><PageHeader eyebrow={`${user.role.toUpperCase()} WORKSPACE`} title={user.role === "employee" ? "My vouchers" : "All vouchers"} description={user.role === "employee" ? "Track every expense request from draft to decision." : "Search, filter, and inspect voucher records across the organization."} action={<><Button variant="secondary" onClick={()=>exportCsv(vouchers)}><Download size={16}/> Export CSV</Button>{user.role === "employee" && <Button onClick={()=>navigate("/vouchers/new")}><Plus size={17}/> New voucher</Button>}</>}/><div className="metrics-grid"><DashboardMetricCard label="Total vouchers" value={vouchers.length} note={`${money(total)} claimed`} icon={FileText} tone="blue"/><DashboardMetricCard label="Pending review" value={vouchers.filter(v=>v.status==="Pending Approval").length} note="Awaiting director" icon={Clock3} tone="amber"/><DashboardMetricCard label="Approved" value={vouchers.filter(v=>v.status==="Approved").length} note="Signed off" icon={CheckCircle2} tone="green"/><DashboardMetricCard label="Rejected" value={vouchers.filter(v=>v.status==="Rejected").length} note="Review remarks" icon={CircleX} tone="red"/></div><section className="panel"><div className="panel-heading"><div><h2>Voucher register</h2><p>Your submitted and saved expense requests</p></div><span className="count-pill">{vouchers.length} records</span></div><FilterBar filters={filters} setFilters={setFilters}/>{error&&<div className="inline-error">{error}</div>}<VoucherTable vouchers={vouchers} role={user.role} loading={loading} onView={setSelected} onEdit={v=>navigate(`/vouchers/${v._id}/edit`)} onSubmit={action} onDelete={del}/></section>{selected&&<VoucherDetailModal voucher={selected} onClose={()=>setSelected(null)}/>}</>;
}
