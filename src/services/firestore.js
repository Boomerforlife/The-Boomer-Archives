import { db } from '../firebase/config';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc,
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  increment,
  serverTimestamp
} from 'firebase/firestore';

const POSTS_COLLECTION = 'posts';
const SERIES_COLLECTION = 'series';
const COMMENTS_COLLECTION = 'comments';
const SUBSCRIBERS_COLLECTION = 'subscribers';

export const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
};

const getUniqueSlug = async (collectionName, baseSlug) => {
  let slug = baseSlug;
  let docRef = doc(db, collectionName, slug);
  let docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    const randomStr = Math.random().toString(36).substring(2, 5);
    slug = `${baseSlug}-${randomStr}`;
  }
  return slug;
};

// --- Posts ---
export const getPublicPosts = async () => {
  const q = query(
    collection(db, POSTS_COLLECTION),
    where('status', '==', 'published'),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
};

export const getAllPosts = async () => {
  const q = query(
    collection(db, POSTS_COLLECTION),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
};

export const getPostById = async (id) => {
  const docRef = doc(db, POSTS_COLLECTION, id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { ...docSnap.data(), id: docSnap.id };
  }
  return null;
};

export const createPost = async (postData) => {
  const { id, ...dataToSave } = postData; // Strip id if it exists

  // Input validation
  if (!dataToSave.title || typeof dataToSave.title !== 'string' || dataToSave.title.trim().length === 0) {
    throw new Error('Post title is required and must be a non-empty string.');
  }
  if (dataToSave.content && typeof dataToSave.content !== 'string') {
    throw new Error('Post content must be a string.');
  }
  if (dataToSave.status && !['draft', 'published'].includes(dataToSave.status)) {
    throw new Error('Post status must be "draft" or "published".');
  }

  const baseSlug = generateSlug(dataToSave.title || 'untitled');
  const slug = await getUniqueSlug(POSTS_COLLECTION, baseSlug);
  
  const docRef = doc(db, POSTS_COLLECTION, slug);
  await setDoc(docRef, {
    ...dataToSave,
    visibility: dataToSave.visibility || 'public',
    createdAt: serverTimestamp(),
    publishedAt: dataToSave.status === 'published' ? serverTimestamp() : null,
    updatedAt: serverTimestamp(),
    hearts: 0
  });
  return docRef;
};

export const updatePost = async (id, postData) => {
  const { id: docId, ...dataToSave } = postData; // Strip id if it exists
  const docRef = doc(db, POSTS_COLLECTION, id);
  const updatePayload = {
    ...dataToSave,
    updatedAt: serverTimestamp()
  };
  if (dataToSave.status === 'published' && !dataToSave.publishedAt) {
    updatePayload.publishedAt = serverTimestamp();
  }
  await updateDoc(docRef, updatePayload);
};

export const deletePost = async (id) => {
  const docRef = doc(db, POSTS_COLLECTION, id);
  await deleteDoc(docRef);
};

export const assignPostToSeries = async (postId, seriesId, seriesOrder) => {
  const docRef = doc(db, POSTS_COLLECTION, postId);
  await updateDoc(docRef, { seriesId, seriesOrder });
};

export const incrementHearts = async (id) => {
  const docRef = doc(db, POSTS_COLLECTION, id);
  await updateDoc(docRef, {
    hearts: increment(1)
  });
};

// --- Series ---
export const getAllSeries = async () => {
  const q = query(
    collection(db, SERIES_COLLECTION),
    orderBy('createdAt', 'asc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
};

export const createSeries = async (seriesData) => {
  const { id, ...dataToSave } = seriesData;
  const baseSlug = generateSlug(dataToSave.title || 'untitled-series');
  const slug = await getUniqueSlug(SERIES_COLLECTION, baseSlug);
  
  const docRef = doc(db, SERIES_COLLECTION, slug);
  await setDoc(docRef, {
    ...dataToSave,
    createdAt: serverTimestamp(),
    postCount: 0
  });
  return docRef;
};

// --- Comments ---
export const getCommentsForPost = async (postId) => {
  const q = query(
    collection(db, COMMENTS_COLLECTION),
    where('postId', '==', postId),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
};

export const addComment = async (postId, commentData) => {
  const { id, ...dataToSave } = commentData;
  const docRef = doc(collection(db, COMMENTS_COLLECTION));
  await setDoc(docRef, {
    ...dataToSave,
    postId,
    createdAt: serverTimestamp()
  });
  return docRef;
};

// --- Subscribers ---
export const addSubscriber = async (email, name) => {
  const docRef = doc(db, SUBSCRIBERS_COLLECTION, email);
  await setDoc(docRef, {
    email,
    name: name || '',
    status: 'pending',
    date: serverTimestamp()
  });
  return docRef;
};

export const getSubscriberByEmail = async (email) => {
  const docRef = doc(db, SUBSCRIBERS_COLLECTION, email);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { ...docSnap.data(), id: docSnap.id };
  }
  return null;
};

export const getAllSubscribers = async () => {
  const q = query(
    collection(db, SUBSCRIBERS_COLLECTION),
    orderBy('date', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
};

export const updateSubscriberStatus = async (email, newStatus) => {
  const docRef = doc(db, SUBSCRIBERS_COLLECTION, email);
  await updateDoc(docRef, {
    status: newStatus,
    updatedAt: serverTimestamp()
  });
};
