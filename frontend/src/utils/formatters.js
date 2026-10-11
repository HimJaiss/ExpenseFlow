export const money = (value) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(Number(value || 0));
export const date = (value) => value ? new Date(value).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";
export const shortDate = (value) => value ? new Date(value).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }) : "—";
export const initials = (name = "") => name.split(" ").filter(Boolean).slice(0,2).map(x => x[0]).join("").toUpperCase();
