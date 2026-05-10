import { Router } from "express";
import { createCertificate } from "../controller/certificate.controller.js";
import authMiddleware from "../middleware/auth.Middleware.js";
import authorize from "../middleware/authorized.middleware.js";

const router = Router();

// Example route for certificate generation
router.post(
  "/generate",
  authMiddleware,
  authorize(["admin"]),
  createCertificate,
);

export default router;
