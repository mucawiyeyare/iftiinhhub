import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import PriceLabel from '../components/PriceLabel';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, EffectFade } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';

import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

/* ─── Animation hook ──────────────────────────────────────────────────────── */
const useReveal = (options = {}) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15, ...options }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, visible];
};

/* ─── Animated heading wrapper ───────────────────────────────────────────── */
const AnimatedSection = ({ children, delay = 0, className = '' }) => {
  const [ref, visible] = useReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

/* ─── Staggered children wrapper ─────────────────────────────────────────── */
const StaggerGrid = ({ children, className = '' }) => {
  const [ref, visible] = useReveal();
  return (
    <div ref={ref} className={className}>
      {React.Children.map(children, (child, i) =>
        React.cloneElement(child, {
          style: {
            ...(child.props.style || {}),
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(32px)',
            transition: `opacity 0.6s ease ${i * 100}ms, transform 0.6s ease ${i * 100}ms`,
          },
        })
      )}
    </div>
  );
};

/* ─── Letter-by-letter AnimatedText ───────────────────────────────────── */
const AnimatedText = ({ text, className = '', baseDelay = 0, charDelay = 22, tag: Tag = 'span' }) => {
  const words = text.split(' ');
  let charIndex = 0;
  return (
    <Tag className={className} aria-label={text} style={{ display: 'block' }}>
      {words.map((word, wi) => {
        const wordSpans = word.split('').map((char, ci) => {
          const delay = baseDelay + charIndex * charDelay;
          charIndex++;
          return (
            <span
              key={ci}
              aria-hidden="true"
              style={{
                display: 'inline-block',
                animation: `letterReveal 0.45s cubic-bezier(0.22,1,0.36,1) both`,
                animationDelay: `${delay}ms`,
              }}
            >
              {char}
            </span>
          );
        });
        if (wi < words.length - 1) charIndex++;
        return (
          <span key={wi} style={{ display: 'inline-block', whiteSpace: 'nowrap', marginRight: '0.22em' }}>
            {wordSpans}
          </span>
        );
      })}
    </Tag>
  );
};

/* ─── Inline styles shared across the page ────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

  .home-root { font-family: 'Inter', system-ui, sans-serif; }

  /* ── NEW HERO ─────────────────────────────────────── */
  .hero-section {
    position: relative;
    min-height: 100vh;
    background: #ffffff;
    display: flex;
    align-items: center;
    overflow: hidden;
    padding: 0 0 60px 0;
    border-bottom: 1px solid #ede9fe;
  }

  /* Subtle radial glow blobs */
  .hero-blob-1 {
    position: absolute; top: -120px; right: -80px;
    width: 600px; height: 600px;
    background: radial-gradient(circle, rgba(167,139,250,0.12) 0%, transparent 70%);
    border-radius: 50%; pointer-events: none;
  }
  .hero-blob-2 {
    position: absolute; bottom: -100px; left: -60px;
    width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%);
    border-radius: 50%; pointer-events: none;
  }
  .hero-grid-lines {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(124,58,237,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(124,58,237,0.04) 1px, transparent 1px);
    background-size: 40px 40px;
    pointer-events: none;
  }

  /* Badge pill */
  .hero-badge {
    display: inline-flex; align-items: center; gap: 8px;
    background: #ede9fe;
    border: 1px solid #c4b5fd;
    color: #6d28d9;
    font-size: 0.78rem; font-weight: 700; letter-spacing: 0.07em;
    text-transform: uppercase; padding: 6px 16px; border-radius: 50px;
    margin-bottom: 28px;
    animation: heroFadeUp 0.6s ease 0.05s both;
  }
  .hero-badge-dot {
    width: 7px; height: 7px;
    background: #a78bfa;
    border-radius: 50%;
    animation: pulse-dot 1.8s ease-in-out infinite;
  }
  @keyframes pulse-dot {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.5; transform: scale(0.7); }
  }

  /* Hero heading */
  .hero-heading {
    font-size: clamp(2.4rem, 5vw, 3.8rem);
    font-weight: 900;
    line-height: 1.12;
    letter-spacing: -0.02em;
    color: #111827;
    margin-bottom: 24px;
    animation: heroFadeUp 0.7s ease 0.15s both;
  }
  .hero-heading-accent {
    background: linear-gradient(90deg, #a78bfa, #c4b5fd);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  /* Sub text */
  .hero-sub {
    font-size: 1.05rem;
    color: #4b5563;
    line-height: 1.75;
    max-width: 540px;
    margin-bottom: 32px;
    font-weight: 400;
    animation: heroFadeUp 0.7s ease 0.3s both;
  }

  /* Feature bullets */
  .hero-bullets {
    display: flex; flex-direction: column; gap: 12px;
    margin-bottom: 40px;
    animation: heroFadeUp 0.7s ease 0.4s both;
  }
  .hero-bullet {
    display: flex; align-items: flex-start; gap: 12px;
    color: #374151;
    font-size: 0.93rem; font-weight: 500; line-height: 1.5;
  }
  .hero-bullet-icon {
    flex-shrink: 0;
    width: 22px; height: 22px;
    background: linear-gradient(135deg, #7c3aed, #a78bfa);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    margin-top: 1px;
  }

  /* CTA buttons group */
  .hero-btn-group {
    display: flex; flex-wrap: wrap; gap: 14px; align-items: center;
    animation: heroFadeUp 0.7s ease 0.55s both;
  }

  /* Primary CTA */
  .btn-hero-primary {
    display: inline-flex; align-items: center; gap: 10px;
    background: linear-gradient(135deg, #7c3aed, #6d28d9);
    color: #fff;
    font-weight: 700; font-size: 1rem; letter-spacing: 0.01em;
    padding: 15px 32px; border-radius: 12px;
    transition: all 0.25s;
    box-shadow: 0 6px 24px rgba(124,58,237,0.5), 0 1px 0 rgba(255,255,255,0.1) inset;
    text-decoration: none;
  }
  .btn-hero-primary:hover {
    background: linear-gradient(135deg, #6d28d9, #5b21b6);
    transform: translateY(-3px);
    box-shadow: 0 12px 36px rgba(124,58,237,0.6);
  }

  /* WhatsApp CTA */
  .btn-hero-whatsapp {
    display: inline-flex; align-items: center; gap: 10px;
    background: #25D366;
    color: #fff;
    font-weight: 700; font-size: 1rem; letter-spacing: 0.01em;
    padding: 15px 32px; border-radius: 12px;
    transition: all 0.25s;
    box-shadow: 0 6px 24px rgba(37,211,102,0.4);
    text-decoration: none;
    border: none; cursor: pointer;
  }
  .btn-hero-whatsapp:hover {
    background: #20b358;
    transform: translateY(-3px);
    box-shadow: 0 12px 36px rgba(37,211,102,0.5);
  }

  /* Stats row */
  .hero-stats {
    display: flex; flex-wrap: wrap; gap: 28px; margin-top: 52px;
    animation: heroFadeUp 0.7s ease 0.65s both;
    padding-top: 36px;
    border-top: 1px solid #e5e7eb;
  }
  .hero-stat-num {
    font-size: 1.75rem; font-weight: 900; color: #111827; line-height: 1;
  }
  .hero-stat-label {
    font-size: 0.82rem; color: #6b7280; font-weight: 500; margin-top: 4px;
  }

  /* Right visual card */
  .hero-visual {
    animation: heroFadeUp 0.8s ease 0.25s both;
  }
  .hero-card {
    background: #f8f5ff;
    border: 1px solid #e0d4fc;
    border-radius: 24px;
    padding: 32px;
    box-shadow: 0 8px 40px rgba(124,58,237,0.1);
  }
  .hero-card-header {
    display: flex; align-items: center; gap: 12px;
    margin-bottom: 24px;
  }
  .hero-card-icon {
    width: 48px; height: 48px;
    background: linear-gradient(135deg, #7c3aed, #a78bfa);
    border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    box-shadow: 0 4px 16px rgba(124,58,237,0.4);
  }
  .hero-module-item {
    display: flex; align-items: center; justify-content: space-between;
    padding: 12px 14px;
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    margin-bottom: 8px;
    transition: background 0.2s, border-color 0.2s;
  }
  .hero-module-item:hover { background: #f5f3ff; border-color: #c4b5fd; }
  .hero-module-label { font-size: 0.87rem; color: #1f2937; font-weight: 600; }
  .hero-module-badge {
    font-size: 0.72rem; font-weight: 700;
    padding: 3px 10px; border-radius: 20px;
    background: #ede9fe;
    color: #6d28d9;
    white-space: nowrap;
  }
  .hero-module-badge.included {
    background: #dcfce7;
    color: #16a34a;
  }
  .hero-progress-bar-wrap {
    background: #e5e7eb;
    border-radius: 99px; height: 6px; width: 100%; margin-top: 4px;
  }
  .hero-progress-bar {
    height: 6px; border-radius: 99px;
    background: linear-gradient(90deg, #7c3aed, #a78bfa);
  }

  /* Floating badge on card */
  .hero-floating-badge {
    position: absolute;
    background: #fff;
    border-radius: 14px;
    padding: 10px 16px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.2);
    display: flex; align-items: center; gap: 10px;
    font-size: 0.8rem; font-weight: 700; color: #1a1a1a;
    animation: float 3s ease-in-out infinite;
  }
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50%       { transform: translateY(-8px); }
  }
  .hero-floating-badge-icon {
    width: 32px; height: 32px;
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
  }

  /* Hero button primary */
  .btn-hero-outline {
    display: inline-flex; align-items: center; gap: 8px;
    background: rgba(255,255,255,0.08); color: #fff;
    font-weight: 700; font-size: 1rem; letter-spacing: 0.01em;
    padding: 14px 32px; border-radius: 10px;
    border: 2px solid rgba(255,255,255,0.4);
    backdrop-filter: blur(6px);
    transition: background 0.2s, color 0.2s, border-color 0.2s, transform 0.2s;
    text-decoration: none;
  }
  .btn-hero-outline:hover {
    background: #fff; color: #7c3aed; border-color: #fff;
    transform: translateY(-2px);
  }

  /* Course card */
  .course-card {
    background: #fff;
    border-radius: 16px;
    border: 1px solid #ede9fe;
    box-shadow: 0 2px 12px rgba(124,58,237,0.06);
    overflow: hidden;
    display: flex; flex-direction: column;
    transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
  }
  .course-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 16px 40px rgba(124,58,237,0.14);
    border-color: #c4b5fd;
  }
  .course-card img {
    height: 192px; width: 100%; object-fit: cover;
    transition: transform 0.4s ease;
  }
  .course-card:hover img { transform: scale(1.04); }
  .course-card-img-wrap { overflow: hidden; }

  /* Course action buttons */
  .btn-course {
    display: flex; align-items: center; justify-content: center;
    width: 100%; padding: 12px 24px;
    border-radius: 10px; font-size: 0.875rem; font-weight: 700;
    letter-spacing: 0.02em; transition: all 0.2s;
    border: none; cursor: pointer;
  }
  .btn-course-indigo { background: #4f46e5; color: #fff; box-shadow: 0 4px 12px rgba(79,70,229,0.3); }
  .btn-course-indigo:hover { background: #4338ca; transform: translateY(-1px); box-shadow: 0 6px 18px rgba(79,70,229,0.4); }
  .btn-course-blue   { background: #2563eb; color: #fff; box-shadow: 0 4px 12px rgba(37,99,235,0.3); }
  .btn-course-blue:hover { background: #1d4ed8; transform: translateY(-1px); box-shadow: 0 6px 18px rgba(37,99,235,0.4); }
  .btn-course-green  { background: #059669; color: #fff; box-shadow: 0 4px 12px rgba(5,150,105,0.3); }
  .btn-course-green:hover { background: #047857; transform: translateY(-1px); box-shadow: 0 6px 18px rgba(5,150,105,0.4); }

  /* Testimonial card */
  .testimonial-card {
    background: linear-gradient(145deg, #faf5ff, #f5f3ff);
    border: 1px solid #ede9fe;
    border-radius: 16px;
    padding: 32px 28px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    gap: 16px;
    box-shadow: 0 4px 20px rgba(124,58,237,0.06);
    transition: transform 0.25s, box-shadow 0.25s;
    min-height: 160px;
  }
  .testimonial-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(124,58,237,0.12);
  }
  .testimonial-card-body { flex: 1; display: flex; flex-direction: column; gap: 8px; }
  .testimonial-card-quote-icon {
    flex-shrink: 0;
    color: #7c3aed;
    font-size: 2.8rem;
    font-family: Georgia, serif;
    line-height: 1;
    margin-top: -6px;
    opacity: 0.55;
    letter-spacing: -2px;
  }

  .testimonials-nav {
    display: flex; align-items: center; justify-content: center;
    gap: 2px; margin-top: 36px;
  }
  .testimonials-nav button {
    width: 44px; height: 44px;
    border: 1.5px solid #ede9fe;
    border-radius: 6px; background: #fff;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    transition: background 0.2s, border-color 0.2s, transform 0.15s;
    color: #6d28d9;
  }
  .testimonials-nav button:hover { background: #ede9fe; border-color: #c4b5fd; transform: scale(1.06); }
  .testimonials-nav button svg { width: 16px; height: 16px; stroke: #6d28d9; stroke-width: 2.5; }

  /* Feature card */
  .feature-card {
    background: linear-gradient(145deg, #5b21b6, #6d28d9);
    border-radius: 20px; padding: 36px 28px; text-align: center;
    display: flex; flex-direction: column; align-items: center;
    border: 1px solid rgba(255,255,255,0.08);
    box-shadow: 0 8px 32px rgba(109,40,217,0.3);
    transition: transform 0.3s, box-shadow 0.3s;
  }
  .feature-card:hover { transform: translateY(-6px); box-shadow: 0 16px 48px rgba(109,40,217,0.45); }
  .feature-icon-ring {
    width: 80px; height: 80px;
    background: rgba(255,255,255,0.12);
    border: 2px solid rgba(255,255,255,0.2);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 24px;
    transition: background 0.3s, transform 0.3s;
    backdrop-filter: blur(4px);
  }
  .feature-card:hover .feature-icon-ring { background: rgba(255,255,255,0.22); transform: scale(1.08); }

  /* Section label pill */
  .section-pill {
    display: inline-flex; align-items: center; gap: 6px;
    background: #ede9fe; color: #6d28d9;
    font-size: 0.75rem; font-weight: 700; letter-spacing: 0.08em;
    text-transform: uppercase; padding: 5px 14px; border-radius: 20px;
    margin-bottom: 12px;
  }

  .section-underline {
    width: 48px; height: 3px;
    background: linear-gradient(90deg, #7c3aed, #a78bfa);
    border-radius: 2px; margin: 16px auto 0;
  }

  .spinner {
    width: 48px; height: 48px;
    border: 3px solid #ede9fe;
    border-top-color: #7c3aed;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  @keyframes heroFadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .hero-title { animation: heroFadeUp 0.7s ease 0.1s both; }
  .hero-btn   { animation: heroFadeUp 0.7s ease 0.5s both; }

  @keyframes letterReveal {
    from { opacity: 0; transform: translateY(14px) scaleY(0.85); }
    to   { opacity: 1; transform: translateY(0)   scaleY(1);   }
  }

  .testimonials-swiper .swiper-wrapper { padding-bottom: 4px; }

  /* Scroll indicator */
  .scroll-indicator {
    position: absolute; bottom: 32px; left: 50%; transform: translateX(-50%);
    display: flex; flex-direction: column; align-items: center; gap: 6px;
    cursor: pointer; animation: heroFadeUp 0.7s ease 1s both;
  }
  .scroll-indicator-text { font-size: 0.72rem; color: #9ca3af; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; }
  .scroll-indicator-arrow {
    width: 30px; height: 30px;
    border: 1.5px solid #d1d5db;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    animation: bounce-arrow 1.8s ease-in-out infinite;
  }
  @keyframes bounce-arrow {
    0%, 100% { transform: translateY(0); }
    50%       { transform: translateY(5px); }
  }

  @media (max-width: 1024px) {
    .hero-grid-layout {
      grid-template-columns: 1fr !important;
      gap: 40px !important;
    }
    .hero-visual { display: none; }
  }
  @media (max-width: 768px) {
    .hero-section { padding-top: 80px; padding-bottom: 80px; min-height: auto; }
    .hero-stats   { gap: 20px; }
    .hero-heading { margin-bottom: 18px; }
    .hero-sub     { font-size: 0.97rem; }
    .hero-btn-group { flex-direction: column; align-items: flex-start; }
  }
`;

/* ─── Testimonials Slider sub-component ─────────────────────────────────── */
const TestimonialsSlider = ({ testimonials }) => {
  const swiperRef = useRef(null);
  return (
    <div className="mt-4">
      <Swiper
        modules={[Pagination]}
        spaceBetween={24}
        slidesPerView={1}
        className="testimonials-swiper"
        onSwiper={(swiper) => { swiperRef.current = swiper; }}
        breakpoints={{ 768: { slidesPerView: 2 } }}
      >
        {testimonials.map((testimonial, index) => (
          <SwiperSlide key={index}>
            <div className="testimonial-card">
              {/* Left: name + role + quote text */}
              <div className="testimonial-card-body">
                <p className="font-bold text-gray-900 text-base leading-tight">{testimonial.name}</p>
                <p className="text-xs text-purple-500 font-semibold mb-3">{testimonial.title}</p>
                <p className="text-gray-500 text-sm leading-relaxed">{testimonial.quote}</p>
              </div>
              {/* Right: large decorative quote mark */}
              <div className="testimonial-card-quote-icon" aria-hidden="true">"</div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Centered bottom prev / next */}
      <div className="testimonials-nav">
        <button onClick={() => swiperRef.current?.slidePrev()} aria-label="Previous">
          <svg fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button onClick={() => swiperRef.current?.slideNext()} aria-label="Next">
          <svg fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════════════
   Component
══════════════════════════════════════════════════════════════════════════ */
const Home = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [assignedCourses, setAssignedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const [allRes, assignedRes] = await Promise.all([
          axios.get('/courses'),
          user && user.role === 'student' ? axios.get('/courses/student/assigned') : Promise.resolve({ data: [] })
        ]);
        const data = Array.isArray(allRes.data) ? allRes.data : [];
        const visible = data.filter(c => c && (c.published === undefined || c.published === true));
        setCourses(visible);
        setAssignedCourses(assignedRes.data || []);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [user]);

  const testimonials = [
    {
      quote: "IftiinHub transformed my career. The hands-on projects and expert instructors gave me the confidence to land my dream job as a software engineer.",
      name: "Sacdiyo Maxamed",
      title: "Full Stack Developer"
    },
    {
      quote: "The flexible learning schedule allowed me to learn at my own pace. The community is incredibly supportive, and I've made connections that will last a lifetime.",
      name: "Jamac Xasan",
      title: "UX/UI Designer"
    },
    {
      quote: "I went from a complete beginner to building complex applications. The curriculum is top-notch and always up-to-date with the latest industry trends.",
      name: "Maxamed Xasan",
      title: "Mobile App Developer"
    }
  ];

  const handleScrollDown = () => {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  };

  const whatsappUrl = `https://wa.me/616408886?text=${encodeURIComponent('Salaan! Waxaan doonayaa inaan ogaado faahfaahinta koorsada IftiinHub. Fadlan ii sheeg macluumaadka.')}` ;

  return (
    <div className="home-root bg-white">
      <style>{styles}</style>

      {/* ── NEW Hero Section ─────────────────────────────────────────────── */}
      <section className="hero-section">
        {/* Background decorative elements */}
        <div className="hero-blob-1" />
        <div className="hero-blob-2" />
        <div className="hero-grid-lines" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'center' }}
               className="hero-grid-layout">

            {/* ── Left: Text Content ── */}
            <div>
              {/* Badge */}
              <div className="hero-badge">
                <span className="hero-badge-dot" />
                #1 Somali Tech Education Platform
              </div>

              {/* Heading */}
              <h1 className="hero-heading">
                Become a{' '}
                <span className="hero-heading-accent">Full-Stack</span>
                <br />
                <span className="hero-heading-accent">Software Engineer</span>
                <br />
                in 12 Months
              </h1>

              {/* Sub */}
              <p className="hero-sub">
                Master Web Development, Mobile Apps &amp; AI Engineering —
                all taught in Somali with weekly mentorship.
                15 courses included. From HTML to React, Node.js &amp; AI.
              </p>

              {/* Bullet features */}
              <div className="hero-bullets">
                {[
                  '15 Structured Modules — HTML → JavaScript → React → Node.js → MongoDB',
                  'Weekly Live Q&A Sessions — Ask questions, get feedback from instructor',
                  '197+ Hours of Content — 1030 lessons with 15+ real projects for your portfolio',
                ].map((text, i) => (
                  <div key={i} className="hero-bullet">
                    <div className="hero-bullet-icon">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    </div>
                    <span>{text}</span>
                  </div>
                ))}
              </div>

              {/* CTA buttons */}
              <div className="hero-btn-group">
                <Link to="/courses" className="btn-hero-primary">
                  Explore Courses
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>

                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-hero-whatsapp">
                  {/* WhatsApp icon */}
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Contact on WhatsApp
                </a>
              </div>

              {/* Stats row */}
              <div className="hero-stats">
                {[
                  { num: '197+',  label: 'Hours of Content' },
                  { num: '100%',  label: 'Taught in Somali' },
                ].map((s, i) => (
                  <div key={i}>
                    <div className="hero-stat-num">{s.num}</div>
                    <div className="hero-stat-label">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Right: Visual Card ── */}
            <div className="hero-visual" style={{ position: 'relative' }}>
              {/* Floating badge top-left */}
              <div className="hero-floating-badge" style={{ top: '-18px', left: '-24px', animationDelay: '0s' }}>
                <div className="hero-floating-badge-icon" style={{ background: '#ede9fe' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#7c3aed">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1a1a1a' }}>Top Rated</div>
                  <div style={{ fontSize: '0.7rem', color: '#6d28d9', fontWeight: 600 }}>★★★★★ 4.9/5</div>
                </div>
              </div>

              {/* Floating badge bottom-right */}
              <div className="hero-floating-badge" style={{ bottom: '12px', right: '-20px', animationDelay: '1s' }}>
                <div className="hero-floating-badge-icon" style={{ background: '#dcfce7' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1a1a1a' }}>Certificate</div>
                  <div style={{ fontSize: '0.7rem', color: '#16a34a', fontWeight: 600 }}>Included</div>
                </div>
              </div>

              <div className="hero-card">
                {/* Card header */}
                <div className="hero-card-header">
                  <div className="hero-card-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, color: '#111827', fontSize: '0.97rem' }}>One Complete Program</div>
                    <div style={{ fontSize: '0.78rem', color: '#7c3aed', fontWeight: 600, marginTop: 2 }}>15 Courses Included</div>
                  </div>
                </div>

                {/* Tech tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
                  {['MongoDB', 'PHP', 'React', 'TailwindCSS'].map(t => (
                    <span key={t} style={{
                      background: '#ede9fe', color: '#6d28d9',
                      fontSize: '0.75rem', fontWeight: 700,
                      padding: '4px 12px', borderRadius: 20,
                      border: '1px solid #c4b5fd'
                    }}>{t}</span>
                  ))}
                  <span style={{
                    background: '#f3f4f6', color: '#6b7280',
                    fontSize: '0.75rem', fontWeight: 600,
                    padding: '4px 12px', borderRadius: 20,
                  }}>+ more modules</span>
                </div>

                {/* Module list */}
                {[
                  { label: 'React.js Module',   sub: 'Modern Frontend Development', badge: 'Included', included: true,  progress: 80 },
                  { label: 'MongoDB',            sub: 'Database & Data Modeling',    badge: 'Included', included: true,  progress: 70 },
                  { label: 'PHP Backend',        sub: 'Server-Side Programming',     badge: 'Included', included: true,  progress: 55 },
                  { label: 'TailwindCSS',        sub: 'Utility-First Styling',       badge: 'Included', included: true,  progress: 65 },
                ].map((m, i) => (
                  <div key={i} className="hero-module-item">
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <div>
                          <div className="hero-module-label">{m.label}</div>
                          <div style={{ fontSize: '0.73rem', color: '#9ca3af', marginTop: 2 }}>{m.sub}</div>
                        </div>
                        <span className={`hero-module-badge${m.included ? ' included' : ''}`}>{m.badge}</span>
                      </div>
                      <div className="hero-progress-bar-wrap">
                        <div className="hero-progress-bar" style={{ width: `${m.progress}%` }} />
                      </div>
                    </div>
                  </div>
                ))}

                {/* Bottom CTA */}
                <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      background: '#25D366', color: '#fff',
                      padding: '11px 0', borderRadius: 10,
                      fontSize: '0.88rem', fontWeight: 700,
                      textDecoration: 'none',
                      transition: 'opacity 0.2s',
                    }}
                    onMouseOver={e => e.currentTarget.style.opacity = '0.9'}
                    onMouseOut={e => e.currentTarget.style.opacity = '1'}
                  >
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="#fff">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Send Message via WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll down indicator */}
        <button className="scroll-indicator" onClick={handleScrollDown}>
          <span className="scroll-indicator-text">Scroll</span>
          <div className="scroll-indicator-arrow">
            <svg width="12" height="12" fill="none" stroke="#9ca3af" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>
      </section>

      {/* ── Featured Courses Section ─────────────────────────────────────── */}
      <div className="py-20" style={{ background: 'linear-gradient(180deg, #faf5ff 0%, #f8fafc 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-14">
            <div className="flex justify-center">
              <span className="section-pill">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Featured
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
              Featured Courses
            </h2>
            <div className="section-underline" />
            <p className="mt-5 text-lg text-gray-500 font-medium max-w-xl mx-auto">
              Start your learning journey with our most popular courses.
            </p>
          </AnimatedSection>

          <div className="mt-4">
            {loading ? (
              <div className="text-center py-16 flex flex-col items-center gap-4">
                <div className="spinner" />
                <div className="text-base font-medium text-gray-500">Loading courses…</div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course, i) => {
                  const isEnrolled = user?.role === 'student' && assignedCourses.some(c => c?._id === course?._id);
                  const isAdmin = user?.role === 'admin';
                  const linkTo = `/courses/${course._id}/learn`;

                  let buttonText = 'Preview Course';
                  let btnClass = 'btn-course btn-course-indigo';

                  if (isAdmin) {
                    buttonText = 'Manage Course';
                    btnClass = 'btn-course btn-course-blue';
                  } else if (isEnrolled) {
                    buttonText = 'Start Learning';
                    btnClass = 'btn-course btn-course-green';
                  }

                  const totalVideos = (course.videos?.length || 0) + (course.video1 ? 1 : 0) + (course.video2 ? 1 : 0);
                  const totalSections = course.sections?.length || 0;



                  return (
                    <div
                      key={course._id}
                      className="course-card"
                      style={{
                        opacity: 0,
                        transform: 'translateY(32px)',
                        animation: `heroFadeUp 0.55s ease ${i * 90}ms both`,
                      }}
                    >
                      <Link to={linkTo} className="course-card-img-wrap block">
                        <img
                          src={course.imageUrl || 'https://via.placeholder.com/400x225'}
                          alt={course.name}
                        />
                      </Link>

                      <div className="p-5 flex flex-col flex-grow">
                        <div className="flex-grow">
                          {/* Title */}
                          <h3 className="text-base font-bold text-gray-900 leading-snug line-clamp-2 mb-1">
                            {course.name}
                          </h3>
                          {/* Instructor */}
                          <p className="text-xs text-gray-400 font-medium mb-2">
                            {course.instructor}
                          </p>
                          {/* Description */}
                          <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-4">
                            {(course.description || '').substring(0, 90)}
                          </p>

                          {/* Meta row */}
                          <div className="flex items-center gap-4 text-xs text-gray-400 font-medium border-t border-gray-100 pt-3">
                            <span className="flex items-center gap-1.5">
                              <svg className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                              </svg>
                              {totalSections} {totalSections === 1 ? 'Section' : 'Sections'}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <svg className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                              {totalVideos} {totalVideos === 1 ? 'Video' : 'Videos'}
                            </span>
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <div className="flex justify-end items-center mb-3">
                            <PriceLabel price={course.price} originalPrice={course.originalPrice} size="sm" />
                          </div>
                          <Link to={linkTo} className={btnClass}>
                            {buttonText}
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Testimonials Section ─────────────────────────────────────────── */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-14">
            <div className="flex justify-center">
              <span className="section-pill">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Reviews
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
              What Our Students Say
            </h2>
            <div className="section-underline" />
          </AnimatedSection>

          <TestimonialsSlider testimonials={testimonials} />
        </div>
      </div>

      {/* ── Nagu Xulo Section ────────────────────────────────────────────── */}
      <div className="py-20" style={{ background: 'linear-gradient(180deg, #f5f3ff 0%, #ede9fe 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-14">
            <div className="flex justify-center">
              <span className="section-pill">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
                Why Us
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-purple-900 tracking-tight">
              Why Choose Us
            </h2>
            <div className="section-underline" />
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <AnimatedSection delay={0}>
              <div className="feature-card">
                <div className="feature-icon-ring">
                  <svg className="w-9 h-9 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-3 tracking-wide">Quality Lessons</h3>
                <p className="text-purple-200 text-sm leading-relaxed text-center">
                  Deeply and professionally prepared education with high quality.
                </p>
              </div>
            </AnimatedSection>

            {/* Card 2 */}
            <AnimatedSection delay={100}>
              <div className="feature-card">
                <div className="feature-icon-ring">
                  <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-3 tracking-wide">24/7 Help</h3>
                <p className="text-purple-200 text-sm leading-relaxed text-center">
                  Whenever you need support, we are by your side.
                </p>
              </div>
            </AnimatedSection>

            {/* Card 3 */}
            <AnimatedSection delay={200}>
              <div className="feature-card">
                <div className="feature-icon-ring">
                  <svg className="w-9 h-9 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.5 1.32c.56.636 1.464 1.052 2.343 1.188V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.5-1.32c-.56-.636-1.464-1.052-2.343-1.188V5z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-3 tracking-wide">Reasonable Price</h3>
                <p className="text-purple-200 text-sm leading-relaxed text-center">
                  High quality education without costing you much.
                </p>
              </div>
            </AnimatedSection>

            {/* Card 4 */}
            <AnimatedSection delay={300}>
              <div className="feature-card">
                <div className="feature-icon-ring">
                  <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-3 tracking-wide">Lifetime Access</h3>
                <p className="text-purple-200 text-sm leading-relaxed text-center">
                  The course you take will never be closed to you, even when you finish.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;