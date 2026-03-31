import React from 'react';
import { Link } from 'react-router-dom';
import TopAppBar from '../components/layout/TopAppBar';
import SideNavBar from '../components/layout/SideNavBar';
import MobileBottomNav from '../components/layout/MobileBottomNav';
import Footer from '../components/layout/Footer';
import { mockPosts } from '../data/mockData';

const MemberPage = () => {
  const savedPosts = mockPosts.slice(0, 2);
  const heartedPosts = mockPosts.slice(2, 4);

  return (
    <div className="min-h-screen bg-surface">
      <TopAppBar />
      <SideNavBar />
      
      <main className="pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-8 py-12">
          {/* Profile Header */}
          <div className="flex items-center gap-6 mb-12">
            <div className="w-20 h-20 rounded-full bg-surface-variant overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200" 
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-3xl font-headline italic font-bold text-on-surface">
                The Archivist
              </h1>
              <p className="text-on-surface-variant mt-1">
                Curating the tactile since 2024
              </p>
              <div className="flex gap-6 mt-3 text-sm text-on-surface-variant">
                <span><strong className="text-on-surface">12</strong> Entries</span>
                <span><strong className="text-on-surface">48</strong> Hearts</span>
                <span><strong className="text-on-surface">6</strong> Collections</span>
              </div>
            </div>
          </div>

          {/* Saved for Later */}
          <section className="mb-16">
            <h2 className="text-xl font-headline italic font-bold mb-6 text-on-surface">
              Saved for Later
            </h2>
            <div className="space-y-4">
              {savedPosts.map((post) => (
                <div key={post.id} className="flex gap-4 p-4 bg-surface-container-low rounded-lg hover:bg-surface-container-high transition-colors">
                  <img 
                    src={post.coverImage} 
                    alt={post.title}
                    className="w-24 h-24 object-cover rounded"
                  />
                  <div className="flex-1">
                    <span className="text-[10px] font-medium uppercase tracking-widest label-text text-primary">
                      {post.category}
                    </span>
                    <h3 className="font-headline text-lg font-bold mt-1">
                      <Link to={`/read/${post.id}`} className="hover:text-primary transition-colors">
                        {post.title}
                      </Link>
                    </h3>
                    <p className="text-sm text-on-surface-variant mt-2 line-clamp-2">
                      {post.excerpt}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Hearted Entries */}
          <section>
            <h2 className="text-xl font-headline italic font-bold mb-6 text-on-surface">
              Hearted Entries
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {heartedPosts.map((post) => (
                <div key={post.id} className="group">
                  <div className="aspect-[4/3] overflow-hidden rounded-lg mb-3">
                    <img 
                      src={post.coverImage} 
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <span className="text-[10px] font-medium uppercase tracking-widest label-text text-primary">
                    {post.category}
                  </span>
                  <h3 className="font-headline text-lg font-bold mt-1">
                    <Link to={`/read/${post.id}`} className="hover:text-primary transition-colors">
                      {post.title}
                    </Link>
                  </h3>
                  <div className="flex items-center gap-2 mt-2 text-sm text-on-surface-variant">
                    <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                      favorite
                    </span>
                    {post.hearts > 0 ? post.hearts : 'Hearted'}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
};

export default MemberPage;
