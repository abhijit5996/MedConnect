import { Router } from "express";
import { getDoctors, getDoctorProfile, updateDoctorProfile } from "../controllers/doctorController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

router.get("/", getDoctors);
router.get("/profile", authenticateToken, getDoctorProfile);
router.get("/profile/:id", getDoctorProfile);
router.put("/profile", authenticateToken, updateDoctorProfile);

export default router;
