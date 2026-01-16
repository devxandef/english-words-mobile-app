import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../../constants';
import { IconProps } from './Icon.types';

export const AppIcon: React.FC<IconProps> = ({
  name,
  size = 20,
  color = COLORS.text,
}) => {
  return <Icon name={name} size={size} color={color} />;
};

