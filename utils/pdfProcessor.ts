import { PDFDocument, StandardFonts, rgb, grayscale } from 'pdf-lib';

export type ProcessMode = 'add' | 'remove';

/**
 * Adds or removes page numbers in a PDF.
 * @param pdfBuffer The array buffer of the input PDF.
 * @param mode The operation mode ('add' or 'remove').
 * @returns A Promise resolving to the Uint8Array of the modified PDF.
 */
export async function processPdf(pdfBuffer: ArrayBuffer, mode: ProcessMode): Promise<Uint8Array> {
  // Load the PDF document
  const pdfDoc = await PDFDocument.load(pdfBuffer);
  const pages = pdfDoc.getPages();

  if (mode === 'add') {
    // Embed the Helvetica font
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

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
  } else {
    // Remove mode: Mask the bottom right corner with a white rectangle
    // This assumes the background is white, which is standard for documents.
    const maskWidth = 70; // Sufficient width to cover typical page numbers
    const maskHeight = 35; // Sufficient height for bottom margin
    
    pages.forEach((page) => {
      const { width } = page.getSize();
      
      page.drawRectangle({
        x: width - maskWidth,
        y: 0,
        width: maskWidth,
        height: maskHeight,
        color: grayscale(1), // White
        opacity: 1,
      });
    });
  }

  // Serialize the PDFDocument to bytes (a Uint8Array)
  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}