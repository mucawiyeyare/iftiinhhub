import React from "react";
import { QRCodeSVG } from "qrcode.react";
import logoImg from "../assets/logo-transparent.png";
import signatureImg from "../assets/signature-transparent.png";

const IftiinCertificate = ({ certificate, isPrintMode = false }) => {
  if (!certificate) return null;

  const {
    studentName = "Student Name",
    courseTitle = "Diploma in Web Applications Development",
    issueDate = new Date().toISOString(),
    certificateId = "IFT-2025-000000",
    instructor = "Abdirahman Mohamed Ibrahim",
    skills = [],
    grade = null,
  } = certificate;

  // Always use the current date dynamically
  const formattedDate = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  // Always use iftiinhub.com domain for QR verification
  const verificationUrl = `https://iftiinhub.com/verify-certificate?id=${encodeURIComponent(certificateId)}`;

  // Clean course title
  const rawTitle = (courseTitle || "Diploma in Web Applications Development")
    .replace(/associate\s*/gi, "")
    .trim();

  const cleanCourseTitle =
    rawTitle.toLowerCase().includes("full") ||
    rawTitle.toLowerCase().includes("stack") ||
    rawTitle.toLowerCase().includes("web")
      ? "Diploma in Web Applications Development"
      : rawTitle.toLowerCase().includes("data")
        ? "Data Analysis (Excel & Power BI)"
        : rawTitle;

  return (
    <div
      id={`certificate-${certificateId}`}
      className={`relative w-full max-w-4xl mx-auto aspect-[1.414/1] bg-[#0d1117] text-white rounded-lg sm:rounded-2xl shadow-2xl overflow-hidden selection:bg-amber-500 selection:text-black flex flex-col justify-between p-2.5 sm:p-5 md:p-7 lg:p-8 transition-all duration-200 ${
        isPrintMode ? "print-certificate-page" : ""
      }`}
      style={{
        boxShadow:
          "0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 40px rgba(212, 175, 55, 0.15)",
      }}
    >
      {/* ── BACKGROUND VECTOR ART ── */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
        viewBox="0 0 1000 707"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          {/* Gold polka dots pattern */}
          <pattern
            id="goldDotsPattern"
            x="0"
            y="0"
            width="14"
            height="14"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="3" cy="3" r="1.5" fill="#d4af37" fillOpacity="0.75" />
          </pattern>

          {/* Soft drop shadow for layered curved cards */}
          <filter
            id="cornerCardShadow"
            x="-20%"
            y="-20%"
            width="150%"
            height="150%"
          >
            <feDropShadow
              dx="4"
              dy="6"
              stdDeviation="8"
              floodColor="#000000"
              floodOpacity="0.8"
            />
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

      {/* ── TOP SECTION: TITLES & CIRCULAR LOGO BADGE ── */}
      <div className="relative z-10 flex items-start justify-between gap-1 sm:gap-2">
        {/* Left Spacer to balance top right badge */}
        <div className="w-8 sm:w-16 md:w-20 shrink-0"></div>

        {/* Center: IFTIIN HUB + cursive certificate */}
        <div className="text-center flex-1 pt-0 sm:pt-1">
          <h1 className="text-sm sm:text-2xl md:text-4xl lg:text-5xl font-black tracking-[0.14em] text-white uppercase font-sans drop-shadow-md leading-tight">
            IFTIIN HUB
          </h1>
          <div
            className="text-xs sm:text-xl md:text-3xl lg:text-4xl text-amber-400 font-serif italic tracking-wide lowercase -mt-1 sm:-mt-1.5 drop-shadow-sm select-none"
            style={{
              fontFamily:
                "'Dancing Script', 'Caveat', 'Brush Script MT', 'Great Vibes', cursive",
            }}
          >
            certificate
          </div>
        </div>

        {/* Top-Right: Circular Golden Logo Badge */}
        <div className="shrink-0 pt-0 sm:pt-0.5 pr-0 sm:pr-1">
          <div className="w-8 h-8 sm:w-14 sm:h-14 md:w-18 md:h-18 rounded-full bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500 p-0.5 sm:p-1 border sm:border-2 border-amber-300 shadow-xl flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center p-0.5 sm:p-1 shadow-inner">
              <img
                src={logoImg}
                alt="IftiinHub Logo"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── MIDDLE SECTION: DIPLOMA AWARD BOX ── */}
      <div className="relative z-10 max-w-2xl mx-auto w-full px-2 sm:px-4 md:px-6 my-auto">
        <div className="border border-amber-400/90 rounded-none p-1.5 sm:p-3 md:p-4 bg-slate-950/40 text-center relative backdrop-blur-xs">
          {/* Authority Line */}
          <p className="text-[7px] sm:text-[10px] md:text-xs text-slate-300 tracking-widest uppercase font-semibold mb-0.5 sm:mb-1">
            By the Authority of Academic Board of Iftiinhub
          </p>

          {/* Diploma Title */}
          <h2 className="text-[10px] sm:text-lg md:text-2xl lg:text-3xl font-bold text-amber-400 tracking-wide mb-0.5 sm:mb-1 drop-shadow-sm leading-tight">
            {cleanCourseTitle}
          </h2>

          {/* Award Text */}
          <p className="text-[7px] sm:text-xs md:text-sm text-slate-200 font-normal mb-0.5 sm:mb-1">
            has been awarded to
          </p>

          {/* Recipient Name */}
          <p className="text-[11px] sm:text-lg md:text-2xl lg:text-3xl font-black uppercase tracking-wider text-amber-300 font-serif drop-shadow-sm mb-0.5 sm:mb-1 leading-tight">
            {studentName}
          </p>

          {/* Completion Statement */}
          <p className="text-[7px] sm:text-[11px] md:text-xs text-slate-200 font-normal mb-0.5 sm:mb-1 leading-snug">
            who has successfully completed the diploma requirements
          </p>

          {/* Approval Line */}
          <p className="text-[6px] sm:text-[9px] md:text-xs text-slate-400 font-normal">
            The degree was approved by the Academic Board on {formattedDate}
          </p>
        </div>
      </div>

      {/* ── BOTTOM SECTION: DATE, QR CODE & CEO SIGNATURE ── */}
      <div className="relative z-10 grid grid-cols-3 gap-1 sm:gap-3 md:gap-4 items-end pb-0.5 sm:pb-1 px-1 sm:px-4 md:px-6">
        {/* Left: Date & Certificate ID */}
        <div className="text-center flex flex-col items-center justify-end">
          <div className="text-[7px] sm:text-xs md:text-sm font-bold text-amber-300 tracking-wide pb-0.5 whitespace-nowrap">
            {formattedDate}
          </div>
          <div className="w-14 sm:w-24 md:w-32 lg:w-40 border-b sm:border-b-2 border-amber-400 mb-0.5 sm:mb-1"></div>
          <span className="text-[8px] sm:text-xs md:text-sm font-bold text-white tracking-wider leading-none">
            Date
          </span>
          <span className="text-[6px] sm:text-[8px] md:text-[10px] font-mono text-slate-400 tracking-wider truncate max-w-[90px] sm:max-w-none mt-0.5">
            Cert No: {certificateId}
          </span>
        </div>

        {/* Center: QR Code with "SCAN ME" */}
        <div className="flex flex-col items-center justify-center">
          <div className="bg-white p-0.5 sm:p-1 md:p-1.5 rounded sm:rounded-lg shadow-xl border border-amber-400 transform hover:scale-105 transition-transform duration-200">
            <QRCodeSVG
              value={verificationUrl}
              size={36}
              level="H"
              includeMargin={false}
              className="w-7 h-7 sm:w-11 sm:h-11 md:w-14 md:h-14"
            />
          </div>
          <div className="mt-0.5 px-1 py-0.2 rounded bg-slate-950 border border-amber-400/60 text-[6px] sm:text-[8px] md:text-[9px] font-mono font-black text-amber-300 uppercase tracking-wider shadow-xs">
            SCAN ME
          </div>
        </div>

        {/* Right: CEO Official Signature */}
        <div className="text-center flex flex-col items-center justify-end">
          <div className="h-5 sm:h-8 md:h-10 flex items-end justify-center pb-0.5 select-none">
            <img
              src={signatureImg}
              alt="Official Signature"
              className="h-4 sm:h-7 md:h-9 w-auto object-contain drop-shadow-sm filter brightness-110"
            />
          </div>
          <div className="w-14 sm:w-24 md:w-32 lg:w-40 border-b sm:border-b-2 border-amber-400 mb-0.5 sm:mb-1"></div>
          <span className="text-[6px] sm:text-[10px] md:text-xs text-slate-300 font-semibold tracking-wide block leading-none">
            Chief Executive Officer
          </span>
          <span className="text-[7px] sm:text-xs md:text-sm font-bold text-amber-300 tracking-wide block truncate max-w-[110px] sm:max-w-none mt-0.5">
            Abdirahman Mohamed Ibrahim
          </span>
        </div>
      </div>
    </div>
  );
};

export default IftiinCertificate;
