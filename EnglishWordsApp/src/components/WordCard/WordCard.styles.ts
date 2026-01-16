import styled from 'styled-components/native';
import { COLORS, SPACING } from '../../constants';

export const CardContainer = styled.TouchableOpacity<{ bgColor: string }>`
  background-color: ${(props) => props.bgColor};
  border-radius: 12px;
  padding: ${SPACING.md}px ${SPACING.sm}px;
  margin: ${SPACING.xs}px;
  border: 1px solid ${COLORS.borderLight};
  height: 80px;
  flex: 1;
  min-width: 0;
  justify-content: center;
  align-items: center;
  shadow-color: ${COLORS.shadow};
  shadow-offset: 0px 2px;
  shadow-opacity: 1;
  shadow-radius: 4px;
  elevation: 2;
  position: relative;
`;

export const WordText = styled.Text`
  font-size: 15px;
  font-weight: 600;
  color: ${COLORS.header};
  text-align: center;
  letter-spacing: 0.2px;
`;

export const FavoriteBadge = styled.View`
  position: absolute;
  top: 6px;
  right: 6px;
  width: 20px;
  height: 20px;
  border-radius: 10px;
  background-color: ${COLORS.favoriteLight};
  justify-content: center;
  align-items: center;
`;

export const RemoveButton = styled.TouchableOpacity`
  position: absolute;
  top: 6px;
  left: 6px;
  width: 24px;
  height: 24px;
  border-radius: 12px;
  background-color: ${COLORS.favorite};
  justify-content: center;
  align-items: center;
  shadow-color: ${COLORS.shadow};
  shadow-offset: 0px 2px;
  shadow-opacity: 1;
  shadow-radius: 3px;
  elevation: 3;
`;

export const LoadingOverlay = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 12px;
  background-color: rgba(0, 0, 0, 0.08);
  justify-content: center;
  align-items: center;
`;
