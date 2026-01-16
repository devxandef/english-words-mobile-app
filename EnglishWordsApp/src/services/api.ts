import axios from 'axios';
import {
  API_BASE_URL,
  COMMON_WORDS_URL,
  WORDS_DICTIONARY_URL,
} from '../constants';
import { WordDefinition } from '../types';
import { cacheService } from './cache';

class ApiService {
  private wordsCache: string[] | null = null;

  async getWordDefinition(word: string): Promise<WordDefinition | null> {
    try {
      // Check cache first
      const cached = cacheService.get(word.toLowerCase());
      if (cached) {
        return cached;
      }

      const response = await axios.get<WordDefinition[]>(
        `${API_BASE_URL}/${word.toLowerCase()}`,
      );

      if (response.data && response.data.length > 0) {
        const wordData = response.data[0];
        // Cache the result
        cacheService.set(word.toLowerCase(), wordData);
        return wordData;
      }

      return null;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      
      if (axios.isAxiosError(error) && error.response?.status !== 404) {
        console.error('Error fetching word definition:', error.message);
      }
      
      return null;
    }
  }

  async fetchWordsDictionary(): Promise<string[]> {
    if (this.wordsCache) {
      return this.wordsCache;
    }

    try {
      try {
        const response = await axios.get<string>(COMMON_WORDS_URL, {
          responseType: 'text',
        });
        
        const words = response.data
          .split('\n')
          .map((word) => word.trim().toLowerCase())
          .filter((word) => word.length > 2 && /^[a-z]+$/.test(word));
        
        if (words.length > 0) {
          this.wordsCache = words;
          return words;
        }
      } catch {
        console.log('Common words list not available, trying full dictionary...');
      }

      const response = await axios.get<Record<string, number>>(
        WORDS_DICTIONARY_URL,
      );
      const words = Object.keys(response.data)
        .map((word) => word.toLowerCase())
        .filter((word) => word.length > 2 && /^[a-z]+$/.test(word));
      
      this.wordsCache = words;
      return words;
    } catch (error) {
      console.error('Error fetching words dictionary:', error);
      return [];
    }
  }

  clearWordsCache(): void {
    this.wordsCache = null;
  }
}

export const apiService = new ApiService();

