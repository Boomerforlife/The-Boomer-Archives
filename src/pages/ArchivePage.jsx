import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import TopAppBar from '../components/layout/TopAppBar';
import SideNavBar from '../components/layout/SideNavBar';
import MobileBottomNav from '../components/layout/MobileBottomNav';
import Footer from '../components/layout/Footer';
import { mockPosts } from '../data/mockData';

const ArchivePage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['Manuscripts', 'Textiles', 'Industrial', 'Ephemeral'];

  const filteredPosts = mockPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-surface">
      <TopAppBar />
      <SideNavBar />
      
      <main className="lg:ml-64 pt-24 min-h-screen">
        <div className="max-w-5xl mx-auto px-8 py-12">
          {/* Search Section */}
          <section className="mb-20">
            <div className="relative group max-w-2xl">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline">
                search
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-surface-container-low border-none border-b border-outline-variant/30 py-6 pl-14 pr-6 focus:ring-0 focus:bg-surface-container-highest transition-all duration-300 font-serif text-xl placeholder:italic placeholder:text-outline/50"
                placeholder="Search the tactile records..."
              />
              <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-primary group-focus-within:w-full transition-all duration-500"></div>
            </div>
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
                The Formative Years<br/>1890 — 1924
              </p>
            </div>

            {/* Archive Items Column */}
            <div className="md:col-span-9 space-y-24">
              {filteredPosts.map((post, index) => (
                <article key={post.id} className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center group">
                  <div className={`${index % 2 === 1 ? 'order-2 md:order-1' : ''} relative overflow-hidden aspect-[4/5] bg-surface-dim`}>
                    <img 
                      src={post.coverImage} 
                      alt={post.title}
                      className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 dimmed-overlay"></div>
                  </div>
                  
                  <div className={`${index % 2 === 1 ? 'order-1 md:order-2 text-right md:text-left' : ''} flex flex-col justify-center`}>
                    <span className="label-text text-[10px] text-primary uppercase tracking-[0.3em] mb-4">
                      Post No. {String(post.postNumber).padStart(3, '0')} • {post.date}
                    </span>
                    <h4 className="font-headline text-2xl font-bold mb-4 leading-tight group-hover:text-primary transition-colors cursor-pointer">
                      {post.title}
                    </h4>
                    <p className="text-on-surface-variant leading-relaxed text-lg italic mb-6">
                      {post.excerpt}
                    </p>
                    <Link 
                      to={`/read/${post.id}`}
                      className={`label-text text-xs uppercase font-semibold tracking-widest border-b border-outline-variant/50 w-fit pb-1 hover:border-primary transition-colors ${
                        index % 2 === 1 ? 'ml-auto md:ml-0' : ''
                      }`}
                    >
                      Read Reflection
                    </Link>
                  </div>
                </article>
              ))}

              {/* Pull Quote Accent */}
              <div className="py-12 border-l-2 border-secondary pl-8 my-12">
                <blockquote className="font-headline text-3xl italic text-on-secondary-container leading-snug">
                  "The digital age has not killed the tactile; it has only made the feel of paper more sacred, a physical anchor in a shifting stream."
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
              Volume II: The Industrial Shift
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
