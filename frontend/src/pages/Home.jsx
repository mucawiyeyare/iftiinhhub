import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

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

  /* Hero button primary */
  .btn-hero-primary {
    display: inline-flex; align-items: center; gap: 8px;
    background: #7c3aed; color: #fff;
    font-weight: 700; font-size: 1rem; letter-spacing: 0.01em;
    padding: 14px 32px; border-radius: 10px;
    transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
    box-shadow: 0 4px 20px rgba(124,58,237,0.4);
  }
  .btn-hero-primary:hover {
    background: #6d28d9; transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(124,58,237,0.5);
  }

  /* Hero button outline */
  .btn-hero-outline {
    display: inline-flex; align-items: center; gap: 8px;
    background: rgba(255,255,255,0.1); color: #fff;
    font-weight: 700; font-size: 1rem; letter-spacing: 0.01em;
    padding: 14px 32px; border-radius: 10px;
    border: 2px solid rgba(255,255,255,0.6);
    backdrop-filter: blur(6px);
    transition: background 0.2s, color 0.2s, border-color 0.2s, transform 0.2s;
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

  /* Level badges */
  .badge {
    display: inline-flex; align-items: center;
    padding: 3px 10px; border-radius: 20px;
    font-size: 0.65rem; font-weight: 800; letter-spacing: 0.06em;
    text-transform: uppercase;
  }
  .badge-beginner { background: #d1fae5; color: #065f46; }
  .badge-intermediate { background: #fef3c7; color: #92400e; }
  .badge-advanced { background: #fee2e2; color: #991b1b; }

  /* Testimonial card — reference layout */
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
  .testimonial-card-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
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

  /* Custom centered bottom nav for testimonials */
  .testimonials-nav {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2px;
    margin-top: 36px;
  }
  .testimonials-nav button {
    width: 44px; height: 44px;
    border: 1.5px solid #ede9fe;
    border-radius: 6px;
    background: #fff;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    transition: background 0.2s, border-color 0.2s, transform 0.15s;
    color: #6d28d9;
  }
  .testimonials-nav button:hover {
    background: #ede9fe;
    border-color: #c4b5fd;
    transform: scale(1.06);
  }
  .testimonials-nav button svg {
    width: 16px; height: 16px;
    stroke: #6d28d9;
    stroke-width: 2.5;
  }

  /* Feature card */
  .feature-card {
    background: linear-gradient(145deg, #5b21b6, #6d28d9);
    border-radius: 20px;
    padding: 36px 28px;
    text-align: center;
    display: flex; flex-direction: column; align-items: center;
    border: 1px solid rgba(255,255,255,0.08);
    box-shadow: 0 8px 32px rgba(109,40,217,0.3);
    transition: transform 0.3s, box-shadow 0.3s;
  }
  .feature-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 16px 48px rgba(109,40,217,0.45);
  }
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
  .feature-card:hover .feature-icon-ring {
    background: rgba(255,255,255,0.22);
    transform: scale(1.08);
  }

  /* Section label pill */
  .section-pill {
    display: inline-flex; align-items: center; gap: 6px;
    background: #ede9fe; color: #6d28d9;
    font-size: 0.75rem; font-weight: 700; letter-spacing: 0.08em;
    text-transform: uppercase; padding: 5px 14px; border-radius: 20px;
    margin-bottom: 12px;
  }

  /* Divider line under section headings */
  .section-underline {
    width: 48px; height: 3px;
    background: linear-gradient(90deg, #7c3aed, #a78bfa);
    border-radius: 2px; margin: 16px auto 0;
  }

  /* Loading spinner */
  .spinner {
    width: 48px; height: 48px;
    border: 3px solid #ede9fe;
    border-top-color: #7c3aed;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* Hero text reveal */
  @keyframes heroFadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .hero-title   { animation: heroFadeUp 0.7s ease 0.1s both; }
  .hero-sub     { animation: heroFadeUp 0.7s ease 0.3s both; }
  .hero-btn     { animation: heroFadeUp 0.7s ease 0.5s both; }

  /* Letter-by-letter reveal keyframe */
  @keyframes letterReveal {
    from { opacity: 0; transform: translateY(14px) scaleY(0.85); }
    to   { opacity: 1; transform: translateY(0)   scaleY(1);   }
  }

  /* Testimonials swiper — no default nav, clean */
  .testimonials-swiper .swiper-wrapper { padding-bottom: 4px; }
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

  return (
    <div className="home-root bg-white">
      <style>{styles}</style>

      {/* ── Hero Section with Slider ────────────────────────────────────── */}
      <Swiper
        modules={[Pagination, Autoplay, EffectFade]}
        spaceBetween={0}
        slidesPerView={1}
        pagination={{ clickable: true }}
        loop={true}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        effect="fade"
        className="h-[60vh] md:h-[80vh] w-full"
        onRealIndexChange={(swiper) => setActiveSlide(swiper.realIndex)}
      >
        <SwiperSlide>
          <div className="h-full w-full bg-cover bg-center" style={{ backgroundImage: `url('/photo-1542831371-29b0f74f9713.avif')` }}>
            <div className="h-full w-full flex items-center justify-center bg-black/40">
              <div className="text-center text-white px-4 max-w-3xl">
                <h1 className="text-4xl md:text-6xl font-extrabold mb-5 leading-tight tracking-tight">
                  <AnimatedText key={`s0-h-${activeSlide}`} text="Unlock Your Potential" baseDelay={80} charDelay={22} />
                </h1>
                <p className="text-lg md:text-xl mb-9 text-purple-100 font-medium leading-relaxed">
                  <AnimatedText key={`s0-p-${activeSlide}`} text="Join IftiinHub and start your journey in the world of technology today." baseDelay={500} charDelay={14} />
                </p>
                <div className="hero-btn">
                  <Link to="/courses" className="btn-hero-primary">
                    Explore Courses
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div className="h-full w-full bg-cover bg-center" style={{ backgroundImage: `url('/photo-1550439062-609e1531270e.avif')` }}>
            <div className="h-full w-full flex items-center justify-center bg-black/40">
              <div className="text-center text-white px-4 max-w-3xl">
                <h1 className="text-4xl md:text-6xl font-extrabold mb-5 leading-tight tracking-tight">
                  <AnimatedText key={`s1-h-${activeSlide}`} text="Learn from Industry Experts" baseDelay={80} charDelay={22} />
                </h1>
                <p className="text-lg md:text-xl mb-9 text-blue-100 font-medium leading-relaxed">
                  <AnimatedText key={`s1-p-${activeSlide}`} text="Our instructors are professionals with real-world experience." baseDelay={500} charDelay={14} />
                </p>
                <div className="hero-btn">
                  <Link to="/about" className="btn-hero-outline">
                    Meet Our Team
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div className="h-full w-full bg-cover bg-center" style={{ backgroundImage: `url('/photo-1555949963-ff9fe0c870eb.avif')` }}>
            <div className="h-full w-full flex items-center justify-center bg-black/40">
              <div className="text-center text-white px-4 max-w-3xl">
                <h1 className="text-4xl md:text-6xl font-extrabold mb-5 leading-tight tracking-tight">
                  <AnimatedText key={`s2-h-${activeSlide}`} text="Build Real-World Projects" baseDelay={80} charDelay={22} />
                </h1>
                <p className="text-lg md:text-xl mb-9 text-purple-100 font-medium leading-relaxed">
                  <AnimatedText key={`s2-p-${activeSlide}`} text="Apply your skills by building a portfolio of impressive projects." baseDelay={500} charDelay={14} />
                </p>
                <div className="hero-btn">
                  <Link to="/register" className="btn-hero-primary">
                    Sign Up Now
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>

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

                  const levelBadge =
                    course.level === 'beginner' ? 'badge badge-beginner' :
                    course.level === 'intermediate' ? 'badge badge-intermediate' :
                    'badge badge-advanced';

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
                          {/* Category */}
                          <p className="text-xs font-bold text-purple-600 uppercase tracking-widest mb-1">
                            {course.category}
                          </p>
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
                          <div className="flex justify-between items-center mb-3">
                            <span className={levelBadge}>{course.level}</span>
                            <span className="text-xl font-extrabold text-gray-900">${course.price}</span>
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