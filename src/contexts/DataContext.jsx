import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { useAuth } from './AuthContext';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const { isAdmin } = useAuth();
  const [posts, setPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]); // For admin
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeAllPosts = () => {};

    // 1. Subscribe to published posts
    const qPosts = query(
      collection(db, 'posts'),
      where('status', '==', 'published')
    );

    const unsubscribePosts = onSnapshot(qPosts, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      // Sort by seriesOrder if they belong to a series, otherwise by createdAt descending
      postsData.sort((a, b) => {
        if (a.seriesId && b.seriesId && a.seriesId === b.seriesId) {
          return (a.seriesOrder || 0) - (b.seriesOrder || 0);
        }
        const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
        const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
        return timeB - timeA;
      });
      console.log("Vault Data Received:", postsData);
      setPosts(postsData);
    }, (error) => {
      console.error("Error fetching published posts:", error);
    });

    // 2. Subscribe to all posts (for Admin / Press Room)
    if (isAdmin) {
      const qAllPosts = query(
        collection(db, 'posts'),
        orderBy('createdAt', 'desc')
      );
      unsubscribeAllPosts = onSnapshot(qAllPosts, (snapshot) => {
        setAllPosts(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
      }, (error) => {
        console.error("Error fetching all posts:", error);
      });
    } else {
      setAllPosts([]);
    }

    // 3. Subscribe to series
    const qSeries = query(
      collection(db, 'series'),
      orderBy('createdAt', 'asc')
    );

    const unsubscribeSeries = onSnapshot(qSeries, (snapshot) => {
      setSeries(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
      setLoading(false); // Consider loading finished once series initial fetch is complete
    }, (error) => {
      console.error("Error fetching series:", error);
      setLoading(false); // Stop loading even on error
    });

    return () => {
      unsubscribePosts();
      unsubscribeAllPosts();
      unsubscribeSeries();
    };
  }, [isAdmin]);

  const value = {
    posts,
    allPosts,
    series,
    loading
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
