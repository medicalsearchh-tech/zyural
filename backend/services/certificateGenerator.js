// services/certificateGenerator.js - SIMPLE VERSION
const PDFDocument = require('pdfkit');
const puppeteer = require('puppeteer');
const cloudinary = require('cloudinary').v2;
const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
const os = require('os');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

class CertificateGenerator {
  constructor() {
    this.tempDir = process.env.TEMP_UPLOAD_DIR || path.join(os.tmpdir(), 'certificates');
    this.ensureTempDir();
  }

  ensureTempDir() {
    if (!fsSync.existsSync(this.tempDir)) {
      fsSync.mkdirSync(this.tempDir, { recursive: true });
    }
  }

  async generateCertificate(template, certificateData) {
    try {
      console.log('Starting certificate generation...');

      // Generate HTML template
      const html = this.generateHTMLTemplate(template, certificateData);

      // Generate both image and PDF
      const [imageResult, pdfResult] = await Promise.all([
        this.generateImageFromHTML(html, template, certificateData),
        this.generatePDFFromHTML(template, certificateData)
      ]);

      return {
        imageUrl: imageResult.url,
        pdfUrl: pdfResult.url,
        success: true
      };
    } catch (error) {
      console.error('Certificate generation error:', error);
      throw new Error(`Certificate generation failed: ${error.message}`);
    }
  }

  generateHTMLTemplate(template, certificateData) {
    const { width, height } = template.designConfig.canvas;
    const elements = template.designConfig.elements || [];

    let elementsHTML = '';
    for (const element of elements) {
      const content = this.getElementContent(element, certificateData);
      const style = element.style || {};

      elementsHTML += `
        <div style="
          position: absolute;
          left: ${element.position.x}%;
          top: ${element.position.y}%;
          transform: translate(-50%, -50%);
          font-family: '${style.fontFamily || 'Arial'}', sans-serif;
          font-size: ${style.fontSize || 24}px;
          font-weight: ${style.fontWeight || 'normal'};
          color: ${style.color || '#000000'};
          text-align: ${style.textAlign || 'left'};
          max-width: ${style.maxWidth || 500}px;
          opacity: ${style.opacity !== undefined ? style.opacity : 1};
          word-wrap: break-word;
          padding: 0 10px;
          box-sizing: border-box;
        ">
          ${this.escapeHtml(content)}
        </div>
      `;
    }

    const backgroundStyle = template.backgroundImageUrl
      ? `background: url('${template.backgroundImageUrl}') center/cover no-repeat;`
      : `background-color: ${template.designConfig.canvas.backgroundColor || '#FFFFFF'};`;

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <link href="https://fonts.googleapis.com/css2?family=Arial:wght@400;700&family=Roboto:wght@400;700&family=Georgia:wght@400;700&display=swap" rel="stylesheet">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { margin: 0; padding: 0; }
          .certificate {
            width: ${width}px;
            height: ${height}px;
            position: relative;
            ${backgroundStyle}
            display: flex;
            align-items: center;
            justify-content: center;
          }
        </style>
      </head>
      <body>
        <div class="certificate">
          ${elementsHTML}
        </div>
      </body>
      </html>
    `;
  }

  async generateImageFromHTML(html, template, certificateData) {
    let browser;
    try {
      console.log('Launching Puppeteer...');
      browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });

      const page = await browser.newPage();
      const { width, height } = template.designConfig.canvas;

      await page.setViewport({ width, height, deviceScaleFactor: 2 });
      await page.setContent(html, { waitUntil: 'networkidle0' });

      const filename = `cert-${certificateData.certificateNumber}-${Date.now()}.png`;
      const filepath = path.join(this.tempDir, filename);

      console.log('Taking screenshot...');
      await page.screenshot({ path: filepath, fullPage: true });

      console.log('Uploading image to Cloudinary...');
      const uploadResult = await this.uploadToCloudinary(filepath, 'image');

      // Clean up
      await fs.unlink(filepath).catch(() => {});

      return {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id
      };
    } catch (error) {
      console.error('Image generation error:', error);
      throw error;
    } finally {
      if (browser) await browser.close();
    }
  }

  async generatePDFFromHTML(template, certificateData) {
    return new Promise((resolve, reject) => {
      try {
        const { width, height } = template.designConfig.canvas;
        const filename = `cert-${certificateData.certificateNumber}-${Date.now()}.pdf`;
        const filepath = path.join(this.tempDir, filename);

        const doc = new PDFDocument({
          size: [width, height],
          margin: 0
        });

        const writeStream = fsSync.createWriteStream(filepath);

        doc.on('error', (err) => {
          writeStream.destroy();
          reject(err);
        });

        writeStream.on('error', (err) => {
          reject(err);
        });

        doc.pipe(writeStream);

        // Draw background color
        doc.rect(0, 0, width, height)
          .fill(template.designConfig.canvas.backgroundColor || '#FFFFFF');

        // Add background image if exists
        if (template.backgroundImageUrl) {
          try {
            doc.image(template.backgroundImageUrl, 0, 0, {
              width: width,
              height: height
            });
          } catch (imgErr) {
            console.warn('Could not add background image to PDF:', imgErr.message);
          }
        }

        // Add elements as text
        const elements = template.designConfig.elements || [];
        for (const element of elements) {
          const content = this.getElementContent(element, certificateData);
          const style = element.style || {};

          const posX = (element.position.x / 100) * width;
          const posY = (element.position.y / 100) * height;

          try {
            // Use built-in fonts only (no custom font loading)
            const fontName = this.getPDFSafeFont(style.fontFamily);
            doc.font(fontName, style.fontWeight === 'bold' ? 'bold' : 'normal');
            doc.fontSize(style.fontSize || 24);
            doc.fillColor(style.color || '#000000');

            doc.text(content, posX - 100, posY, {
              width: (style.maxWidth || 300),
              align: style.textAlign || 'left',
              lineGap: 5
            });
          } catch (textErr) {
            console.warn('Error adding text to PDF:', textErr.message);
          }
        }

        doc.end();

        writeStream.on('finish', async () => {
          try {
            console.log('Uploading PDF to Cloudinary...');
            const uploadResult = await this.uploadToCloudinary(filepath, 'application/pdf');

            // Clean up
            await fs.unlink(filepath).catch(() => {});

            resolve({
              url: uploadResult.secure_url,
              publicId: uploadResult.public_id
            });
          } catch (uploadErr) {
            reject(uploadErr);
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  getPDFSafeFont(fontFamily) {
    // PDFKit built-in fonts only
    const fontMap = {
      'Arial': 'Helvetica',
      'Times New Roman': 'Times-Roman',
      'Georgia': 'Times-Roman',
      'Courier': 'Courier',
      'Roboto': 'Helvetica',
      'Montserrat': 'Helvetica',
      'Open Sans': 'Helvetica',
      'Helvetica': 'Helvetica'
    };

    return fontMap[fontFamily] || 'Helvetica';
  }

  getElementContent(element, certificateData) {
    if (element.type === 'dynamic-field' && element.fieldType) {
      return String(certificateData[element.fieldType] || element.fieldType);
    }
    return String(element.content || '');
  }

  escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return String(text).replace(/[&<>"']/g, (m) => map[m]);
  }

  async uploadToCloudinary(filepath, resourceType = 'auto') {
    try {
      console.log(`Uploading ${filepath} to Cloudinary...`);

      const result = await cloudinary.uploader.upload(filepath, {
        folder: 'certificates',
        resource_type: resourceType === 'application/pdf' ? 'raw' : 'image',
        use_filename: true,
        unique_filename: true
      });

      console.log('Upload successful:', result.public_id);
      return result;
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw new Error(`Cloudinary upload failed: ${error.message}`);
    }
  }

  async deleteCertificateFromCloud(publicId) {
    try {
      if (!publicId) return;
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error('Error deleting from Cloudinary:', error);
    }
  }
}

module.exports = new CertificateGenerator();