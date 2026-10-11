import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
const COLORS=["#4263eb","#e9a23b","#25a56a","#e45b67","#9b72cf"];
export default function StatusPieChart({ data=[] }) {
  if (!data.length) return <div className="chart-empty">No category data yet.</div>;
  return <div className="donut-layout"><div className="donut-chart"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={data} dataKey="value" nameKey="name" innerRadius={54} outerRadius={76} paddingAngle={3} stroke="none">{data.map((entry,i)=><Cell key={entry.name} fill={COLORS[i%COLORS.length]}/>)}</Pie><Tooltip formatter={v=>`₹${Number(v).toLocaleString("en-IN")}`}/></PieChart></ResponsiveContainer></div><div className="legend-list">{data.slice(0,5).map((x,i)=><div className="legend-item" key={x.name}><i style={{background:COLORS[i%COLORS.length]}}/><span>{x.name}</span><strong>₹{Number(x.value).toLocaleString("en-IN")}</strong></div>)}</div></div>;
}
