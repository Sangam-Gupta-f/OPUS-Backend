import { Router } from "express";
import {
  createCertificate,
  getAllCertificates,
  getCertificateById,
  downloadCertificate,
} from "../controller/certificate.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import authorize from "../middleware/authorized.middleware.js";

const router = Router();

// Example route for certificate generation
router.post(
  "/generate",
  authMiddleware,
  authorize(["admin"]),
  createCertificate,
);
// Route to get all certificates
router.get("/", authMiddleware, authorize(["admin"]), getAllCertificates);

// Route to get a certificate by ID
router.get("/:id", getCertificateById);

// Route to download certificate PDF
router.get("/:id/download", downloadCertificate);

export default router;
