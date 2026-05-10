import { Router } from "express";
import { createUser, loginUser } from "../controller/user.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import authorize from "../middleware/authorized.middleware.js";

const router = Router();

router.post("/register", authMiddleware, authorize(["admin"]), createUser);
router.post("/login", loginUser);

export default router;
