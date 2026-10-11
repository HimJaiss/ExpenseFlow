import bcrypt from "bcryptjs";
import connectDB from "../src/config/db.js";
import User from "../src/models/User.js";
import Voucher from "../src/models/Voucher.js";

await connectDB();
await User.deleteMany({});
await Voucher.deleteMany({});
const password = await bcrypt.hash("Demo@123", 12);
const [employee, employee2, director, accounts] = await User.create([
  { name: "Aarav Sharma", email: "employee@expenseflow.demo", password, role: "employee", department: "Engineering", employeeId: "EMP-1024" },
  { name: "Ananya Patel", email: "ananya@expenseflow.demo", password, role: "employee", department: "Marketing", employeeId: "EMP-1038" },
  { name: "Rohan Mehta", email: "director@expenseflow.demo", password, role: "director", department: "Leadership", employeeId: "DIR-001" },
  { name: "Priya Nair", email: "accounts@expenseflow.demo", password, role: "accounts", department: "Finance", employeeId: "ACC-004" }
]);
const now = new Date();
const day = (n) => new Date(now.getTime() - n * 86400000);
const sample = [
  { voucherNumber: `EXP-${now.getFullYear()}-0001`, expenseDate: day(2), department: "Engineering", title: "Client visit — Pune to Mumbai", category: "Travel", description: "Round-trip train tickets for client architecture workshop.", amount: 4850, employee, employeeName: employee.name, employeeId: employee.employeeId, employeeSignature: "/uploads/demo-employee-signature.svg", status: "Pending Approval", submittedAt: day(1) },
  { voucherNumber: `EXP-${now.getFullYear()}-0002`, expenseDate: day(4), department: "Marketing", title: "Campaign planning lunch", category: "Meals", description: "Team lunch during quarterly campaign planning.", amount: 3260, employee: employee2, employeeName: employee2.name, employeeId: employee2.employeeId, employeeSignature: "/uploads/demo-employee-signature.svg", status: "Pending Approval", submittedAt: day(3) },
  { voucherNumber: `EXP-${now.getFullYear()}-0003`, expenseDate: day(8), department: "Engineering", title: "Development tool subscription", category: "Software", description: "Monthly testing and collaboration software.", amount: 2199, employee, employeeName: employee.name, employeeId: employee.employeeId, employeeSignature: "/uploads/demo-employee-signature.svg", directorSignature: "/uploads/demo-director-signature.svg", status: "Approved", approvalDate: day(6), approvedBy: director },
  { voucherNumber: `EXP-${now.getFullYear()}-0004`, expenseDate: day(1), department: "Engineering", title: "USB-C hub and adapters", category: "Office Supplies", description: "Adapters for shared demo workstation.", amount: 1890, employee, employeeName: employee.name, employeeId: employee.employeeId, status: "Draft" },
  { voucherNumber: `EXP-${now.getFullYear()}-0005`, expenseDate: day(12), department: "Marketing", title: "Hotel for regional event", category: "Accommodation", description: "Overnight stay for regional partner event.", amount: 7200, employee: employee2, employeeName: employee2.name, employeeId: employee2.employeeId, employeeSignature: "/uploads/demo-employee-signature.svg", status: "Rejected", rejectionReason: "Please attach the itemized invoice and resubmit with a clearer breakdown.", submittedAt: day(11) },
  { voucherNumber: `EXP-${now.getFullYear()}-0006`, expenseDate: day(5), department: "Engineering", title: "Customer workshop refreshments", category: "Meals", description: "Refreshments for an on-site customer workshop.", amount: 1450, employee, employeeName: employee.name, employeeId: employee.employeeId, employeeSignature: "/uploads/demo-employee-signature.svg", directorSignature: "/uploads/demo-director-signature.svg", status: "Approved", approvalDate: day(4), approvedBy: director }
];
await Voucher.insertMany(sample);
console.log("Seed complete. Demo password: Demo@123");
console.log("Employee: employee@expenseflow.demo | Director: director@expenseflow.demo | Accounts: accounts@expenseflow.demo");
process.exit(0);
