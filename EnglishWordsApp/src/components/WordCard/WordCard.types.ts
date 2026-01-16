export interface WordCardProps {
  word: string;
  onPress: () => void;
  isFavorite?: boolean;
  index: number;
  showRemoveButton?: boolean;
  onRemove?: () => void;
  isLoading?: boolean;
}

