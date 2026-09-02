import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageTitle from '../components/PageTitle';
import fullstackImg from '../assets/program-fullstack.png';
import dataAnalysisImg from '../assets/program-data-analysis.png';

const programs = [
  {
    id: 'fullstack-web',
    image: fullstackImg,
    badge: 'MERN Engineering',
    title: 'ASSOCIATE FULL-STACK WEB DEVELOPER',
    subtitle: 'React.js • Node.js • Express • MongoDB • Tailwind CSS • JavaScript',
    duration: '16 Weeks • 4 Days/Week',
    mode: '🎥 Live Zoom Online',
    desc: 'Live interactive online Zoom classes. Master frontend React, backend Node/Express REST APIs, database architecture, and live cloud deployment.',
    whatsappMsg: 'Salaan! Waxaan doonayaa inaan iska diiwaangeliyo Barnaamijka Live Zoom ee Full-Stack Web Development.'
  },
  {
    id: 'data-analysis',
    image: dataAnalysisImg,
    badge: 'Data & Analytics',
    title: 'ASSOCIATE DATA ANALYST (EXCEL & POWER BI)',
    subtitle: 'Advanced Excel • Microsoft Power BI • DAX • Power Query • Dashboards',
    duration: '10 Weeks • 3 Days/Week',
    mode: '🎥 Live Zoom Online',
    desc: 'Live interactive online Zoom classes. Master advanced Excel data modeling, automated ETL with Power Query, DAX calculations, and interactive Power BI dashboards.',
    whatsappMsg: 'Salaan! Waxaan doonayaa inaan iska diiwaangeliyo Barnaamijka Live Zoom ee Data Analysis (Excel & Power BI).'
  }
];

const clientSystems = [
  {
    id: 'dhiigkaal',
    name: 'Dhiigkaal Blood Bank & Healthcare System',
    url: 'https://dhiigkaal.iftiinhub.com',
    domain: 'dhiigkaal.iftiinhub.com',
    badge: 'Healthcare & Blood Bank ERP',
    tagline: 'Electronic Blood Donor Registry, Emergency Blood Match & Laboratory Screening System',
    desc: 'A mission-critical healthcare application engineered for hospitals and blood banks. Features real-time donor tracking, blood unit inventories, emergency request broadcast, and lab results.',
    features: [
      'Digital Donor Registration & Blood Type Database',
      'Emergency Blood Match & Real-time Request Dispatch',
      'Hospital & Laboratory Screening Workflows',
      'Automated SMS Notifications & Blood Stock Tracking'
    ],
    tech: ['React.js', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS', 'REST APIs'],
    color: 'from-rose-500 to-red-600',
    iconBg: 'bg-rose-50 text-rose-600 border-rose-200',
    icon: '🩸',
    logoText: 'DHIIGKAAL HEALTH',
    status: 'Live in Production'
  },
  {
    id: 'snabdental',
    name: 'SNAB Dental Clinic & Healthcare Management',
    url: 'https://snabdental.iftiinhub.com',
    domain: 'snabdental.iftiinhub.com',
    badge: 'Dental & Clinical EHR System',
    tagline: 'Complete Dental Clinic EHR, Online Appointment Booking, Tooth Charting & Invoicing',
    desc: 'Specialized enterprise clinical management suite for modern dental clinics. Streamlines patient intake, medical history, dental procedure charting, prescriptions, and financial billing.',
    features: [
      'Interactive Dental Treatment & Tooth Charting System',
      'Online Patient Booking & Doctor Schedule Manager',
      'Laboratory Test Requests & Results Management',
      'Point of Sale, Medical Invoicing & Payment Receipts'
    ],
    tech: ['React.js', 'Node.js', 'Express', 'MongoDB', 'JWT Auth', 'Tailwind CSS'],
    color: 'from-emerald-500 to-teal-600',
    iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    icon: '🦷',
    logoText: 'SNAB DENTAL CLINIC',
    status: 'Live in Production'
  },
  {
    id: 'ntw',
    name: 'NTW Academic & University Portal (Hormuud University)',
    url: 'https://ntw.hu.edu.so',
    domain: 'ntw.hu.edu.so',
    badge: 'Higher Education Management System',
    tagline: 'Official University Portal, Student Admissions, Semester Grading & Academic Records',
    desc: 'High-performance university management portal powering student lifecycles, faculty course allocations, interactive student grade books, and official credential verifications.',
    features: [
      'Comprehensive Student Admission & Enrollment Hub',
      'Automated Semester Grade Books & Transcript Generation',
      'Course Syllabus, Lecture Notes & Video Materials',
      'Online Certificate & Credential Verification Portal'
    ],
    tech: ['React.js', 'Node.js', 'Express', 'Linux VPS', 'SSL Hardened'],
    color: 'from-blue-600 to-indigo-700',
    iconBg: 'bg-blue-50 text-blue-600 border-blue-200',
    icon: '🎓',
    logoText: 'HORMUUD UNIV - NTW',
    status: 'Live in Production'
  },
  {
    id: 'elmiportal',
    name: 'Mr. Elmi Institutional Document Management Portal',
    url: 'https://mr.elmiportal.iftiinhub.com',
    domain: 'mr.elmiportal.iftiinhub.com',
    badge: 'Enterprise Document Archive',
    tagline: 'High-Security Cloud Document Archiving, Permission Access & File Verification',
    desc: 'Enterprise document filing and records portal engineered for institutions. Provides secure cloud storage, digital document verification, granular permission policies, and audit logs.',
    features: [
      'Digital Records Archive & Document Filing Architecture',
      'Role-based Secure Document Permissions & Access Control',
      'Document Authenticity Verification & Watermarking',
      'Automated Activity Logs & Enterprise Auditing'
    ],
    tech: ['React.js', 'Node.js', 'Express', 'MongoDB', 'Cloud Storage'],
    color: 'from-amber-500 to-amber-700',
    iconBg: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: '📑',
    logoText: 'ELMI ENTERPRISE PORTAL',
    status: 'Live in Production'
  }
];

const testimonials = [
  {
    name: 'Mohamed Abdi',
    role: 'Full-Stack Developer Graduate',
    content: 'The live Zoom classes with screen-sharing and real-time code reviews made complex backend and database concepts so easy to master in Somali.',
    avatar: '👨‍💻'
  },
  {
    name: 'Amina Hassan',
    role: 'Data Analyst & Power BI Specialist',
    content: 'Learning Power BI and advanced Excel modeling interactively on Zoom helped me build professional dashboards for my organization.',
    avatar: '👩‍💻'
  },
  {
    name: 'Eng. Sharmaarke',
    role: 'School Principal & ICT Client',
    content: 'IftiinHub engineered our complete school management portal. The student grading and billing system saved our staff countless hours.',
    avatar: '🏫'
  }
];

const Home = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  // Auto-play slider every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % clientSystems.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const currentSystem = clientSystems[activeSlide];

  return (
    <div className="min-h-screen bg-white text-slate-900 transition-colors duration-300">
      <PageTitle title="IftiinHub - Live Zoom Tech Training & Custom ICT Systems" />

      {/* ═════════════════════════════════════════════════════════════════════
          HERO SECTION (Clean White with Golden Yellow Accents)
      ═════════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden py-14 sm:py-20 lg:py-24 bg-gradient-to-b from-amber-500/10 via-white to-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-300 text-amber-800 text-xs sm:text-sm font-bold uppercase tracking-wider mb-6 shadow-sm">
              <span>🎥</span> Live Interactive Online Classes via Zoom
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-tight">
              Live Online Tech Training &amp; <span className="text-amber-500">Enterprise ICT Systems</span>
            </h1>

            {/* Subtitle */}
            <p className="mt-6 text-base sm:text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto">
              IftiinHub is a premier technology platform. We provide live interactive Zoom bootcamps in <strong className="text-slate-900">Full-Stack Web Development</strong> and <strong className="text-slate-900">Data Analysis (Excel &amp; Power BI)</strong>, and engineer custom enterprise software management systems for institutions.
            </p>

            {/* Actions */}
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a
                href="#training-section"
                className="btn-brand-primary text-sm sm:text-base px-8 py-3.5"
              >
                🚀 Explore Live Zoom Programs
              </a>
              <a
                href="#our-customers"
                className="btn-brand-dark text-sm sm:text-base px-8 py-3.5"
              >
                🏢 View Our Live Customer Systems
              </a>
            </div>

            {/* Key stats ticker */}
            <div className="mt-12 pt-8 border-t border-slate-200 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-xl sm:text-2xl font-black text-amber-500">Live Zoom</div>
                <div className="text-xs font-semibold text-slate-600 mt-0.5">Interactive Classes</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-xl sm:text-2xl font-black text-slate-900">100% Practical</div>
                <div className="text-xs font-semibold text-slate-600 mt-0.5">Real-World Projects</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-xl sm:text-2xl font-black text-amber-500">Somali &amp; Eng</div>
                <div className="text-xs font-semibold text-slate-600 mt-0.5">Bilingual Instruction</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-xl sm:text-2xl font-black text-slate-900">Real Systems</div>
                <div className="text-xs font-semibold text-slate-600 mt-0.5">Deployed in Production</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════
          TRAINING PROGRAMS SECTION (Software Academy Cards with Real Images)
      ═════════════════════════════════════════════════════════════════════ */}
      <section id="training-section" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="badge-brand-gold mb-2">Live Zoom Bootcamps</span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
            Our Featured Training Programs
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base max-w-xl mx-auto">
            Live interactive classes on Zoom with screen-sharing, coding walkthroughs, and direct instructor mentorship.
          </p>
        </div>

        {/* 2 Academy Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10">
          {programs.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
            >
              <div>
                {/* Real Tech Image Header (Software Academy style) */}
                <div className="bg-white p-6 border-b border-slate-100 flex items-center justify-center relative">
                  <img
                    src={p.image}
                    alt={p.title}
                    className="w-full h-auto max-h-60 object-contain rounded-xl transform group-hover:scale-102 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4 bg-amber-500 text-slate-950 font-black text-xs px-3 py-1 rounded-full shadow-md">
                    {p.badge}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 sm:p-8">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold">
                      {p.mode}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      ⏱️ {p.duration}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight mb-2">
                    {p.title}
                  </h3>

                  <p className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-4">
                    {p.subtitle}
                  </p>

                  <p className="text-sm text-slate-600 leading-relaxed mb-6">
                    {p.desc}
                  </p>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-amber-500 font-bold">✓</span>
                      <span>Live interactive Zoom sessions with screen sharing</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-amber-500 font-bold">✓</span>
                      <span>Real portfolio projects &amp; live code review</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-amber-500 font-bold">✓</span>
                      <span>1-on-1 WhatsApp instructor support &amp; recordings</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
                <a
                  href={`https://wa.me/616408886?text=${encodeURIComponent(p.whatsappMsg)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-brand-primary flex-1 text-center text-sm py-3 justify-center"
                >
                  💬 Enroll via WhatsApp
                </a>
                <Link
                  to="/training-programs"
                  className="btn-brand-dark text-center text-sm py-3 px-5 justify-center"
                >
                  View Full Syllabus →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════
          OUR CUSTOMERS & REAL SYSTEMS WE BUILT (Requested by User)
      ═════════════════════════════════════════════════════════════════════ */}
      <section id="our-customers" className="py-16 sm:py-24 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-300 text-amber-800 text-xs sm:text-sm font-bold uppercase tracking-wider mb-3 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              OUR CUSTOMERS &amp; REAL DEPLOYED SYSTEMS
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight">
              Real Systems We Have <span className="text-amber-500">Built &amp; Engineered</span>
            </h2>
            <p className="mt-4 text-slate-600 max-w-3xl mx-auto text-sm sm:text-base leading-relaxed">
              We engineer mission-critical software systems and cloud database architectures for hospitals, specialized clinics, universities, and institutions across the country.
            </p>
          </div>

          {/* ── CLIENT SYSTEMS LIVE LOGO TICKER / SLIDER NAVIGATION ── */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
            {clientSystems.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => setActiveSlide(idx)}
                className={`px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all duration-300 flex items-center gap-2.5 border cursor-pointer ${
                  activeSlide === idx
                    ? 'bg-slate-950 text-amber-400 border-slate-950 shadow-lg scale-105'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-amber-400 hover:bg-amber-50/50'
                }`}
              >
                <span className="text-base">{item.icon}</span>
                <span className="font-mono">{item.domain}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              </button>
            ))}
          </div>

          {/* ── ACTIVE FEATURED SYSTEM HERO CARD SLIDER ── */}
          <div className="bg-white rounded-3xl border-2 border-slate-200/90 shadow-xl overflow-hidden mb-12 transition-all duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
              
              {/* Left Column: Visual Brand Card */}
              <div className="lg:col-span-5 bg-gradient-to-br from-slate-950 via-slate-900 to-zinc-900 p-8 sm:p-12 text-white flex flex-col justify-between relative overflow-hidden">
                {/* Ambient Glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

                <div>
                  <div className="flex items-center justify-between gap-2 mb-6">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold uppercase tracking-wider">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      {currentSystem.status}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      System {activeSlide + 1} of {clientSystems.length}
                    </span>
                  </div>

                  <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-4xl mb-6 shadow-inner">
                    {currentSystem.icon}
                  </div>

                  <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                    {currentSystem.badge}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black tracking-tight mt-1 mb-3 text-white">
                    {currentSystem.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                    {currentSystem.tagline}
                  </p>
                </div>

                {/* Direct Live Link Action */}
                <div className="pt-6 border-t border-white/10 space-y-3">
                  <a
                    href={currentSystem.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-black text-sm transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                    <span>🚀 Visit Live System</span>
                    <span className="font-mono text-xs font-normal">({currentSystem.domain})</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                  
                  {/* Slider Control Arrows */}
                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={() => setActiveSlide((prev) => (prev - 1 + clientSystems.length) % clientSystems.length)}
                      className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold text-slate-300 flex items-center gap-1 cursor-pointer"
                    >
                      ← Previous System
                    </button>
                    <button
                      onClick={() => setActiveSlide((prev) => (prev + 1) % clientSystems.length)}
                      className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold text-slate-300 flex items-center gap-1 cursor-pointer"
                    >
                      Next System →
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: System Capabilities & Architecture */}
              <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-2">
                    System Architecture &amp; Solution Overview
                  </h4>
                  <p className="text-sm sm:text-base text-slate-700 leading-relaxed mb-6 font-medium">
                    {currentSystem.desc}
                  </p>

                  <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
                    Key Modules &amp; Engineered Features:
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                    {currentSystem.features.map((feat, fIdx) => (
                      <div key={fIdx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2.5">
                        <span className="text-emerald-600 font-black text-sm">✓</span>
                        <span className="text-xs font-semibold text-slate-800 leading-snug">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tech Stack Footer */}
                <div className="pt-6 border-t border-slate-100">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                    Engineering Stack &amp; Cloud Infrastructure:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {currentSystem.tech.map((t, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-3 py-1 rounded-lg bg-amber-50 text-amber-900 text-xs font-mono font-bold border border-amber-200 shadow-2xs"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* ── 4 CLIENT SYSTEM CARDS GRID (Side-by-Side Reference) ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
            {clientSystems.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => setActiveSlide(idx)}
                className={`bg-white rounded-2xl p-6 border-2 transition-all duration-300 flex flex-col justify-between cursor-pointer group ${
                  activeSlide === idx
                    ? 'border-amber-500 shadow-lg scale-102 bg-amber-50/10'
                    : 'border-slate-200 shadow-sm hover:border-slate-300 hover:shadow-md'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-2xl">{item.icon}</span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      Live
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-950 text-base leading-snug mb-1 group-hover:text-amber-700 transition">
                    {item.name}
                  </h4>
                  <p className="font-mono text-xs text-amber-800 font-semibold mb-3">
                    {item.domain}
                  </p>
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                    {item.tagline}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">
                    {item.badge.split(' ')[0]}
                  </span>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-xs font-bold text-amber-700 hover:text-amber-900 inline-flex items-center gap-1"
                  >
                    Open Live ↗
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Consultation Banner */}
          <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 rounded-3xl p-8 sm:p-12 text-slate-950 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-black/10 text-slate-950 text-xs font-black uppercase tracking-wider mb-2">
                Enterprise Custom Engineering
              </span>
              <h3 className="text-2xl sm:text-3xl font-black mb-2">
                Need a Custom ICT Software System for Your Organization?
              </h3>
              <p className="text-slate-950/90 font-medium text-sm sm:text-base max-w-xl">
                We engineer scalable hospital software, school and university portals, blood bank ERPs, and cloud database solutions. Let's build your system today.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
              <a
                href="https://wa.me/616408886?text=Salaan!%20Waxaan%20doonayaa%20in%20aan%20wada%20hadalno%20ku%20saabsan%20dhismaha%20nidaam%20ICT."
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-xl bg-slate-950 text-white font-bold text-sm hover:bg-zinc-800 transition-all shadow-md inline-flex items-center gap-2"
              >
                💬 WhatsApp Consultation
              </a>
              <Link
                to="/contact"
                className="px-6 py-3.5 rounded-xl bg-white/50 backdrop-blur-sm border border-slate-950/20 text-slate-950 font-bold text-sm hover:bg-white/70 transition-all"
              >
                ✉️ Contact Engineering Team
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════
          TESTIMONIALS
      ═════════════════════════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="badge-brand-gold mb-2">Success Stories</span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
            What Our Students &amp; Clients Say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm flex flex-col justify-between"
            >
              <p className="text-sm text-slate-600 italic leading-relaxed mb-6">
                "{t.content}"
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-xl">
                  {t.avatar}
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-950">{t.name}</div>
                  <div className="text-xs text-amber-700 font-semibold">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════════
          BOTTOM CALL TO ACTION
      ═════════════════════════════════════════════ */}
      <section className="py-16 sm:py-20 bg-slate-950 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight mb-4">
            Join the Next Live Zoom Cohort Today
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto mb-8">
            Live interactive Zoom sessions, hands-on portfolio projects, Somali instruction, and verified certificates.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/student-register" className="btn-brand-primary text-sm sm:text-base px-8 py-3.5">
              📝 Create Student Account
            </Link>
            <a
              href="https://wa.me/616408886?text=Salaan!%20Waxaan%20doonayaa%20in%20aan%20bilaabo%20waxbarashada%20Live%20Zoom%20ee%20IftiinHub."
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 rounded-xl border border-zinc-700 bg-zinc-900 text-white font-bold text-sm hover:border-amber-500 hover:text-amber-400 transition-all inline-flex items-center gap-2"
            >
              💬 WhatsApp Us Directly
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;