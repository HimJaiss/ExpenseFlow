import app from "./app.js";
import connectDB from "./config/db.js";
import { env } from "./config/env.js";
try {
  await connectDB();
  app.listen(env.port, () => console.log(`ExpenseFlow API listening at http://localhost:${env.port}`));
} catch (error) {
  console.error("Unable to start API:", error.message);
  process.exit(1);
}
