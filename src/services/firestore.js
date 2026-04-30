import { db } from '../firebase/config';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
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
  return await addDoc(collection(db, POSTS_COLLECTION), {
    ...dataToSave,
    createdAt: serverTimestamp(),
    publishedAt: dataToSave.status === 'published' ? serverTimestamp() : null,
    updatedAt: serverTimestamp(),
    hearts: 0
  });
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
  return await addDoc(collection(db, SERIES_COLLECTION), {
    ...dataToSave,
    createdAt: serverTimestamp(),
    postCount: 0
  });
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
  return await addDoc(collection(db, COMMENTS_COLLECTION), {
    ...dataToSave,
    postId,
    createdAt: serverTimestamp()
  });
};
