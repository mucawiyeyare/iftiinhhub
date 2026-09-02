import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import PageTitle from '../components/PageTitle';

const Contact = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', whatsapp: '', message: '' });
  const [sent, setSent] = useState(false);
  const [isEnrollmentRequest, setIsEnrollmentRequest] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state) {
      const { subject, message, courseDetails } = location.state;
      if (subject && message) {
        setIsEnrollmentRequest(true);
        setForm({
          name: user?.name || '',
          email: user?.email || '',
          whatsapp: '',
          message: message
        });
      }
    }
  }, [location.state, user]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await axios.post('/messages', {
        name: form.name,
        email: form.email,
        whatsapp: form.whatsapp,
        message: form.message,
        type: isEnrollmentRequest ? 'enrollment_request' : 'general',
        courseDetails: isEnrollmentRequest ? location.state?.courseDetails : null,
        subject: isEnrollmentRequest ? location.state?.subject : 'General Inquiry / ICT Consultation',
      });
      setSent(true);
      setTimeout(() => setSent(false), 5000);
      setForm({ name: '', email: '', whatsapp: '', message: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <PageTitle title="Contact & Consultation - IFTIINHUB" />

      {/* ── Header Banner (Pure White with Light Gold Accent) ── */}
      <section className="py-12 sm:py-16 bg-gradient-to-b from-amber-500/10 via-white to-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-300 text-amber-800 text-xs sm:text-sm font-bold uppercase tracking-wider mb-4 shadow-sm">
            <span>📩</span> Get In Touch
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight">
            Contact &amp; <span className="text-amber-500">ICT Consultation</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-xl mx-auto">
            Have questions regarding our live Zoom training programs or need a custom enterprise software system? Send us a message or chat with us on WhatsApp.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center text-2xl shrink-0">
              ✉️
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-950">Email Address</h3>
              <p className="text-sm text-slate-600">info@iftiinhub.com</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center text-2xl shrink-0">
              💬
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-950">WhatsApp &amp; Phone</h3>
              <a
                href="https://wa.me/616408886?text=Salaan!%20Waxaan%20doonayaa%20in%20aan%20la%20xiriiro%20IftiinHub."
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-bold text-amber-600 hover:underline"
              >
                +252 61 6408886
              </a>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center text-2xl shrink-0">
              📍
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-950">Location</h3>
              <p className="text-sm text-slate-600">Mogadishu, Somalia</p>
            </div>
          </div>
        </div>

        {/* Message Form Card */}
        <div className="bg-white rounded-3xl shadow-lg border border-slate-200 p-8 sm:p-12 max-w-3xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-black text-slate-950 mb-2">
              {isEnrollmentRequest ? 'Program Enrollment / Consultation Form' : 'Send Us a Direct Message'}
            </h2>
            <p className="text-sm text-slate-600">
              Fill out the form below and our team will get back to you promptly.
            </p>
          </div>

          {sent && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-sm flex items-center gap-3">
              <span>✅</span>
              <span>Your message was sent successfully! Our administration will contact you shortly.</span>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-300 text-red-800 text-sm flex items-center gap-3">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Full Name *
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  placeholder="e.g. Hassan Mohamed"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={onChange}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                WhatsApp / Phone Number
              </label>
              <input
                type="tel"
                name="whatsapp"
                value={form.whatsapp}
                onChange={onChange}
                placeholder="+252 61 XXX XXXX"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Message / Inquired Service *
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={onChange}
                rows={5}
                placeholder="Tell us what you want to learn or the ICT system specifications you need..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-brand-primary py-3.5 text-center text-sm font-bold justify-center"
            >
              {loading ? 'Sending Message...' : '🚀 Submit Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
