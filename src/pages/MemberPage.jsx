import React from 'react';
import { Link } from 'react-router-dom';
import TopAppBar from '../components/layout/TopAppBar';
import SideNavBar from '../components/layout/SideNavBar';
import MobileBottomNav from '../components/layout/MobileBottomNav';
import Footer from '../components/layout/Footer';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';

const MemberPage = () => {
  const { posts } = useData();
  const { currentUser, signInWithGoogle, isAdmin, signOut } = useAuth();

  // Simulated reading journal data using the real posts
  const recentlyReadPosts = posts.slice(0, 2);
  const heartedPosts = [...posts].sort((a, b) => (b.hearts || 0) - (a.hearts || 0)).slice(0, 4);

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
                src={currentUser?.photoURL || "https://i.pinimg.com/736x/d4/17/c5/d417c5ecee4000c998059d84398ddf03.jpg"}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-3xl font-headline italic font-bold text-on-surface">
                {currentUser?.displayName || 'The Anonymous Reader'}
              </h1>
              <p className="text-on-surface-variant mt-1">
                Curating the tactile since {new Date().getFullYear()}
              </p>
              {currentUser ? (
                <button
                  onClick={signOut}
                  className="mt-3 text-sm font-bold text-error hover:opacity-80 transition-opacity"
                >
                  Sign out
                </button>
              ) : (
                <button
                  onClick={signInWithGoogle}
                  className="mt-3 text-sm font-bold text-primary hover:text-secondary transition-colors"
                >
                  Sign in to save your progress
                </button>
              )}
            </div>
          </div>

          {/* Reading Journal */}
          <section className="mb-16">
            <h2 className="text-xl font-headline italic font-bold mb-6 text-on-surface">
              Recent Reads
            </h2>
            <div className="space-y-4">
              {recentlyReadPosts.map((post) => (
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
              Community Favorites
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
