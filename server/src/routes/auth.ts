import { Router } from "express";
import { register, login, getMe, getAdminCheck } from "../controllers/authController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/admin-check", getAdminCheck);
router.get("/me", authenticateToken, getMe);

export default router;
