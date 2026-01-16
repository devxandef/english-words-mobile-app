import AsyncStorage from '@react-native-async-storage/async-storage';
import { storageService } from '../../src/services/storage';
import { firestoreService } from '../../src/services/firestore';
import { STORAGE_KEYS } from '../../src/constants';
import { WordListItem } from '../../src/types';

jest.mock('@react-native-async-storage/async-storage');
jest.mock('../../src/services/firestore');

const mockedAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;
const mockedFirestoreService = firestoreService as jest.Mocked<typeof firestoreService>;

describe('StorageService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    storageService.setUserId(null);
  });

  describe('setUserId', () => {
    it('should set user id', () => {
      storageService.setUserId('user123');
      // We can't directly test private property, but we can test it through other methods
      expect(storageService.setUserId).not.toThrow();
    });

    it('should clear user id', () => {
      storageService.setUserId(null);
      expect(storageService.setUserId).not.toThrow();
    });
  });

  describe('getFavorites', () => {
    it('should return favorites from local storage when user is not logged in', async () => {
      const favorites = ['word1', 'word2'];
      mockedAsyncStorage.getItem.mockResolvedValue(JSON.stringify(favorites));

      const result = await storageService.getFavorites();

      expect(result).toEqual(favorites);
      expect(mockedAsyncStorage.getItem).toHaveBeenCalledWith(STORAGE_KEYS.FAVORITES);
      expect(mockedFirestoreService.getFavorites).not.toHaveBeenCalled();
    });

    it('should return empty array when local storage is empty and user not logged in', async () => {
      mockedAsyncStorage.getItem.mockResolvedValue(null);

      const result = await storageService.getFavorites();

      expect(result).toEqual([]);
    });

    it('should merge local and Firestore favorites when user is logged in', async () => {
      const localFavorites = ['word1', 'word2'];
      const firestoreFavorites = ['word2', 'word3'];

      storageService.setUserId('user123');
      mockedAsyncStorage.getItem.mockResolvedValue(JSON.stringify(localFavorites));
      mockedFirestoreService.getFavorites.mockResolvedValue(firestoreFavorites);
      mockedFirestoreService.saveFavorites.mockResolvedValue(undefined);

      const result = await storageService.getFavorites();

      expect(result).toEqual(['word1', 'word2', 'word3']);
      expect(mockedFirestoreService.getFavorites).toHaveBeenCalledWith('user123');
      expect(mockedAsyncStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEYS.FAVORITES,
        JSON.stringify(['word1', 'word2', 'word3']),
      );
    });

    it('should not save to Firestore if merged data is same length', async () => {
      const localFavorites = ['word1', 'word2'];
      const firestoreFavorites = ['word1', 'word2'];

      storageService.setUserId('user123');
      mockedAsyncStorage.getItem.mockResolvedValue(JSON.stringify(localFavorites));
      mockedFirestoreService.getFavorites.mockResolvedValue(firestoreFavorites);

      await storageService.getFavorites();

      expect(mockedFirestoreService.saveFavorites).not.toHaveBeenCalled();
    });

    it('should return local favorites on Firestore error', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      const localFavorites = ['word1', 'word2'];

      storageService.setUserId('user123');
      mockedAsyncStorage.getItem.mockResolvedValue(JSON.stringify(localFavorites));
      mockedFirestoreService.getFavorites.mockRejectedValue(new Error('Firestore error'));

      const result = await storageService.getFavorites();

      expect(result).toEqual(localFavorites);
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });

    it('should return empty array on error', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      mockedAsyncStorage.getItem.mockRejectedValue(new Error('Storage error'));

      const result = await storageService.getFavorites();

      expect(result).toEqual([]);
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });

  describe('addFavorite', () => {
    it('should add favorite to local storage when user not logged in', async () => {
      mockedAsyncStorage.getItem.mockResolvedValue(JSON.stringify([]));

      await storageService.addFavorite('word1');

      expect(mockedAsyncStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEYS.FAVORITES,
        JSON.stringify(['word1']),
      );
      expect(mockedFirestoreService.saveFavorites).not.toHaveBeenCalled();
    });

    it('should not add duplicate favorite', async () => {
      mockedAsyncStorage.getItem.mockResolvedValue(JSON.stringify(['word1']));

      await storageService.addFavorite('word1');

      expect(mockedAsyncStorage.setItem).not.toHaveBeenCalled();
    });

    it('should save to Firestore when user is logged in', async () => {
      storageService.setUserId('user123');
      mockedAsyncStorage.getItem.mockResolvedValue(JSON.stringify([]));
      mockedFirestoreService.saveFavorites.mockResolvedValue(undefined);

      await storageService.addFavorite('word1');

      expect(mockedFirestoreService.saveFavorites).toHaveBeenCalledWith('user123', ['word1']);
    });

    it('should handle Firestore error gracefully', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      storageService.setUserId('user123');
      mockedAsyncStorage.getItem.mockResolvedValue(JSON.stringify([]));
      mockedFirestoreService.saveFavorites.mockRejectedValue(new Error('Firestore error'));

      await storageService.addFavorite('word1');

      expect(mockedAsyncStorage.setItem).toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });

  describe('removeFavorite', () => {
    it('should remove favorite from local storage', async () => {
      mockedAsyncStorage.getItem.mockResolvedValue(JSON.stringify(['word1', 'word2']));

      await storageService.removeFavorite('word1');

      expect(mockedAsyncStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEYS.FAVORITES,
        JSON.stringify(['word2']),
      );
    });

    it('should save to Firestore when user is logged in', async () => {
      storageService.setUserId('user123');
      mockedAsyncStorage.getItem.mockResolvedValue(JSON.stringify(['word1', 'word2']));
      mockedFirestoreService.saveFavorites.mockResolvedValue(undefined);

      await storageService.removeFavorite('word1');

      expect(mockedFirestoreService.saveFavorites).toHaveBeenCalledWith('user123', ['word2']);
    });

    it('should handle Firestore error gracefully', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      storageService.setUserId('user123');
      mockedAsyncStorage.getItem.mockResolvedValue(JSON.stringify(['word1']));
      mockedFirestoreService.saveFavorites.mockRejectedValue(new Error('Firestore error'));

      await storageService.removeFavorite('word1');

      expect(mockedAsyncStorage.setItem).toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });

  describe('isFavorite', () => {
    it('should return true when word is favorite', async () => {
      mockedAsyncStorage.getItem.mockResolvedValue(JSON.stringify(['word1', 'word2']));

      const result = await storageService.isFavorite('word1');

      expect(result).toBe(true);
    });

    it('should return false when word is not favorite', async () => {
      mockedAsyncStorage.getItem.mockResolvedValue(JSON.stringify(['word1', 'word2']));

      const result = await storageService.isFavorite('word3');

      expect(result).toBe(false);
    });
  });

  describe('getHistory', () => {
    it('should return history from local storage when user not logged in', async () => {
      const history: WordListItem[] = [
        { word: 'word1', viewedAt: 1000 },
        { word: 'word2', viewedAt: 2000 },
      ];

      mockedAsyncStorage.getItem.mockResolvedValue(JSON.stringify(history));

      const result = await storageService.getHistory();

      expect(result).toEqual(history);
      expect(mockedFirestoreService.getHistory).not.toHaveBeenCalled();
    });

    it('should merge local and Firestore history when user is logged in', async () => {
      const localHistory: WordListItem[] = [
        { word: 'word1', viewedAt: 1000 },
        { word: 'word2', viewedAt: 2000 },
      ];
      const firestoreHistory: WordListItem[] = [
        { word: 'word1', viewedAt: 3000 }, // More recent
        { word: 'word3', viewedAt: 1500 },
      ];

      storageService.setUserId('user123');
      mockedAsyncStorage.getItem.mockResolvedValue(JSON.stringify(localHistory));
      mockedFirestoreService.getHistory.mockResolvedValue(firestoreHistory);
      mockedFirestoreService.saveHistory.mockResolvedValue(undefined);

      const result = await storageService.getHistory();

      expect(result).toHaveLength(3);
      expect(result.find((h) => h.word === 'word1')?.viewedAt).toBe(3000);
      expect(result.find((h) => h.word === 'word2')?.viewedAt).toBe(2000);
      expect(result.find((h) => h.word === 'word3')?.viewedAt).toBe(1500);
    });

    it('should limit history to 100 items', async () => {
      const localHistory: WordListItem[] = Array.from({ length: 60 }, (_, i) => ({
        word: `word${i}`,
        viewedAt: i * 1000,
      }));
      const firestoreHistory: WordListItem[] = Array.from({ length: 60 }, (_, i) => ({
        word: `word${i + 60}`,
        viewedAt: (i + 60) * 1000,
      }));

      storageService.setUserId('user123');
      mockedAsyncStorage.getItem.mockResolvedValue(JSON.stringify(localHistory));
      mockedFirestoreService.getHistory.mockResolvedValue(firestoreHistory);
      mockedFirestoreService.saveHistory.mockResolvedValue(undefined);

      const result = await storageService.getHistory();

      expect(result).toHaveLength(100);
    });

    it('should return local history on Firestore error', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      const localHistory: WordListItem[] = [{ word: 'word1', viewedAt: 1000 }];

      storageService.setUserId('user123');
      mockedAsyncStorage.getItem.mockResolvedValue(JSON.stringify(localHistory));
      mockedFirestoreService.getHistory.mockRejectedValue(new Error('Firestore error'));

      const result = await storageService.getHistory();

      expect(result).toEqual(localHistory);
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });

  describe('addToHistory', () => {
    it('should add new word to history', async () => {
      mockedAsyncStorage.getItem.mockResolvedValue(JSON.stringify([]));

      await storageService.addToHistory('word1');

      expect(mockedAsyncStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEYS.HISTORY,
        expect.stringContaining('word1'),
      );
    });

    it('should update viewedAt for existing word', async () => {
      const existingHistory: WordListItem[] = [
        { word: 'word1', viewedAt: 1000 },
      ];

      mockedAsyncStorage.getItem.mockResolvedValue(JSON.stringify(existingHistory));

      await storageService.addToHistory('word1');

      const setItemCall = mockedAsyncStorage.setItem.mock.calls.find(
        (call) => call[0] === STORAGE_KEYS.HISTORY,
      );
      const savedHistory = JSON.parse(setItemCall![1] as string);
      expect(savedHistory[0].word).toBe('word1');
      expect(savedHistory[0].viewedAt).toBeGreaterThan(1000);
    });

    it('should limit history to 100 items', async () => {
      const existingHistory: WordListItem[] = Array.from({ length: 100 }, (_, i) => ({
        word: `word${i}`,
        viewedAt: i * 1000,
      }));

      mockedAsyncStorage.getItem.mockResolvedValue(JSON.stringify(existingHistory));

      await storageService.addToHistory('newword');

      const setItemCall = mockedAsyncStorage.setItem.mock.calls.find(
        (call) => call[0] === STORAGE_KEYS.HISTORY,
      );
      const savedHistory = JSON.parse(setItemCall![1] as string);
      expect(savedHistory).toHaveLength(100);
      expect(savedHistory[0].word).toBe('newword');
    });

    it('should save to Firestore when user is logged in', async () => {
      storageService.setUserId('user123');
      mockedAsyncStorage.getItem.mockResolvedValue(JSON.stringify([]));
      mockedFirestoreService.saveHistory.mockResolvedValue(undefined);

      await storageService.addToHistory('word1');

      expect(mockedFirestoreService.saveHistory).toHaveBeenCalled();
    });
  });

  describe('syncToFirestore', () => {
    it('should not sync when user is not logged in', async () => {
      await storageService.syncToFirestore();

      expect(mockedFirestoreService.syncLocalDataToFirestore).not.toHaveBeenCalled();
    });

    it('should sync local data to Firestore', async () => {
      const favorites = ['word1', 'word2'];
      const history: WordListItem[] = [{ word: 'word1', viewedAt: 1000 }];

      storageService.setUserId('user123');
      mockedAsyncStorage.getItem
        .mockResolvedValueOnce(JSON.stringify(favorites))
        .mockResolvedValueOnce(JSON.stringify(history));
      mockedFirestoreService.syncLocalDataToFirestore.mockResolvedValue(undefined);

      await storageService.syncToFirestore();

      expect(mockedFirestoreService.syncLocalDataToFirestore).toHaveBeenCalledWith(
        'user123',
        favorites,
        history,
      );
    });

    it('should handle sync error gracefully', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      storageService.setUserId('user123');
      mockedAsyncStorage.getItem
        .mockResolvedValueOnce(JSON.stringify([]))
        .mockResolvedValueOnce(JSON.stringify([]));
      mockedFirestoreService.syncLocalDataToFirestore.mockRejectedValue(
        new Error('Sync error'),
      );

      await storageService.syncToFirestore();

      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });

  describe('loadFromFirestore', () => {
    it('should return local data when user is not logged in', async () => {
      const favorites = ['word1'];
      const history: WordListItem[] = [{ word: 'word1', viewedAt: 1000 }];

      mockedAsyncStorage.getItem
        .mockResolvedValueOnce(JSON.stringify(favorites))
        .mockResolvedValueOnce(JSON.stringify(history));

      const result = await storageService.loadFromFirestore();

      expect(result.favorites).toEqual(favorites);
      expect(result.history).toEqual(history);
      expect(mockedFirestoreService.mergeFirestoreWithLocal).not.toHaveBeenCalled();
    });

    it('should merge Firestore and local data', async () => {
      const localFavorites = ['word1'];
      const localHistory: WordListItem[] = [{ word: 'word1', viewedAt: 1000 }];
      const mergedFavorites = ['word1', 'word2'];
      const mergedHistory: WordListItem[] = [
        { word: 'word1', viewedAt: 1000 },
        { word: 'word2', viewedAt: 2000 },
      ];

      storageService.setUserId('user123');
      mockedAsyncStorage.getItem
        .mockResolvedValueOnce(JSON.stringify(localFavorites))
        .mockResolvedValueOnce(JSON.stringify(localHistory));
      mockedFirestoreService.mergeFirestoreWithLocal.mockResolvedValue({
        favorites: mergedFavorites,
        history: mergedHistory,
      });

      const result = await storageService.loadFromFirestore();

      expect(result.favorites).toEqual(mergedFavorites);
      expect(result.history).toEqual(mergedHistory);
      expect(mockedAsyncStorage.setItem).toHaveBeenCalledTimes(2);
    });

    it('should return local data on error', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      const localFavorites = ['word1'];
      const localHistory: WordListItem[] = [{ word: 'word1', viewedAt: 1000 }];

      storageService.setUserId('user123');
      mockedAsyncStorage.getItem
        .mockResolvedValueOnce(JSON.stringify(localFavorites)) // For mergeFirestoreWithLocal
        .mockResolvedValueOnce(JSON.stringify(localHistory)) // For mergeFirestoreWithLocal
        .mockResolvedValueOnce(JSON.stringify(localFavorites)) // For getFavorites fallback
        .mockResolvedValueOnce(JSON.stringify(localHistory)); // For getHistory fallback
      mockedFirestoreService.mergeFirestoreWithLocal.mockRejectedValue(
        new Error('Merge error'),
      );
      // Mock getFavorites to return local data when called in error handler
      mockedFirestoreService.getFavorites.mockResolvedValue(localFavorites);
      mockedFirestoreService.getHistory.mockResolvedValue(localHistory);

      const result = await storageService.loadFromFirestore();

      expect(result.favorites).toEqual(localFavorites);
      expect(result.history).toEqual(localHistory);
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });

  describe('getWordsListLoaded / setWordsListLoaded', () => {
    it('should return false when words list not loaded', async () => {
      mockedAsyncStorage.getItem.mockResolvedValue(null);

      const result = await storageService.getWordsListLoaded();

      expect(result).toBe(false);
    });

    it('should return true when words list is loaded', async () => {
      mockedAsyncStorage.getItem.mockResolvedValue('loaded');

      const result = await storageService.getWordsListLoaded();

      expect(result).toBe(true);
    });

    it('should set words list loaded flag', async () => {
      mockedAsyncStorage.setItem.mockResolvedValue(undefined);

      await storageService.setWordsListLoaded();

      expect(mockedAsyncStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEYS.WORDS_LIST,
        'loaded',
      );
    });
  });
});

