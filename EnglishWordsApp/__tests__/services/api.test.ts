import axios from 'axios';
import { apiService } from '../../src/services/api';
import { cacheService } from '../../src/services/cache';
import { WordDefinition } from '../../src/types';

jest.mock('axios');
jest.mock('../../src/services/cache');

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedCacheService = cacheService as jest.Mocked<typeof cacheService>;

describe('ApiService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    apiService.clearWordsCache();
    mockedCacheService.get.mockReturnValue(null);
  });

  describe('getWordDefinition', () => {
    it('should return cached data when available', async () => {
      const cachedData: WordDefinition = {
        word: 'test',
        meanings: [],
      };

      mockedCacheService.get.mockReturnValue(cachedData);

      const result = await apiService.getWordDefinition('test');

      expect(result).toEqual(cachedData);
      expect(mockedAxios.get).not.toHaveBeenCalled();
    });

    it('should fetch from API when not cached', async () => {
      const wordData: WordDefinition = {
        word: 'hello',
        meanings: [
          {
            partOfSpeech: 'noun',
            definitions: [{ definition: 'a greeting' }],
          },
        ],
      };

      mockedAxios.get.mockResolvedValue({
        data: [wordData],
      });

      const result = await apiService.getWordDefinition('hello');

      expect(result).toEqual(wordData);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://api.dictionaryapi.dev/api/v2/entries/en/hello',
      );
      expect(mockedCacheService.set).toHaveBeenCalledWith('hello', wordData);
    });

    it('should return null when API returns empty array', async () => {
      mockedAxios.get.mockResolvedValue({
        data: [],
      });

      const result = await apiService.getWordDefinition('nonexistent');

      expect(result).toBeNull();
    });

    it('should return null and not log for 404 errors', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      const error = {
        response: { status: 404 },
        isAxiosError: true,
      };

      mockedAxios.isAxiosError = jest.fn(() => true);
      mockedAxios.get.mockRejectedValue(error);

      const result = await apiService.getWordDefinition('notfound');

      expect(result).toBeNull();
      expect(consoleErrorSpy).not.toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });

    it('should log and return null for non-404 errors', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      const error = {
        response: { status: 500 },
        message: 'Server error',
        isAxiosError: true,
      };

      mockedAxios.isAxiosError = jest.fn(() => true);
      mockedAxios.get.mockRejectedValue(error);

      const result = await apiService.getWordDefinition('error');

      expect(result).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error fetching word definition:',
        'Server error',
      );

      consoleErrorSpy.mockRestore();
    });

    it('should convert word to lowercase', async () => {
      const wordData: WordDefinition = {
        word: 'Hello',
        meanings: [],
      };

      mockedAxios.get.mockResolvedValue({
        data: [wordData],
      });

      await apiService.getWordDefinition('Hello');

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://api.dictionaryapi.dev/api/v2/entries/en/hello',
      );
      expect(mockedCacheService.set).toHaveBeenCalledWith('hello', wordData);
    });
  });

  describe('fetchWordsDictionary', () => {
    it('should return cached words if available', async () => {
      const cachedWords = ['word1', 'word2', 'word3'];
      (apiService as any).wordsCache = cachedWords;

      const result = await apiService.fetchWordsDictionary();

      expect(result).toEqual(cachedWords);
      expect(mockedAxios.get).not.toHaveBeenCalled();
    });

    it('should fetch from common words URL first', async () => {
      const wordsText = 'hello\nworld\ntest\n';
      mockedAxios.get.mockResolvedValueOnce({
        data: wordsText,
      });

      const result = await apiService.fetchWordsDictionary();

      expect(result).toEqual(['hello', 'world', 'test']);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://raw.githubusercontent.com/first20hours/google-10000-english/master/google-10000-english-usa-no-swears-medium.txt',
        { responseType: 'text' },
      );
    });

    it('should filter words correctly (length > 2, only letters)', async () => {
      const wordsText = 'hi\nhello\nworld\ntest123\nab\n';
      mockedAxios.get.mockResolvedValueOnce({
        data: wordsText,
      });

      const result = await apiService.fetchWordsDictionary();

      expect(result).toEqual(['hello', 'world']);
      expect(result).not.toContain('hi'); // too short
      expect(result).not.toContain('test123'); // has numbers
      expect(result).not.toContain('ab'); // too short
    });

    it('should fallback to dictionary URL if common words fails', async () => {
      mockedAxios.get
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({
          data: {
            hello: 1,
            world: 1,
            test: 1,
          },
        });

      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

      const result = await apiService.fetchWordsDictionary();

      expect(result).toEqual(['hello', 'world', 'test']);
      expect(consoleLogSpy).toHaveBeenCalledWith(
        'Common words list not available, trying full dictionary...',
      );

      consoleLogSpy.mockRestore();
    });

    it('should filter dictionary words correctly', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('Network error'));
      mockedAxios.get.mockResolvedValueOnce({
        data: {
          hello: 1,
          hi: 1,
          test123: 1,
          ab: 1,
        },
      });

      const result = await apiService.fetchWordsDictionary();

      expect(result).toEqual(['hello']);
      expect(result).not.toContain('hi');
      expect(result).not.toContain('test123');
      expect(result).not.toContain('ab');
    });

    it('should return empty array on error', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      mockedAxios.get
        .mockRejectedValueOnce(new Error('Network error'))
        .mockRejectedValueOnce(new Error('Network error'));

      const result = await apiService.fetchWordsDictionary();

      expect(result).toEqual([]);
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });

    it('should cache words in memory', async () => {
      const wordsText = 'hello\nworld\n';
      mockedAxios.get.mockResolvedValueOnce({
        data: wordsText,
      });

      const result1 = await apiService.fetchWordsDictionary();
      const result2 = await apiService.fetchWordsDictionary();

      expect(result1).toEqual(result2);
      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    });
  });

  describe('clearWordsCache', () => {
    it('should clear the words cache', async () => {
      const wordsText = 'hello\nworld\n';
      mockedAxios.get.mockResolvedValueOnce({
        data: wordsText,
      });

      await apiService.fetchWordsDictionary();
      apiService.clearWordsCache();

      // Next call should fetch again
      mockedAxios.get.mockResolvedValueOnce({
        data: wordsText,
      });

      await apiService.fetchWordsDictionary();

      expect(mockedAxios.get).toHaveBeenCalledTimes(2);
    });
  });
});

