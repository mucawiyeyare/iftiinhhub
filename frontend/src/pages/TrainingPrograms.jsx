import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import PageTitle from '../components/PageTitle';
import fullstackImg from '../assets/program-fullstack.png';
import dataAnalysisImg from '../assets/program-data-analysis.png';
import instructorImg from '../assets/instructor.jpg';

// Real customer logos
import snabDentalLogo from '../assets/customers/snab-dental-logo.png';
import dhiigkaalLogo from '../assets/customers/dhiigkaal-logo.png';
import ntwHuLogo from '../assets/customers/ntw-hu-logo.png';

const academyPrograms = [
  {
    id: 'fullstack-web',
    image: fullstackImg,
    badge: 'MERN Engineering Track',
    title: 'FULL STACK WEB DEVELOPMENT',
    subtitle: 'HTML5, CSS3, Tailwind CSS, JavaScript (ES6+), React.js, Node.js, Express & MongoDB',
    mode: '🎥 Live Interactive via Zoom',
    duration: '16 Weeks • 4 Sessions/Week',
    level: 'Beginner to Professional',
    description: 'Learn modern software engineering through live interactive Zoom classes with senior instructors. Build dynamic user interfaces in React, engineer high-performance REST APIs in Node.js & Express, model scalable MongoDB databases, and deploy live production systems.',
    curriculum: [
      'HTML5, CSS3, Tailwind CSS & Responsive Mobile-First Design',
      'JavaScript ES6+, DOM Manipulation, Async/Await & Event Loop',
      'React.js Component Architecture, Hooks, State & React Router',
      'Node.js & Express RESTful API Development & Middleware',
      'MongoDB & Mongoose Database Schema Design & Queries',
      'Authentication (JWT), Role-Based Access Control & Security',
      'Git, GitHub Version Control, VPS Cloud Hosting & Domain Setup'
    ],
    features: [
      '🎥 Live Zoom classes with screen-sharing & live codealong',
      '🛠️ 5 Real-world full-stack portfolio projects',
      '🇸🇴 Direct Somali & English technical instruction',
      '💬 1-on-1 WhatsApp instructor code review & debugging',
      '📜 Official Verified Certificate of Completion',
      '📹 Full video recordings of every live Zoom session provided'
    ],
    whatsappMsg: 'Salaan! Waxaan doonayaa inaan iska diiwaangeliyo Barnaamijka Live Zoom ee Full-Stack Web Development ee IftiinHub.'
  },
  {
    id: 'data-analysis',
    image: dataAnalysisImg,
    badge: 'Data & Analytics Track',
    title: 'DATA ANALYSIS (EXCEL & POWER BI)',
    subtitle: 'Advanced Microsoft Excel, Microsoft Power BI, Power Query, DAX & SQL Fundamentals',
    mode: '🎥 Live Interactive via Zoom',
    duration: '10 Weeks • 3 Sessions/Week',
    level: 'All Levels (Beginner to Advanced)',
    description: 'Master data analysis, data cleaning, and business intelligence reporting. Learn advanced Excel modeling, automated Power Query workflows, complex DAX formulas, and design executive interactive Power BI dashboards to transform raw data into actionable business insights.',
    curriculum: [
      'Advanced Excel: XLOOKUP, VLOOKUP, INDEX/MATCH, Dynamic Arrays',
      'Data Cleaning, Text Transformation & Logical Functions (IF/IFS)',
      'Advanced Pivot Tables, Pivot Charts & Slicers for Quick Analysis',
      'Power Query: ETL (Extract, Transform, Load) & Automated Workflows',
      'Power BI Data Modeling: Star Schemas, Relationships & Cardinality',
      'DAX Mastery: Calculated Columns, Measures & Time-Intelligence',
      'Interactive Dashboard Design, KPI Visuals, Drill-downs & Publishing'
    ],
    features: [
      '🎥 Live Zoom classes with hands-on real dataset exercises',
      '📊 4 Real-world executive business & financial dashboards',
      '🇸🇴 Step-by-step Somali explanation of data concepts',
      '💬 Direct instructor guidance on business problem solving',
      '📜 Official Verified Certificate of Completion',
      '📹 Full video recordings of every live Zoom session provided'
    ],
    whatsappMsg: 'Salaan! Waxaan doonayaa inaan iska diiwaangeliyo Barnaamijka Live Zoom ee Data Analysis (Excel & Power BI) ee IftiinHub.'
  }
];

const builtSystems = [
  {
    id: 'dhiigkaal',
    title: 'Dhiigkaal Blood Bank & Healthcare System',
    shortName: 'Dhiigkaal Blood Bank',
    logo: dhiigkaalLogo,
    url: 'https://dhiigkaal.iftiinhub.com',
    domain: 'dhiigkaal.iftiinhub.com',
    category: 'Healthcare & Blood Bank ERP',
    systemColor: '#e11d48',
    borderColor: 'border-rose-200 hover:border-rose-400',
    bgColor: 'bg-rose-50/20 hover:bg-rose-50/50',
    tabColor: '#e11d48',
    badgeClass: 'bg-rose-100 text-rose-800 border-rose-200',
    desc: 'Electronic blood donor registry, emergency blood matching, hospital lab screening workflows, and real-time blood stock management.',
    features: [
      'Donor Registry & Blood Type Matching',
      'Emergency Dispatch & Request Workflows',
      'Laboratory Screening & Stock Tracking'
    ]
  },
  {
    id: 'snabdental',
    title: 'SNAB Dental Clinic & Healthcare Management',
    shortName: 'SNAB Dental Clinic',
    logo: snabDentalLogo,
    url: 'https://snabdental.iftiinhub.com',
    domain: 'snabdental.iftiinhub.com',
    category: 'Dental & Clinical EHR System',
    systemColor: '#d97706',
    borderColor: 'border-amber-200 hover:border-amber-400',
    bgColor: 'bg-amber-50/20 hover:bg-amber-50/50',
    tabColor: '#f59e0b',
    badgeClass: 'bg-amber-100 text-amber-900 border-amber-200',
    desc: 'Specialized dental clinical management suite with electronic health records (EHR), tooth charting, appointments, and medical billing.',
    features: [
      'Interactive Tooth & Dental Charting',
      'Online Patient Booking & Doctor Schedules',
      'Point of Sale, Invoicing & Receipts'
    ]
  },
  {
    id: 'ntw',
    title: 'National Training Week (Hormuud University)',
    shortName: 'Hormuud University (NTW)',
    logo: ntwHuLogo,
    url: 'https://ntw.hu.edu.so',
    domain: 'ntw.hu.edu.so',
    category: 'University & Academic Portal',
    systemColor: '#16a34a',
    borderColor: 'border-emerald-200 hover:border-emerald-400',
    bgColor: 'bg-emerald-50/20 hover:bg-emerald-50/50',
    tabColor: '#16a34a',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    desc: 'High-performance university academic portal powering student admissions, semester grade books, course syllabi, and verified digital credentials.',
    features: [
      'Student Admissions & Enrollment Hub',
      'Semester Grade Books & Transcripts',
      'Online Credential Verification System'
    ]
  }
];

const TrainingPrograms = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    axios.get('/courses')
      .then(res => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          setCourses(res.data);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900 transition-colors duration-300">
      <PageTitle title="Live Online Training Programs - IFTIINHUB" />

      {/* ── Top Header (Clean White Design) ── */}
      <section className="py-12 sm:py-16 bg-gradient-to-b from-amber-500/10 via-white to-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-300 text-amber-800 text-xs sm:text-sm font-bold uppercase tracking-wider mb-4 shadow-xs">
            <span>🎥</span> Live Interactive Online Classes via Zoom
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight leading-tight">
            IftiinHub <span className="text-amber-500">Training Programs</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Gain high-income software engineering and data analytics skills through live Zoom classes with senior instructors, live coding, and real portfolio projects.
          </p>
        </div>
      </section>

      {/* ── Program Cards (Software Academy Style) ── */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {(courses.length > 0 ? courses : academyPrograms).map((p, idx) => {
            const isDbCourse = !p.id && p._id;
            const courseId = isDbCourse ? p._id : p.id;
            const title = isDbCourse ? p.name : p.title;
            const image = (isDbCourse ? p.imageUrl : p.image) || fullstackImg;
            const duration = isDbCourse ? (p.duration || '12 Weeks') : p.duration;
            const instructor = isDbCourse ? (p.instructor || 'Eng. Abdirahman Mohamed') : 'Eng. Abdirahman Mohamed Ibrahim';
            const instructorImage = isDbCourse ? (p.instructorImage || instructorImg) : instructorImg;
            const description = isDbCourse ? p.description : p.description;
            const badge = isDbCourse ? 'ACADEMY PROGRAM' : p.badge;
            const curriculum = isDbCourse
              ? (Array.isArray(p.whatYouWillLearn) ? p.whatYouWillLearn : [])
              : (p.curriculum || []);
            const features = isDbCourse
              ? [
                  '🎥 Live Zoom classes with screen-sharing & live codealong',
                  '🛠️ Real-world portfolio projects',
                  '💬 1-on-1 WhatsApp instructor support',
                  '📜 Official Verified Certificate of Completion'
                ]
              : (p.features || []);
            const whatsappMsg = isDbCourse
              ? `Salaan! Waxaan doonayaa inaan iska diiwaangeliyo koorsada: ${p.name}.`
              : p.whatsappMsg;
            const linkTo = isDbCourse ? `/courses/${p._id}` : '/student-register';

            return (
              <div
                key={courseId || idx}
                className="bg-white rounded-3xl border border-slate-200 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  {/* Visual Image Header */}
                  <div className="bg-slate-900 p-6 border-b border-slate-100 flex items-center justify-center relative min-h-[240px]">
                    <img
                      src={image}
                      alt={title}
                      className="w-full h-auto max-h-64 object-contain rounded-2xl transform group-hover:scale-102 transition-transform duration-300"
                      onError={(e) => { e.target.src = fullstackImg; }}
                    />
                    <div className="absolute top-4 right-4 bg-amber-500 text-slate-950 font-black text-xs px-3.5 py-1 rounded-full shadow-md">
                      {badge}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 sm:p-8">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold">
                        🎥 Live Interactive via Zoom
                      </span>
                      <span className="text-xs font-semibold text-slate-500">
                        ⏱️ {duration}
                      </span>
                    </div>

                    {/* Course-Name */}
                    <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight mb-2 group-hover:text-amber-600 transition-colors">
                      {title}
                    </h2>

                    {/* Instructor Name & His Image */}
                    <div className="flex items-center gap-2.5 pb-3 mb-4 border-b border-slate-100">
                      <img
                        src={instructorImage}
                        alt={instructor}
                        className="w-9 h-9 rounded-full object-cover border-2 border-amber-500 shadow-sm flex-shrink-0"
                        onError={(e) => { e.target.src = instructorImg; }}
                      />
                      <div className="min-w-0">
                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider leading-none">Instructor</p>
                        <p className="text-sm font-bold text-slate-900 truncate">{instructor}</p>
                      </div>
                    </div>

                    <p className="text-sm text-slate-600 leading-relaxed mb-6">
                      {description}
                    </p>

                    {/* Curriculum / What You'll Learn */}
                    {curriculum.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-1.5">
                          <span>📚</span> {isDbCourse ? 'What You Will Learn' : 'Program Curriculum & Modules'}
                        </h3>
                        <div className="space-y-2">
                          {curriculum.map((topic, i) => (
                            <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                              <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                                {i + 1}
                              </span>
                              <span>{topic}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Program Highlights */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
                        What's Included:
                      </h4>
                      {features.map((feat, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                          <span className="text-amber-500 font-bold">✓</span>
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
                  <a
                    href={`https://wa.me/616408886?text=${encodeURIComponent(whatsappMsg)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-brand-primary flex-1 text-center text-sm py-3 justify-center"
                  >
                    💬 Register via WhatsApp
                  </a>
                  <Link
                    to={linkTo}
                    className="btn-brand-dark text-center text-sm py-3 px-5 justify-center"
                  >
                    {isDbCourse ? 'View Course →' : '📝 Student Sign Up'}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Real Enterprise Systems Built By Us ── */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-slate-50/80 via-white to-slate-50/60 border-y border-slate-200 relative overflow-hidden">
        
        {/* Dot pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center mb-12">
            <span className="badge-brand-gold mb-2">Live Production Systems</span>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight flex items-baseline justify-center gap-2">
              <span>Real Systems</span>
              <span className="text-amber-500 relative inline-block">
                Built By Us
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
            <p className="mt-5 text-slate-600 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
              We design, build, and deploy mission-critical web applications, electronic medical records, blood bank registries, and university management portals.
            </p>
          </div>

          {/* 3 Real System Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 mb-12">
            {builtSystems.map((sys) => (
              <a
                key={sys.id}
                href={sys.url}
                target="_blank"
                rel="noopener noreferrer"
                className="relative group cursor-pointer transition-all duration-300 hover:-translate-y-2 block"
              >
                {/* System Color Accent Shadow Tab */}
                <div
                  className="absolute -bottom-2.5 right-6 w-24 h-4 rounded-full transition-all duration-300 opacity-80 group-hover:opacity-100 group-hover:w-32 shadow-md"
                  style={{ backgroundColor: sys.tabColor }}
                ></div>

                {/* White Card with System Accent */}
                <div className={`relative bg-white rounded-2xl border-2 p-6 sm:p-7 flex flex-col justify-between h-full shadow-lg transition-all duration-300 ${sys.borderColor} ${sys.bgColor}`}>
                  
                  <div>
                    {/* Header Badges */}
                    <div className="w-full flex items-center justify-between mb-4">
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${sys.badgeClass}`}>
                        {sys.category}
                      </span>
                      <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Live
                      </span>
                    </div>

                    {/* Logo Image */}
                    <div className="w-full h-24 flex items-center justify-center p-2 mb-4 bg-white rounded-xl border border-slate-100 shadow-xs">
                      <img
                        src={sys.logo}
                        alt={sys.title}
                        className="max-h-20 max-w-[180px] w-auto h-auto object-contain transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>

                    <h3 className="text-lg font-black text-slate-950 mb-2">
                      {sys.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                      {sys.desc}
                    </p>

                    {/* Feature bullet points */}
                    <div className="space-y-1.5 mb-6">
                      {sys.features.map((f, fIdx) => (
                        <div key={fIdx} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                          <span className="text-emerald-600 font-black">✓</span>
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Domain & Direct Link */}
                  <div className="w-full pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs font-mono font-bold text-slate-800">
                    <span className="group-hover:text-slate-950 transition-colors">
                      {sys.domain}
                    </span>
                    <span
                      className="font-sans font-bold flex items-center gap-1 transition-transform group-hover:translate-x-1"
                      style={{ color: sys.systemColor }}
                    >
                      Visit System →
                    </span>
                  </div>

                </div>
              </a>
            ))}
          </div>

          {/* Consultation CTA Banner */}
          <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 rounded-3xl p-8 sm:p-12 text-slate-950 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-black/10 text-slate-950 text-xs font-black uppercase tracking-wider mb-2">
                Enterprise Custom Engineering
              </span>
              <h3 className="text-2xl sm:text-3xl font-black mb-1">
                Need a Custom ICT System for Your Institution?
              </h3>
              <p className="text-slate-950/90 font-medium text-xs sm:text-sm max-w-xl">
                Contact our senior software engineering team to discuss your project requirements and receive a customized quote.
              </p>
            </div>
            <a
              href="https://wa.me/616408886?text=Salaan!%20Waxaan%20doonayaa%20in%20aan%20kala%20hadlo%20dhismaha%20nidaam%20ICT."
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-xl bg-slate-950 text-white font-bold text-sm hover:bg-zinc-800 transition-all shadow-md shrink-0 inline-flex items-center gap-2"
            >
              💬 Request System Consultation
            </a>
          </div>

        </div>
      </section>

      {/* ── FAQ: Live Zoom Classes ── */}
      <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
            <h3 className="font-bold text-base text-slate-950 mb-2">
              Are classes conducted live on Zoom?
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Yes! All our training programs are conducted live online via Zoom with interactive screen-sharing, live coding sessions, and direct Q&amp;A with instructors. Full video recordings of each session are also provided for your revision.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
            <h3 className="font-bold text-base text-slate-950 mb-2">
              What language is used during Zoom sessions?
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Instructors explain all concepts in clear, easy-to-understand Somali, while using international English coding terminology, documentation, and syntax.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
            <h3 className="font-bold text-base text-slate-950 mb-2">
              Will I receive a verified certificate upon completion?
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Yes. Upon completing your coursework and submitting your portfolio capstone project, an official verifiable certificate with a unique Verification ID and QR code is issued directly to your student dashboard.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TrainingPrograms;
