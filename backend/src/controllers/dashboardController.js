import Voucher from "../models/Voucher.js";
export async function dashboard(req, res) {
  const base = req.user.role === "employee" ? { employee: req.user._id } : {};
  const vouchers = await Voucher.find(base).sort({ createdAt: -1 }).limit(100);
  const sum = (arr) => arr.reduce((total, v) => total + Number(v.amount || 0), 0);
  const count = (status) => vouchers.filter(v => v.status === status).length;
  const today = new Date(); today.setHours(0,0,0,0);
  const approvedToday = vouchers.filter(v => v.status === "Approved" && v.approvalDate && new Date(v.approvalDate) >= today);
  const rejectedToday = vouchers.filter(v => v.status === "Rejected" && new Date(v.updatedAt) >= today);
  res.json({
    metrics: {
      total: vouchers.length, drafts: count("Draft"), pending: count("Pending Approval"),
      approved: count("Approved"), rejected: count("Rejected"),
      claimedAmount: sum(vouchers), pendingAmount: sum(vouchers.filter(v => v.status === "Pending Approval")),
      approvedAmount: sum(vouchers.filter(v => v.status === "Approved")),
      approvedToday: approvedToday.length, rejectedToday: rejectedToday.length
    },
    recent: vouchers.slice(0, 6),
    categoryBreakdown: Object.entries(vouchers.reduce((a,v) => { a[v.category] = (a[v.category] || 0) + v.amount; return a; }, {})).map(([name,value]) => ({ name, value })),
    monthly: Array.from({ length: 6 }, (_, i) => {
      const d = new Date(); d.setMonth(d.getMonth() - (5-i));
      const month = d.toLocaleString("en-IN", { month: "short" });
      const amount = vouchers.filter(v => new Date(v.expenseDate).getMonth() === d.getMonth() && new Date(v.expenseDate).getFullYear() === d.getFullYear()).reduce((a,v)=>a+v.amount,0);
      return { month, amount };
    })
  });
}
