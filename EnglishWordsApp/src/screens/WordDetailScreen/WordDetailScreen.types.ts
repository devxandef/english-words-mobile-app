export interface WordDetailScreenProps {
  route: {
    params: {
      word: string;
      wordIndex?: number;
      wordsList?: string[];
      activeTab?: string;
    };
  };
  navigation: any;
}

