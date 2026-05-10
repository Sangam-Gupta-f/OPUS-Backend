import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";

const generateCertificatePDF = async ({
  certificateName,
  certificateId,
  name,
  faterName,
  issuedDate,
  qrCode,
}) => {
  const browser = await puppeteer.launch({
    headless: true,
  });

  const page = await browser.newPage();

  const html = `
    <html>
      <body
        style="
          font-family: Arial;
          padding: 50px;
          text-align: center;
          border: 10px solid #0f172a;
        "
      >
        <h1>${certificateName}</h1>

        <h2>${name}</h2>

        <p>Father Name: ${faterName || ""}</p>

        <p>Certificate ID: ${certificateId}</p>

        <p>
          Issued Date:
          ${new Date(issuedDate).toDateString()}
        </p>

        <img
          src="${qrCode}"
          width="150"
          height="150"
        />

        <p>
          Scan QR to verify certificate
        </p>
      </body>
    </html>
  `;

  await page.setContent(html);

  const pdfBuffer = await page.pdf({
    format: "A4",
  });

  await browser.close();

  return pdfBuffer;
};

export default generateCertificatePDF;
