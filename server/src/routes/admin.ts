import { Router } from "express";
import {
  getAdminStats,
  getAdminUsers,
  toggleDoctorApproval,
  deleteUser,
  getAdminAppointments,
  cancelAppointment,
} from "../controllers/adminController";
import { authenticateToken, isAdmin } from "../middleware/auth";

const router = Router();

// Apply auth middleware to all admin routes
router.use(authenticateToken);
router.use(isAdmin);

router.get("/stats", getAdminStats);
router.get("/users", getAdminUsers);
router.put("/doctors/:doctorId/approve", toggleDoctorApproval);
router.delete("/users/:id", deleteUser);
router.get("/appointments", getAdminAppointments);
router.delete("/appointments/:id", cancelAppointment);

export default router;
