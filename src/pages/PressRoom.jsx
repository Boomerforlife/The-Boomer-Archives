import React, { useState, useEffect } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import TopAppBar from '../components/layout/TopAppBar';
import SideNavBar from '../components/layout/SideNavBar';
import Footer from '../components/layout/Footer';
import CardDesigner from '../components/press/CardDesigner';
import SeriesOrchestrator from '../components/press/SeriesOrchestrator';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { createPost, updatePost, createSeries, assignPostToSeries, getAllSubscribers, updateSubscriberStatus } from '../services/firestore';

const PressRoom = () => {
  const { isAdmin, currentUser } = useAuth();
  const { allPosts, series, loading } = useData();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [activeTab, setActiveTab] = useState('write');
  
  const [currentPost, setCurrentPost] = useState({
    id: 'new',
    title: '',
    excerpt: '',
    content: '',
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800',
    category: 'Draft',
    editorialTag: '',
    isFeatured: false,
    visibility: 'public',
    seriesId: null,
    seriesOrder: null,
    status: 'draft'
  });

  const [saving, setSaving] = useState(false);
  const [subscribers, setSubscribers] = useState([]);

  useEffect(() => {
    if (activeTab === 'subscribers') {
      const loadSubs = async () => {
        try {
          const subs = await getAllSubscribers();
          setSubscribers(subs);
        } catch (error) {
          console.error("Error loading subscribers", error);
        }
      };
      loadSubs();
    }
  }, [activeTab]);

  useEffect(() => {
    // If we select an existing post, populate the editor
    if (currentPost.id !== 'new') {
      setTitle(currentPost.title || '');
      setContent(currentPost.content || '');
    }
  }, [currentPost.id]);

  if (!loading && !isAdmin) {
    return <Navigate to="/" state={{ showSentinelMessage: true }} replace />;
  }

  if (loading) {
    return <div className="min-h-screen bg-surface flex items-center justify-center">Loading Press Room...</div>;
  }


  const wordCount = content.split(/\s+/).filter(Boolean).length;
  const readTime = Math.ceil(wordCount / 200) || 1;

  const handleUpdatePost = (updatedPost) => {
    setCurrentPost(updatedPost);
  };

  const handleCreateSeries = async (newSeriesData) => {
    try {
      await createSeries(newSeriesData);
      alert('Series created successfully!');
    } catch (error) {
      console.error("Error creating series:", error);
      alert('Failed to create series');
    }
  };

  const handleAssignPost = async (postId, seriesId, order) => {
    try {
      await assignPostToSeries(postId, seriesId, order);
      alert('Post assigned to series successfully!');
    } catch (error) {
      console.error("Error assigning post:", error);
      alert('Failed to assign post to series');
    }
  };

  const handleSave = async (status = 'draft') => {
    setSaving(true);
    try {
      const postData = {
        ...currentPost,
        title,
        content,
        excerpt: currentPost.excerpt || content.substring(0, 100) + '...',
        status,
        readTime,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      };

      if (currentPost.id === 'new') {
        const docRef = await createPost({
          ...postData,
          author: {
            name: currentUser.displayName,
            avatar: currentUser.photoURL
          }
        });
        setCurrentPost({ ...postData, id: docRef.id });
      } else {
        await updatePost(currentPost.id, postData);
        setCurrentPost(postData);
      }
      alert(`Post ${status === 'published' ? 'published' : 'saved'} successfully!`);
    } catch (error) {
      console.error("Error saving post:", error);
      alert("Failed to save post");
    } finally {
      setSaving(false);
    }
  };

  const handleInsertImage = () => {
    const url = window.prompt('Enter image URL:');
    if (!url) return;
    
    const altText = window.prompt('Enter a brief description (alt text):') || 'image';
    const imageMarkdown = `\n![${altText}](${url})\n`;
    
    setContent(prev => prev + imageMarkdown);
  };

  return (
    <div className="min-h-screen bg-surface relative">
      <TopAppBar />
      
      {/* Main Layout Shell */}
      <div className="min-h-screen pt-16">
        <SideNavBar />
        
        {/* Editor Content Canvas */}
        <main className="flex-1 flex flex-col md:flex-row bg-surface-dim overflow-hidden">
          {/* Drafts/Navigation Panel */}
          <section className="w-full md:w-80 border-r border-outline-variant/10 bg-surface-container-low/50 backdrop-blur-sm p-6 overflow-y-auto hidden md:block">
            <div className="mb-8">
              <h2 className="text-[10px] font-medium uppercase tracking-widest label-text text-on-surface-variant mb-4">
                All Entries
              </h2>
              <button 
                onClick={() => setCurrentPost({ id: 'new', title: '', content: '', status: 'draft' })}
                className="w-full text-left py-2 text-sm text-primary hover:underline mb-4"
              >
                + Create New Entry
              </button>
              <ul className="space-y-4">
                {allPosts.map((post) => (
                  <li key={post.id}>
                    <button 
                      onClick={() => setCurrentPost(post)}
                      className="group block text-left w-full"
                    >
                      <span className="block text-sm font-headline italic text-on-surface group-hover:text-primary transition-colors truncate">
                        {post.title || 'Untitled Draft'}
                      </span>
                      <span className="block text-[10px] font-medium uppercase tracking-tighter label-text text-on-surface-variant/60">
                        {post.status} • {post.date || 'No Date'}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h2 className="text-[10px] font-medium uppercase tracking-widest label-text text-on-surface-variant mb-4">
                Creator Tools
              </h2>
              <nav className="flex flex-col gap-2">
                <button
                  onClick={() => setActiveTab('write')}
                  className={`flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200 text-left ${
                    activeTab === 'write'
                      ? 'bg-surface-container-high text-on-surface font-bold'
                      : 'text-on-surface-variant hover:bg-surface-variant'
                  }`}
                >
                  <span className="material-symbols-outlined">edit</span>
                  <span className="text-xs font-medium uppercase tracking-widest label-text">Write</span>
                </button>
                <button
                  onClick={() => setActiveTab('design')}
                  className={`flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200 text-left ${
                    activeTab === 'design'
                      ? 'bg-surface-container-high text-on-surface font-bold'
                      : 'text-on-surface-variant hover:bg-surface-variant'
                  }`}
                >
                  <span className="material-symbols-outlined">palette</span>
                  <span className="text-xs font-medium uppercase tracking-widest label-text">Card Designer</span>
                </button>
                <button
                  onClick={() => setActiveTab('series')}
                  className={`flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200 text-left ${
                    activeTab === 'series'
                      ? 'bg-surface-container-high text-on-surface font-bold'
                      : 'text-on-surface-variant hover:bg-surface-variant'
                  }`}
                >
                  <span className="material-symbols-outlined">collections_bookmark</span>
                  <span className="text-xs font-medium uppercase tracking-widest label-text">Series</span>
                </button>
                <button
                  onClick={() => setActiveTab('subscribers')}
                  className={`flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200 text-left ${
                    activeTab === 'subscribers'
                      ? 'bg-surface-container-high text-on-surface font-bold'
                      : 'text-on-surface-variant hover:bg-surface-variant'
                  }`}
                >
                  <span className="material-symbols-outlined">group</span>
                  <span className="text-xs font-medium uppercase tracking-widest label-text">Subscribers</span>
                </button>
              </nav>
            </div>
          </section>

          {/* Main Content Area - Changes based on active tab */}
          {activeTab === 'write' && (
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
                    <button 
                      onClick={handleInsertImage} 
                      className="material-symbols-outlined text-outline hover:text-on-surface transition-colors" 
                      title="Insert Image URL"
                    >
                      image
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleSave('draft')}
                      disabled={saving}
                      className="bg-surface-variant text-on-surface-variant px-6 py-2 rounded-full text-xs font-medium uppercase tracking-widest label-text hover:opacity-90 transition-all"
                    >
                      {saving ? 'Saving...' : 'Save Draft'}
                    </button>
                    <button 
                      onClick={() => handleSave('published')}
                      disabled={saving}
                      className="bg-on-surface text-surface px-6 py-2 rounded-full text-xs font-medium uppercase tracking-widest label-text hover:opacity-90 transition-all"
                    >
                      {saving ? 'Publishing...' : 'Publish'}
                    </button>
                  </div>
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
                    {currentPost.category || 'Draft'}
                  </span>
                  <div className="flex-1 text-right text-[10px] font-medium uppercase tracking-widest label-text text-on-surface-variant/40">
                    Words: {wordCount} · Est. {readTime} min
                  </div>
                </div>
                <div className="mt-6 flex items-center gap-4">
                  <span className="text-xs font-medium text-on-surface-variant">Visibility:</span>
                  <select 
                    value={currentPost.visibility || 'public'} 
                    onChange={(e) => setCurrentPost({...currentPost, visibility: e.target.value})}
                    className="bg-transparent border border-outline-variant/30 text-xs text-on-surface-variant px-3 py-1 rounded focus:outline-none focus:border-primary"
                  >
                    <option value="public">Public</option>
                    <option value="private">Members Only</option>
                  </select>
                </div>
              </div>
            </section>
          )}

          {activeTab === 'design' && (
            <section className="flex-1 bg-surface-container-lowest p-8 md:p-16 overflow-y-auto">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-headline italic font-bold text-on-surface mb-8">
                  Card Designer
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <CardDesigner post={currentPost} onUpdate={handleUpdatePost} />
                  <div className="space-y-6">
                    <h3 className="text-sm font-medium text-on-surface">Preview in Archive Context</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className={`bg-surface-container-high rounded-xl overflow-hidden whisper-shadow ${currentPost.isFeatured ? 'col-span-2' : ''}`}>
                        <div className="aspect-[4/3] overflow-hidden">
                          <img src={currentPost.coverImage} alt={currentPost.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="p-4">
                          {currentPost.editorialTag && (
                           <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-[10px] font-medium uppercase tracking-widest rounded mb-2">
                             {currentPost.editorialTag}
                           </span>
                          )}
                          <h4 className="font-headline text-lg font-bold text-on-surface leading-tight">
                            {currentPost.title || 'Untitled Post'}
                          </h4>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {activeTab === 'series' && (
            <section className="flex-1 bg-surface-container-lowest p-8 md:p-16 overflow-y-auto">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-headline italic font-bold text-on-surface mb-8">
                  Series Orchestrator
                </h2>
                <SeriesOrchestrator
                  posts={allPosts}
                  series={series}
                  onCreateSeries={handleCreateSeries}
                  onAssignPost={handleAssignPost}
                />
              </div>
            </section>
          )}

          {activeTab === 'subscribers' && (
            <section className="flex-1 bg-surface-container-lowest p-8 md:p-16 overflow-y-auto">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-headline italic font-bold text-on-surface mb-8">
                  Subscriber Management
                </h2>
                <div className="bg-surface-container-high rounded-xl overflow-hidden whisper-shadow">
                  {subscribers.length === 0 ? (
                    <div className="p-8 text-center text-on-surface-variant italic font-serif">
                      No subscribers found.
                    </div>
                  ) : (
                    <ul className="divide-y divide-outline-variant/10">
                      {subscribers.map(sub => (
                        <li key={sub.id} className="flex items-center justify-between p-6 hover:bg-surface-variant transition-colors">
                          <div>
                            <span className="block text-on-surface font-medium">
                              {sub.name ? `${sub.name} (${sub.email})` : sub.email}
                            </span>
                            <span className="block text-xs text-on-surface-variant mt-1">
                              Status: <strong className={sub.status === 'approved' ? 'text-primary' : 'text-error'}>{sub.status.toUpperCase()}</strong> • Date: {sub.date?.toDate().toLocaleDateString() || 'Recently'}
                            </span>
                          </div>
                          <button
                            onClick={async () => {
                              try {
                                const newStatus = sub.status === 'approved' ? 'pending' : 'approved';
                                await updateSubscriberStatus(sub.email, newStatus);
                                setSubscribers(prev => prev.map(s => 
                                  s.email === sub.email ? { ...s, status: newStatus } : s
                                ));
                              } catch(e) {
                                alert('Failed to update status');
                              }
                            }}
                            className={sub.status === 'approved' 
                              ? "bg-surface-container-highest text-on-surface hover:bg-error hover:text-error-container px-4 py-2 rounded text-xs font-medium uppercase tracking-widest label-text transition-colors"
                              : "bg-primary/10 text-primary hover:bg-primary hover:text-on-primary px-4 py-2 rounded text-xs font-medium uppercase tracking-widest label-text transition-colors"
                            }
                          >
                            {sub.status === 'approved' ? 'Revoke' : 'Approve'}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </section>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default PressRoom;
