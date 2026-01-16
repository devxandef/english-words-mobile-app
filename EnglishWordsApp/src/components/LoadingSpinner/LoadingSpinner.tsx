import React from 'react';
import { ActivityIndicator } from 'react-native';
import { COLORS } from '../../constants';
import { Container, LoadingText } from './LoadingSpinner.styles';

export const LoadingSpinner: React.FC = () => {
  return (
    <Container>
      <ActivityIndicator size="large" color={COLORS.primary} />
      <LoadingText>Loading words...</LoadingText>
    </Container>
  );
};

