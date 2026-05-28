import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TransitionLink from '../components/common/TransitionLink';
import TopAppBar from '../components/layout/TopAppBar';
import SideNavBar from '../components/layout/SideNavBar';
import MobileBottomNav from '../components/layout/MobileBottomNav';
import Footer from '../components/layout/Footer';
import { useData } from '../contexts/DataContext';
import { useTheme } from '../contexts/ThemeContext';

const LandingPage = () => {
  const { posts, loading } = useData();
  const { theme } = useTheme();
  const [heroVisible, setHeroVisible] = React.useState(true);
  const [visibleCards, setVisibleCards] = useState(new Set());
  const heroRef = React.useRef(null);
  const cardRefs = useRef([]);
  const vantaRef = useRef(null);
  const [showTopBar, setShowTopBar] = useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const [showSentinel, setShowSentinel] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    if (location.state?.showSentinelMessage) {
      setShowSentinel(true);
      setIsFadingOut(false);
    }
  }, [location.state]);

  useEffect(() => {
    if (showSentinel) {
      const timer = setTimeout(() => {
        setIsFadingOut(true);
        setTimeout(() => {
          setShowSentinel(false);
          navigate('/', { replace: true, state: {} });
        }, 500);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSentinel, navigate]);

  useEffect(() => {
    const handleScroll = () => {
      setShowTopBar(window.scrollY > window.innerHeight * 0.8);
      setShowScrollIndicator(window.scrollY < 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Intersection Observer for scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const index = entry.target.dataset.index;
          if (index) {
            setVisibleCards(prev => new Set([...prev, parseInt(index)]));
          }
        }
      });
    }, observerOptions);

    cardRefs.current.forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, [posts]); // Re-run when posts change

  useEffect(() => {
    if (!vantaRef.current || !window.VANTA) return;

    const vantaColors = theme === 'dark' 
      ? {
          highlightColor: 0xA39684,
          midtoneColor: 0x2C2620,
          lowlightColor: 0x1A140B,
          baseColor: 0x1A140B,
        }
      : {
          highlightColor: 0xAAA396,
          midtoneColor: 0xF1EADA,
          lowlightColor: 0xCEC1AB,
          baseColor: 0xB59E7D,
        };

    const effect = window.VANTA.FOG({
      el: vantaRef.current,
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.00,
      minWidth: 200.00,
      ...vantaColors,
      blurFactor: 0.37,
      zoom: 0.70,
      speed: 1.30
    });

    return () => {
      if (effect) effect.destroy();
    };
  }, [theme]);

  const displayPosts = [...posts].sort((a, b) => {
    if (a.isFeatured && !b.isFeatured) return -1;
    if (!a.isFeatured && b.isFeatured) return 1;
    return 0;
  }).slice(0, 6);

  return (
    <div className="min-h-screen bg-surface">
      {showSentinel && (
        <div className={`fixed bottom-12 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 ease-out ${isFadingOut ? 'opacity-0 translate-y-8' : 'opacity-100 translate-y-0 animate-in slide-in-from-bottom-8 fade-in'
          }`}>
          <div className="backdrop-blur-xl bg-surface/60 p-6 px-8 border border-[#d4af37]/40 shadow-2xl rounded-2xl flex items-center gap-4">
            <span className="material-symbols-outlined text-[#d4af37]">lock</span>
            <h1 className="text-xl md:text-2xl font-serif italic text-on-surface tracking-tight drop-shadow-sm">
              That Place is only for the Archivist.
            </h1>
          </div>
        </div>
      )}
      <TopAppBar visible={showTopBar} />
      <SideNavBar />

      <main className="pb-20">
        {/* Vanta.js Full-Screen Hero Section */}
        <section
          ref={vantaRef}
          className="fixed inset-0 z-0 flex items-center justify-center overflow-hidden"
        >
          <div className="relative z-10 text-center px-6">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif italic tracking-tighter text-on-surface mix-blend-multiply opacity-90 leading-tight">
              The Boomer Archives
            </h1>
            <p className="mt-8 text-xl md:text-2xl lg:text-3xl font-serif italic text-secondary max-w-3xl mx-auto">
              Expressing Personalities One at a Time
            </p>
          </div>

          {/* Scroll Down Indicator */}
          <div className={`absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-opacity duration-700 ${showScrollIndicator ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <span className="text-[10px] font-medium uppercase tracking-widest text-on-surface/80 drop-shadow-md">Scroll Down</span>
            <span className="material-symbols-outlined text-on-surface/80 animate-bounce drop-shadow-md">keyboard_arrow_down</span>
          </div>
        </section>

        {/* Content starts after full-screen hero */}
        <div className="relative z-10 mt-[100vh] bg-surface pt-20">
          <div className="px-8 max-w-7xl mx-auto">
            {/* Featured Cards */}
            <div className="space-y-12">
              {!loading && displayPosts.map((post, index) => (
                <article
                  key={post.id}
                  ref={el => cardRefs.current[index] = el}
                  data-index={index}
                  className={`group cursor-pointer card-hover-preview transition-all duration-700 ease-out ${visibleCards.has(index)
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-12'
                    }`}
                >
                  <TransitionLink 
                    to={`/read/${post.id}`}
                    className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} bg-surface-container-low rounded-xl overflow-hidden whisper-shadow min-h-[400px]`}
                  >
                    <div className="md:w-3/5 overflow-hidden">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="preview-image w-full h-full object-cover transition-all duration-700 grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-90"
                      />
                    </div>
                    <div className="md:w-2/5 p-12 flex flex-col justify-center">
                      <span className="text-xs font-medium uppercase tracking-widest label-text text-on-surface-variant mb-4">
                        {post.category}
                      </span>
                      <h2 className="text-4xl font-serif text-on-surface mb-6 leading-tight">
                        {post.title}
                      </h2>
                      <p className="text-on-surface-variant leading-relaxed mb-8">
                        {post.excerpt}
                      </p>
                      <span
                        className="self-start text-xs font-medium uppercase tracking-widest text-primary border-b border-primary/30 pb-1 group-hover:border-primary transition-colors block"
                      >
                        View Entry →
                      </span>
                    </div>
                  </TransitionLink>
                </article>
              ))}
            </div>
          </div>
        </div>
      </main>

      <div className="relative z-10 bg-surface">
        <Footer />
      </div>
      <MobileBottomNav />
    </div>
  );
};

export default LandingPage;
