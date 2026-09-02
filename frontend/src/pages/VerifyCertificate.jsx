import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import PageTitle from '../components/PageTitle';
import IftiinCertificate from '../components/IftiinCertificate';

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
    <div className="min-h-screen bg-white text-slate-800 py-12 px-4 sm:px-6 lg:px-8 selection:bg-amber-500 selection:text-black">
      <PageTitle title="Verify Certificate - IftiinHub" />

      {/* Print Stylesheet for Exact Dark-Gold Certificate PDF Output */}
      <style>{`
        @media print {
          @page {
            size: landscape;
            margin: 0;
          }
          html, body {
            background: #0A0E1A !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .no-print {
            display: none !important;
          }
          .print-certificate-container {
            width: 100vw !important;
            height: 100vh !important;
            max-width: none !important;
            border-radius: 0 !important;
            border: none !important;
            box-shadow: none !important;
            margin: 0 !important;
            padding: 3rem !important;
            page-break-inside: avoid !important;
            page-break-after: avoid !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>

      <div className="max-w-4xl mx-auto">
        {/* Top Header */}
        <div className="text-center mb-10 no-print">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            Official Credential Verification Portal
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Verify IftiinHub Certificates
          </h1>
          <p className="mt-3 text-slate-600 text-base max-w-2xl mx-auto">
            Instantly authenticate official graduation certificates and training credentials issued by IftiinHub Academy.
          </p>
        </div>

        {/* ── Search Box Container ── */}
        <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 sm:p-8 shadow-lg shadow-slate-100 mb-10 no-print">
          <h2 className="text-xl font-bold text-slate-900 mb-1.5 flex items-center gap-2">
            Enter certificate ID
          </h2>
          <p className="text-sm text-slate-500 mb-6">
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
                className="w-full pl-11 pr-10 py-3.5 bg-slate-50 text-slate-900 placeholder-slate-400 rounded-xl border border-slate-300 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition duration-200 font-mono text-sm tracking-wider uppercase font-semibold"
              />
              {certificateId && (
                <button
                  type="button"
                  onClick={() => setCertificateId('')}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 cursor-pointer"
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
              className="bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-black px-7 py-3.5 rounded-xl transition duration-200 shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 text-sm sm:text-base whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
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
          <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-700">Try sample IDs:</span>
            {sampleIds.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setCertificateId(id);
                  handleVerify(id);
                }}
                className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 hover:bg-amber-100 hover:text-amber-900 border border-slate-200 font-mono transition font-medium cursor-pointer"
              >
                {id}
              </button>
            ))}
          </div>
        </div>

        {/* ── ERROR / NOT FOUND STATE ── */}
        {searched && !loading && error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 sm:p-8 mb-10 text-center animate-fadeIn no-print">
            <div className="w-14 h-14 bg-red-100 border border-red-200 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              ✕
            </div>
            <h3 className="text-xl font-bold text-red-900 mb-2">Certificate Not Found</h3>
            <p className="text-red-700 text-sm max-w-lg mx-auto mb-4">
              {error}
            </p>
            <div className="text-xs text-slate-600 bg-white border border-red-100 p-4 rounded-xl max-w-md mx-auto text-left space-y-1 shadow-sm">
              <p className="font-semibold text-slate-800">💡 Quick Troubleshooting:</p>
              <p>• Make sure there are no typos in your certificate ID.</p>
              <p>• IDs typically look like <span className="font-mono text-amber-700 font-bold">NTW-YEAR-A1B2C3D4</span> or <span className="font-mono text-amber-700 font-bold">IFT-2025-XXXXXX</span>.</p>
              <p>• If you need assistance, contact <a href="mailto:support@iftiinhhub.com" className="text-amber-700 underline font-semibold">support@iftiinhhub.com</a>.</p>
            </div>
          </div>
        )}

        {/* ── VERIFIED RESULT DISPLAY ── */}
        {searched && !loading && result && (
          <div className="space-y-6 animate-fadeIn">
            {/* Top Verification Status Badge & Actions Bar */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm no-print">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black text-xl flex-shrink-0 shadow-sm">
                  ✓
                </div>
                <div>
                  <h3 className="text-emerald-950 font-bold text-base sm:text-lg flex items-center gap-2">
                    Official Certificate Verified
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold uppercase">
                      {result.status || 'Valid'}
                    </span>
                  </h3>
                  <p className="text-xs text-emerald-800">
                    Certificate ID: <span className="font-mono font-bold text-amber-700">{result.certificateId}</span>
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                <button
                  onClick={handleCopyLink}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition shadow-sm cursor-pointer"
                  title="Copy verification link"
                >
                  <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  {copied ? 'Link Copied!' : 'Share Link'}
                </button>

                <button
                  onClick={handlePrint}
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 text-xs font-black flex items-center justify-center gap-1.5 transition shadow-md cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Print / Save PDF
                </button>
              </div>
            </div>

            {/* ── OFFICIAL LUXURY CERTIFICATE CARD (Matching certificate Iftiin Hub (1).pdf) ── */}
            <div className="print-certificate-container">
              <IftiinCertificate certificate={result} isPrintMode={true} />
            </div>

            {/* Bottom Navigation */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 text-xs text-slate-500 no-print">
              <div>
                Questions about this credential? Contact <a href="mailto:verify@iftiinhhub.com" className="text-amber-700 underline font-semibold">verify@iftiinhhub.com</a>.
              </div>
              <Link
                to="/training-programs"
                className="text-amber-700 hover:text-amber-800 font-bold flex items-center gap-1"
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
