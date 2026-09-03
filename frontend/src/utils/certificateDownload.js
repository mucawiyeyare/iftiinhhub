import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/**
 * Downloads a DOM element as a high-resolution landscape PDF certificate
 * @param {string} elementId - The DOM element ID to render (e.g. `certificate-${id}`)
 * @param {string} filename - Target PDF file name
 */
export const downloadCertificateAsPDF = async (elementId, filename = 'IftiinHub-Certificate.pdf') => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error('Certificate element not found:', elementId);
    window.print();
    return;
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 3, // High-DPI crisp export
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#0A0E1A',
      logging: false,
      windowWidth: 1200
    });

    const imgData = canvas.toDataURL('image/png', 1.0);

    // Standard A4 landscape dimensions in mm: 297 x 210
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
    pdf.save(filename.endsWith('.pdf') ? filename : `${filename}.pdf`);
    return true;
  } catch (error) {
    console.error('Failed to generate PDF download via canvas, falling back to print dialog:', error);
    window.print();
    return false;
  }
};

/**
 * Downloads a DOM element as a high-resolution PNG image
 * @param {string} elementId - The DOM element ID to render
 * @param {string} filename - Target image file name
 */
export const downloadCertificateAsPNG = async (elementId, filename = 'IftiinHub-Certificate.png') => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error('Certificate element not found:', elementId);
    return;
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 3,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#0A0E1A',
      logging: false,
      windowWidth: 1200
    });

    const link = document.createElement('a');
    link.download = filename.endsWith('.png') ? filename : `${filename}.png`;
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
    return true;
  } catch (error) {
    console.error('Failed to generate PNG image:', error);
    return false;
  }
};
