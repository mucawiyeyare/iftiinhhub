import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import toast from 'react-hot-toast';

export const downloadCertificateAsPDF = async (certificateId, studentName = 'Student') => {
  const element = document.getElementById(`certificate-${certificateId}`);
  if (!element) {
    toast.error('Certificate preview element not found.');
    return false;
  }

  const toastId = toast.loading('Preparing high-resolution PDF...');

  try {
    const canvas = await html2canvas(element, {
      scale: 3,
      useCORS: true,
      logging: false,
      backgroundColor: '#0d1117'
    });

    const imgData = canvas.toDataURL('image/png', 1.0);
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    pdf.addImage(imgData, 'PNG', 0, 0, 297, 210, undefined, 'FAST');
    const safeName = (studentName || 'Student').trim().replace(/[^a-zA-Z0-9_-]/g, '_');
    pdf.save(`Certificate_${safeName}_${certificateId}.pdf`);

    toast.success('Certificate PDF downloaded!', { id: toastId });
    return true;
  } catch (error) {
    console.error('Error generating certificate PDF:', error);
    toast.error('Failed to generate PDF. Please try Print / Save PDF.', { id: toastId });
    return false;
  }
};

export const downloadCertificateAsImage = async (certificateId, studentName = 'Student') => {
  const element = document.getElementById(`certificate-${certificateId}`);
  if (!element) {
    toast.error('Certificate preview element not found.');
    return false;
  }

  const toastId = toast.loading('Generating high-resolution image...');

  try {
    const canvas = await html2canvas(element, {
      scale: 3,
      useCORS: true,
      logging: false,
      backgroundColor: '#0d1117'
    });

    const imgData = canvas.toDataURL('image/png', 1.0);
    const link = document.createElement('a');
    const safeName = (studentName || 'Student').trim().replace(/[^a-zA-Z0-9_-]/g, '_');
    link.download = `Certificate_${safeName}_${certificateId}.png`;
    link.href = imgData;
    link.click();

    toast.success('Certificate image downloaded!', { id: toastId });
    return true;
  } catch (error) {
    console.error('Error generating certificate image:', error);
    toast.error('Failed to generate image.', { id: toastId });
    return false;
  }
};
