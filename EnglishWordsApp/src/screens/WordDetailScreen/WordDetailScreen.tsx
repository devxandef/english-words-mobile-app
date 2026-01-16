import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, ActivityIndicator, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { WordDefinition } from '../../types';
import { apiService } from '../../services/api';
import { storageService } from '../../services/storage';
import { playAudio } from '../../utils/audio';
import { COLORS } from '../../constants';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { WordDetailScreenProps } from './WordDetailScreen.types';
import {
  SafeAreaContainer,
  Container,
  Header,
  HeaderTitle,
  CloseButton,
  FavoriteButton,
  WordCard,
  WordText,
  PhoneticText,
  AudioContainer,
  PlayButton,
  ProgressBar,
  ProgressFill,
  Content,
  SectionTitle,
  MeaningContainer,
  PartOfSpeech,
  DefinitionText,
  ExampleText,
  NavigationButtons,
  NavButton,
  NavButtonText,
} from './WordDetailScreen.styles';

export const WordDetailScreen: React.FC<WordDetailScreenProps> = ({
  route,
  navigation,
}) => {
  const { word, wordIndex, wordsList = [] } = route.params;
  const [wordData, setWordData] = useState<WordDefinition | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(wordIndex ?? -1);

  const loadWordData = useCallback(async () => {
    setLoading(true);
    const data = await apiService.getWordDefinition(word);
    setWordData(data);
    if (data?.phonetics) {
      const audio = data.phonetics.find((p) => p.audio)?.audio;
      setAudioUrl(audio || null);
    }
    setLoading(false);
  }, [word]);

  const checkFavorite = useCallback(async () => {
    const favorite = await storageService.isFavorite(word);
    setIsFavorite(favorite);
  }, [word]);

  useEffect(() => {
    loadWordData();
    checkFavorite();
  }, [loadWordData, checkFavorite]);

  const handleToggleFavorite = async () => {
    if (isFavorite) {
      await storageService.removeFavorite(word);
    } else {
      await storageService.addFavorite(word);
    }
    setIsFavorite(!isFavorite);
  };

  const handlePlayAudio = async () => {
    if (!audioUrl || isPlaying) return;

    setIsPlaying(true);
    try {
      await playAudio(audioUrl);
    } catch (error) {
      console.error('Error playing audio:', error);
    } finally {
      setIsPlaying(false);
    }
  };

  const navigateToWord = useCallback(
    async (newWord: string, newIndex: number) => {
      setLoading(true);
      setCurrentIndex(newIndex);
      await storageService.addToHistory(newWord);
      const data = await apiService.getWordDefinition(newWord);
      setWordData(data);
      if (data?.phonetics) {
        const audio = data.phonetics.find((p) => p.audio)?.audio;
        setAudioUrl(audio || null);
      }
      const favorite = await storageService.isFavorite(newWord);
      setIsFavorite(favorite);
      setLoading(false);
    },
    [],
  );

  const handlePrevious = () => {
    if (currentIndex > 0 && wordsList.length > 0) {
      const prevIndex = currentIndex - 1;
      const prevWord = wordsList[prevIndex];
      navigateToWord(prevWord, prevIndex);
    }
  };

  const handleNext = () => {
    if (currentIndex >= 0 && currentIndex < wordsList.length - 1) {
      const nextIndex = currentIndex + 1;
      const nextWord = wordsList[nextIndex];
      navigateToWord(nextWord, nextIndex);
    }
  };

  const canGoPrevious = currentIndex > 0 && wordsList.length > 0;
  const canGoNext =
    currentIndex >= 0 && currentIndex < wordsList.length - 1;

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!wordData) {
    return (
      <SafeAreaContainer edges={['top']}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={COLORS.header}
          translucent={false}
        />
        <Container>
          <Header>
            <CloseButton onPress={() => navigation.goBack()}>
              <Icon name="close" size={24} color={COLORS.background} />
            </CloseButton>
            <HeaderTitle>{word}</HeaderTitle>
            <FavoriteButton onPress={handleToggleFavorite}>
              <Icon
                name={isFavorite ? 'favorite' : 'favorite-border'}
                size={24}
                color={isFavorite ? COLORS.favorite : COLORS.background}
              />
            </FavoriteButton>
          </Header>
        <Content>
          <WordCard>
            <WordText>{word}</WordText>
          </WordCard>
          <MeaningContainer>
            <DefinitionText>
              Definition not available for this word in the dictionary.
            </DefinitionText>
          </MeaningContainer>
        </Content>
        </Container>
      </SafeAreaContainer>
    );
  }

  const phonetic =
    wordData.phonetic ||
    wordData.phonetics?.find((p) => p.text)?.text ||
    '';

  return (
    <SafeAreaContainer edges={['top']}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.header}
        translucent={false}
      />
      <Container>
        <Header>
          <CloseButton onPress={() => navigation.goBack()}>
            <Icon name="close" size={24} color={COLORS.background} />
          </CloseButton>
          <HeaderTitle>{wordData.word}</HeaderTitle>
          <FavoriteButton onPress={handleToggleFavorite}>
            <Icon
              name={isFavorite ? 'favorite' : 'favorite-border'}
              size={24}
              color={isFavorite ? COLORS.favorite : COLORS.background}
            />
          </FavoriteButton>
        </Header>

      <ScrollView>
        <WordCard>
          <WordText>{wordData.word}</WordText>
          {phonetic && <PhoneticText>{phonetic}</PhoneticText>}
        </WordCard>

        {audioUrl && (
          <AudioContainer>
            <PlayButton onPress={handlePlayAudio} disabled={isPlaying}>
              {isPlaying ? (
                <ActivityIndicator size="small" color={COLORS.background} />
              ) : (
                <Icon name="play-arrow" size={24} color={COLORS.background} />
              )}
            </PlayButton>
            <ProgressBar>
              <ProgressFill />
            </ProgressBar>
          </AudioContainer>
        )}

        <Content>
          <SectionTitle>Meanings</SectionTitle>
          {wordData.meanings.map((meaning, index) => (
            <MeaningContainer key={index}>
              <PartOfSpeech>{meaning.partOfSpeech}</PartOfSpeech>
              {meaning.definitions.map((def, defIndex) => (
                <React.Fragment key={defIndex}>
                  <DefinitionText>• {def.definition}</DefinitionText>
                  {def.example && (
                    <ExampleText>"{def.example}"</ExampleText>
                  )}
                </React.Fragment>
              ))}
            </MeaningContainer>
          ))}
        </Content>
      </ScrollView>

      <NavigationButtons>
        <NavButton onPress={handlePrevious} disabled={!canGoPrevious}>
          <Icon
            name="arrow-back"
            size={20}
            color={canGoPrevious ? COLORS.background : COLORS.textSecondary}
          />
          <NavButtonText disabled={!canGoPrevious}>Previous</NavButtonText>
        </NavButton>
        <NavButton onPress={handleNext} disabled={!canGoNext}>
          <NavButtonText disabled={!canGoNext}>Next</NavButtonText>
          <Icon
            name="arrow-forward"
            size={20}
            color={canGoNext ? COLORS.background : COLORS.textSecondary}
          />
        </NavButton>
      </NavigationButtons>
      </Container>
    </SafeAreaContainer>
  );
};

