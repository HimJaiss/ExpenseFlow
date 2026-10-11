import mongoose from "mongoose";
const voucherSchema = new mongoose.Schema({
  voucherNumber: { type: String, unique: true, index: true },
  voucherDate: { type: Date, default: Date.now },
  expenseDate: { type: Date, required: true },
  department: { type: String, required: true, trim: true },
  title: { type: String, required: true, trim: true },
  category: { type: String, enum: ["Travel", "Meals", "Office Supplies", "Accommodation", "Software", "Client Meeting", "Utilities", "Other"], default: "Other" },
  description: { type: String, default: "" },
  amount: { type: Number, required: true, min: 0.01 },
  employee: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  employeeName: { type: String, required: true },
  employeeId: { type: String, default: "" },
  employeeSignature: { type: String, default: "" },
  directorSignature: { type: String, default: "" },
  status: { type: String, enum: ["Draft", "Pending Approval", "Approved", "Rejected"], default: "Draft", index: true },
  approvalDate: { type: Date, default: null },
  rejectionReason: { type: String, default: "" },
  submittedAt: { type: Date, default: null },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }
}, { timestamps: true });
voucherSchema.index({ voucherNumber: 1 }, { unique: true });
voucherSchema.index({ employee: 1, status: 1, createdAt: -1 });
voucherSchema.index({ department: 1, category: 1, status: 1 });
export default mongoose.model("Voucher", voucherSchema);
