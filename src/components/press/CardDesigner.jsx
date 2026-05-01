import React from 'react';

const CardDesigner = ({ post, onUpdate }) => {
  const handleToggleFeatured = () => {
    onUpdate({ ...post, isFeatured: !post.isFeatured });
  };

  const handleTagChange = (e) => {
    onUpdate({ ...post, editorialTag: e.target.value });
  };

  const handleCategoryChange = (e) => {
    onUpdate({ ...post, category: e.target.value });
  };

  const handleCoverChange = (e) => {
    onUpdate({ ...post, coverImage: e.target.value });
  };

  const handleTitleChange = (e) => {
    onUpdate({ ...post, title: e.target.value });
  };

  const handleExcerptChange = (e) => {
    onUpdate({ ...post, excerpt: e.target.value });
  };

  return (
    <div className="bg-surface-container-low rounded-xl p-6 space-y-6">
      <h3 className="text-[10px] font-medium uppercase tracking-widest label-text text-on-surface-variant mb-4">
        Card Designer
      </h3>

      {/* Featured Toggle */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-on-surface">Featured Post</label>
        <button
          onClick={handleToggleFeatured}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            post.isFeatured ? 'bg-primary' : 'bg-surface-variant'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              post.isFeatured ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
      {post.isFeatured && (
        <p className="text-xs text-primary">
          This post will span 2 columns in the Archive grid
        </p>
      )}

      {/* Title Input */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-on-surface">Headline</label>
        <input
          type="text"
          value={post.title || ''}
          onChange={handleTitleChange}
          placeholder="Enter headline..."
          className="w-full bg-surface-container-high border border-outline-variant/30 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
        />
      </div>

      {/* Excerpt Input */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-on-surface">Excerpt</label>
        <textarea
          value={post.excerpt || ''}
          onChange={handleExcerptChange}
          placeholder="Enter a brief description..."
          rows={3}
          className="w-full bg-surface-container-high border border-outline-variant/30 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary transition-colors resize-none"
        />
      </div>

      {/* Category Input */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-on-surface">Category</label>
        <input
          type="text"
          value={post.category || ''}
          onChange={handleCategoryChange}
          placeholder="e.g., Essay, Review, Journal"
          className="w-full bg-surface-container-high border border-outline-variant/30 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
        />
      </div>

      {/* Editorial Tag Input */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-on-surface">Editorial Tag</label>
        <input
          type="text"
          value={post.editorialTag || ''}
          onChange={handleTagChange}
          placeholder="e.g., TECH, PHILOSOPHY"
          className="w-full bg-surface-container-high border border-outline-variant/30 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
        />
      </div>

      {/* Cover Image URL */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-on-surface">Cover Image URL</label>
        <input
          type="text"
          value={post.coverImage}
          onChange={handleCoverChange}
          placeholder="https://..."
          className="w-full bg-surface-container-high border border-outline-variant/30 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
        />
      </div>

      {/* Live Preview */}
      <div className="space-y-2">
        <label className="text-[10px] font-medium uppercase tracking-widest label-text text-on-surface-variant">
          Live Preview
        </label>
        <div className={`bg-surface-container-high rounded-xl overflow-hidden whisper-shadow ${
          post.isFeatured ? 'lg:col-span-2' : ''
        }`}>
          <div className="aspect-[4/3] overflow-hidden">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-4">
            {post.editorialTag && (
              <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-[10px] font-medium uppercase tracking-widest rounded mb-2">
                {post.editorialTag}
              </span>
            )}
            <h4 className="font-headline text-lg font-bold text-on-surface leading-tight">
              {post.title}
            </h4>
            <p className="text-xs text-on-surface-variant mt-2 line-clamp-2">
              {post.excerpt}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardDesigner;
