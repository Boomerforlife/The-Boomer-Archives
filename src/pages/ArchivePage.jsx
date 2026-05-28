import React, { useState, useEffect, useRef } from 'react';
import TransitionLink from '../components/common/TransitionLink';
import TopAppBar from '../components/layout/TopAppBar';
import SideNavBar from '../components/layout/SideNavBar';
import MobileBottomNav from '../components/layout/MobileBottomNav';
import Footer from '../components/layout/Footer';
import { useData } from '../contexts/DataContext';

const ArchivePage = () => {
  const { posts, series } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeries, setSelectedSeries] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [visibleCards, setVisibleCards] = useState(new Set());
  const cardRefs = useRef([]);
  const postsPerPage = 6;

  const categories = ['Manuscripts', 'Textiles', 'Industrial', 'Ephemeral'];

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeries = selectedSeries ? post.seriesId === selectedSeries : true;
    return matchesSearch && matchesSeries;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + postsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
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

    return () => observer.disconnect();
  }, [paginatedPosts]);

  return (
    <div className="min-h-screen bg-surface">
      <TopAppBar />
      <SideNavBar />
      
      <main className="pt-24 pb-32 md:pb-0 min-h-screen">
        <div className="px-8 py-12">
          {/* Search Section */}
          <section className="mb-20">
            <div className="relative group w-full">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline">
                search
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // Reset to page 1 on search
                }}
                className="w-full bg-surface-container-low border-none border-b border-outline-variant/30 py-6 pl-14 pr-6 focus:ring-0 focus:bg-surface-container-highest transition-all duration-300 font-serif text-xl placeholder:italic placeholder:text-outline/50"
                placeholder="Search through My Big Brain..."
              />
              <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-primary group-focus-within:w-full transition-all duration-500"></div>
            </div>

            {/* Series Filter */}
            {series && series.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-6">
                <button
                  onClick={() => {
                    setSelectedSeries(null);
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-2 rounded-full text-xs font-medium uppercase tracking-widest label-text transition-colors ${
                    selectedSeries === null 
                      ? 'bg-primary text-on-primary' 
                      : 'bg-surface-container-high text-on-surface hover:bg-surface-variant'
                  }`}
                >
                  All Entries
                </button>
                {series.map(s => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setSelectedSeries(s.id);
                      setCurrentPage(1);
                    }}
                    className={`px-4 py-2 rounded-full text-xs font-medium uppercase tracking-widest label-text transition-colors ${
                      selectedSeries === s.id 
                        ? 'bg-primary text-on-primary' 
                        : 'bg-surface-container-high text-on-surface hover:bg-surface-variant'
                    }`}
                  >
                    {s.title}
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* Archive Content: Asymmetric Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            {/* Volume Header Column */}
            <div className="md:col-span-3 lg:sticky lg:top-32 h-fit">
              <h3 className="font-headline text-4xl italic font-bold text-on-surface mb-2 tracking-tighter">
                Volume I
              </h3>
              <div className="w-12 h-0.5 bg-primary mb-6"></div>
              <p className="label-text text-xs text-outline leading-relaxed uppercase tracking-widest">
                The Formative Years<br/>2020 — 2030
              </p>
            </div>

            {/* Archive Items Column */}
            <div className="md:col-span-9">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {paginatedPosts.map((post, index) => (
                  <article 
                    key={post.id} 
                    ref={el => cardRefs.current[index] = el}
                    data-index={index}
                    className={`group transition-all duration-700 ease-out ${
                      visibleCards.has(index) 
                        ? 'opacity-100 translate-y-0' 
                        : 'opacity-0 translate-y-12'
                    }`}
                    style={{ transitionDelay: `${(index % 3) * 100}ms` }}
                  >
                    <TransitionLink 
                      to={`/read/${post.id}`}
                      className="block bg-surface-container-low rounded-xl overflow-hidden whisper-shadow hover:shadow-lg transition-shadow duration-300"
                    >
                      <div className={`relative overflow-hidden bg-surface-dim ${post.isFeatured ? 'aspect-[21/9]' : 'aspect-[4/5]'}`}>
                        <img 
                          src={post.coverImage} 
                          alt={post.title}
                          className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                        <div className="absolute inset-0 dimmed-overlay" />
                        {post.editorialTag && (
                          <span className="absolute top-4 left-4 px-3 py-1 bg-primary/90 text-on-primary text-[10px] font-medium uppercase tracking-widest rounded">
                            {post.editorialTag}
                          </span>
                        )}
                        {post.isFeatured && (
                          <span className="absolute top-4 right-4 px-3 py-1 bg-secondary/90 text-on-secondary text-[10px] font-medium uppercase tracking-widest rounded">
                            Featured
                          </span>
                        )}
                      </div>
                      
                      <div className={`p-6 ${post.isFeatured ? 'md:p-8' : ''}`}>
                        <span className="label-text text-[10px] text-primary uppercase tracking-[0.3em] mb-3 block">
                          {post.seriesId ? `Volume ${post.seriesOrder} • ` : ''}{post.date}
                        </span>
                        <h4 className={`font-headline font-bold mb-3 leading-tight group-hover:text-primary transition-colors ${post.isFeatured ? 'text-3xl' : 'text-xl'}`}>
                          {post.title}
                        </h4>
                        <p className={`text-on-surface-variant leading-relaxed italic mb-4 ${post.isFeatured ? 'text-lg' : 'text-sm'}`}>
                          {post.excerpt}
                        </p>
                        <span 
                          className="label-text text-xs uppercase font-semibold tracking-widest border-b border-outline-variant/50 w-fit pb-1 group-hover:border-primary transition-colors block"
                        >
                          Read {post.seriesId ? 'Volume' : 'Reflection'}
                        </span>
                      </div>
                    </TransitionLink>
                  </article>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-12">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg bg-surface-container text-on-surface disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-container-high transition-colors"
                  >
                    <span className="material-symbols-outlined">chevron_left</span>
                  </button>
                  
                  <div className="flex items-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                          currentPage === page
                            ? 'bg-primary text-on-primary'
                            : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg bg-surface-container text-on-surface disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-container-high transition-colors"
                  >
                    <span className="material-symbols-outlined">chevron_right</span>
                  </button>
                </div>
              )}

              {/* Pull Quote Accent */}
              <div className="py-12 border-l-2 border-secondary pl-8 my-12">
                <blockquote className="font-headline text-3xl italic text-on-secondary-container leading-snug">
                  "Comfort is just fear in disguise, for life has no rest. (ima still go out on the weekends though)"
                </blockquote>
                <cite className="label-text text-[10px] uppercase tracking-widest mt-4 block text-outline">
                  — The Archivist's Preface
                </cite>
              </div>
            </div>
          </div>

          {/* Volume II Transition */}
          <div className="mt-40 pt-20 border-t border-outline-variant/20 text-center">
            <span className="label-text text-[10px] uppercase tracking-[0.5em] text-outline mb-8 block">
              Next Epoch
            </span>
            <h3 className="font-headline text-6xl italic font-bold text-on-surface tracking-tighter opacity-30 hover:opacity-100 transition-opacity cursor-pointer">
              Volume II: The Mind shift
            </h3>
          </div>
        </div>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
};

export default ArchivePage;
