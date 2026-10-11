import { money, date } from "./formatters";
export function exportCsv(vouchers) {
  const columns = ["voucherNumber","employeeName","department","title","category","amount","expenseDate","status"];
  const rows = [columns.join(","), ...vouchers.map(v => columns.map(k => `"${String(k === "amount" ? money(v[k]) : k === "expenseDate" ? date(v[k]) : v[k] ?? "").replaceAll('"','""')}"`).join(","))];
  const blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "expenseflow-vouchers.csv"; a.click(); URL.revokeObjectURL(url);
}
