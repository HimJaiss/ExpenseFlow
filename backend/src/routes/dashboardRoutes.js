import { Router } from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import { dashboard } from "../controllers/dashboardController.js";
const router = Router();
router.get("/", authenticate, dashboard);
export default router;
