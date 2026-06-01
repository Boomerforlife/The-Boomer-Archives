import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import DOMPurify from 'dompurify';
import { z } from 'zod';
import TransitionLink from '../components/common/TransitionLink';
import TopAppBar from '../components/layout/TopAppBar';
import SideNavBar from '../components/layout/SideNavBar';
import MobileBottomNav from '../components/layout/MobileBottomNav';
import Footer from '../components/layout/Footer';
import AuthModal from '../components/auth/AuthModal';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { getCommentsForPost, addComment, incrementHearts } from '../services/firestore';

const ArticlePage = () => {
  const { id } = useParams();
  const { posts, series, loading } = useData();
  const { currentUser, isApprovedMember, signInWithGoogle } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [hasHearted, setHasHearted] = useState(false);
  const [commentError, setCommentError] = useState('');

  const commentSchema = z.object({
    content: z.string()
      .min(1, "Reflections cannot be empty")
      .max(2000, "Reflections must be under 2000 characters")
  });

  useEffect(() => {
    const fetchComments = async () => {
      const fetchedComments = await getCommentsForPost(id);
      setComments(fetchedComments);
    };
    fetchComments();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  const post = posts.find(p => p.id === id);

  if (!post) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <p>Post not found.</p>
      </div>
    );
  }

  // Get series info if post belongs to a series
  const currentSeries = post.seriesId ? series.find(s => s.id === post.seriesId) : null;
  const seriesPosts = currentSeries 
    ? posts.filter(p => p.seriesId === post.seriesId).sort((a, b) => (a.seriesOrder || 0) - (b.seriesOrder || 0))
    : [];
  const currentIndex = seriesPosts.findIndex(p => p.id === post.id);
  const nextPost = currentIndex >= 0 && currentIndex < seriesPosts.length - 1 ? seriesPosts[currentIndex + 1] : null;

  const handleHeart = async () => {
    if (hasHearted) return;
    await incrementHearts(id);
    setHasHearted(true);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return;
    
    try {
      commentSchema.parse({ content: newComment.trim() });
      setCommentError('');
    } catch (err) {
      setCommentError(err.errors[0].message);
      return;
    }

    setSubmitting(true);
    
    try {
      const initials = currentUser.displayName 
        ? currentUser.displayName.split(' ').map(n => n[0]).join('').toUpperCase()
        : 'U';

      const commentData = {
        author: currentUser.displayName || 'Anonymous',
        initials: initials,
        content: newComment.slice(0, 2000),
        date: new Date().toLocaleDateString(),
        uid: currentUser.uid
      };
      
      await addComment(id, commentData);
      setNewComment('');
      // Refresh comments
      const fetchedComments = await getCommentsForPost(id);
      setComments(fetchedComments);
    } catch (error) {
      console.error("Error adding comment", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-container-high">
      <TopAppBar />
      <SideNavBar />
      
      <main className="pt-32 pb-32 px-6 lg:pl-80 lg:pr-12 max-w-7xl mx-auto">
        {/* Reader Container */}
        <article className="bg-surface-container-lowest rounded-xl overflow-hidden whisper-shadow border border-outline-variant/10">
          {/* Hero Image Section */}
          <div className="w-full h-64 md:h-[460px] overflow-hidden">
            <img 
              src={post.coverImage} 
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="max-w-3xl mx-auto px-8 lg:px-12 py-16">
            {/* Metadata */}
            <div className="flex items-center gap-4 mb-8">
              {post.author && (
                <div className="w-10 h-10 rounded-full bg-surface-variant overflow-hidden">
                  <img 
                    src={post.author.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'} 
                    alt={post.author.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div>
                <span className="block text-xs font-medium uppercase tracking-widest label-text text-secondary">
                  {post.author?.name || 'The Archivist'}
                </span>
                <span className="block text-xs font-sans text-outline">
                  {post.date} • {post.readTime} min read
                </span>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <button 
                  onClick={handleHeart}
                  disabled={hasHearted}
                  className={`flex items-center gap-1 ${hasHearted ? 'text-primary' : 'text-outline hover:text-primary transition-colors'}`}
                >
                  <span className="material-symbols-outlined text-lg">
                    {hasHearted ? 'favorite' : 'favorite_border'}
                  </span>
                  <span className="text-sm font-sans">{post.hearts || 0}</span>
                </button>
              </div>
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline italic font-bold tracking-tight text-on-surface mb-12 leading-tight">
              {post.title}
            </h1>

            {post.visibility === 'private' && !isApprovedMember ? (
              <div className="text-center py-16 bg-surface-container-low rounded-xl border border-outline-variant/10 my-12 shadow-sm">
                <span className="material-symbols-outlined text-5xl text-outline mb-4">lock</span>
                <h2 className="text-2xl font-headline italic font-bold text-on-surface mb-4">Members Only Volume</h2>
                <p className="text-on-surface-variant max-w-md mx-auto mb-8">
                  You are not a member yet. Would you like to become a member to read this reflection and others like it?
                </p>
                <TransitionLink 
                  to="/subscribe"
                  className="inline-flex items-center gap-2 bg-primary text-on-primary py-3 px-8 rounded-full text-xs font-medium uppercase tracking-widest label-text hover:opacity-90 transition-all"
                >
                  Subscribe Here
                </TransitionLink>
              </div>
            ) : (
              <>
                {/* Body Content */}
                <div className="prose-custom text-on-surface-variant 
                  [&>p:first-of-type]:first-letter:text-7xl 
                  [&>p:first-of-type]:first-letter:font-serif 
                  [&>p:first-of-type]:first-letter:float-left 
                  [&>p:first-of-type]:first-letter:mr-3 
                  [&>p:first-of-type]:first-letter:mt-2 
                  [&>p:first-of-type]:first-letter:text-primary
                  [&>blockquote]:my-12 [&>blockquote]:py-4 [&>blockquote]:pl-8 [&>blockquote]:border-l-2 [&>blockquote]:border-secondary [&>blockquote]:italic [&>blockquote]:text-2xl [&>blockquote]:font-headline [&>blockquote]:text-on-surface
                  [&>h2]:text-2xl [&>h2]:font-headline [&>h2]:font-semibold [&>h2]:text-on-surface [&>h2]:mt-12 [&>h2]:mb-6
                  [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:opacity-80
                  [&_ol]:list-decimal [&_ol]:ml-6 [&_ul]:list-disc [&_ul]:ml-6 [&_li]:mb-2
                  space-y-6
                ">
                  <ReactMarkdown>
                    {DOMPurify.sanitize(post.content || '', {
                      ALLOWED_TAGS: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote',
                                      'ul', 'ol', 'li', 'a', 'strong', 'em', 'code', 'pre',
                                      'br', 'hr', 'img'],
                      ALLOWED_ATTR: ['href', 'target', 'rel', 'src', 'alt'],
                      FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form', 'input', 'style', 'svg', 'math'],
                      FORBID_ATTR: ['onerror', 'onclick', 'onload', 'onmouseover', 'onfocus', 'onblur', 'onchange', 'onsubmit', 'class', 'style', 'id'],
                      ALLOW_UNKNOWN_PROTOCOLS: false,
                      ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto):|[^a-z]|[a-z+.-]+(?:[^a-z+.:-]|$))/i
                    })}
                  </ReactMarkdown>
                </div>

                {/* Interaction Tags */}
                <div className="mt-16 pt-8 border-t border-outline-variant/20 flex flex-wrap gap-2">
                  {post.tags && post.tags.map((tag) => (
                    <span 
                      key={tag}
                      className="px-3 py-1 bg-surface-container-low text-xs font-medium uppercase tracking-widest label-text text-secondary rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        </article>

        {/* Series Navigation - Next Volume */}
        {nextPost && (
          <section className="max-w-3xl mx-auto mt-16">
            <div className="bg-surface-container-low rounded-xl p-8 border border-outline-variant/10">
              <span className="text-[10px] font-medium uppercase tracking-widest label-text text-on-surface-variant mb-2 block">
                {currentSeries?.title} • Volume {nextPost.seriesOrder}
              </span>
              <h3 className="text-2xl font-headline italic font-bold text-on-surface mb-4">
                {nextPost.title}
              </h3>
              <p className="text-on-surface-variant text-sm mb-6 line-clamp-2">
                {nextPost.excerpt}
              </p>
              <TransitionLink 
                to={`/read/${nextPost.id}`}
                className="inline-flex items-center gap-2 bg-primary text-on-primary py-3 px-6 rounded-full text-xs font-medium uppercase tracking-widest label-text hover:opacity-90 transition-all"
              >
                Read Next
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </TransitionLink>
            </div>
          </section>
        )}

        {/* Comments Section */}
        <section className="max-w-3xl mx-auto mt-20">
          <h3 className="text-xl font-headline italic font-bold mb-8 text-on-surface">
            Reflections ({comments.length})
          </h3>
          
          <div className="space-y-10">
            {comments.map((comment) => (
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

            {/* Comment Input */}
            <div className="mt-12 bg-surface-container-low p-8 rounded-lg border border-outline-variant/10">
              {!currentUser ? (
                <div className="text-center py-8">
                  <p className="text-on-surface-variant mb-4">
                    Sign in to share your reflections
                  </p>
                  <button 
                    onClick={signInWithGoogle}
                    className="bg-primary text-on-primary py-3 px-8 rounded-md text-xs font-medium uppercase tracking-widest label-text hover:opacity-90 transition-all"
                  >
                    Sign in with Google
                  </button>
                </div>
              ) : (
                <form onSubmit={handleCommentSubmit} className="flex flex-col">
                  <p className="text-sm text-on-surface-variant mb-4">
                    Posting as <strong>{currentUser.displayName}</strong>
                  </p>
                  <textarea
                    value={newComment}
                    onChange={(e) => { setNewComment(e.target.value); setCommentError(''); }}
                    placeholder="Share your reflections..."
                    className="w-full bg-surface p-4 rounded border border-outline-variant/30 focus:ring-1 focus:ring-primary focus:outline-none min-h-[120px] mb-2 text-sm"
                  ></textarea>
                  {commentError && <p className="text-error text-xs mb-4">{commentError}</p>}
                  <button 
                    type="submit"
                    disabled={submitting || !newComment.trim()}
                    className="self-end bg-primary text-on-primary py-2 px-6 rounded-md text-xs font-medium uppercase tracking-widest label-text hover:opacity-90 transition-all disabled:opacity-50"
                  >
                    {submitting ? 'Posting...' : 'Post Reflection'}
                  </button>
                </form>
              )}
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

