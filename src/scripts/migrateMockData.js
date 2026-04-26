import { db, storage } from '../firebase/config';
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { mockPosts, mockSeries } from '../data/mockData';

export const migrateData = async () => {
  try {
    console.log('Starting migration...');

    // Migrate Series
    for (const series of mockSeries) {
      const seriesRef = doc(db, 'series', series.id);
      await setDoc(seriesRef, {
        ...series,
        createdAt: new Date()
      });
      console.log(`Migrated series: ${series.title}`);
    }

    // Migrate Posts
    for (const post of mockPosts) {
      // Use setDoc if we want to keep the same IDs, or addDoc for new IDs
      const postRef = doc(db, 'posts', post.id);
      await setDoc(postRef, {
        ...post,
        status: 'published',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log(`Migrated post: ${post.title}`);
    }

    console.log('Migration complete!');
  } catch (error) {
    console.error('Migration failed:', error);
  }
};
