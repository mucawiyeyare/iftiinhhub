import React from 'react';
import { Link } from 'react-router-dom';
import PageTitle from '../components/PageTitle';
import fullstackImg from '../assets/program-fullstack.png';
import dataAnalysisImg from '../assets/program-data-analysis.png';

const academyPrograms = [
  {
    id: 'fullstack-web',
    image: fullstackImg,
    badge: 'MERN Engineering Track',
    title: 'ASSOCIATE FULL-STACK WEB DEVELOPER',
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
    title: 'ASSOCIATE DATA ANALYST (EXCEL & POWER BI)',
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

const ictServices = [
  {
    icon: '🏫',
    title: 'University & School Portals',
    desc: 'Student admission, grade books, fees management, attendance tracking, and parent/teacher portals.'
  },
  {
    icon: '🏥',
    title: 'Hospital & Clinic Information Systems',
    desc: 'Patient digital records (EHR), doctor schedules, appointments, pharmacy, laboratory workflows, and invoicing.'
  },
  {
    icon: '💼',
    title: 'Enterprise Business ERPs & Accounting',
    desc: 'Inventory control, Point of Sale (POS), staff payroll, expense tracking, and real-time financial reporting.'
  },
  {
    icon: '☁️',
    title: 'Cloud Infrastructure & Database Setup',
    desc: 'Linux VPS configuration, database optimization, SSL security, automated nightly backups, and IT support.'
  }
];

const TrainingPrograms = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900 transition-colors duration-300">
      <PageTitle title="Live Online Training Programs - IFTIINHUB" />

      {/* ── Top Header (Clean White Design) ── */}
      <section className="py-12 sm:py-16 bg-gradient-to-b from-amber-500/10 via-white to-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-300 text-amber-800 text-xs sm:text-sm font-bold uppercase tracking-wider mb-4 shadow-sm">
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

      {/* ── Training Programs Cards Section (Software Academy Style) ── */}
      <section className="py-12 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="badge-brand-gold mb-2">Cohort Programs</span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
            Available Live Zoom Bootcamps
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
            Choose your learning track. Each program is delivered live on Zoom with direct mentorship and project reviews.
          </p>
        </div>

        {/* 2 Main Program Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {academyPrograms.map((program) => (
            <div
              key={program.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
            >
              <div>
                {/* Real Image Container (Software Academy style) */}
                <div className="relative bg-white border-b border-slate-100 p-6 flex items-center justify-center overflow-hidden">
                  <img
                    src={program.image}
                    alt={program.title}
                    className="w-full h-auto max-h-64 object-contain rounded-xl transform group-hover:scale-102 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4 bg-amber-500 text-slate-950 font-black text-xs px-3 py-1 rounded-full shadow-md">
                    {program.badge}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 sm:p-8">
                  {/* Mode & Duration Row */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold">
                      {program.mode}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      ⏱️ {program.duration}
                    </span>
                  </div>

                  {/* Title (Software Academy uppercase bold) */}
                  <h3 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight mb-2">
                    {program.title}
                  </h3>

                  <p className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-4">
                    {program.subtitle}
                  </p>

                  <p className="text-sm text-slate-600 leading-relaxed mb-6">
                    {program.description}
                  </p>

                  {/* Curriculum Breakdown */}
                  <div className="mb-6 p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <span>📚</span> Syllabus &amp; Core Topics:
                    </h4>
                    <ul className="space-y-2">
                      {program.curriculum.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                          <span className="text-amber-500 font-bold shrink-0">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Program Features */}
                  <div className="mb-6">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                      What is Included:
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 font-medium">
                      {program.features.map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-lg border border-slate-100">
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
                <a
                  href={`https://wa.me/616408886?text=${encodeURIComponent(program.whatsappMsg)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-brand-primary flex-1 text-center text-sm py-3 justify-center"
                >
                  💬 Register via WhatsApp
                </a>
                <Link
                  to="/student-register"
                  className="btn-brand-dark text-center text-sm py-3 px-5 justify-center"
                >
                  📝 Student Sign Up
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Enterprise ICT Systems Building Section (Clean White) ── */}
      <section className="py-16 sm:py-20 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="badge-brand-gold mb-2">Institutional Systems</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
              We Also Build Custom ICT &amp; Enterprise Systems
            </h2>
            <p className="mt-3 text-slate-600 max-w-2xl mx-auto text-sm sm:text-base">
              IftiinHub builds modern software systems and cloud database infrastructure for schools, universities, hospitals, and businesses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {ictServices.map((srv, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="text-3xl mb-3 p-3 bg-amber-50 rounded-xl w-fit border border-amber-200">
                    {srv.icon}
                  </div>
                  <h3 className="text-base font-bold text-slate-950 mb-2">
                    {srv.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {srv.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Consultation CTA Banner */}
          <div className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 rounded-2xl p-8 text-slate-950 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div>
              <h3 className="text-xl sm:text-2xl font-black mb-1">
                Need a Custom ICT System for Your Institution?
              </h3>
              <p className="text-slate-900 font-medium text-xs sm:text-sm max-w-xl">
                Contact our senior software engineering team to discuss your project requirements and receive a customized quote.
              </p>
            </div>
            <a
              href="https://wa.me/616408886?text=Salaan!%20Waxaan%20doonayaa%20in%20aan%20kala%20hadlo%20dhismaha%20nidaam%20ICT."
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl bg-slate-950 text-white font-bold text-sm hover:bg-zinc-800 transition-all shadow-md shrink-0 inline-flex items-center gap-2"
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
              How do I get instructor support between live classes?
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Each student is added to an active WhatsApp group and has direct 1-on-1 access to instructors for code debugging, assignment reviews, and question answering.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TrainingPrograms;
