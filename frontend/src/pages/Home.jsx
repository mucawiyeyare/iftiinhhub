import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageTitle from '../components/PageTitle';
import fullstackImg from '../assets/program-fullstack.png';
import dataAnalysisImg from '../assets/program-data-analysis.png';

// Real customer logos provided by user
import snabDentalLogo from '../assets/customers/snab-dental-logo.png';
import dhiigkaalLogo from '../assets/customers/dhiigkaal-logo.png';
import ntwHuLogo from '../assets/customers/ntw-hu-logo.png';

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

const customerLogos = [
  {
    id: 'dhiigkaal',
    name: 'Dhiigkaal Blood Bank & Healthcare System',
    shortName: 'Dhiigkaal Blood Bank',
    logo: dhiigkaalLogo,
    url: 'https://dhiigkaal.iftiinhub.com',
    domain: 'dhiigkaal.iftiinhub.com',
    category: 'Healthcare & Blood Bank ERP',
    tagline: 'Electronic Blood Donor Registry, Emergency Blood Match & Lab Screening Workflows',
    desc: 'Mission-critical healthcare system engineered for hospitals and blood banks. Features real-time donor tracking, emergency blood requests, screening workflows, and stock tracking.',
    features: [
      'Digital Donor Registration & Blood Type Matching',
      'Emergency Blood Match & Real-time Request Dispatch',
      'Hospital & Laboratory Screening Workflows',
      'Automated SMS Notifications & Blood Stock Tracking'
    ],
    tech: ['React.js', 'Node.js', 'Express', 'MongoDB', 'REST APIs', 'Tailwind CSS']
  },
  {
    id: 'snabdental',
    name: 'SNAB Dental Clinic & Healthcare Management',
    shortName: 'SNAB Dental Clinic',
    logo: snabDentalLogo,
    url: 'https://snabdental.iftiinhub.com',
    domain: 'snabdental.iftiinhub.com',
    category: 'Dental & Clinical EHR System',
    tagline: 'Complete Dental Clinic EHR, Online Appointment Booking, Tooth Charting & Invoicing',
    desc: 'Specialized enterprise clinical management suite for modern dental clinics. Streamlines patient intake, medical history, dental procedure charting, prescriptions, and financial billing.',
    features: [
      'Interactive Dental Treatment & Tooth Charting System',
      'Online Patient Booking & Doctor Schedule Manager',
      'Laboratory Test Requests & Results Management',
      'Point of Sale, Medical Invoicing & Payment Receipts'
    ],
    tech: ['React.js', 'Node.js', 'Express', 'MongoDB', 'JWT Auth', 'Tailwind CSS']
  },
  {
    id: 'ntw',
    name: 'NTW Academic & University Portal (Hormuud University)',
    shortName: 'Hormuud University (NTW)',
    logo: ntwHuLogo,
    url: 'https://ntw.hu.edu.so',
    domain: 'ntw.hu.edu.so',
    category: 'Higher Education Management System',
    tagline: 'Official University Portal, Student Admissions, Semester Grading & Academic Records',
    desc: 'High-performance university management portal powering student lifecycles, faculty course allocations, interactive student grade books, and official credential verifications.',
    features: [
      'Comprehensive Student Admission & Enrollment Hub',
      'Automated Semester Grade Books & Transcript Generation',
      'Course Syllabus, Lecture Notes & Video Materials',
      'Online Certificate & Credential Verification Portal'
    ],
    tech: ['React.js', 'Node.js', 'Express', 'Linux VPS', 'SSL Hardened']
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
  const [activeCustomerIndex, setActiveCustomerIndex] = useState(0);

  // Auto-cycle through the 3 customer systems
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveCustomerIndex((prev) => (prev + 1) % customerLogos.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const activeCustomer = customerLogos[activeCustomerIndex];

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
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-300 text-amber-800 text-xs sm:text-sm font-bold uppercase tracking-wider mb-6 shadow-xs">
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
                🏢 View Our Customers
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
                <div className="text-xl sm:text-2xl font-black text-slate-900">Enterprise</div>
                <div className="text-xs font-semibold text-slate-600 mt-0.5">Real Systems Deployed</div>
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
          OUR CUSTOMERS SECTION (Exact Tabaarak ICT Design with Real Logos)
      ═════════════════════════════════════════════════════════════════════ */}
      <section id="our-customers" className="py-16 sm:py-24 bg-gradient-to-b from-slate-50/70 via-white to-slate-50/50 border-y border-slate-200 relative overflow-hidden">
        
        {/* Subtle Map / Dot Pattern Background like Tabaarak */}
        <div className="absolute inset-0 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Header (Exact Typography from Tabaarak ICT Screenshot) */}
          <div className="text-center sm:text-left mb-12">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight flex items-baseline justify-center sm:justify-start gap-2.5">
              <span>Our</span>
              <span className="text-blue-600 relative inline-block">
                Customer
                {/* Hand-drawn blue underline matching Tabaarak ICT */}
                <svg
                  className="absolute -bottom-2.5 left-0 w-full h-3.5 text-blue-500 overflow-visible"
                  viewBox="0 0 100 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 9C28 2 72 2 98 9"
                    stroke="#2563eb"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h2>
            <p className="mt-5 text-slate-600 text-sm sm:text-base max-w-2xl leading-relaxed">
              Our customers are our top priority we are dedicated to providing tailored solutions and exceptional services
            </p>
          </div>

          {/* ── 3 CUSTOMER LOGO CARDS (Exact Tabaarak Style with Real Logos) ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 mb-10">
            {customerLogos.map((cust, idx) => (
              <div
                key={cust.id}
                onClick={() => setActiveCustomerIndex(idx)}
                className={`relative group cursor-pointer transition-all duration-300 ${
                  activeCustomerIndex === idx ? 'scale-102' : 'hover:-translate-y-1.5'
                }`}
              >
                {/* Tabaarak Signature Blue Shadow / Accent Tab Underneath */}
                <div className={`absolute -bottom-2.5 right-6 w-24 h-4 bg-blue-600 rounded-full transition-all duration-300 ${
                  activeCustomerIndex === idx ? 'opacity-100 w-32 bg-blue-600 shadow-md shadow-blue-500/40' : 'opacity-70 group-hover:opacity-100 group-hover:w-28'
                }`}></div>

                {/* White Logo Card Container */}
                <div className={`relative bg-white rounded-2xl border-2 p-6 sm:p-8 flex flex-col items-center justify-center h-44 shadow-lg transition-all duration-300 ${
                  activeCustomerIndex === idx
                    ? 'border-blue-500 ring-4 ring-blue-500/10 shadow-xl'
                    : 'border-slate-200/90 group-hover:border-blue-300'
                }`}>
                  
                  {/* Real Customer Logo Image */}
                  <div className="w-full h-24 flex items-center justify-center p-1">
                    <img
                      src={cust.logo}
                      alt={cust.name}
                      className="max-h-20 max-w-[200px] w-auto h-auto object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  {/* Domain tag & Live status */}
                  <div className="mt-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="font-mono text-xs font-bold text-slate-700 group-hover:text-blue-600 transition-colors">
                      {cust.domain}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Slider / Pagination Indicator Dots */}
          <div className="flex items-center justify-center gap-2.5 mb-10">
            {customerLogos.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveCustomerIndex(idx)}
                className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  activeCustomerIndex === idx ? 'w-8 bg-blue-600 shadow-xs' : 'w-2.5 bg-slate-300 hover:bg-slate-400'
                }`}
                title={`View customer ${idx + 1}`}
              />
            ))}
          </div>

          {/* ── EXPANDED DETAILS OF SELECTED CUSTOMER SYSTEM ── */}
          {activeCustomer && (
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl p-6 sm:p-10 transition-all duration-300">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {/* Left System Info */}
                <div className="lg:col-span-8">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold uppercase tracking-wider">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      Live Production System
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                      {activeCustomer.category}
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight mb-2">
                    {activeCustomer.name}
                  </h3>

                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6 font-medium">
                    {activeCustomer.desc}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6">
                    {activeCustomer.features.map((feat, fIdx) => (
                      <div key={fIdx} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2 text-xs font-semibold text-slate-800">
                        <span className="text-emerald-600 font-black">✓</span>
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2 items-center pt-4 border-t border-slate-100">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-2">Tech Stack:</span>
                    {activeCustomer.tech.map((t, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 text-xs font-mono font-semibold">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right Action Card */}
                <div className="lg:col-span-4 bg-gradient-to-br from-slate-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white flex flex-col justify-between h-full text-center sm:text-left">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-2">
                      Client Domain
                    </div>
                    <div className="text-lg font-mono font-black text-white break-all mb-4">
                      {activeCustomer.domain}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed mb-6">
                      Click below to test and browse this live production system directly.
                    </p>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-white/10">
                    <a
                      href={activeCustomer.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm transition-all shadow-md flex items-center justify-center gap-2"
                    >
                      <span>🚀 Visit Live System</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                    <a
                      href="https://wa.me/616408886?text=Salaan!%20Waxaan%20doonayaa%20in%20aan%20ka%20hadalno%20dhismaha%20nidaam%20software%20oo%20la%20mid%20ah%20nidaamyada%20IftiinHub."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 font-bold text-xs transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>💬 Request Similar System</span>
                    </a>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Consultation Banner */}
          <div className="mt-12 bg-gradient-to-r from-slate-950 via-slate-900 to-zinc-950 rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-slate-800">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/40 text-blue-400 text-xs font-black uppercase tracking-wider mb-2">
                Enterprise Custom Engineering
              </span>
              <h3 className="text-2xl sm:text-3xl font-black mb-2 text-white">
                Need a Custom ICT Software System for Your Organization?
              </h3>
              <p className="text-slate-300 font-medium text-sm sm:text-base max-w-xl">
                We engineer scalable hospital software, school and university portals, blood bank ERPs, and cloud database solutions. Let's build your system today.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
              <a
                href="https://wa.me/616408886?text=Salaan!%20Waxaan%20doonayaa%20in%20aan%20wada%20hadalno%20ku%20saabsan%20dhismaha%20nidaam%20ICT."
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm transition-all shadow-md inline-flex items-center gap-2"
              >
                💬 WhatsApp Consultation
              </a>
              <Link
                to="/contact"
                className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm transition-all"
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