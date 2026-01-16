import firestore from '@react-native-firebase/firestore';
import { WordListItem } from '../types';

class FirestoreService {
  private getUsersCollection() {
    return firestore().collection('users');
  }

  private getUserDoc(userId: string) {
    return this.getUsersCollection().doc(userId);
  }

  private getUserDataCollection(userId: string) {
    return this.getUserDoc(userId).collection('userData');
  }

  // Favorites
  async getFavorites(userId: string): Promise<string[]> {
    try {
      const doc = await this.getUserDataCollection(userId).doc('favorites').get();
      if (doc.exists) {
        const data = doc.data();
        return data?.words || [];
      }
      return [];
    } catch (error) {
      console.error('Error getting favorites from Firestore:', error);
      return [];
    }
  }

  async saveFavorites(userId: string, favorites: string[]): Promise<void> {
    try {
      await this.getUserDataCollection(userId).doc('favorites').set({
        words: favorites,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
    } catch (error) {
      console.error('Error saving favorites to Firestore:', error);
      throw error;
    }
  }

  // History
  async getHistory(userId: string): Promise<WordListItem[]> {
    try {
      const doc = await this.getUserDataCollection(userId).doc('history').get();
      if (doc.exists) {
        const data = doc.data();
        return data?.items || [];
      }
      return [];
    } catch (error) {
      console.error('Error getting history from Firestore:', error);
      return [];
    }
  }

  async saveHistory(userId: string, history: WordListItem[]): Promise<void> {
    try {
      await this.getUserDataCollection(userId).doc('history').set({
        items: history,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
    } catch (error) {
      console.error('Error saving history to Firestore:', error);
      throw error;
    }
  }

  // Sync local data to Firestore (when user logs in)
  async syncLocalDataToFirestore(
    userId: string,
    favorites: string[],
    history: WordListItem[],
  ): Promise<void> {
    try {
      const batch = firestore().batch();
      
      const favoritesRef = this.getUserDataCollection(userId).doc('favorites');
      batch.set(favoritesRef, {
        words: favorites,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });

      const historyRef = this.getUserDataCollection(userId).doc('history');
      batch.set(historyRef, {
        items: history,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });

      await batch.commit();
    } catch (error) {
      console.error('Error syncing local data to Firestore:', error);
      throw error;
    }
  }

  // Merge Firestore data with local data (when user logs in)
  async mergeFirestoreWithLocal(
    userId: string,
    localFavorites: string[],
    localHistory: WordListItem[],
  ): Promise<{ favorites: string[]; history: WordListItem[] }> {
    try {
      const [firestoreFavorites, firestoreHistory] = await Promise.all([
        this.getFavorites(userId),
        this.getHistory(userId),
      ]);

      // Merge favorites (combine both, remove duplicates)
      const mergedFavorites = Array.from(
        new Set([...localFavorites, ...firestoreFavorites]),
      );

      // Merge history (combine both, sort by viewedAt, remove duplicates)
      const historyMap = new Map<string, WordListItem>();
      
      // Add local history
      localHistory.forEach((item) => {
        const existing = historyMap.get(item.word);
        if (!existing || (item.viewedAt || 0) > (existing.viewedAt || 0)) {
          historyMap.set(item.word, item);
        }
      });

      // Add Firestore history
      firestoreHistory.forEach((item) => {
        const existing = historyMap.get(item.word);
        if (!existing || (item.viewedAt || 0) > (existing.viewedAt || 0)) {
          historyMap.set(item.word, item);
        }
      });

      const mergedHistory = Array.from(historyMap.values()).sort(
        (a, b) => (b.viewedAt || 0) - (a.viewedAt || 0),
      );

      // Save merged data back to Firestore
      await this.syncLocalDataToFirestore(userId, mergedFavorites, mergedHistory);

      return {
        favorites: mergedFavorites,
        history: mergedHistory,
      };
    } catch (error) {
      console.error('Error merging Firestore with local data:', error);
      return {
        favorites: localFavorites,
        history: localHistory,
      };
    }
  }
}

export const firestoreService = new FirestoreService();

