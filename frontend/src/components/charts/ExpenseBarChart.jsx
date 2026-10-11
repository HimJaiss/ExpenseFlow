import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { money } from "../../utils/formatters";
export default function ExpenseBarChart({ data=[] }) {
  return <div className="chart-canvas"><ResponsiveContainer width="100%" height="100%"><BarChart data={data} margin={{top:8,right:8,left:-18,bottom:0}}><CartesianGrid vertical={false} stroke="var(--chart-grid)" strokeDasharray="4 4"/><XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill:"var(--muted)",fontSize:12}} dy={8}/><YAxis axisLine={false} tickLine={false} tick={{fill:"var(--muted)",fontSize:11}} tickFormatter={v=>v>=1000?`${Math.round(v/1000)}k`:v}/><Tooltip formatter={v=>money(v)} contentStyle={{borderRadius:12,border:"1px solid var(--border)",background:"var(--panel)",color:"var(--text)"}}/><Bar dataKey="amount" fill="#4263eb" radius={[5,5,0,0]} maxBarSize={34}/></BarChart></ResponsiveContainer></div>;
}
