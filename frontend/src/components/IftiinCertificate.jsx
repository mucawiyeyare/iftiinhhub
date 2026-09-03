import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import logoImg from '../assets/logo-transparent.png';

const IftiinCertificate = ({ certificate, isPrintMode = false }) => {
  if (!certificate) return null;

  const {
    studentName = 'Student Name',
    courseTitle = 'Full Stack Web Developer (MERN Stack)',
    issueDate = new Date().toISOString(),
    certificateId = 'IFT-2025-000000',
    instructor = 'Abdirahman Mohamed Ibrahim',
    skills = [],
    grade = null
  } = certificate;

  // Always use the current date dynamically
  const formattedDate = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  // Always use iftiinhub.com domain for QR verification
  const verificationUrl = `https://iftiinhub.com/verify-certificate?id=${encodeURIComponent(certificateId)}`;

  // Clean course title: remove any "Associate" and normalize full-stack
  const rawTitle = (courseTitle || 'Full Stack Web Development')
    .replace(/associate\s*/gi, '')
    .trim();

  const cleanCourseTitle =
    rawTitle.toLowerCase().includes('full') ||
    rawTitle.toLowerCase().includes('stack') ||
    rawTitle.toLowerCase().includes('web')
      ? 'Full Stack Web Development'
      : rawTitle.toLowerCase().includes('data')
      ? 'Data Analysis (Excel & Power BI)'
      : rawTitle;

  // Normalized instructor (ensure fallback to Abdirahman Mohamed Ibrahim if not customized or old team value)
  const displayInstructor =
    instructor && !instructor.includes('Mucawiye')
      ? instructor.replace(/^eng\.\s*/i, '').trim()
      : 'Abdirahman Mohamed Ibrahim';

  // Skills description
  const skillsText = skills && skills.length > 0
    ? skills.join(' • ')
    : 'HTML5, CSS3, Tailwind CSS, JavaScript ES6+, React.js, Node.js, Express & MongoDB Database Architecture';

  return (
    <div
      id={`certificate-${certificateId}`}
      className={`relative w-full max-w-4xl mx-auto aspect-[1.414/1] bg-[#0A0E1A] text-white rounded-3xl shadow-2xl overflow-hidden border-4 border-amber-500/80 selection:bg-amber-500 selection:text-black flex flex-col justify-between p-6 sm:p-10 ${
        isPrintMode ? 'print-certificate-page' : ''
      }`}
      style={{
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 40px rgba(245, 158, 11, 0.15)'
      }}
    >
      {/* ── BACKGROUND GEOMETRIC ACCENTS & DOT MATRIX (Matching PDF Template) ── */}
      
      {/* Top-Left Geometric Gold & Dark Layers */}
      <div className="absolute top-0 left-0 w-64 h-64 pointer-events-none overflow-hidden z-0">
        {/* Layer 1: Dark Slate Polygon */}
        <div
          className="absolute -top-12 -left-12 w-56 h-56 bg-slate-800/90 border-r-4 border-b-4 border-amber-500 transform -rotate-12 shadow-2xl"
          style={{ clipPath: 'polygon(0 0, 100% 0, 80% 100%, 0% 80%)' }}
        ></div>
        {/* Layer 2: Gold Accent Ribbon */}
        <div
          className="absolute -top-6 -left-6 w-44 h-44 bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 transform -rotate-6 opacity-90"
          style={{ clipPath: 'polygon(0 0, 100% 0, 60% 100%, 0% 60%)' }}
        ></div>
        {/* Layer 3: Dark Inner Wedge */}
        <div
          className="absolute -top-2 -left-2 w-32 h-32 bg-[#111827] border-r-2 border-b-2 border-amber-300"
          style={{ clipPath: 'polygon(0 0, 100% 0, 40% 100%, 0% 40%)' }}
        ></div>
        {/* Dot Matrix Texture Overlay */}
        <div className="absolute top-4 left-4 w-32 h-32 bg-[radial-gradient(#94a3b8_1.5px,transparent_1.5px)] [background-size:12px_12px] opacity-40"></div>
      </div>

      {/* Bottom-Right Geometric Gold & Dark Layers */}
      <div className="absolute bottom-0 right-0 w-64 h-64 pointer-events-none overflow-hidden z-0">
        {/* Layer 1: Dark Slate Polygon */}
        <div
          className="absolute -bottom-12 -right-12 w-56 h-56 bg-slate-800/90 border-l-4 border-t-4 border-amber-500 transform -rotate-12 shadow-2xl"
          style={{ clipPath: 'polygon(20% 0%, 100% 0%, 100% 100%, 0% 100%)' }}
        ></div>
        {/* Layer 2: Gold Accent Ribbon */}
        <div
          className="absolute -bottom-6 -right-6 w-44 h-44 bg-gradient-to-tl from-amber-400 via-amber-500 to-amber-600 transform -rotate-6 opacity-90"
          style={{ clipPath: 'polygon(40% 0%, 100% 0%, 100% 100%, 0% 100%)' }}
        ></div>
        {/* Layer 3: Dark Inner Wedge */}
        <div
          className="absolute -bottom-2 -right-2 w-32 h-32 bg-[#111827] border-l-2 border-t-2 border-amber-300"
          style={{ clipPath: 'polygon(60% 0%, 100% 0%, 100% 100%, 0% 100%)' }}
        ></div>
        {/* Dot Matrix Texture Overlay */}
        <div className="absolute bottom-4 right-4 w-32 h-32 bg-[radial-gradient(#94a3b8_1.5px,transparent_1.5px)] [background-size:12px_12px] opacity-40"></div>
      </div>

      {/* Subtle Full Certificate Grid Texture */}
      <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none z-0"></div>

      {/* ── TOP HEADER SECTION: "certificate" Script & Logo Badge ── */}
      <div className="relative z-10 flex items-start justify-between">
        {/* Elegant Gold Cursive Header (Exact match to PDF) */}
        <div className="pt-2 sm:pt-4 pl-2 sm:pl-4">
          <div
            className="text-4xl sm:text-6xl md:text-7xl font-serif text-amber-400 italic tracking-wider select-none"
            style={{
              fontFamily: "'Great Vibes', 'Brush Script MT', 'Dancing Script', 'Caveat', cursive",
              textShadow: '0 2px 8px rgba(245, 158, 11, 0.4), 0 4px 16px rgba(0,0,0,0.8)'
            }}
          >
            certificate
          </div>
        </div>

        {/* Top-Right Circular Golden Logo Badge (Exact match to PDF) */}
        <div className="shrink-0 mt-2 sm:mt-4 mr-2 sm:mr-4">
          <div className="w-16 h-16 sm:w-22 sm:h-22 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500 p-2 sm:p-2.5 border-4 border-amber-200 shadow-xl flex items-center justify-center transform hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center p-1.5 shadow-inner">
              <img
                src={logoImg}
                alt="IftiinHub Logo"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── MIDDLE SECTION 1: STUDENT NAME LINE (Matching second certificate text) ── */}
      <div className="relative z-10 my-2 sm:my-3 max-w-2xl mx-auto w-full px-2 sm:px-6 text-center">
        <p className="text-xs sm:text-sm md:text-base font-semibold text-slate-300 tracking-wider mb-1">
          This Is To Proudly Certify That :
        </p>
        <div className="border-b-2 border-amber-400 pb-1 text-center">
          <span className="text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-wider text-amber-300 font-serif drop-shadow-sm">
            {studentName}
          </span>
        </div>
      </div>

      {/* ── MIDDLE SECTION 2: GOLD BORDERED COURSE & CURRICULUM BOX ── */}
      <div className="relative z-10 max-w-2xl mx-auto w-full px-2 sm:px-4">
        <div className="border-2 border-amber-400 rounded-xl p-3.5 sm:p-5 bg-gradient-to-b from-slate-900/80 via-slate-950/90 to-slate-900/80 shadow-2xl backdrop-blur-xs text-center relative overflow-hidden">
          
          {/* Subtle inner gold glow */}
          <div className="absolute inset-0 bg-amber-500/5 pointer-events-none"></div>

          {/* Congratulatory Lead (Matching second certificate text) */}
          <p className="text-[11px] sm:text-xs md:text-sm font-semibold text-slate-300 tracking-wider mb-1">
            Congratulations on completing
          </p>

          {/* Course Name Header: Only Full Stack Web Development (No Associate) */}
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-amber-400 tracking-wide mb-2 sm:mb-2.5 drop-shadow-sm uppercase">
            {cleanCourseTitle}
          </h2>

          {/* Curriculum Description & Competencies Text */}
          <p className="text-[11px] sm:text-xs md:text-sm text-slate-200 leading-relaxed font-medium max-w-xl mx-auto">
            Has demonstrated academic excellence and practical proficiency in {cleanCourseTitle}. Successfully engineered, tested, and deployed end-to-end full-scale software capstones encompassing {skillsText}.
          </p>

        </div>
      </div>

      {/* ── BOTTOM SECTION: DATE, QR CODE & SIGNATURE (Exact match to PDF) ── */}
      <div className="relative z-10 grid grid-cols-3 gap-2 sm:gap-4 items-end mt-4 sm:mt-6 pt-2">
        
        {/* Left: Date */}
        <div className="text-center sm:text-left flex flex-col items-center sm:items-start">
          <div className="text-xs sm:text-sm md:text-base font-bold text-amber-300 tracking-wide pb-1">
            {formattedDate}
          </div>
          <div className="w-24 sm:w-36 border-b-2 border-slate-400 mb-1"></div>
          <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-white">
            Date
          </span>
          <span className="text-[9px] sm:text-[10px] font-mono text-slate-400 tracking-wider">
            {certificateId}
          </span>
        </div>

        {/* Center: QR Code with "SCAN ME" (Exact match to PDF) */}
        <div className="flex flex-col items-center justify-center">
          <div className="bg-white p-1.5 sm:p-2 rounded-xl shadow-2xl border-2 border-amber-400 transform hover:scale-110 transition-transform duration-200">
            <QRCodeSVG
              value={verificationUrl}
              size={64}
              level="H"
              includeMargin={false}
              className="w-12 h-12 sm:w-16 sm:h-16 md:w-18 md:h-18"
            />
          </div>
          <div className="mt-1 px-2 py-0.5 rounded bg-slate-950 border border-amber-400/60 text-[9px] sm:text-[10px] font-mono font-black text-amber-300 uppercase tracking-wider shadow-xs">
            SCAN ME
          </div>
        </div>

        {/* Right: Signature */}
        <div className="text-center sm:text-right flex flex-col items-center sm:items-end">
          {/* Cursive text-image signature above the name */}
          <div
            className="text-xl sm:text-3xl md:text-4xl text-slate-300 font-serif italic tracking-wide pb-0 drop-shadow-sm leading-tight select-none"
            style={{
              fontFamily: "'Brush Script MT', 'Dancing Script', 'Caveat', 'Great Vibes', cursive",
              filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))',
              opacity: 0.85
            }}
          >
            {displayInstructor}
          </div>
          <div className="w-24 sm:w-36 border-b-2 border-slate-400 mb-1 mt-0.5"></div>
          <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-white">
            {displayInstructor}
          </span>
          <span className="text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
            Academic Director
          </span>
        </div>

      </div>
    </div>
  );
};

export default IftiinCertificate;
