import Certificate from "../model/certificate.js";
import generateCertificatePDF from "../utils/generateCertificatePDF.js";
import generateQRCode from "../utils/generateQRCode.js";
// create certificate
export const createCertificate = async (req, res) => {
  try {
    const {
      certificateId,
      enrollmentNumber,
      rollNumber,
      name,
      fatherName,
      issuedDate,
      internshipStartDate,
      internshipEndDate,
      collegeName,
    } = req.body;
    if (
      !certificateId ||
      !name ||
      !enrollmentNumber ||
      !rollNumber ||
      !internshipStartDate ||
      !internshipEndDate ||
      !collegeName
    ) {
      return res.status(400).json({
        message:
          "Certificate name, certificate ID, enrollment number, roll number, internship start date, internship end date, and college name are required",
      });
    }
    const existingCertificate = await Certificate.findOne({ certificateId });
    if (existingCertificate) {
      return res.status(400).json({ message: "Certificate ID already exists" });
    }
    // verification url
    const verificationUrl = `${process.env.FRONTEND_URL}/verify/${certificateId}`;

    // generate qr
    const qrCode = await generateQRCode(verificationUrl);
    if (!qrCode) {
      return res.status(500).json({ message: "Error generating QR code" });
    }

    const certificate = new Certificate({
      certificateId,
      enrollmentNumber,
      rollNumber,
      name,
      fatherName,
      issuedDate,
      qrCode,
      verificationUrl,
      internshipStartDate,
      internshipEndDate,
      collegeName,
      timing: `7 AM - 1 PM`,
      shedule: `6 Hours Daily`,
      internshipHours: 120,
    });
    await certificate.save();

    return res.status(201).json({
      message: "Certificate created successfully",
      certificate,
    });
  } catch (error) {
    console.error("CREATE CERTIFICATE ERROR:", error);

    return res.status(500).json({
      message: "Error creating certificate",
      error: error.message,
      stack: error.stack,
    });
  }
};

// get all certificates
export const getAllCertificates = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const pageNumber = parseInt(page) || 1;
    const pageSize = parseInt(limit) || 10;
    const skip = (pageNumber - 1) * pageSize;
    const totalCertificates = await Certificate.countDocuments();
    const totalPages = Math.ceil(totalCertificates / pageSize);
    const certificates = await Certificate.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize)
      .exec();
    res.status(200).json({
      data: certificates,
      pagination: {
        currentPage: pageNumber,
        pageSize,
        totalCertificates,
        totalPages,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching certificates", error });
  }
};

export const getAllStudents = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const pageNumber = parseInt(page) || 1;
    const pageSize = parseInt(limit) || 10;
    const skip = (pageNumber - 1) * pageSize;
    const totalStudents = await Certificate.countDocuments();
    const totalPages = Math.ceil(totalStudents / pageSize);
    const students = await Certificate.find()
      .select("name certificateId fatherName collegeName")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize)
      .exec();
    res.status(200).json({
      data: students,
      pagination: {
        currentPage: pageNumber,
        pageSize,
        totalStudents,
        totalPages,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching students", error });
  }
};

// get certificate by id
export const getCertificateById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: "Certificate ID is required" });
    }
    const certificate = await Certificate.findOne({
      certificateId: id,
    });
    if (!certificate) {
      return res.status(404).json({ message: "Certificate not found" });
    }
    res.status(200).json(certificate);
  } catch (error) {
    res.status(500).json({ message: "Error fetching certificate", error });
  }
};

// delete certificate
export const deleteCertificate = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: "Certificate ID is required" });
    }
    const certificate = await Certificate.findOneAndDelete({
      _id: id,
    });
    if (!certificate) {
      return res.status(404).json({ message: "Certificate not found" });
    }
    res.status(200).json({ message: "Certificate deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting certificate", error });
  }
};

export const downloadCertificate = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: "Certificate ID is required" });
    }
    const certificate = await Certificate.findOne({
      certificateId: id,
    });
    if (!certificate) {
      return res.status(404).json({ message: "Certificate not found" });
    }
    const pdfBuffer = await generateCertificatePDF(certificate);
    if (!pdfBuffer) {
      return res
        .status(500)
        .json({ message: "Error generating certificate PDF" });
    }
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=${certificate.certificateId}.pdf`,
    });
    return res.send(pdfBuffer);
  } catch (error) {
    res.status(500).json({ message: "Error downloading certificate", error });
  }
};
