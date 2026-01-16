import React from 'react';
import { ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../../constants';
import { WordCardProps } from './WordCard.types';
import {
  CardContainer,
  WordText,
  FavoriteBadge,
  RemoveButton,
  LoadingOverlay,
} from './WordCard.styles';

const cardColors = [
  COLORS.cardLight1,
  COLORS.cardLight2,
  COLORS.cardLight3,
  COLORS.cardLight4,
  COLORS.cardLight5,
  COLORS.cardLight6,
];

export const WordCard: React.FC<WordCardProps> = ({
  word,
  onPress,
  isFavorite,
  index,
  showRemoveButton = false,
  onRemove,
  isLoading = false,
}) => {
  const bgColor = cardColors[index % cardColors.length];
  
  const handleRemove = () => {
    if (onRemove) {
      onRemove();
    }
  };
  
  return (
    <CardContainer
      onPress={onPress}
      activeOpacity={0.6}
      bgColor={bgColor}
      disabled={isLoading}
    >
      <WordText>{word}</WordText>
      {isLoading && (
        <LoadingOverlay>
          <ActivityIndicator size="small" color={COLORS.background} />
        </LoadingOverlay>
      )}
      {showRemoveButton && onRemove && (
        <RemoveButton 
          onPress={handleRemove} 
          activeOpacity={0.7}
        >
          <Icon name="close" size={14} color={COLORS.background} />
        </RemoveButton>
      )}
      {isFavorite && !showRemoveButton && (
        <FavoriteBadge>
          <Icon name="favorite" size={12} color={COLORS.favorite} />
        </FavoriteBadge>
      )}
    </CardContainer>
  );
};

