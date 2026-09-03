import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import logoImg from '../assets/logo-transparent.png';
import signatureImg from '../assets/signature-transparent.png';

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
      className={`relative w-full max-w-4xl mx-auto min-h-[490px] sm:min-h-0 sm:aspect-[1.414/1] bg-[#0d1117] text-white rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden selection:bg-amber-500 selection:text-black flex flex-col justify-between p-3.5 sm:p-7 md:p-10 transition-all duration-200 ${
        isPrintMode ? 'print-certificate-page' : ''
      }`}
      style={{
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 40px rgba(212, 175, 55, 0.15)'
      }}
    >
      {/* ── BACKGROUND VECTOR ART (Exact match to certificate Iftiin Hub (1).pdf) ── */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
        viewBox="0 0 1000 707"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          {/* Gold polka dots pattern */}
          <pattern id="goldDotsPattern" x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse">
            <circle cx="3" cy="3" r="1.5" fill="#d4af37" fillOpacity="0.75" />
          </pattern>

          {/* Soft drop shadow for layered curved cards */}
          <filter id="cornerCardShadow" x="-20%" y="-20%" width="150%" height="150%">
            <feDropShadow dx="4" dy="6" stdDeviation="8" floodColor="#000000" floodOpacity="0.8" />
          </filter>
        </defs>

        {/* Outer Inset Gold Border (frames the entire certificate canvas) */}
        <rect
          x="26"
          y="26"
          width="948"
          height="655"
          fill="none"
          stroke="#d4af37"
          strokeWidth="1.8"
          strokeOpacity="0.9"
        />

        {/* ── TOP-LEFT / LEFT ABSTRACT GEOMETRIC CURVES ── */}
        {/* Layer 1: Outermost Gold Dots Shield */}
        <path
          d="M 0,0 L 320,0 C 270,120 220,200 160,270 C 100,340 50,390 0,430 Z"
          fill="url(#goldDotsPattern)"
        />
        <path
          d="M 320,0 C 270,120 220,200 160,270 C 100,340 50,390 0,430"
          fill="none"
          stroke="#d4af37"
          strokeWidth="2.5"
        />

        {/* Layer 2: Middle Slate Curved Shield with Gold Line Edge */}
        <path
          d="M 0,0 L 260,0 C 210,130 170,220 120,300 C 70,380 25,430 0,470 Z"
          fill="#1c2331"
          filter="url(#cornerCardShadow)"
        />
        <path
          d="M 260,0 C 210,130 170,220 120,300 C 70,380 25,430 0,470"
          fill="none"
          stroke="#d4af37"
          strokeWidth="2"
        />

        {/* Layer 3: Foreground Smooth Rounded Navy Tongue */}
        <path
          d="M 0,0 L 190,0 C 170,80 180,180 140,280 C 110,360 60,430 0,520 Z"
          fill="#252d3d"
          filter="url(#cornerCardShadow)"
        />
        <path
          d="M 190,0 C 170,80 180,180 140,280 C 110,360 60,430 0,520"
          fill="none"
          stroke="#eab308"
          strokeWidth="1.5"
          strokeOpacity="0.7"
        />

        {/* Layer 4: Deep Front Slate Organic Wave (extends down left) */}
        <path
          d="M 0,80 C 40,80 80,140 85,220 C 90,320 40,430 0,580 Z"
          fill="#1f2634"
          filter="url(#cornerCardShadow)"
        />
        <path
          d="M 0,80 C 40,80 80,140 85,220 C 90,320 40,430 0,580"
          fill="none"
          stroke="#f59e0b"
          strokeWidth="1.5"
          strokeOpacity="0.5"
        />

        {/* ── BOTTOM-RIGHT ABSTRACT GEOMETRIC CURVES ── */}
        {/* Layer 1: Dot Matrix Rising Curve */}
        <path
          d="M 1000,707 L 730,707 C 780,660 840,610 890,550 C 940,490 970,440 1000,410 Z"
          fill="url(#goldDotsPattern)"
        />
        <path
          d="M 730,707 C 780,660 840,610 890,550 C 940,490 970,440 1000,410"
          fill="none"
          stroke="#d4af37"
          strokeWidth="2.5"
        />

        {/* Layer 2: Foreground Slate Card with Gold Trim */}
        <path
          d="M 1000,707 L 790,707 C 830,660 880,620 920,570 C 960,520 985,480 1000,460 Z"
          fill="#252d3d"
          filter="url(#cornerCardShadow)"
        />
        <path
          d="M 790,707 C 830,660 880,620 920,570 C 960,520 985,480 1000,460"
          fill="none"
          stroke="#d4af37"
          strokeWidth="2"
        />
      </svg>

      {/* ── TOP SECTION: TITLES & CIRCULAR LOGO BADGE (Exact match to PDF) ── */}
      <div className="relative z-10 flex items-start justify-between gap-2">
        {/* Left Spacer to balance the top right badge */}
        <div className="w-12 sm:w-20 md:w-24 shrink-0"></div>

        {/* Center: IFTIIN HUB + cursive certificate */}
        <div className="text-center flex-1 pt-0.5 sm:pt-1">
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-[0.14em] text-white uppercase font-sans drop-shadow-md leading-none">
            IFTIIN HUB
          </h1>
          <div
            className="text-xl sm:text-3xl md:text-4xl lg:text-5xl text-amber-400 font-serif italic tracking-wide lowercase mt-0.5 sm:-mt-1 drop-shadow-sm select-none"
            style={{
              fontFamily: "'Dancing Script', 'Caveat', 'Brush Script MT', 'Great Vibes', cursive"
            }}
          >
            certificate
          </div>
        </div>

        {/* Top-Right: Circular Golden Logo Badge (Exact match to PDF) */}
        <div className="shrink-0 pt-0 sm:pt-1 pr-0 sm:pr-1">
          <div className="w-12 h-12 sm:w-18 sm:h-18 md:w-22 md:h-22 rounded-full bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500 p-1 sm:p-1.5 border-2 sm:border-3 md:border-4 border-amber-300 shadow-xl flex items-center justify-center transform hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center p-1 sm:p-1.5 shadow-inner">
              <img
                src={logoImg}
                alt="IftiinHub Logo"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── MIDDLE SECTION 1: NAME : ________________________ (Exact match to PDF) ── */}
      <div className="relative z-10 my-2 sm:my-4 md:my-5 max-w-2xl mx-auto w-full px-2 sm:px-6 md:px-8">
        <div className="flex items-end gap-2 sm:gap-3 w-full">
          <span className="text-base sm:text-xl md:text-2xl font-bold text-white tracking-wide shrink-0 pb-0.5 sm:pb-1 font-sans">
            Name :
          </span>
          <div className="flex-1 relative border-b-2 sm:border-b-3 border-amber-400 pb-0.5 sm:pb-1 text-left pl-1 sm:pl-3 overflow-hidden">
            <span
              className="font-black uppercase tracking-wider text-amber-300 font-serif drop-shadow-sm whitespace-nowrap block"
              style={{ fontSize: 'clamp(0.75rem, 3.5vw, 1.75rem)' }}
            >
              {studentName}
            </span>
          </div>
        </div>
      </div>

      {/* ── MIDDLE SECTION 2: GOLD BORDERED COURSE BOX (Exact match to PDF) ── */}
      <div className="relative z-10 max-w-2xl mx-auto w-full px-2 sm:px-6 md:px-8 my-1 sm:my-2">
        <div className="border border-amber-400/90 rounded-none p-2.5 sm:p-4 md:p-6 bg-slate-950/40 sm:bg-transparent text-center relative backdrop-blur-xs sm:backdrop-blur-none">
          {/* Course Name Header: Full Stack (Exact match to PDF) */}
          <h2 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold text-amber-400 tracking-wide mb-1 sm:mb-2 md:mb-3 drop-shadow-sm">
            {cleanCourseTitle}
          </h2>

          {/* Curriculum Description & Competencies Text */}
          <p className="text-[10px] sm:text-xs md:text-sm text-slate-100 leading-relaxed font-normal max-w-xl mx-auto">
            Has demonstrated academic excellence and practical proficiency in {cleanCourseTitle}. Successfully engineered, tested, and deployed end-to-end full-scale software capstones encompassing {skillsText}.
          </p>
        </div>
      </div>

      {/* ── BOTTOM SECTION: DATE, QR CODE & SIGNATURE (Exact match to PDF) ── */}
      <div className="relative z-10 grid grid-cols-3 gap-1 sm:gap-3 md:gap-4 items-end mt-2 sm:mt-4 md:mt-6 pb-1 sm:pb-2 px-1 sm:px-4 md:px-6">
        
        {/* Left: Date */}
        <div className="text-center flex flex-col items-center">
          <div className="text-[10px] sm:text-xs md:text-sm font-bold text-amber-300 tracking-wide pb-0.5 sm:pb-1 whitespace-nowrap">
            {formattedDate}
          </div>
          <div className="w-18 sm:w-28 md:w-36 lg:w-44 border-b-1.5 sm:border-b-2 border-amber-400 mb-0.5 sm:mb-1"></div>
          <span className="text-xs sm:text-sm md:text-base font-bold text-white tracking-wider">
            Date
          </span>
          <span className="text-[8px] sm:text-[9px] md:text-[10px] font-mono text-slate-400 tracking-wider truncate max-w-[90px] sm:max-w-none">
            {certificateId}
          </span>
        </div>

        {/* Center: QR Code with "SCAN ME" (Exact match to PDF) */}
        <div className="flex flex-col items-center justify-center">
          <div className="bg-white p-1 sm:p-1.5 md:p-2 rounded-lg sm:rounded-xl shadow-2xl border sm:border-2 border-amber-400 transform hover:scale-105 transition-transform duration-200">
            <QRCodeSVG
              value={verificationUrl}
              size={46}
              level="H"
              includeMargin={false}
              className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16"
            />
          </div>
          <div className="mt-0.5 sm:mt-1 px-1.5 py-0.5 rounded bg-slate-950 border border-amber-400/60 text-[8px] sm:text-[9px] md:text-[10px] font-mono font-black text-amber-300 uppercase tracking-wider shadow-xs">
            SCAN ME
          </div>
        </div>

        {/* Right: Signature */}
        <div className="text-center flex flex-col items-center">
          {/* Symbol signature image above the line (Exact match to requested signature) */}
          <div className="h-8 sm:h-10 md:h-12 flex items-end justify-center pb-0.5 select-none">
            <img
              src={signatureImg}
              alt="Official Signature"
              className="h-7 sm:h-9 md:h-11 w-auto object-contain drop-shadow-sm filter brightness-110"
            />
          </div>
          <div className="w-18 sm:w-28 md:w-36 lg:w-44 border-b-1.5 sm:border-b-2 border-amber-400 mb-0.5 sm:mb-1 mt-0.5"></div>
          <span className="text-xs sm:text-sm md:text-base font-bold text-white tracking-wide text-center">
            {displayInstructor}
          </span>
        </div>

      </div>
    </div>
  );
};

export default IftiinCertificate;
