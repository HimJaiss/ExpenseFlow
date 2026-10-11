import Voucher from "../models/Voucher.js";

export async function nextVoucherNumber() {
  const year = new Date().getFullYear();
  const count = await Voucher.countDocuments({ voucherNumber: new RegExp(`^EXP-${year}-`) });
  return `EXP-${year}-${String(count + 1).padStart(4, "0")}`;
}
export function canReadVoucher(voucher, user) {
  return user.role !== "employee" || String(voucher.employee) === String(user._id);
}
