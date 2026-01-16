export interface WordDefinition {
  word: string;
  phonetic?: string;
  phonetics?: Array<{
    text?: string;
    audio?: string;
  }>;
  meanings: Array<{
    partOfSpeech: string;
    definitions: Array<{
      definition: string;
      example?: string;
      synonyms?: string[];
      antonyms?: string[];
    }>;
  }>;
  sourceUrls?: string[];
}

export interface WordListItem {
  word: string;
  isFavorite?: boolean;
  viewedAt?: number;
}

export type TabType = 'wordlist' | 'history' | 'favorites';

