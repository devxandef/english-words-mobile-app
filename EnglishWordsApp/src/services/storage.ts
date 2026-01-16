import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants';
import { WordListItem } from '../types';
import { firestoreService } from './firestore';

class StorageService {
  private userId: string | null = null;

  setUserId(userId: string | null) {
    this.userId = userId;
  }

  // Favorites
  async getFavorites(): Promise<string[]> {
    try {
      // Get from local storage first (for offline support)
      const localData = await AsyncStorage.getItem(STORAGE_KEYS.FAVORITES);
      const localFavorites = localData ? JSON.parse(localData) : [];

      // If user is logged in, get from Firestore and merge
      if (this.userId) {
        try {
          const firestoreFavorites = await firestoreService.getFavorites(
            this.userId,
          );
          // Merge and remove duplicates
          const merged = Array.from(new Set([...localFavorites, ...firestoreFavorites]));
          // Save merged data back to local storage
          await AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(merged));
          // Save to Firestore if there are differences
          if (merged.length !== firestoreFavorites.length) {
            await firestoreService.saveFavorites(this.userId, merged);
          }
          return merged;
        } catch (error) {
          console.error('Error syncing favorites from Firestore:', error);
          return localFavorites;
        }
      }

      return localFavorites;
    } catch (error) {
      console.error('Error getting favorites:', error);
      return [];
    }
  }

  async addFavorite(word: string): Promise<void> {
    try {
      const favorites = await this.getFavorites();
      if (!favorites.includes(word)) {
        favorites.push(word);
        // Save locally
        await AsyncStorage.setItem(
          STORAGE_KEYS.FAVORITES,
          JSON.stringify(favorites),
        );
        // Save to Firestore if user is logged in
        if (this.userId) {
          try {
            await firestoreService.saveFavorites(this.userId, favorites);
          } catch (error) {
            console.error('Error saving favorite to Firestore:', error);
          }
        }
      }
    } catch (error) {
      console.error('Error adding favorite:', error);
    }
  }

  async removeFavorite(word: string): Promise<void> {
    try {
      const favorites = await this.getFavorites();
      const filtered = favorites.filter((w) => w !== word);
      // Save locally
      await AsyncStorage.setItem(
        STORAGE_KEYS.FAVORITES,
        JSON.stringify(filtered),
      );
      // Save to Firestore if user is logged in
      if (this.userId) {
        try {
          await firestoreService.saveFavorites(this.userId, filtered);
        } catch (error) {
          console.error('Error removing favorite from Firestore:', error);
        }
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  }

  async isFavorite(word: string): Promise<boolean> {
    const favorites = await this.getFavorites();
    return favorites.includes(word);
  }

  // History
  async getHistory(): Promise<WordListItem[]> {
    try {
      // Get from local storage first (for offline support)
      const localData = await AsyncStorage.getItem(STORAGE_KEYS.HISTORY);
      const localHistory = localData ? JSON.parse(localData) : [];

      // If user is logged in, get from Firestore and merge
      if (this.userId) {
        try {
          const firestoreHistory = await firestoreService.getHistory(this.userId);
          // Merge history (combine both, sort by viewedAt, remove duplicates)
          const historyMap = new Map<string, WordListItem>();
          
          localHistory.forEach((item: WordListItem) => {
            const existing = historyMap.get(item.word);
            if (!existing || (item.viewedAt || 0) > (existing.viewedAt || 0)) {
              historyMap.set(item.word, item);
            }
          });

          firestoreHistory.forEach((item: WordListItem) => {
            const existing = historyMap.get(item.word);
            if (!existing || (item.viewedAt || 0) > (existing.viewedAt || 0)) {
              historyMap.set(item.word, item);
            }
          });

          const merged = Array.from(historyMap.values()).sort(
            (a, b) => (b.viewedAt || 0) - (a.viewedAt || 0),
          ).slice(0, 100); // Keep only last 100 items

          // Save merged data back to local storage
          await AsyncStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(merged));
          // Save to Firestore if there are differences
          if (merged.length !== firestoreHistory.length) {
            await firestoreService.saveHistory(this.userId, merged);
          }
          return merged;
        } catch (error) {
          console.error('Error syncing history from Firestore:', error);
          return localHistory;
        }
      }

      return localHistory;
    } catch (error) {
      console.error('Error getting history:', error);
      return [];
    }
  }

  async addToHistory(word: string): Promise<void> {
    try {
      const history = await this.getHistory();
      const existingIndex = history.findIndex((item) => item.word === word);

      let updatedHistory: WordListItem[];
      if (existingIndex >= 0) {
        history[existingIndex].viewedAt = Date.now();
        updatedHistory = history;
      } else {
        updatedHistory = [{ word, viewedAt: Date.now() }, ...history];
      }

      // Keep only last 100 items
      const limitedHistory = updatedHistory.slice(0, 100);
      
      // Save locally
      await AsyncStorage.setItem(
        STORAGE_KEYS.HISTORY,
        JSON.stringify(limitedHistory),
      );
      
      // Save to Firestore if user is logged in
      if (this.userId) {
        try {
          await firestoreService.saveHistory(this.userId, limitedHistory);
        } catch (error) {
          console.error('Error saving history to Firestore:', error);
        }
      }
    } catch (error) {
      console.error('Error adding to history:', error);
    }
  }

  // Sync local data to Firestore (called when user logs in)
  async syncToFirestore(): Promise<void> {
    if (!this.userId) return;

    try {
      // Get data directly from AsyncStorage to avoid sync loop
      const [localFavorites, localHistory] = await Promise.all([
        (async () => {
          const data = await AsyncStorage.getItem(STORAGE_KEYS.FAVORITES);
          return data ? JSON.parse(data) : [];
        })(),
        (async () => {
          const data = await AsyncStorage.getItem(STORAGE_KEYS.HISTORY);
          return data ? JSON.parse(data) : [];
        })(),
      ]);

      await firestoreService.syncLocalDataToFirestore(
        this.userId,
        localFavorites,
        localHistory,
      );
    } catch (error) {
      console.error('Error syncing to Firestore:', error);
    }
  }

  // Load and merge data from Firestore (called when user logs in)
  async loadFromFirestore(): Promise<{ favorites: string[]; history: WordListItem[] }> {
    if (!this.userId) {
      return {
        favorites: await this.getFavorites(),
        history: await this.getHistory(),
      };
    }

    try {
      const [localFavorites, localHistory] = await Promise.all([
        (async () => {
          const data = await AsyncStorage.getItem(STORAGE_KEYS.FAVORITES);
          return data ? JSON.parse(data) : [];
        })(),
        (async () => {
          const data = await AsyncStorage.getItem(STORAGE_KEYS.HISTORY);
          return data ? JSON.parse(data) : [];
        })(),
      ]);

      const merged = await firestoreService.mergeFirestoreWithLocal(
        this.userId,
        localFavorites,
        localHistory,
      );

      // Save merged data to local storage
      await AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(merged.favorites));
      await AsyncStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(merged.history));

      return merged;
    } catch (error) {
      console.error('Error loading from Firestore:', error);
      return {
        favorites: await this.getFavorites(),
        history: await this.getHistory(),
      };
    }
  }

  async getWordsListLoaded(): Promise<boolean> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.WORDS_LIST);
      return data === 'loaded';
    } catch (error) {
      console.error('Error checking words list status:', error);
      return false;
    }
  }

  async setWordsListLoaded(): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.WORDS_LIST, 'loaded');
    } catch (error) {
      console.error('Error setting words list status:', error);
    }
  }
}

export const storageService = new StorageService();

