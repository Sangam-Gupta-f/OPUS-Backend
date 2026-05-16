import { Router } from "express";
import {
  createCertificate,
  getAllCertificates,
  getCertificateById,
  downloadCertificate,
  deleteCertificate,
  getAllStudents,
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

// get all students
router.get("/students", getAllStudents);
// Route to get a certificate by ID
router.get("/:id", getCertificateById);

// Route to download certificate PDF
router.get("/:id/download", downloadCertificate);

// Route to delete a certificate
router.delete("/:id", authMiddleware, authorize(["admin"]), deleteCertificate);

export default router;
