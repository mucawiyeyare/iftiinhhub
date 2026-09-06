import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";
import toast from "react-hot-toast";

/**
 * Helper to wait for DOM element to exist
 */
const waitForElement = (id, maxAttempts = 15, delay = 100) => {
  return new Promise((resolve) => {
    let attempts = 0;
    const check = () => {
      const el = document.getElementById(id);
      if (el) return resolve(el);
      attempts++;
      if (attempts >= maxAttempts) return resolve(null);
      setTimeout(check, delay);
    };
    check();
  });
};

export const downloadCertificateAsPDF = async (
  certificateId,
  studentName = "Student",
) => {
  const targetId = `certificate-${certificateId}`;
  let element = document.getElementById(targetId);

  if (!element) {
    element = await waitForElement(targetId);
  }

  if (!element) {
    toast.error("Opening browser print view for PDF...");
    window.print();
    return false;
  }

  const toastId = toast.loading("Generating PDF certificate...");

  try {
    const dataUrl = await toPng(element, {
      quality: 0.95,
      pixelRatio: 2,
      cacheBust: false,
      backgroundColor: "#0d1117",
      skipFonts: true,
      filter: (node) => {
        return !node.classList || !node.classList.contains("no-print");
      },
    });

    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    pdf.addImage(dataUrl, "PNG", 0, 0, 297, 210, undefined, "FAST");
    const safeName = (studentName || "Student")
      .trim()
      .replace(/[^a-zA-Z0-9_-]/g, "_");
    pdf.save(`Certificate_${safeName}_${certificateId}.pdf`);

    toast.success("Certificate PDF downloaded!", { id: toastId });
    return true;
  } catch (error) {
    console.warn("Direct PDF generation fallback:", error);
    toast.dismiss(toastId);
    window.print();
    return false;
  }
};

export const downloadCertificateAsImage = async (
  certificateId,
  studentName = "Student",
) => {
  const targetId = `certificate-${certificateId}`;
  let element = document.getElementById(targetId);

  if (!element) {
    element = await waitForElement(targetId);
  }

  if (!element) {
    toast.error("Certificate element not found.");
    return false;
  }

  const toastId = toast.loading("Generating PNG image...");

  try {
    const dataUrl = await toPng(element, {
      quality: 0.95,
      pixelRatio: 2,
      cacheBust: false,
      backgroundColor: "#0d1117",
      skipFonts: true,
      filter: (node) => {
        return !node.classList || !node.classList.contains("no-print");
      },
    });

    const link = document.createElement("a");
    const safeName = (studentName || "Student")
      .trim()
      .replace(/[^a-zA-Z0-9_-]/g, "_");
    link.download = `Certificate_${safeName}_${certificateId}.png`;
    link.href = dataUrl;
    link.click();

    toast.success("Certificate image downloaded!", { id: toastId });
    return true;
  } catch (error) {
    console.warn("PNG generation fallback:", error);
    toast.error("Opening browser print view instead...", { id: toastId });
    setTimeout(() => window.print(), 300);
    return false;
  }
};
