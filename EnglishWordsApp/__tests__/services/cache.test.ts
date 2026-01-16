import { cacheService } from '../../src/services/cache';
import { WordDefinition } from '../../src/types';

describe('CacheService', () => {
  beforeEach(() => {
    cacheService.clear();
  });

  describe('get', () => {
    it('should return null for non-existent key', () => {
      const result = cacheService.get('nonexistent');
      expect(result).toBeNull();
    });

    it('should return cached data when key exists and not expired', () => {
      const wordData: WordDefinition = {
        word: 'test',
        meanings: [],
      };

      cacheService.set('test', wordData);
      const result = cacheService.get('test');

      expect(result).toEqual(wordData);
    });

    it('should return null when cached data is expired', () => {
      const wordData: WordDefinition = {
        word: 'test',
        meanings: [],
      };

      cacheService.set('test', wordData);

      // Mock Date.now to simulate expiration (TTL is 24 hours)
      const originalNow = Date.now;
      Date.now = jest.fn(() => originalNow() + 25 * 60 * 60 * 1000); // 25 hours later

      const result = cacheService.get('test');

      expect(result).toBeNull();

      Date.now = originalNow;
    });

    it('should delete expired entry from cache', () => {
      const wordData: WordDefinition = {
        word: 'test',
        meanings: [],
      };

      cacheService.set('test', wordData);

      const originalNow = Date.now;
      Date.now = jest.fn(() => originalNow() + 25 * 60 * 60 * 1000);

      cacheService.get('test'); // This should delete the expired entry

      Date.now = originalNow;

      // Setting a new entry should work
      cacheService.set('test', wordData);
      const result = cacheService.get('test');
      expect(result).toEqual(wordData);
    });
  });

  describe('set', () => {
    it('should store data with timestamp', () => {
      const wordData: WordDefinition = {
        word: 'hello',
        meanings: [
          {
            partOfSpeech: 'noun',
            definitions: [{ definition: 'a greeting' }],
          },
        ],
      };

      cacheService.set('hello', wordData);
      const result = cacheService.get('hello');

      expect(result).toEqual(wordData);
    });

    it('should overwrite existing entry', () => {
      const wordData1: WordDefinition = {
        word: 'test',
        meanings: [],
      };

      const wordData2: WordDefinition = {
        word: 'test',
        meanings: [{ partOfSpeech: 'noun', definitions: [] }],
      };

      cacheService.set('test', wordData1);
      cacheService.set('test', wordData2);

      const result = cacheService.get('test');
      expect(result).toEqual(wordData2);
    });
  });

  describe('clear', () => {
    it('should remove all cached entries', () => {
      const wordData: WordDefinition = {
        word: 'test',
        meanings: [],
      };

      cacheService.set('key1', wordData);
      cacheService.set('key2', wordData);

      cacheService.clear();

      expect(cacheService.get('key1')).toBeNull();
      expect(cacheService.get('key2')).toBeNull();
    });
  });
});

