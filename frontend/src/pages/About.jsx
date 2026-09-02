import React from 'react';
import { Link } from 'react-router-dom';
import PageTitle from '../components/PageTitle';

const About = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <PageTitle title="About Us - IFTIINHUB" />

      {/* ── Hero Banner ── */}
      <section className="relative overflow-hidden py-14 sm:py-20 bg-gradient-to-b from-amber-500/10 via-white to-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-300 text-amber-800 text-xs sm:text-sm font-bold uppercase tracking-wider mb-4 shadow-sm">
            💡 About IftiinHub
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight max-w-4xl mx-auto leading-tight">
            Illuminating Minds, <span className="text-amber-500">Engineering Systems</span>
          </h1>
          <p className="mt-6 text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            IftiinHub was founded with a unified mission: to bridge the digital skills gap through live interactive Zoom tech education and to engineer reliable ICT management systems for institutions.
          </p>
        </div>
      </section>

      {/* ── Our Mission & Vision ── */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="badge-brand-gold mb-3">Who We Are</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-950 tracking-tight mb-6">
              A Hub for Technology, Learning &amp; Innovation
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-4">
              At IftiinHub, we deliver intensive live Zoom training programs in <strong className="text-slate-900">Full-Stack Web Development</strong> and <strong className="text-slate-900">Data Analysis (Excel &amp; Power BI)</strong> that take learners from complete beginners to production-ready software engineers and data analysts.
            </p>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6">
              Concurrently, our software engineering team acts as an ICT solutions partner for universities, schools, hospitals, and enterprises across the region — designing high-performance management systems and cloud architectures.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-200">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="text-2xl sm:text-3xl font-black text-amber-500 mb-1">Live Zoom</div>
                <div className="text-xs sm:text-sm font-semibold text-slate-700">Interactive Coding</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="text-2xl sm:text-3xl font-black text-slate-950 mb-1">Bilingual</div>
                <div className="text-xs sm:text-sm font-semibold text-slate-700">Somali &amp; English</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl">
            <h3 className="text-xl font-bold text-slate-950 mb-6 flex items-center gap-2">
              <span>🎯</span> Our Core Values
            </h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-lg shrink-0 text-amber-700 font-bold">
                  1
                </div>
                <div>
                  <h4 className="font-bold text-slate-950 text-base">Practical Relevance First</h4>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1">
                    No dry theories without code. Every lesson translates into a portfolio piece or working software system.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-lg shrink-0 text-amber-700 font-bold">
                  2
                </div>
                <div>
                  <h4 className="font-bold text-slate-950 text-base">Accessibility &amp; Language</h4>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1">
                    Making advanced technical concepts easy to understand through mother-tongue Somali explanations and standard English syntax.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-lg shrink-0 text-amber-700 font-bold">
                  3
                </div>
                <div>
                  <h4 className="font-bold text-slate-950 text-base">Enterprise Quality</h4>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1">
                    We build software systems with industry-grade security, scalability, and automated data backup standards.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Contact CTA ── */}
      <section className="py-16 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-200">
        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-950 tracking-tight mb-4">
          Want to Learn or Partner With Us?
        </h2>
        <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto mb-8">
          Whether you want to enroll in an upcoming live Zoom bootcamp or consult on a software project for your organization, we are here to help.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/training-programs" className="btn-brand-primary text-sm sm:text-base px-6 py-3">
            🚀 View Training Programs
          </Link>
          <a
            href="https://wa.me/616408886?text=Salaan!%20Waxaan%20doonayaa%20in%20aan%20la%20xiriiro%20IftiinHub."
            target="_blank"
            rel="noopener noreferrer"
            className="btn-brand-dark text-sm sm:text-base px-6 py-3"
          >
            💬 Contact via WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
};

export default About;
