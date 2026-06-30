import { Router } from "express";
import { bookAppointment, getAppointments, updateAppointmentStatus } from "../controllers/appointmentController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

router.post("/", authenticateToken, bookAppointment);
router.get("/", authenticateToken, getAppointments);
router.put("/:id/status", authenticateToken, updateAppointmentStatus);

export default router;
