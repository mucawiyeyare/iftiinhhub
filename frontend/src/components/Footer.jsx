import React from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../assets/logo-transparent.png';

const Footer = () => {
  return (
    <footer className="bg-slate-50 text-slate-700 border-t-2 border-amber-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Column 1: Brand Info */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="inline-flex items-center gap-3 mb-5">
              <img
                src={logoImg}
                alt="IftiinHub Logo"
                className="h-10 w-auto object-contain"
              />
            </Link>
            <p className="text-sm text-slate-600 max-w-md leading-relaxed mb-6">
              IftiinHub provides live online Zoom tech bootcamps in <strong className="text-slate-900">Full-Stack Web Development</strong> and <strong className="text-slate-900">Data Analysis (Excel &amp; Power BI)</strong>, and engineers custom enterprise software management systems for institutions across the region.
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-amber-800">
              <span>💡 Live Zoom Tech Bootcamps</span>
              <span>•</span>
              <span>⚡ Enterprise ICT Systems</span>
              <span>•</span>
              <span>📜 Verified Credentials</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-950 mb-4">
              Navigation
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="text-slate-600 hover:text-amber-600 font-medium transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-slate-600 hover:text-amber-600 font-medium transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/training-programs" className="text-slate-600 hover:text-amber-600 font-medium transition-colors">
                  Training Programs
                </Link>
              </li>
              <li>
                <Link to="/verify-certificate" className="text-slate-600 hover:text-amber-600 font-medium transition-colors flex items-center gap-1.5">
                  <span>📜</span>
                  <span>Verify Certificate</span>
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-600 hover:text-amber-600 font-medium transition-colors">
                  Contact &amp; Consultation
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-slate-600 hover:text-amber-600 font-medium transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/student-register" className="text-slate-600 hover:text-amber-600 font-medium transition-colors">
                  Student Registration
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Live Zoom Tracks & Support */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-950 mb-4">
              Programs &amp; Support
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-600">
              <li className="font-medium">Full-Stack Web Developer (Zoom)</li>
              <li className="font-medium">Data Analyst - Excel &amp; Power BI (Zoom)</li>
              <li className="font-medium">University &amp; School Portals</li>
              <li className="font-medium">Hospital Management Systems</li>
              <li className="pt-2">
                <a
                  href="https://wa.me/616408886?text=Salaan!%20Waxaan%20doonayaa%20in%20aan%20la%20xiriiro%20IftiinHub."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-amber-700 hover:text-amber-800 font-bold"
                >
                  <span>💬 WhatsApp: +252 61 6408886</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} IftiinHub. All rights reserved. Live interactive online education &amp; software engineering.
          </div>
          <div className="flex gap-6">
            <Link to="/about" className="hover:text-slate-800">Privacy &amp; Terms</Link>
            <Link to="/contact" className="hover:text-slate-800">Help Desk</Link>
            <Link to="/verify-certificate" className="hover:text-slate-800">Verify Certificate</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;