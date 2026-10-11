import { z } from "zod";
export const voucherSchema = z.object({
  expenseDate: z.string().min(1, "Expense date is required."),
  department: z.string().trim().min(1, "Department is required."),
  title: z.string().trim().min(2, "Expense title must be at least 2 characters."),
  category: z.enum(["Travel", "Meals", "Office Supplies", "Accommodation", "Software", "Client Meeting", "Utilities", "Other"]),
  description: z.string().optional().default(""),
  amount: z.coerce.number().positive("Amount must be greater than zero.")
});
