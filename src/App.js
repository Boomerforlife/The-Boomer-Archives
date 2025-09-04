
import React, { useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  collection, 
  addDoc, 
  doc, 
  deleteDoc, 
  updateDoc, 
  onSnapshot, 
  increment
} from 'firebase/firestore';
import { auth, db } from './firebase';

// Utility function to format timestamps safely
const formatTimestamp = (timestamp, options = {}) => {
  try {
    let date;
    if (timestamp instanceof Date) {
      date = timestamp;
    } else if (timestamp && timestamp.toDate && typeof timestamp.toDate === 'function') {
      date = timestamp.toDate();
    } else {
      date = new Date(timestamp);
    }
    
    if (isNaN(date.getTime())) {
      date = new Date();
    }
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...options
    });
  } catch (error) {
    console.error('Error formatting timestamp:', error);
    return new Date().toLocaleDateString('en-US', options);
  }
};

// Use a simple state-based router for a single-file app
const PAGE_STATE = {
  LOGIN: 'LOGIN',
  REGISTER: 'REGISTER',
  LIST: 'LIST',
  CREATE: 'CREATE',
  EDIT: 'EDIT',
  VIEW: 'VIEW'
};

// Authentication Components
const LoginForm = ({ onLogin, onSwitchToRegister, error }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onLogin(email, password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-pink-800 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-white/20 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">BN</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-purple-200">Sign in to Blog Nation</p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-purple-200 font-semibold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label className="block text-purple-200 font-semibold mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
          >
            Sign In
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-purple-200">
            Don't have an account?{' '}
            <button
              onClick={onSwitchToRegister}
              className="text-pink-300 hover:text-pink-200 font-semibold"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

const RegisterForm = ({ onRegister, onSwitchToLogin, error }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    await onRegister(email, password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-pink-800 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-white/20 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">BN</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Join Blog Nation</h2>
          <p className="text-purple-200">Create your account</p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-purple-200 font-semibold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label className="block text-purple-200 font-semibold mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              placeholder="Enter your password"
              required
            />
          </div>
          <div>
            <label className="block text-purple-200 font-semibold mb-2">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              placeholder="Confirm your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
          >
            Sign Up
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-purple-200">
            Already have an account?{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-pink-300 hover:text-pink-200 font-semibold"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

const PostList = ({ posts, onEdit, onDelete, onView, currentUser, onLike, onDislike }) => {
  return (
    <div className="space-y-8">
      {posts.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full flex items-center justify-center">
            <span className="text-4xl">📝</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-700 mb-2">No posts yet</h3>
          <p className="text-gray-500 text-lg">Start your blogging journey by creating your first post!</p>
        </div>
      ) : (
        posts.map((post) => (
          <article key={post.id} className="group bg-white/70 backdrop-blur-sm p-8 rounded-3xl shadow-lg border border-white/20 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] hover:bg-white/90">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h2 
                  className="text-3xl font-bold mb-3 text-gray-800 cursor-pointer hover:text-blue-600 transition-colors duration-200 group-hover:text-blue-600" 
                  onClick={() => onView(post)}
                >
                  {post.title}
                </h2>
                <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed text-lg">
                  {post.content.length > 200 ? `${post.content.substring(0, 200)}...` : post.content}
                </p>
                {post.categories && post.categories.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.categories.map((category, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      {post.author.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">{post.author}</p>
                    <p className="text-xs text-gray-500">
                      {formatTimestamp(post.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex space-x-3">
                  <button
                    onClick={() => onView(post)}
                    className="px-4 py-2 text-sm font-semibold text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    👁️ Read
                  </button>
                  {currentUser && currentUser.uid === post.authorId && (
                    <>
                      <button
                        onClick={() => onEdit(post)}
                        className="px-4 py-2 text-sm font-semibold text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => onDelete(post.id)}
                        className="px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                      >
                        🗑️ Delete
                      </button>
                    </>
                  )}
                </div>
                
                {/* Like/Dislike Buttons */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onLike(post.id)}
                    className="flex items-center space-x-1 px-3 py-1 text-sm font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    <span>👍</span>
                    <span>{post.likes || 0}</span>
                  </button>
                  <button
                    onClick={() => onDislike(post.id)}
                    className="flex items-center space-x-1 px-3 py-1 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <span>👎</span>
                    <span>{post.dislikes || 0}</span>
                  </button>
                </div>
              </div>
            </div>
          </article>
        ))
      )}
    </div>
  );
};

const PostForm = ({ post, onSave, onCancel }) => {
  const [title, setTitle] = useState(post?.title || '');
  const [content, setContent] = useState(post?.content || '');
  const [author, setAuthor] = useState(post?.author || 'Anonymous');
  const [categories, setCategories] = useState(post?.categories || []);
  const [newCategory, setNewCategory] = useState('');

  const addCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory('');
    }
  };

  const removeCategory = (categoryToRemove) => {
    setCategories(categories.filter(cat => cat !== categoryToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title && content) {
      onSave({
        id: post?.id,
        title: title.trim(),
        content: content.trim(),
        author: author.trim() || 'Anonymous',
        categories: categories,
        timestamp: new Date()
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-sm p-10 rounded-3xl shadow-2xl border border-white/20">
      <div className="flex items-center space-x-3 mb-8">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center">
          <span className="text-white font-bold text-lg">
            {post ? '✏️' : '✍️'}
          </span>
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
          {post ? 'Edit Post' : 'Create New Post'}
        </h2>
      </div>
      
      <div className="mb-8">
        <label htmlFor="title" className="block text-gray-700 font-semibold mb-3 text-lg">Title</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all duration-200 text-lg"
          placeholder="Enter your post title..."
          required
        />
      </div>
      
      <div className="mb-8">
        <label htmlFor="content" className="block text-gray-700 font-semibold mb-3 text-lg">Content</label>
        <textarea
          id="content"
          rows="12"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all duration-200 text-lg resize-none"
          placeholder="Write your post content here..."
          required
        ></textarea>
      </div>
      
      <div className="mb-8">
        <label htmlFor="author" className="block text-gray-700 font-semibold mb-3 text-lg">Author</label>
        <input
          id="author"
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all duration-200 text-lg"
          placeholder="Your name..."
          required
        />
      </div>

      <div className="mb-10">
        <label className="block text-gray-700 font-semibold mb-3 text-lg">Categories/Tags</label>
        <div className="flex space-x-2 mb-3">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCategory())}
            className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Add a category..."
          />
          <button
            type="button"
            onClick={addCategory}
            className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((category, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
            >
              {category}
              <button
                type="button"
                onClick={() => removeCategory(category)}
                className="ml-2 text-purple-600 hover:text-purple-800"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>
      
      <div className="flex space-x-4">
        <button
          type="submit"
          className="flex-1 px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {post ? '🔄 Update Post' : '🚀 Publish Post'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-8 py-4 text-lg font-bold text-gray-700 bg-gray-100 rounded-2xl shadow-lg hover:bg-gray-200 hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          ❌ Cancel
        </button>
      </div>
    </form>
  );
};

const PostView = ({ post, onBack }) => {
  if (!post) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center">
          <span className="text-4xl">❌</span>
        </div>
        <h3 className="text-2xl font-bold text-gray-700 mb-2">Post not found</h3>
        <p className="text-gray-500 text-lg">The post you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <article className="bg-white/80 backdrop-blur-sm p-10 rounded-3xl shadow-2xl border border-white/20">
      <div className="mb-8">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 px-4 py-2 text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 mb-6"
        >
          <span>←</span>
          <span>Back to Posts</span>
        </button>
        
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent leading-tight">
          {post.title}
        </h1>
        
        <div className="flex items-center space-x-4 mb-8 p-4 bg-gray-50 rounded-2xl">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">
              {post.author.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-700">{post.author}</p>
            <p className="text-sm text-gray-500">
              {formatTimestamp(post.timestamp, {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>
      </div>
      
      <div className="prose prose-lg max-w-none">
        <div className="whitespace-pre-wrap text-gray-700 leading-relaxed text-xl bg-gray-50 p-8 rounded-2xl border-l-4 border-blue-500">
          {post.content}
        </div>
      </div>
    </article>
  );
};

const App = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(PAGE_STATE.LOGIN);
  const [selectedPost, setSelectedPost] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [postToDeleteId, setPostToDeleteId] = useState(null);
  const [initializationError] = useState(null);
  const [authError, setAuthError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Authentication handlers
  const handleLogin = async (email, password) => {
    try {
      setAuthError(null);
      await signInWithEmailAndPassword(auth, email, password);
      setPage(PAGE_STATE.LIST);
    } catch (error) {
      setAuthError(error.message);
    }
  };

  const handleRegister = async (email, password) => {
    try {
      setAuthError(null);
      await createUserWithEmailAndPassword(auth, email, password);
      setPage(PAGE_STATE.LIST);
    } catch (error) {
      setAuthError(error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setPage(PAGE_STATE.LOGIN);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("👤 Auth state changed:", currentUser);
      setUser(currentUser);
      setLoading(false);
      if (currentUser) {
        console.log(`✅ User authenticated: ${currentUser.uid}`);
        setPage(PAGE_STATE.LIST);
      } else {
        console.log("❌ No user authenticated");
        setPage(PAGE_STATE.LOGIN);
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch posts from Firestore in real-time
  useEffect(() => {
    if (!user || !db) {
      console.log("⏳ Waiting for user and database...", { user: !!user, db: !!db });
      return;
    }
    
    console.log("📖 Setting up Firestore listener for posts...");
    const postsCollectionRef = collection(db, 'posts');
    const unsubscribe = onSnapshot(postsCollectionRef, (snapshot) => {
      console.log("📄 Posts snapshot received:", snapshot.docs.length, "posts");
      const postsData = snapshot.docs.map(doc => {
        const data = doc.data();
        let timestamp;
        
        // Handle different timestamp formats
        if (data.timestamp) {
          if (data.timestamp.toDate && typeof data.timestamp.toDate === 'function') {
            // Firestore Timestamp object
            timestamp = data.timestamp.toDate();
          } else if (data.timestamp instanceof Date) {
            // Already a Date object
            timestamp = data.timestamp;
          } else if (typeof data.timestamp === 'string' || typeof data.timestamp === 'number') {
            // String or number timestamp
            timestamp = new Date(data.timestamp);
          } else {
            // Fallback
            timestamp = new Date();
          }
        } else {
          // No timestamp, use current time
          timestamp = new Date();
        }
        
        // Ensure timestamp is valid
        if (isNaN(timestamp.getTime())) {
          timestamp = new Date();
        }
        
        return {
          id: doc.id,
          title: data.title || '',
          content: data.content || '',
          author: data.author || 'Anonymous',
          authorId: data.authorId || '',
          categories: data.categories || [],
          likes: data.likes || 0,
          dislikes: data.dislikes || 0,
          timestamp: timestamp
        };
      });
      console.log("📝 Processed posts:", postsData);
      setPosts(postsData.sort((a, b) => b.timestamp - a.timestamp));
    }, (error) => {
      console.error("❌ Error fetching posts:", error);
    });
    return () => unsubscribe();
  }, [user]);

  // Handle CRUD operations
  const handleSavePost = async (postData) => {
    try {
      console.log("💾 Saving post:", postData);
      if (postData.id) {
        console.log("🔄 Updating existing post...");
        const postDocRef = doc(db, 'posts', postData.id);
        await updateDoc(postDocRef, {
          title: postData.title,
          content: postData.content,
          author: postData.author
        });
        console.log("✅ Post updated successfully!");
      } else {
        console.log("➕ Creating new post...");
        const postsCollectionRef = collection(db, 'posts');
        // Don't include the id field when creating new posts
        const docRef = await addDoc(postsCollectionRef, {
          title: postData.title,
          content: postData.content,
          author: postData.author,
          authorId: user.uid,
          categories: postData.categories || [],
          likes: 0,
          dislikes: 0,
          timestamp: postData.timestamp,
        });
        console.log("✅ Post added successfully! ID:", docRef.id);
      }
      setPage(PAGE_STATE.LIST);
      setSelectedPost(null);
    } catch (error) {
      console.error("❌ Error saving post:", error);
      alert(`Failed to save post: ${error.message}`);
    }
  };

  const handleDeletePost = (id) => {
    setPostToDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const postDocRef = doc(db, 'posts', postToDeleteId);
      await deleteDoc(postDocRef);
      console.log("Post deleted successfully!");
    } catch (error) {
      console.error("Error deleting post:", error);
    } finally {
      setShowDeleteModal(false);
      setPostToDeleteId(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setPostToDeleteId(null);
  };

  const handleEditPost = (post) => {
    setSelectedPost(post);
    setPage(PAGE_STATE.EDIT);
  };

  const handleViewPost = (post) => {
    setSelectedPost(post);
    setPage(PAGE_STATE.VIEW);
  };

  const handleLike = async (postId) => {
    try {
      const postDocRef = doc(db, 'posts', postId);
      await updateDoc(postDocRef, {
        likes: increment(1)
      });
      console.log("✅ Post liked!");
    } catch (error) {
      console.error("❌ Error liking post:", error);
    }
  };

  const handleDislike = async (postId) => {
    try {
      const postDocRef = doc(db, 'posts', postId);
      await updateDoc(postDocRef, {
        dislikes: increment(1)
      });
      console.log("✅ Post disliked!");
    } catch (error) {
      console.error("❌ Error disliking post:", error);
    }
  };

  // Filter posts based on search and category
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || post.categories.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  // Get unique categories for filter
  const allCategories = [...new Set(posts.flatMap(post => post.categories))];

  const renderContent = () => {
    if (initializationError) {
      return (
        <div className="text-center p-10 bg-red-50 border-2 border-red-200 text-red-700 rounded-3xl shadow-lg">
          <div className="w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">⚠️</span>
          </div>
          <h3 className="font-bold text-2xl mb-3">Connection Error</h3>
          <p className="text-lg mb-4">{initializationError}</p>
          <p className="text-sm text-red-600">Please check your Firebase configuration and try again.</p>
        </div>
      );
    }

    switch (page) {
      case PAGE_STATE.LOGIN:
        return <LoginForm onLogin={handleLogin} onSwitchToRegister={() => setPage(PAGE_STATE.REGISTER)} error={authError} />;
      case PAGE_STATE.REGISTER:
        return <RegisterForm onRegister={handleRegister} onSwitchToLogin={() => setPage(PAGE_STATE.LOGIN)} error={authError} />;
      case PAGE_STATE.CREATE:
        return <PostForm onSave={handleSavePost} onCancel={() => setPage(PAGE_STATE.LIST)} />;
      case PAGE_STATE.EDIT:
        return <PostForm post={selectedPost} onSave={handleSavePost} onCancel={() => setPage(PAGE_STATE.LIST)} />;
      case PAGE_STATE.VIEW:
        return <PostView post={selectedPost} onBack={() => setPage(PAGE_STATE.LIST)} />;
      case PAGE_STATE.LIST:
      default:
        return <PostList posts={filteredPosts} onEdit={handleEditPost} onDelete={handleDeletePost} onView={handleViewPost} currentUser={user} onLike={handleLike} onDislike={handleDislike} />;
    }
  };

  // Don't render main app if user is not authenticated
  if (page === PAGE_STATE.LOGIN || page === PAGE_STATE.REGISTER) {
    return renderContent();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-pink-800 flex flex-col items-center py-8 px-4 sm:px-8 font-sans antialiased relative">
      <div className="w-full max-w-6xl mx-auto">
        <header className="flex flex-col lg:flex-row items-center justify-between mb-8 p-6 bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20">
          <div className="flex items-center space-x-4 mb-4 lg:mb-0">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">BN</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent tracking-tight">
              Blog Nation
            </h1>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full lg:w-auto">
            {/* Search Bar */}
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pl-10 bg-white/20 border border-white/30 rounded-xl text-white placeholder-purple-200 focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              />
              <span className="absolute left-3 top-2.5 text-purple-200">🔍</span>
            </div>
            
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 bg-white/20 border border-white/30 rounded-xl text-white focus:ring-2 focus:ring-purple-400 focus:border-transparent"
            >
              <option value="">All Categories</option>
              {allCategories.map(category => (
                <option key={category} value={category} className="bg-purple-800">
                  {category}
                </option>
              ))}
            </select>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => {
                  setPage(PAGE_STATE.CREATE);
                  setSelectedPost(null);
                }}
                className="px-6 py-2 text-sm font-bold text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
              >
                ✍️ New Post
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-bold text-purple-200 bg-white/10 rounded-xl hover:bg-white/20 transition-all duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className="w-full">
          {loading ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full flex items-center justify-center animate-pulse">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">Loading Blog Nation</h3>
              <p className="text-gray-500 text-lg">Setting up your blogging experience...</p>
            </div>
          ) : (
            renderContent()
          )}
        </main>

        <footer className="text-center mt-20 py-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">BN</span>
            </div>
            <span className="text-lg font-semibold text-gray-600">Blog Nation</span>
          </div>
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Blog Nation. Built By Boomer.
          </p>
        </footer>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/95 backdrop-blur-sm p-10 rounded-3xl shadow-2xl w-full max-w-md text-center transform transition-all scale-100 border border-white/20">
            <div className="w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">🗑️</span>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-800">Delete Post?</h3>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Are you sure you want to delete this post? This action cannot be undone and the post will be permanently removed.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={confirmDelete}
                className="px-8 py-3 bg-red-600 text-white font-semibold rounded-2xl hover:bg-red-700 hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                🗑️ Delete
              </button>
              <button
                onClick={cancelDelete}
                className="px-8 py-3 bg-gray-100 text-gray-800 font-semibold rounded-2xl hover:bg-gray-200 hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                ❌ Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
