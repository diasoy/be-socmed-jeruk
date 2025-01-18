// filepath: /c:/Users/user/Documents/ProjectVSCODE/backend-socmed-jeruk/routes/authRoutes.js
import { Router } from "express";
import { register, login } from "../controller/authController.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);

export default router;
