import Certificate from "../model/certificate.js";
import generateCertificatePDF from "../utils/generateCertificatePDF.js";
import generateQRCode from "../utils/generateQRCode.js";
// create certificate
export const createCertificate = async (req, res) => {
  try {
    const {
      certificateId,
      name,
      faterName,
      issuedDate,
      expiryDate,
      internshipStartDate,
      internshipEndDate,
    } = req.body;
    if (
      !certificateId ||
      !name ||
      !expiryDate ||
      !internshipStartDate ||
      !internshipEndDate
    ) {
      return res.status(400).json({
        message:
          "Certificate name, certificate ID, name, and expiry date are required",
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

    // generate pdf
    const pdfBuffer = await generateCertificatePDF({
      certificateId,
      name,
      faterName,
      issuedDate,
      qrCode,
      internshipStartDate,
      internshipEndDate,
    });
    if (!pdfBuffer) {
      return res
        .status(500)
        .json({ message: "Error generating certificate PDF" });
    }

    // save certificate
    const certificate = new Certificate({
      certificateId,
      name,
      faterName,
      issuedDate,
      expiryDate,
      qrCode,
      verificationUrl,
      internshipStartDate,
      internshipEndDate,
    });
    await certificate.save();

    res.set({
      "Content-Type": "application/pdf",

      "Content-Disposition": `attachment; filename=${certificateId}.pdf`,
    });

    return res.send(pdfBuffer);
  } catch (error) {
    res.status(500).json({ message: "Error creating certificate", error });
  }
};

// get all certificates
export const getAllCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find()
      .sort({ createdAt: -1 })
      .exec();
    res.status(200).json(certificates);
  } catch (error) {
    res.status(500).json({ message: "Error fetching certificates", error });
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
      certificateId: id,
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
