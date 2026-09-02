import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import PageTitle from '../components/PageTitle';
import logoImg from '../assets/logo-transparent.png';

const VerifyCertificate = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [certificateId, setCertificateId] = useState(searchParams.get('id') || '');
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  // Auto-verify if ID is in URL query param
  useEffect(() => {
    const idFromUrl = searchParams.get('id');
    if (idFromUrl && idFromUrl.trim()) {
      setCertificateId(idFromUrl.trim());
      handleVerify(idFromUrl.trim());
    }
  }, [searchParams]);

  const handleVerify = async (idToVerify) => {
    const id = (idToVerify || certificateId).trim();
    if (!id) {
      setError('Please enter a valid certificate ID');
      return;
    }

    setLoading(true);
    setError('');
    setSearched(true);
    setResult(null);

    // Update URL query param without full reload
    setSearchParams({ id });

    try {
      // Direct API call
      const response = await axios.get(`/certificates/verify/${encodeURIComponent(id)}`);
      if (response.data && response.data.certificate) {
        setResult(response.data.certificate);
      } else {
        setError('Certificate record not found.');
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('No verified certificate found with this ID. Please check the code and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleVerify();
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/verify-certificate?id=${encodeURIComponent(result?.certificateId || certificateId)}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  const sampleIds = ['NTW-YEAR-A1B2C3D4', 'IFT-2025-WEB01', 'IFT-2025-DATA02'];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8 selection:bg-amber-500 selection:text-black">
      <PageTitle title="Verify Certificate - IftiinHub" />

      {/* Print Stylesheet */}
      <style>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          .no-print {
            display: none !important;
          }
          .print-container {
            box-shadow: none !important;
            border: 2px solid #b45309 !important;
            background: #ffffff !important;
            color: #0f172a !important;
            margin: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            page-break-inside: avoid;
          }
          .print-text-dark {
            color: #0f172a !important;
          }
          .print-text-muted {
            color: #475569 !important;
          }
        }
      `}</style>

      <div className="max-w-4xl mx-auto">
        {/* Top Header / Breadcrumb */}
        <div className="text-center mb-10 no-print">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            Official Credential Verification Portal
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Verify IftiinHub Certificates
          </h1>
          <p className="mt-3 text-slate-400 text-base max-w-2xl mx-auto">
            Instantly authenticate official graduation certificates and training credentials issued by IftiinHub Academy.
          </p>
        </div>

        {/* ── Search Box Container (Matches requested UI) ── */}
        <div className="bg-[#0b131f] border border-slate-800/90 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/50 mb-10 no-print">
          <h2 className="text-xl font-bold text-white mb-1.5 flex items-center gap-2">
            Enter certificate ID
          </h2>
          <p className="text-sm text-slate-400 mb-6">
            The ID is case-insensitive and may include letters, numbers, and hyphens.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 items-stretch">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={certificateId}
                onChange={(e) => setCertificateId(e.target.value)}
                placeholder="E.G. NTW-YEAR-A1B2C3D4"
                className="w-full pl-11 pr-4 py-3.5 bg-[#070d18] text-white placeholder-slate-500 rounded-xl border border-emerald-900/60 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition duration-200 font-mono text-sm tracking-wider uppercase"
              />
              {certificateId && (
                <button
                  type="button"
                  onClick={() => setCertificateId('')}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-slate-950 font-bold px-7 py-3.5 rounded-xl transition duration-200 shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 text-sm sm:text-base whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-slate-950" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Verifying...
                </>
              ) : (
                'Verify Certificate'
              )}
            </button>
          </form>

          {/* Quick Demo Samples */}
          <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-2 text-xs text-slate-400">
            <span className="font-medium text-slate-300">Try sample IDs:</span>
            {sampleIds.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setCertificateId(id);
                  handleVerify(id);
                }}
                className="px-2.5 py-1 rounded-md bg-slate-800/90 text-amber-400 hover:bg-amber-500/20 hover:text-amber-300 border border-slate-700/60 font-mono transition"
              >
                {id}
              </button>
            ))}
          </div>
        </div>

        {/* ── ERROR / NOT FOUND STATE ── */}
        {searched && !loading && error && (
          <div className="bg-red-950/40 border border-red-800/60 rounded-2xl p-6 sm:p-8 mb-10 text-center animate-fadeIn no-print">
            <div className="w-14 h-14 bg-red-900/40 border border-red-700/50 text-red-400 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              ✕
            </div>
            <h3 className="text-xl font-bold text-red-200 mb-2">Certificate Not Found</h3>
            <p className="text-slate-300 text-sm max-w-lg mx-auto mb-4">
              {error}
            </p>
            <div className="text-xs text-slate-400 bg-slate-900/80 border border-slate-800 p-4 rounded-xl max-w-md mx-auto text-left space-y-1">
              <p className="font-semibold text-slate-300">💡 Quick Troubleshooting:</p>
              <p>• Make sure there are no typos in your certificate ID.</p>
              <p>• IDs typically look like <span className="font-mono text-amber-400">NTW-YEAR-A1B2C3D4</span> or <span className="font-mono text-amber-400">IFT-2025-XXXXXX</span>.</p>
              <p>• If you believe this is an error, please contact <a href="mailto:support@iftiinhhub.com" className="text-amber-400 underline">support@iftiinhhub.com</a>.</p>
            </div>
          </div>
        )}

        {/* ── VERIFIED RESULT DISPLAY ── */}
        {searched && !loading && result && (
          <div className="space-y-6 animate-fadeIn">
            {/* Top Verification Status Badge & Actions Bar */}
            <div className="bg-emerald-950/40 border border-emerald-700/60 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg shadow-emerald-950/30 no-print">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-xl flex-shrink-0">
                  ✓
                </div>
                <div>
                  <h3 className="text-emerald-300 font-bold text-base sm:text-lg flex items-center gap-2">
                    Official Certificate Verified
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold uppercase">
                      {result.status || 'Valid'}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-300">
                    Certificate ID: <span className="font-mono font-bold text-amber-400">{result.certificateId}</span>
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                <button
                  onClick={handleCopyLink}
                  className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                  title="Copy verification link"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  {copied ? 'Link Copied!' : 'Share Link'}
                </button>

                <button
                  onClick={handlePrint}
                  className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-md shadow-amber-500/20"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Print / Save PDF
                </button>
              </div>
            </div>

            {/* ── OFFICIAL CERTIFICATE DOCUMENT CARD (PRINTABLE) ── */}
            <div className="print-container bg-gradient-to-b from-white via-amber-50/20 to-white text-slate-900 border-8 border-amber-600/30 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
              {/* Outer Golden Border Corner Accents */}
              <div className="absolute top-3 left-3 w-10 h-10 border-t-2 border-l-2 border-amber-600 pointer-events-none"></div>
              <div className="absolute top-3 right-3 w-10 h-10 border-t-2 border-r-2 border-amber-600 pointer-events-none"></div>
              <div className="absolute bottom-3 left-3 w-10 h-10 border-b-2 border-l-2 border-amber-600 pointer-events-none"></div>
              <div className="absolute bottom-3 right-3 w-10 h-10 border-b-2 border-r-2 border-amber-600 pointer-events-none"></div>

              {/* Watermark Background Seal */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
                <img src={logoImg} alt="IftiinHub Seal" className="w-[500px] h-[500px] object-contain" />
              </div>

              {/* Certificate Header */}
              <div className="text-center relative z-10">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <img src={logoImg} alt="IftiinHub Logo" className="h-14 sm:h-16 w-auto object-contain" />
                </div>
                <div className="uppercase tracking-[0.25em] text-xs font-bold text-amber-700 mb-1">
                  IftiinHub Academy & Professional Training
                </div>
                <h2 className="text-2xl sm:text-4xl font-serif font-black text-slate-900 tracking-wide mt-2 mb-3">
                  CERTIFICATE OF COMPLETION
                </h2>
                <div className="w-36 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto mb-6"></div>
              </div>

              {/* Certificate Body */}
              <div className="text-center my-6 relative z-10 max-w-2xl mx-auto space-y-4">
                <p className="text-xs sm:text-sm uppercase tracking-widest text-slate-600 print-text-muted">
                  This is proudly presented to
                </p>
                <h3 className="text-2xl sm:text-4xl font-bold font-serif text-slate-950 border-b-2 border-amber-300/80 pb-3 mx-4 sm:mx-12">
                  {result.studentName}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 print-text-muted leading-relaxed pt-2">
                  for successfully completing all curriculum requirements, rigorous hands-on projects, and practical assessments in
                </p>
                <div className="text-lg sm:text-2xl font-extrabold text-amber-800 bg-amber-100/50 py-2.5 px-6 rounded-xl inline-block border border-amber-200">
                  {result.courseTitle}
                </div>
              </div>

              {/* Skills / Covered Topics (if any) */}
              {result.skills && result.skills.length > 0 && (
                <div className="relative z-10 max-w-xl mx-auto text-center my-4">
                  <div className="flex flex-wrap justify-center gap-1.5">
                    {result.skills.map((skill, idx) => (
                      <span key={idx} className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md border border-slate-200">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Certificate Footer / Signatures & Seal */}
              <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-6 items-end mt-12 pt-8 border-t border-amber-200/80 text-center sm:text-left">
                {/* Left: Issue Date & ID */}
                <div className="space-y-1">
                  <div className="text-xs text-slate-500 font-medium uppercase">Date of Issue</div>
                  <div className="text-sm font-bold text-slate-900">
                    {new Date(result.issueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                  <div className="text-xs text-slate-500 font-medium uppercase pt-2">Certificate ID</div>
                  <div className="text-sm font-mono font-bold text-amber-700 tracking-wider">
                    {result.certificateId}
                  </div>
                </div>

                {/* Center: Official Verified Stamp / Seal */}
                <div className="flex flex-col items-center justify-center">
                  <div className="w-20 h-20 rounded-full border-4 border-double border-amber-600 bg-amber-50 flex flex-col items-center justify-center shadow-md p-1">
                    <span className="text-amber-800 text-[9px] font-black uppercase tracking-tighter text-center">
                      IFTIINHUB
                    </span>
                    <span className="text-lg font-black text-amber-600">★ ★ ★</span>
                    <span className="text-amber-900 text-[8px] font-bold uppercase tracking-tight">
                      VERIFIED
                    </span>
                  </div>
                  <span className="text-[10px] text-amber-800 font-bold uppercase mt-1 tracking-wider">
                    Official Credential
                  </span>
                </div>

                {/* Right: Academic Director Signature */}
                <div className="text-center sm:text-right space-y-1">
                  <div className="font-serif italic text-lg sm:text-xl text-slate-800 tracking-wide font-bold">
                    {result.instructor || 'Eng. Mucawiye'}
                  </div>
                  <div className="w-32 border-t border-slate-400 mx-auto sm:ml-auto sm:mr-0 pt-1"></div>
                  <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Academic Director
                  </div>
                  <div className="text-[10px] text-slate-500">
                    IftiinHub Training Academy
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 text-xs text-slate-400 no-print">
              <div>
                Questions about this credential? Contact <a href="mailto:verify@iftiinhhub.com" className="text-amber-400 underline">verify@iftiinhhub.com</a>.
              </div>
              <Link
                to="/training-programs"
                className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
              >
                Explore More Training Programs →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyCertificate;
