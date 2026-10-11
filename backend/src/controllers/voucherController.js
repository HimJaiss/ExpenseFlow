import Voucher from "../models/Voucher.js";
import { voucherSchema } from "../validators/voucherSchemas.js";
import { nextVoucherNumber, canReadVoucher } from "../services/voucherService.js";
import { auditEvent } from "../services/auditService.js";

const populate = { path: "employee", select: "name email role department employeeId" };
function scopedQuery(user) { return user.role === "employee" ? { employee: user._id } : {}; }

export async function listVouchers(req, res) {
  const q = { ...scopedQuery(req.user) };
  const { search, status, category, department, from, to, minAmount, maxAmount } = req.query;
  if (status && status !== "All") q.status = status;
  if (category && category !== "All") q.category = category;
  if (department && department !== "All") q.department = department;
  if (from || to) q.expenseDate = {};
  if (from) q.expenseDate.$gte = new Date(from);
  if (to) q.expenseDate.$lte = new Date(`${to}T23:59:59.999`);
  if (minAmount || maxAmount) q.amount = {};
  if (minAmount !== undefined && minAmount !== "") q.amount.$gte = Number(minAmount);
  if (maxAmount !== undefined && maxAmount !== "") q.amount.$lte = Number(maxAmount);
  if (search) {
    const rx = new RegExp(String(search).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    q.$or = [{ voucherNumber: rx }, { employeeName: rx }, { department: rx }, { title: rx }, { category: rx }];
  }
  const vouchers = await Voucher.find(q).populate(populate).sort({ createdAt: -1 }).limit(500);
  res.json({ vouchers });
}
export async function getVoucher(req, res) {
  const voucher = await Voucher.findById(req.params.id).populate(populate);
  if (!voucher) return res.status(404).json({ message: "Voucher not found." });
  if (!canReadVoucher(voucher, req.user)) return res.status(403).json({ message: "You can only view your own vouchers." });
  res.json({ voucher });
}
export async function createVoucher(req, res) {
  const parsed = voucherSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: parsed.error.issues[0].message, errors: parsed.error.flatten() });
  const voucher = await Voucher.create({
    ...parsed.data, voucherNumber: await nextVoucherNumber(), employee: req.user._id,
    employeeName: req.user.name, employeeId: req.user.employeeId || "", status: "Draft"
  });
  auditEvent("voucher.created", voucher, req.user);
  res.status(201).json({ voucher });
}
export async function updateVoucher(req, res) {
  const voucher = await Voucher.findById(req.params.id);
  if (!voucher) return res.status(404).json({ message: "Voucher not found." });
  if (req.user.role !== "employee" || String(voucher.employee) !== String(req.user._id)) return res.status(403).json({ message: "Only the owning employee can edit this voucher." });
  if (voucher.status !== "Draft") return res.status(409).json({ message: "Only Draft vouchers can be edited." });
  const parsed = voucherSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: parsed.error.issues[0].message });
  Object.assign(voucher, parsed.data);
  await voucher.save();
  auditEvent("voucher.updated", voucher, req.user);
  res.json({ voucher });
}
export async function deleteVoucher(req, res) {
  const voucher = await Voucher.findById(req.params.id);
  if (!voucher) return res.status(404).json({ message: "Voucher not found." });
  if (req.user.role !== "employee" || String(voucher.employee) !== String(req.user._id)) return res.status(403).json({ message: "Only the owning employee can delete this voucher." });
  if (voucher.status !== "Draft") return res.status(409).json({ message: "Only Draft vouchers can be deleted." });
  await voucher.deleteOne();
  auditEvent("voucher.deleted", voucher, req.user);
  res.json({ message: "Draft voucher deleted." });
}
export async function submitVoucher(req, res) {
  const voucher = await Voucher.findById(req.params.id);
  if (!voucher) return res.status(404).json({ message: "Voucher not found." });
  if (req.user.role !== "employee" || String(voucher.employee) !== String(req.user._id)) return res.status(403).json({ message: "Only the owner can submit this voucher." });
  if (voucher.status !== "Draft") return res.status(409).json({ message: "Only Draft vouchers can be submitted." });
  if (!voucher.employeeSignature) return res.status(400).json({ message: "Upload your employee signature before submitting." });
  voucher.status = "Pending Approval";
  voucher.submittedAt = new Date();
  await voucher.save();
  auditEvent("voucher.submitted", voucher, req.user);
  res.json({ voucher });
}
export async function uploadEmployeeSignature(req, res) {
  const voucher = await Voucher.findById(req.params.id);
  if (!voucher) return res.status(404).json({ message: "Voucher not found." });
  if (req.user.role !== "employee" || String(voucher.employee) !== String(req.user._id)) return res.status(403).json({ message: "Only the owner can upload this signature." });
  if (voucher.status !== "Draft") return res.status(409).json({ message: "Signatures can only be changed while Draft." });
  if (!req.file) return res.status(400).json({ message: "Signature image is required." });
  voucher.employeeSignature = `/uploads/${req.file.filename}`;
  await voucher.save();
  res.json({ voucher });
}
export async function approveVoucher(req, res) {
  const voucher = await Voucher.findById(req.params.id);
  if (!voucher) return res.status(404).json({ message: "Voucher not found." });
  if (voucher.status !== "Pending Approval") return res.status(409).json({ message: "Only pending vouchers can be approved." });
  if (!req.file) return res.status(400).json({ message: "Director signature is required to approve." });
  voucher.status = "Approved";
  voucher.directorSignature = `/uploads/${req.file.filename}`;
  voucher.approvalDate = new Date();
  voucher.approvedBy = req.user._id;
  await voucher.save();
  auditEvent("voucher.approved", voucher, req.user);
  res.json({ voucher });
}
export async function rejectVoucher(req, res) {
  const reason = String(req.body?.reason || "").trim();
  if (!reason) return res.status(400).json({ message: "A rejection reason is required." });
  const voucher = await Voucher.findById(req.params.id);
  if (!voucher) return res.status(404).json({ message: "Voucher not found." });
  if (voucher.status !== "Pending Approval") return res.status(409).json({ message: "Only pending vouchers can be rejected." });
  voucher.status = "Rejected";
  voucher.rejectionReason = reason;
  await voucher.save();
  auditEvent("voucher.rejected", voucher, req.user);
  res.json({ voucher });
}
