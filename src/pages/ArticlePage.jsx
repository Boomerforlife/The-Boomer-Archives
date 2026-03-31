import React from 'react';
import { Link, useParams } from 'react-router-dom';
import TopAppBar from '../components/layout/TopAppBar';
import SideNavBar from '../components/layout/SideNavBar';
import MobileBottomNav from '../components/layout/MobileBottomNav';
import Footer from '../components/layout/Footer';
import { mockPosts, mockComments } from '../data/mockData';

const ArticlePage = () => {
  const { id } = useParams();
  const post = mockPosts.find(p => p.id === id) || mockPosts[0];

  return (
    <div className="min-h-screen bg-surface-container-high">
      <TopAppBar />
      <SideNavBar />
      
      <main className="pt-32 pb-20 px-6 lg:pl-80 lg:pr-12 max-w-7xl mx-auto">
        {/* Reader Container */}
        <article className="bg-[#fffcf9] rounded-xl overflow-hidden shadow-[0_10px_30px_rgba(34,26,14,0.04)] border border-outline-variant/10">
          {/* Hero Image Section */}
          <div className="w-full h-[460px] overflow-hidden">
            <img 
              src={post.coverImage} 
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="max-w-3xl mx-auto px-8 lg:px-12 py-16">
            {/* Metadata */}
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 rounded-full bg-surface-variant overflow-hidden">
                <img 
                  src={post.author.avatar} 
                  alt={post.author.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="block text-xs font-medium uppercase tracking-widest label-text text-secondary">
                  {post.author.name}
                </span>
                <span className="block text-xs font-sans text-outline">
                  {post.date} • {post.readTime} min read
                </span>
              </div>
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline italic font-bold tracking-tight text-on-surface mb-12 leading-tight">
              {post.title}
            </h1>

            {/* Body Content */}
            <div className="prose-custom text-on-surface-variant">
              <p className="first-letter:text-7xl first-letter:font-serif first-letter:float-left first-letter:mr-3 first-letter:mt-2 first-letter:text-primary">
                {post.content}
              </p>
              
              <p>
                Consider the texture of heavy-stock vellum. It does not simply hold text; it frames it. The way light catches the slight irregularities of the fiber creates a depth that no high-resolution screen can replicate. This is the "dim mode" of physical existence—a low-contrast, high-focus environment where the mind can truly decompress.
              </p>

              {/* Pull Quote */}
              <div className="my-12 py-4 pl-8 border-l-2 border-secondary italic">
                <blockquote className="text-2xl font-headline text-on-surface">
                  "A book is a physical anchor in a world that is drifting into the ether. It is the only place left where the clock doesn't tick."
                </blockquote>
              </div>

              <p>
                We find that the Archivist does not merely collect objects, but moments of stillness. When we turn a page, we are engaging in a rhythmic choreography that has remained unchanged for centuries. This tactile feedback loop—the sound of the flip, the scent of the binding, the weight in the hands—creates a mnemonic bridge, helping the brain encode the narrative more deeply than a scrolling thumb ever could.
              </p>

              <h2 className="text-2xl font-headline font-semibold text-on-surface mt-12 mb-6">
                The Geometry of Concentration
              </h2>
              <p>
                The margins of a book are as important as the text itself. They provide a sanctuary for the reader's eye, a buffer against the noise of the external world. In our digital spaces, we have cluttered these borders with notifications and navigation, forgetting that white space—or in our case, warm paper tones—is the oxygen of thought.
              </p>
            </div>

            {/* Interaction Tags */}
            <div className="mt-16 pt-8 border-t border-outline-variant/20 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span 
                  key={tag}
                  className="px-3 py-1 bg-surface-container-low text-xs font-medium uppercase tracking-widest label-text text-secondary rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </article>

        {/* Comments Section */}
        <section className="max-w-3xl mx-auto mt-20">
          <h3 className="text-xl font-headline italic font-bold mb-8 text-on-surface">
            Reflections ({mockComments.length})
          </h3>
          
          <div className="space-y-10">
            {mockComments.map((comment) => (
              <div key={comment.id} className="flex gap-6">
                <div className="w-10 h-10 rounded bg-secondary-container flex-shrink-0 flex items-center justify-center">
                  <span className="text-xs font-bold label-text text-on-secondary-container">
                    {comment.initials}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold label-text">{comment.author}</span>
                    <span className="text-xs text-outline font-sans">{comment.date}</span>
                  </div>
                  <p className="text-sm text-on-surface-variant font-body leading-relaxed">
                    {comment.content}
                  </p>
                </div>
              </div>
            ))}

            {/* Comment Input - Gated */}
            <div className="mt-12 bg-surface-container-low p-8 rounded-lg border border-outline-variant/10">
              <div className="text-center py-8">
                <p className="text-on-surface-variant mb-4">
                  Sign in to share your reflections
                </p>
                <button className="bg-primary text-on-primary py-3 px-8 rounded-md text-xs font-medium uppercase tracking-widest label-text hover:opacity-90 transition-all">
                  Sign in with Google
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
};

export default ArticlePage;
