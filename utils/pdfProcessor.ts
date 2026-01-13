import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

/**
 * Adds page numbers to the bottom right of every page in a PDF.
 * @param pdfBuffer The array buffer of the input PDF.
 * @returns A Promise resolving to the Uint8Array of the modified PDF.
 */
export async function processPdf(pdfBuffer: ArrayBuffer): Promise<Uint8Array> {
  // Load the PDF document
  const pdfDoc = await PDFDocument.load(pdfBuffer);

  // Embed the Helvetica font
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Get all pages
  const pages = pdfDoc.getPages();

  // Configuration for the page number
  const fontSize = 9;
  const color = rgb(0.2, 0.2, 0.2); // Dark grey, slightly softer than pure black
  const marginRight = 15; // Distance from right edge
  const marginBottom = 10; // Distance from bottom edge

  // Iterate through pages and draw text
  pages.forEach((page, idx) => {
    const { width } = page.getSize();
    const pageNumberText = `${idx + 1}`;
    
    // Calculate text width to align it properly to the right
    const textWidth = helveticaFont.widthOfTextAtSize(pageNumberText, fontSize);
    
    const xPosition = width - marginRight - textWidth;
    const yPosition = marginBottom;

    page.drawText(pageNumberText, {
      x: xPosition,
      y: yPosition,
      size: fontSize,
      font: helveticaFont,
      color: color,
    });
  });

  // Serialize the PDFDocument to bytes (a Uint8Array)
  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}