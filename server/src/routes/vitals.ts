import { Router } from "express";
import { getVitals, updateVitals } from "../controllers/vitalsController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

router.get("/", authenticateToken, getVitals);
router.get("/:patientId", authenticateToken, getVitals);
router.post("/", authenticateToken, updateVitals);

export default router;
