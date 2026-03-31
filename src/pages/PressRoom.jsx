import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import TopAppBar from '../components/layout/TopAppBar';
import SideNavBar from '../components/layout/SideNavBar';
import Footer from '../components/layout/Footer';

const PressRoom = () => {
  const [title, setTitle] = useState('The Weight of Vellum');
  const [content, setContent] = useState(`There is a particular resistance that vellum offers to the nib—a physical dialogue between animal hide and cold steel. In the digital archive, we often forget the haptic dimension of our thoughts.

To write is to carve. Even here, in this digital space designed to mimic the dimly lit study, the intention remains the same. We seek to pin down the ephemeral.

Consider the way light falls across a textured surface. Our interface should reflect this. Not through artificial shadows, but through the careful layering of tones—a tobacco-stained background that allows the eye to rest where the mind wanders.`);

  const drafts = [
    { title: 'The Weight of Vellum', modified: '2h ago' },
    { title: 'Reflections on Copperplate', modified: 'yesterday' },
    { title: 'Ink Chemistry & Permanence', modified: 'Oct 12, 2024' },
  ];

  const wordCount = content.split(/\s+/).length;
  const readTime = Math.ceil(wordCount / 200);

  return (
    <div className="min-h-screen bg-surface">
      <TopAppBar />
      
      {/* Main Layout Shell */}
      <div className="flex min-h-screen pt-16">
        <SideNavBar />
        
        {/* Editor Content Canvas */}
        <main className="flex-1 lg:ml-64 flex flex-col md:flex-row bg-surface-dim overflow-hidden">
          {/* Drafts/Navigation Panel */}
          <section className="w-full md:w-80 border-r border-outline-variant/10 bg-surface-container-low/50 backdrop-blur-sm p-6 overflow-y-auto hidden md:block">
            <div className="mb-8">
              <h2 className="text-[10px] font-medium uppercase tracking-widest label-text text-on-surface-variant mb-4">
                Recent Drafts
              </h2>
              <ul className="space-y-4">
                {drafts.map((draft, index) => (
                  <li key={index}>
                    <button className="group block text-left w-full">
                      <span className="block text-sm font-headline italic text-on-surface group-hover:text-primary transition-colors">
                        {draft.title}
                      </span>
                      <span className="block text-[10px] font-medium uppercase tracking-tighter label-text text-on-surface-variant/60">
                        Modified {draft.modified}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h2 className="text-[10px] font-medium uppercase tracking-widest label-text text-on-surface-variant mb-4">
                Archives
              </h2>
              <ul className="space-y-3">
                <li><Link to="/archive" className="text-xs font-medium label-text text-on-surface-variant hover:text-on-surface">Autumn Collection 2024</Link></li>
                <li><Link to="/archive" className="text-xs font-medium label-text text-on-surface-variant hover:text-on-surface">Technique Series</Link></li>
                <li><Link to="/archive" className="text-xs font-medium label-text text-on-surface-variant hover:text-on-surface">Material Studies</Link></li>
              </ul>
            </div>
          </section>

          {/* Main Writing Area */}
          <section className="flex-1 bg-surface-container-lowest p-8 md:p-16 lg:p-24 overflow-y-auto">
            <div className="max-w-2xl mx-auto editor-container">
              {/* Formatting Controls */}
              <div className="sticky top-0 mb-12 flex items-center justify-between border-b border-outline-variant/10 pb-4 bg-white/80 backdrop-blur-sm z-10">
                <div className="flex items-center gap-6">
                  <button className="material-symbols-outlined text-outline hover:text-on-surface transition-colors" title="Bold">
                    format_bold
                  </button>
                  <button className="material-symbols-outlined text-outline hover:text-on-surface transition-colors" title="Italic">
                    format_italic
                  </button>
                  <button className="material-symbols-outlined text-outline hover:text-on-surface transition-colors" title="Heading">
                    title
                  </button>
                  <button className="material-symbols-outlined text-outline hover:text-on-surface transition-colors" title="Quote">
                    format_quote
                  </button>
                  <button className="material-symbols-outlined text-outline hover:text-on-surface transition-colors" title="Link">
                    link
                  </button>
                </div>
                <button className="bg-on-surface text-surface px-6 py-2 rounded-full text-xs font-medium uppercase tracking-widest label-text hover:opacity-90 transition-all">
                  Publish
                </button>
              </div>

              {/* Title Input */}
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-4xl md:text-5xl font-headline italic tracking-tight mb-8 text-on-surface bg-transparent border-none focus:ring-0 w-full placeholder:text-outline-variant"
                placeholder="Enter title..."
              />

              {/* Editor Canvas */}
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="writing-canvas w-full bg-transparent border-none focus:ring-0 focus:outline-none text-lg md:text-xl leading-relaxed text-secondary resize-none min-h-[400px]"
                placeholder="Begin your entry..."
              />

              {/* Post Meta */}
              <div className="mt-20 pt-12 border-t border-outline-variant/20 flex flex-wrap gap-4 items-center">
                <span className="px-3 py-1 bg-surface-container-high rounded text-[10px] font-medium uppercase tracking-widest label-text text-on-surface-variant">
                  Material Study
                </span>
                <span className="px-3 py-1 bg-surface-container-high rounded text-[10px] font-medium uppercase tracking-widest label-text text-on-surface-variant">
                  Haptics
                </span>
                <div className="flex-1 text-right text-[10px] font-medium uppercase tracking-widest label-text text-on-surface-variant/40">
                  Words: {wordCount} · Est. {readTime} min
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default PressRoom;
