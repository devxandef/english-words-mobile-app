import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  View,
  ActivityIndicator,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { WordCard } from '../../components/WordCard';
import { TabBar } from '../../components/TabBar';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { UserAvatar } from '../../components/UserAvatar';
import { COLORS, GRID_COLUMNS, SPACING } from '../../constants';
import { TabType, WordListItem } from '../../types';
import { apiService } from '../../services/api';
import { storageService } from '../../services/storage';
import { useAuth } from '../../contexts/AuthContext';
import { WordListScreenProps } from './WordListScreen.types';
import {
  Container,
  SafeAreaContainer,
  Title,
  HeaderContainer,
  UserHeader,
  TabBarContainer,
  TabBarWrapper,
  WordsGrid,
  EmptyContainer,
  EmptyText,
} from './WordListScreen.styles';

export const WordListScreen: React.FC<WordListScreenProps> = ({
  navigation,
}) => {
  const { signOut, user } = useAuth();
  const [words, setWords] = useState<string[]>([]);
  const [filteredWords, setFilteredWords] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [history, setHistory] = useState<WordListItem[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('wordlist');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [pressingWord, setPressingWord] = useState<string | null>(null);
  const ITEMS_PER_PAGE = 30;

  const loadWords = useCallback(async () => {
    try {
      setLoading(true);
      // Check if we've loaded words before (just a flag, not the actual list)
      const wasLoaded = await storageService.getWordsListLoaded();
      
      // Always fetch from API (it will use in-memory cache if available)
      const wordsList = await apiService.fetchWordsDictionary();
      
      // Set flag that we've loaded (without saving the actual list)
      if (!wasLoaded && wordsList.length > 0) {
        await storageService.setWordsListLoaded();
      }
      
      setWords(wordsList);
      setFilteredWords(wordsList.slice(0, ITEMS_PER_PAGE));
    } catch (error) {
      console.error('Error loading words:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadFavorites = useCallback(async () => {
    const favs = await storageService.getFavorites();
    setFavorites(favs);
  }, []);

  const loadHistory = useCallback(async () => {
    const hist = await storageService.getHistory();
    setHistory(hist);
  }, []);

  useEffect(() => {
    loadWords();
    loadFavorites();
    loadHistory();
  }, [loadWords, loadFavorites, loadHistory]);

  // Reload favorites and history when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadFavorites();
      loadHistory();
    }, [loadFavorites, loadHistory])
  );

  useEffect(() => {
    switch (activeTab) {
      case 'favorites':
        setFilteredWords(favorites.slice(0, ITEMS_PER_PAGE));
        setPage(0);
        break;
      case 'history':
        setFilteredWords(
          history.map((item) => item.word).slice(0, ITEMS_PER_PAGE),
        );
        setPage(0);
        break;
      default:
        setFilteredWords(words.slice(0, ITEMS_PER_PAGE));
        setPage(0);
    }
  }, [activeTab, words, favorites, history]);

  const handleLoadMore = () => {
    if (loadingMore) return;

    const currentWords =
      activeTab === 'favorites'
        ? favorites
        : activeTab === 'history'
          ? history.map((item) => item.word)
          : words;

    if (filteredWords.length >= currentWords.length) {
      return; // No more items to load
    }

    setLoadingMore(true);
    setTimeout(() => {
      const nextPage = page + 1;
      const endIndex = (nextPage + 1) * ITEMS_PER_PAGE;
      const newWords = currentWords.slice(0, endIndex);

      setFilteredWords(newWords);
      setPage(nextPage);
      setLoadingMore(false);
    }, 300);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadWords(), loadFavorites(), loadHistory()]);
    setRefreshing(false);
  };

  const handleWordPress = async (word: string, index: number) => {
    setPressingWord(word);
    try {
      await storageService.addToHistory(word);
      await loadHistory();
      
      const currentWords =
        activeTab === 'favorites'
          ? favorites
          : activeTab === 'history'
            ? history.map((item) => item.word)
            : words;
      
      navigation.navigate('WordDetail', {
        word,
        wordIndex: index,
        wordsList: currentWords,
        activeTab,
      });
    } catch (error) {
      console.error('Error handling word press:', error);
    } finally {
      setPressingWord(null);
    }
  };

  const handleRemoveFavorite = async (word: string) => {
    await storageService.removeFavorite(word);
    await loadFavorites();
    // Update filtered words if we're on favorites tab
    if (activeTab === 'favorites') {
      const updatedFavorites = await storageService.getFavorites();
      setFilteredWords(updatedFavorites.slice(0, ITEMS_PER_PAGE));
      setPage(0);
    }
  };

  const renderItem = ({ item, index }: { item: string; index: number }) => {
    const isFavorite = favorites.includes(item);
    return (
      <WordCard
        word={item}
        onPress={() => handleWordPress(item, index)}
        isFavorite={isFavorite}
        index={index}
        showRemoveButton={activeTab === 'favorites'}
        onRemove={activeTab === 'favorites' ? () => handleRemoveFavorite(item) : undefined}
        isLoading={pressingWord === item}
      />
    );
  };

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={{ padding: SPACING.md }}>
        <ActivityIndicator size="small" color={COLORS.primary} />
      </View>
    );
  };

  const renderEmpty = () => (
    <EmptyContainer>
      <EmptyText>
        {activeTab === 'favorites'
          ? 'No favorites yet'
          : activeTab === 'history'
            ? 'No history yet'
            : 'No words found'}
      </EmptyText>
    </EmptyContainer>
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <SafeAreaContainer edges={['top']}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.header}
        translucent={false}
      />
      <Container>
        <HeaderContainer>
          <UserHeader>
            <UserAvatar photoURL={user?.photoURL || null} onLogout={signOut} />
          </UserHeader>
          <TabBarContainer>
            <TabBarWrapper>
              <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
            </TabBarWrapper>
          </TabBarContainer>
          <Title>
            {activeTab === 'favorites'
              ? 'Favorites'
              : activeTab === 'history'
                ? 'History'
                : 'Word list'}
          </Title>
        </HeaderContainer>
        <WordsGrid>
        <FlatList
          data={filteredWords}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${item}-${index}`}
          numColumns={GRID_COLUMNS}
          contentContainerStyle={{
            paddingBottom: SPACING.lg,
            paddingHorizontal: SPACING.xs,
          }}
          columnWrapperStyle={GRID_COLUMNS > 1 ? styles.columnWrapper : undefined}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmpty}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[COLORS.primary]}
            />
          }
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={50}
          initialNumToRender={10}
          windowSize={10}
        />
        </WordsGrid>
      </Container>
    </SafeAreaContainer>
  );
};

const styles = StyleSheet.create({
  columnWrapper: {
    justifyContent: 'space-between',
  },
});

