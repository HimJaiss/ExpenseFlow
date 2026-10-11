import { ArrowUpRight } from "lucide-react";
export default function DashboardMetricCard({ label, value, note, icon:Icon, tone="blue", trend }) {
  return <article className="metric-card"><div className="metric-top"><span>{label}</span><div className={`metric-icon metric-${tone}`}><Icon size={19}/></div></div><div className="metric-value">{value}</div><div className="metric-bottom"><span>{note}</span>{trend && <span className="metric-trend"><ArrowUpRight size={13}/>{trend}</span>}</div></article>;
}
