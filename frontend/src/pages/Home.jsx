import React from 'react';
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
    title: 'FULL STACK WEB DEVELOPMENT',
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
    title: 'DATA ANALYSIS (EXCEL & POWER BI)',
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
    systemColor: '#e11d48',
    cardBg: 'bg-rose-50/30 hover:bg-rose-50/60',
    borderColor: 'border-rose-200/80 hover:border-rose-400',
    tabColor: '#e11d48',
    pillColor: 'bg-rose-100 text-rose-800 border-rose-200'
  },
  {
    id: 'snabdental',
    name: 'SNAB Dental Clinic & Healthcare Management',
    shortName: 'SNAB Dental Clinic',
    logo: snabDentalLogo,
    url: 'https://snabdental.iftiinhub.com',
    domain: 'snabdental.iftiinhub.com',
    category: 'Dental & Clinical EHR System',
    systemColor: '#d97706',
    cardBg: 'bg-amber-50/30 hover:bg-amber-50/60',
    borderColor: 'border-amber-200/80 hover:border-amber-400',
    tabColor: '#f59e0b',
    pillColor: 'bg-amber-100 text-amber-900 border-amber-200'
  },
  {
    id: 'ntw',
    name: 'NTW Academic & University Portal (Hormuud University)',
    shortName: 'Hormuud University (NTW)',
    logo: ntwHuLogo,
    url: 'https://ntw.hu.edu.so',
    domain: 'ntw.hu.edu.so',
    category: 'Higher Education Management System',
    systemColor: '#16a34a',
    cardBg: 'bg-emerald-50/30 hover:bg-emerald-50/60',
    borderColor: 'border-emerald-200/80 hover:border-emerald-400',
    tabColor: '#16a34a',
    pillColor: 'bg-emerald-100 text-emerald-800 border-emerald-200'
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
          OUR CUSTOMERS SECTION (System Color Accents, No Blue)
      ═════════════════════════════════════════════════════════════════════ */}
      <section id="our-customers" className="py-16 sm:py-24 bg-gradient-to-b from-slate-50/80 via-white to-slate-50/60 border-y border-slate-200 relative overflow-hidden">
        
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Header (IftiinHub Brand Gold/Amber Style) */}
          <div className="text-center sm:text-left mb-12">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight flex items-baseline justify-center sm:justify-start gap-2.5">
              <span>Our</span>
              <span className="text-amber-500 relative inline-block">
                Customer
                {/* Hand-drawn Amber/Gold Underline */}
                <svg
                  className="absolute -bottom-2.5 left-0 w-full h-3.5 text-amber-500 overflow-visible"
                  viewBox="0 0 100 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 9C28 2 72 2 98 9"
                    stroke="#f59e0b"
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

          {/* ── 3 CUSTOMER LOGO CARDS WITH SYSTEM IDENTITY COLORS ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 mb-12">
            {customerLogos.map((cust) => (
              <a
                key={cust.id}
                href={cust.url}
                target="_blank"
                rel="noopener noreferrer"
                className="relative group cursor-pointer transition-all duration-300 hover:-translate-y-2 block"
              >
                {/* System Color Shadow / Bottom Accent Tab */}
                <div
                  className="absolute -bottom-2.5 right-6 w-24 h-4 rounded-full transition-all duration-300 opacity-80 group-hover:opacity-100 group-hover:w-32 shadow-md"
                  style={{ backgroundColor: cust.tabColor }}
                ></div>

                {/* White Logo Card with System Color Accents */}
                <div className={`relative bg-white rounded-2xl border-2 p-6 sm:p-8 flex flex-col items-center justify-between h-56 shadow-lg transition-all duration-300 ${cust.borderColor} ${cust.cardBg}`}>
                  
                  {/* Category Pill with System Color */}
                  <div className="w-full flex items-center justify-between mb-2">
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${cust.pillColor}`}>
                      {cust.category}
                    </span>
                    <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      Live
                    </span>
                  </div>

                  {/* Real Customer Logo Image */}
                  <div className="w-full h-24 flex items-center justify-center p-2">
                    <img
                      src={cust.logo}
                      alt={cust.name}
                      className="max-h-20 max-w-[200px] w-auto h-auto object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  {/* Domain & Visit Link with System Color */}
                  <div className="w-full pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs font-mono font-bold text-slate-800">
                    <span className="group-hover:text-slate-950 transition-colors">
                      {cust.domain}
                    </span>
                    <span
                      className="font-sans font-bold flex items-center gap-1 transition-transform group-hover:translate-x-1"
                      style={{ color: cust.systemColor }}
                    >
                      Visit System →
                    </span>
                  </div>

                </div>
              </a>
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