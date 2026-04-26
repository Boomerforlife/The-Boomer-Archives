import React, { useState, useEffect, useRef } from 'react';
import TransitionLink from '../components/common/TransitionLink';
import TopAppBar from '../components/layout/TopAppBar';
import SideNavBar from '../components/layout/SideNavBar';
import MobileBottomNav from '../components/layout/MobileBottomNav';
import Footer from '../components/layout/Footer';
import { useData } from '../contexts/DataContext';

const LandingPage = () => {
  const { posts, loading } = useData();
  const [heroVisible, setHeroVisible] = React.useState(true);
  const [visibleCards, setVisibleCards] = useState(new Set());
  const heroRef = React.useRef(null);
  const cardRefs = useRef([]);
  const vantaRef = useRef(null);
  const [showTopBar, setShowTopBar] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowTopBar(window.scrollY > window.innerHeight * 0.8);
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
    
    const effect = window.VANTA.FOG({
      el: vantaRef.current,
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.00,
      minWidth: 200.00,
      highlightColor: 0xAAA396,
      midtoneColor: 0xF1EADA,
      lowlightColor: 0xCEC1AB,
      baseColor: 0xB59E7D,
      blurFactor: 0.37,
      zoom: 0.70,
      speed: 1.30
    });

    return () => {
      if (effect) effect.destroy();
    };
  }, []);

  const featuredPosts = posts.slice(0, 4);

  return (
    <div className="min-h-screen bg-surface">
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
        </section>

        {/* Content starts after full-screen hero */}
        <div className="relative z-10 mt-[100vh] bg-surface pt-20">
          <div className="px-8 max-w-7xl mx-auto">
          {/* Featured Cards */}
          <div className="space-y-12">
            {!loading && featuredPosts.map((post, index) => (
              <article 
                key={post.id} 
                ref={el => cardRefs.current[index] = el}
                data-index={index}
                className={`group cursor-pointer card-hover-preview transition-all duration-700 ease-out ${
                  visibleCards.has(index) 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-12'
                }`}
              >
                <div className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} bg-surface-container-low rounded-xl overflow-hidden whisper-shadow min-h-[400px]`}>
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
                    <TransitionLink 
                      to={`/read/${post.id}`}
                      className="self-start text-xs font-medium uppercase tracking-widest text-primary border-b border-primary/30 pb-1 hover:border-primary transition-colors"
                    >
                      Enter Entry
                    </TransitionLink>
                  </div>
                </div>
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
