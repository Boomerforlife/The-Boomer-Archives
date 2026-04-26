import React from 'react';
import TransitionLink from '../components/common/TransitionLink';
import TopAppBar from '../components/layout/TopAppBar';
import SideNavBar from '../components/layout/SideNavBar';
import Footer from '../components/layout/Footer';

const LegalBlooper = () => {
  return (
    <div className="min-h-screen bg-surface">
      <TopAppBar />
      <SideNavBar />
      
      <main className="pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-8 py-12">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="font-headline text-4xl italic font-bold text-on-surface mb-4">
              Legal Stuff
            </h1>
            <p className="text-on-surface-variant text-sm uppercase tracking-[0.2em]">
              Privacy & Terms
            </p>
          </div>

          {/* Content Area - Add your text here */}
          <div className="prose prose-lg max-w-none">
            <div className="bg-[#CEC1AB]/20 rounded-xl p-8 border border-outline-variant/10">
              <p className="text-on-surface-variant text-center italic">
                Yea Give Me your Data lol !! :D 
              </p>
            </div>
          </div>

          {/* Back Link */}
          <div className="mt-12 text-center">
            <TransitionLink
              to="/"
              className="inline-flex items-center gap-2 text-sm text-on-surface-variant hover:text-on-surface transition-colors"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              Back to Home
            </TransitionLink>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LegalBlooper;
