import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import PageTitle from '../components/PageTitle';
import fullstackImg from '../assets/program-fullstack.png';
import dataAnalysisImg from '../assets/program-data-analysis.png';

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
                  {/* Full-bleed cover image */}
                  <div className="bg-slate-900 relative h-60 sm:h-72 overflow-hidden">
                    <img
                      src={image}
                      alt={title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => { e.target.src = fullstackImg; }}
                    />
                    <div className="absolute top-4 right-4 bg-amber-500 text-slate-950 font-black text-xs px-3.5 py-1 rounded-full shadow-md">
                      {badge}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 sm:p-8">
                    <h2 className="text-lg sm:text-xl font-extrabold text-slate-950 leading-snug mb-2 group-hover:text-amber-600 transition-colors">
                      {title}
                    </h2>

                    <p className="text-sm text-slate-500 leading-relaxed mb-4">
                      {description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 pt-4 mb-6 border-t border-slate-100">
                      <span className="px-2.5 py-1 rounded border border-slate-200 bg-slate-50 text-[11px] text-slate-500">Live Interactive via Zoom</span>
                      <span className="px-2.5 py-1 rounded border border-slate-200 bg-slate-50 text-[11px] text-slate-500">{instructor}</span>
                      <span className="px-2.5 py-1 rounded border border-slate-200 bg-slate-50 text-[11px] text-slate-500">⏱️ {duration}</span>
                    </div>

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
