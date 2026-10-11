export default function StatusBadge({ status }) {
  const cls = { "Draft":"badge-gray", "Pending Approval":"badge-amber", "Approved":"badge-green", "Rejected":"badge-red" }[status] || "badge-gray";
  return <span className={`badge ${cls}`}><span className="badge-dot" />{status}</span>;
}
