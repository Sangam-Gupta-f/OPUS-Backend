import Certificate from "../model/certificate.js";
import generateCertificatePDF from "../utils/generateCertificatePDF.js";
import generateQRCode from "../utils/generateQRCode.js";
// create certificate
export const createCertificate = async (req, res) => {
  try {
    const {
      certificateName,
      certificateId,
      name,
      faterName,
      issuedDate,
      expiryDate,
    } = req.body;
    if (!certificateName || !certificateId || !name || !expiryDate) {
      return res.status(400).json({
        message: "Certificate name, certificate ID, name, are required",
      });
    }
    const existingCertificate = await Certificate.findOne({ certificateId });
    if (existingCertificate) {
      return res.status(400).json({ message: "Certificate ID already exists" });
    }
    // verification url
    const verificationUrl = `${process.env.FRONTEND_URL}/certificate/${certificateId}`;

    // generate qr
    const qrCode = await generateQRCode(verificationUrl);

    // generate pdf
    const pdfBuffer = await generateCertificatePDF({
      certificateName,
      certificateId,
      name,
      faterName,
      issuedDate,
      qrCode,
    });
    if (!pdfBuffer) {
      return res
        .status(500)
        .json({ message: "Error generating certificate PDF" });
    }

    // save certificate
    const certificate = new Certificate({
      certificateName,
      certificateId,
      name,
      faterName,
      issuedDate,
      expiryDate,
      qrCode,
      verificationUrl,
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
