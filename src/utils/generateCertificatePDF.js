import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import path from "path";
import fs from "fs";

const toBase64 = (filePath) => {
  try {
    const data = fs.readFileSync(filePath);
    const ext = path.extname(filePath).slice(1).toLowerCase();
    const mime =
      ext === "svg"
        ? "image/svg+xml"
        : ext === "png"
          ? "image/png"
          : "image/jpeg";
    return `data:${mime};base64,${data.toString("base64")}`;
  } catch {
    return "";
  }
};

const generateCertificatePDF = async ({
  certificateId,
  name,
  faterName,
  issuedDate,
  qrCode,
  internshipStartDate,
  internshipEndDate,
}) => {
  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(),
    headless: chromium.headless,
  });

  const signPath = path.join(process.cwd(), "public", "opus-sign.png");
  const sealPath = path.join(process.cwd(), "public", "opus-seal.png");

  const signBase64 = toBase64(signPath);
  const sealBase64 = toBase64(sealPath);

  const page = await browser.newPage();

  const fmt = (d) =>
    new Date(d).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

  const formattedIssueDate = fmt(issuedDate);
  const formattedStartDate = fmt(internshipStartDate);
  const formattedEndDate = fmt(internshipEndDate);

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"/>
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap" rel="stylesheet"/>
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    width: 1123px;
    height: 794px;
    background: #0c0a06;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Cormorant Garamond', Georgia, serif;
    overflow: hidden;
  }

  /* ── Outermost frame ── */
  .frame-outer {
    width: 1123px;
    height: 794px;
    background: linear-gradient(160deg, #fdf8ee 0%, #f5ead2 40%, #fdf3e0 70%, #ece1c5 100%);
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Ornate multi-layer border */
  .frame-outer::before {
    content: '';
    position: absolute;
    inset: 10px;
    border: 3px solid #8b6914;
    box-shadow: inset 0 0 0 4px #f5ead2, inset 0 0 0 7px #7a5c10, inset 0 0 0 10px #f5ead2;
  }
  .frame-outer::after {
    content: '';
    position: absolute;
    inset: 22px;
    border: 1px solid #c9a84c;
  }

  /* Textured parchment noise overlay */
  .noise {
    position: absolute;
    inset: 0;
    background-image:
      url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 0;
    opacity: 0.5;
  }

  /* Corner ornaments */
  .corner {
    position: absolute;
    width: 90px;
    height: 90px;
    z-index: 2;
  }
  .corner svg { width: 100%; height: 100%; }
  .corner.tl { top: 14px;    left: 14px; }
  .corner.tr { top: 14px;    right: 14px;  transform: scaleX(-1); }
  .corner.bl { bottom: 14px; left: 14px;   transform: scaleY(-1); }
  .corner.br { bottom: 14px; right: 14px;  transform: scale(-1); }

  /* Gold divider line */
  .gold-line {
    width: 520px;
    height: 2px;
    background: linear-gradient(90deg, transparent, #c9a84c 20%, #f5d27a 50%, #c9a84c 80%, transparent);
    margin: 0 auto;
  }
  .gold-line.narrow {
    width: 260px;
    height: 1px;
    opacity: 0.7;
  }

  /* ── Main content ── */
  .content {
    position: relative;
    z-index: 3;
    width: 100%;
    height: 100%;
    padding: 36px 60px 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  /* Logo / org name header */
  .org-header {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 6px;
  }
  .org-name {
    font-family: 'Cinzel', serif;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 5px;
    color: #7a5c10;
    text-transform: uppercase;
  }
  .org-dot {
    width: 5px; height: 5px;
    background: #c9a84c;
    border-radius: 50%;
  }

  /* Title ribbon */
  .ribbon-wrap {
    position: relative;
    margin: 8px 0 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
  }
  .ribbon-wrap::before,
  .ribbon-wrap::after {
    content: '';
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, transparent, #c9a84c);
    margin: 0 18px;
  }
  .ribbon-wrap::after {
    background: linear-gradient(90deg, #c9a84c, transparent);
  }

  .cert-title {
    font-family: 'Cinzel', serif;
    font-size: 38px;
    font-weight: 900;
    color: #5c3d02;
    letter-spacing: 3px;
    text-transform: uppercase;
    line-height: 1;
    text-shadow: 0 1px 2px rgba(100,60,0,0.18);
  }

  .cert-subtitle {
    font-family: 'Cinzel', serif;
    font-size: 11.5px;
    letter-spacing: 6px;
    color: #9a7a30;
    text-transform: uppercase;
    margin: 2px 0 10px;
  }

  /* Presented to */
  .presented {
    font-family: 'Cormorant Garamond', serif;
    font-style: italic;
    font-size: 16px;
    color: #7a6040;
    letter-spacing: 1.5px;
    margin-bottom: 2px;
  }

  /* Recipient name */
  .recipient-name {
    font-family: 'Cinzel', serif;
    font-size: 34px;
    font-weight: 700;
    color: #3b2000;
    letter-spacing: 2px;
    margin: 4px 0 2px;
    text-shadow: 0 1px 0 rgba(200,160,50,0.3);
  }

  /* Father name line */
  .father-line {
    font-family: 'Cormorant Garamond', serif;
    font-style: italic;
    font-size: 15px;
    color: #7a6040;
    margin-bottom: 8px;
  }
  .father-line span {
    font-weight: 600;
    font-style: normal;
    color: #4a2e00;
  }

  /* Body text */
  .body-text {
    font-family: 'Cormorant Garamond', serif;
    font-size: 15.5px;
    color: #3d2800;
    line-height: 1.7;
    text-align: center;
    max-width: 760px;
    margin: 0 auto;
  }
  .body-text strong {
    font-weight: 600;
    color: #5c3300;
  }

  /* ── Bottom three-column section ── */
  .bottom-row {
    margin-top: auto;
    width: 100%;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    padding-top: 10px;
  }

  /* Certificate meta */
  .meta-block {
    width: 210px;
    font-family: 'Cormorant Garamond', serif;
    font-size: 12.5px;
    color: #6b4c1e;
    line-height: 1.9;
  }
  .meta-block .meta-label {
    font-family: 'Cinzel', serif;
    font-size: 8.5px;
    letter-spacing: 2px;
    color: #9a7a30;
    text-transform: uppercase;
    display: block;
    margin-bottom: -1px;
  }
  .meta-block .meta-entry {
    border-bottom: 1px solid #d4b87a44;
    padding-bottom: 3px;
    margin-bottom: 4px;
  }

  /* QR section */
  .qr-block {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }
  .qr-border {
    padding: 6px;
    border: 1.5px solid #c9a84c;
    background: #fffdf5;
    box-shadow: 0 2px 12px rgba(100,70,0,0.12);
  }
  .qr-border img {
    width: 90px;
    height: 90px;
    display: block;
  }
  .qr-caption {
    font-family: 'Cinzel', serif;
    font-size: 7.5px;
    letter-spacing: 2px;
    color: #9a7a30;
    text-transform: uppercase;
    text-align: center;
  }

  /* Signature section */
  .sig-block {
    width: 400px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0;
  }
  .sig-images {
    display: flex;
    align-items: flex-end;
    justify-content: center;
    gap: 10px;
    margin-bottom: -2px;
  }
  .sig-images img.sign {
    height: 120px;
    object-fit: contain;
  }
  .sig-images img.seal {
    height: 150px;
    object-fit: contain;
  }
  .sig-line {
    width: 220px;
    height: 1px;
    background: linear-gradient(90deg, transparent, #b8922e 30%, #b8922e 70%, transparent);
    margin: 4px 0 4px;
  }
  .sig-label {
    font-family: 'Cinzel', serif;
    font-size: 8.5px;
    letter-spacing: 2.5px;
    color: #8b6914;
    text-transform: uppercase;
    text-align: center;
  }
  .sig-sublabel {
    font-family: 'Cormorant Garamond', serif;
    font-style: italic;
    font-size: 11.5px;
    color: #7a6040;
    text-align: center;
  }

  /* Certificate ID badge */
  .id-badge {
    position: absolute;
    top: 32px;
    right: 50px;
    font-family: 'Cinzel', serif;
    font-size: 9px;
    letter-spacing: 1.5px;
    color: #9a7a30;
    text-transform: uppercase;
    z-index: 5;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 1px;
  }
  .id-badge .id-label { color: #c0a060; font-size: 7px; letter-spacing: 2px; }

  /* Gold stars decorative row */
  .star-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 4px 0;
    color: #c9a84c;
    font-size: 10px;
    letter-spacing: 4px;
  }
</style>
</head>
<body>
<div class="frame-outer">
  <div class="noise"></div>

  <!-- Corner ornaments -->
  ${["tl", "tr", "bl", "br"]
    .map(
      (cls) => `
  <div class="corner ${cls}">
    <svg viewBox="0 0 90 90" xmlns="http://www.w3.org/2000/svg">
      <g fill="none" stroke="#b8922e" stroke-width="1.2">
        <path d="M5,5 L5,35 Q5,5 35,5 Z" stroke-width="1"/>
        <path d="M5,5 L5,40" stroke-width="2"/>
        <path d="M5,5 L40,5" stroke-width="2"/>
        <circle cx="5" cy="5" r="3" fill="#c9a84c" stroke="none"/>
        <path d="M18,5 Q18,18 5,18" stroke-width="1" opacity="0.6"/>
        <path d="M5,28 L5,5 L28,5" stroke-width="0.7" opacity="0.5"/>
        <!-- flourish -->
        <path d="M10,10 C14,14 20,10 22,16 S28,22 24,26" stroke-width="0.8" opacity="0.7"/>
        <path d="M10,10 C10,14 14,20 16,22 S22,28 26,24" stroke-width="0.8" opacity="0.7"/>
        <circle cx="22" cy="22" r="1.5" fill="#c9a84c" stroke="none" opacity="0.6"/>
      </g>
    </svg>
  </div>`,
    )
    .join("")}

  <!-- ID Badge -->
  <div class="id-badge">
    <span class="id-label">Certificate No.</span>
    <span>${certificateId}</span>
  </div>

  <div class="content">

    <!-- Org header -->
    <div class="org-header">
      <div class="gold-line narrow"></div>
      <div class="org-dot"></div>
      <span class="org-name">Opus Social Foundation</span>
      <div class="org-dot"></div>
      <div class="gold-line narrow"></div>
    </div>

    <!-- Title -->
    <div class="ribbon-wrap">
      <span class="cert-title">Certificate of Internship</span>
    </div>
    <div class="cert-subtitle">Excellence &nbsp;·&nbsp; Dedication &nbsp;·&nbsp; Achievement</div>

    <div class="gold-line"></div>

    <div class="star-row">★ &nbsp; ★ &nbsp; ★</div>

    <!-- Recipient -->
    <div class="presented">This certificate is proudly presented to</div>
    <div class="recipient-name">${name}</div>
    <div class="father-line">Son / Daughter of &nbsp;<span>${faterName || "N/A"}</span></div>

    <div class="gold-line" style="width:320px; margin:6px auto;"></div>

    <!-- Body -->
    <div class="body-text">
      has successfully completed a <strong>120-Hour Internship Programme</strong> under the curriculum of<br/>
      <strong>Social Work &amp; Human Management</strong> at
      <strong>Opus Social Foundation, District Centre Jaipur</strong>,<br/>
      carried out from <strong>${formattedStartDate}</strong> to <strong>${formattedEndDate}</strong>.<br/>
      Throughout the programme, the intern demonstrated outstanding dedication, discipline,<br/>
      and professional commitment in completing all assigned project-based tasks.
    </div>

    <!-- Bottom row -->
    <div class="bottom-row">

      <!-- Meta details -->
      <div class="meta-block">
        <div class="meta-entry"><span class="meta-label">Certificate ID</span>${certificateId}</div>
        <div class="meta-entry"><span class="meta-label">Date of Issue</span>${formattedIssueDate}</div>
        <div class="meta-entry"><span class="meta-label">Duration</span>120 Hours</div>
        <div class="meta-entry"><span class="meta-label">Program</span>Social Work &amp; Human Mgmt.</div>
        <div class="meta-entry"><span class="meta-label">Centre</span>District Jaipur</div>
      </div>

      <!-- QR Code -->
      <div class="qr-block">
        <div class="qr-border">
          <img src="${qrCode}" alt="QR Code"/>
        </div>
        <span class="qr-caption">Scan to Verify</span>
      </div>

      <!-- Signature + Seal -->
      <div class="sig-block">
        <div class="sig-images">
          ${signBase64 ? `<img class="sign" src="${signBase64}" alt="Signature"/>` : ""}
          ${sealBase64 ? `<img class="seal" src="${sealBase64}" alt="Official Seal"/>` : ""}
        </div>
        <div class="sig-line"></div>
        <div class="sig-label">Authorized Signatory</div>
        <div class="sig-sublabel">Opus Social Foundation</div>
      </div>

    </div>
  </div>
</div>
</body>
</html>`;

  await page.setContent(html, { waitUntil: "networkidle0" });

  const pdfBuffer = await page.pdf({
    width: "1123px",
    height: "794px",
    printBackground: true,
  });

  await browser.close();
  return pdfBuffer;
};

export default generateCertificatePDF;
