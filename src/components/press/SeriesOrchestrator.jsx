import React, { useState } from 'react';

const SeriesOrchestrator = ({ posts, series, onUpdateSeries, onAssignPost }) => {
  const [newSeriesTitle, setNewSeriesTitle] = useState('');
  const [newSeriesCover, setNewSeriesCover] = useState('');
  const [newSeriesDesc, setNewSeriesDesc] = useState('');
  const [selectedPost, setSelectedPost] = useState('');
  const [selectedSeries, setSelectedSeries] = useState('');
  const [volumeNumber, setVolumeNumber] = useState('');
  const [draggedItem, setDraggedItem] = useState(null);

  const handleCreateSeries = () => {
    if (!newSeriesTitle) return;
    const newSeries = {
      id: `series-${Date.now()}`,
      title: newSeriesTitle,
      coverUrl: newSeriesCover || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800',
      description: newSeriesDesc,
      postCount: 0
    };
    onUpdateSeries([...series, newSeries]);
    setNewSeriesTitle('');
    setNewSeriesCover('');
    setNewSeriesDesc('');
  };

  const handleAssignPost = () => {
    if (!selectedPost || !selectedSeries || !volumeNumber) return;
    onAssignPost(selectedPost, selectedSeries, parseInt(volumeNumber));
    setSelectedPost('');
    setSelectedSeries('');
    setVolumeNumber('');
  };

  const getSeriesPosts = (seriesId) => {
    return posts
      .filter(p => p.seriesId === seriesId)
      .sort((a, b) => (a.seriesOrder || 0) - (b.seriesOrder || 0));
  };

  const handleDragStart = (e, post, seriesId) => {
    setDraggedItem({ post, seriesId });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetSeriesId, targetOrder) => {
    e.preventDefault();
    if (!draggedItem) return;
    
    const { post, seriesId: sourceSeriesId } = draggedItem;
    if (sourceSeriesId === targetSeriesId && post.seriesOrder === targetOrder) return;
    
    onAssignPost(post.id, targetSeriesId, targetOrder);
    setDraggedItem(null);
  };

  return (
    <div className="bg-surface-container-low rounded-xl p-6 space-y-6">
      <h3 className="text-[10px] font-medium uppercase tracking-widest label-text text-on-surface-variant mb-4">
        Series Orchestrator
      </h3>

      {/* Create New Series */}
      <div className="space-y-4 border-b border-outline-variant/20 pb-6">
        <h4 className="text-sm font-medium text-on-surface">Create New Series</h4>
        <input
          type="text"
          value={newSeriesTitle}
          onChange={(e) => setNewSeriesTitle(e.target.value)}
          placeholder="Series Title"
          className="w-full bg-surface-container-high border border-outline-variant/30 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary"
        />
        <input
          type="text"
          value={newSeriesCover}
          onChange={(e) => setNewSeriesCover(e.target.value)}
          placeholder="Cover Image URL (optional)"
          className="w-full bg-surface-container-high border border-outline-variant/30 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary"
        />
        <textarea
          value={newSeriesDesc}
          onChange={(e) => setNewSeriesDesc(e.target.value)}
          placeholder="Series Description"
          rows="2"
          className="w-full bg-surface-container-high border border-outline-variant/30 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary resize-none"
        />
        <button
          onClick={handleCreateSeries}
          className="w-full bg-primary text-on-primary py-2 rounded-lg text-xs font-medium uppercase tracking-widest hover:opacity-90 transition-opacity"
        >
          Create Series
        </button>
      </div>

      {/* Assign Post to Series */}
      <div className="space-y-4 border-b border-outline-variant/20 pb-6">
        <h4 className="text-sm font-medium text-on-surface">Assign Post to Series</h4>
        <select
          value={selectedPost}
          onChange={(e) => setSelectedPost(e.target.value)}
          className="w-full bg-surface-container-high border border-outline-variant/30 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary"
        >
          <option value="">Select a post...</option>
          {posts.map(post => (
            <option key={post.id} value={post.id}>{post.title}</option>
          ))}
        </select>
        <select
          value={selectedSeries}
          onChange={(e) => setSelectedSeries(e.target.value)}
          className="w-full bg-surface-container-high border border-outline-variant/30 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary"
        >
          <option value="">Select a series...</option>
          {series.map(s => (
            <option key={s.id} value={s.id}>{s.title}</option>
          ))}
        </select>
        <input
          type="number"
          value={volumeNumber}
          onChange={(e) => setVolumeNumber(e.target.value)}
          placeholder="Volume Number"
          min="1"
          className="w-full bg-surface-container-high border border-outline-variant/30 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary"
        />
        <button
          onClick={handleAssignPost}
          className="w-full bg-on-surface text-surface py-2 rounded-lg text-xs font-medium uppercase tracking-widest hover:opacity-90 transition-opacity"
        >
          Assign to Series
        </button>
      </div>

      {/* Series List with Reordering */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-on-surface">Manage Series Order</h4>
        {series.map(s => (
          <div key={s.id} className="bg-surface-container-high rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <img src={s.coverUrl} alt={s.title} className="w-12 h-12 rounded object-cover" />
              <div>
                <h5 className="font-medium text-on-surface">{s.title}</h5>
                <p className="text-xs text-on-surface-variant">{getSeriesPosts(s.id).length} volumes</p>
              </div>
            </div>
            <div className="space-y-2">
              {getSeriesPosts(s.id).map((post, index) => (
                <div
                  key={post.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, post, s.id)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, s.id, index + 1)}
                  className="flex items-center gap-3 p-2 bg-surface rounded cursor-move hover:bg-surface-variant transition-colors"
                >
                  <span className="material-symbols-outlined text-outline-variant text-sm">drag_indicator</span>
                  <span className="text-xs font-medium text-primary w-6">#{post.seriesOrder}</span>
                  <span className="text-sm text-on-surface truncate">{post.title}</span>
                </div>
              ))}
              {getSeriesPosts(s.id).length === 0 && (
                <p className="text-xs text-on-surface-variant italic p-2">No posts assigned yet. Drag posts here to add them.</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeriesOrchestrator;
