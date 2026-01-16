import styled from 'styled-components/native';
import { COLORS, SPACING } from '../../constants';

export const AvatarContainer = styled.View`
  position: relative;
`;

export const AvatarButton = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: ${COLORS.background};
  justify-content: center;
  align-items: center;
  overflow: hidden;
  border-width: 2px;
  border-color: ${COLORS.background};
`;

export const AvatarImage = styled.Image`
  width: 100%;
  height: 100%;
  border-radius: 20px;
`;

export const AvatarIcon = styled.View`
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  background-color: ${COLORS.primaryLight};
`;

export const MenuOverlay = styled.TouchableOpacity`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: flex-start;
  align-items: flex-end;
  padding-top: 60px;
  padding-right: ${SPACING.md}px;
`;

export const MenuContainer = styled.View`
  background-color: ${COLORS.background};
  border-radius: 12px;
  padding: ${SPACING.sm}px;
  min-width: 150px;
  shadow-color: ${COLORS.shadow};
  shadow-offset: 0px 4px;
  shadow-opacity: 1;
  shadow-radius: 8px;
  elevation: 8;
`;

export const MenuItem = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: ${SPACING.md}px;
  border-radius: 8px;
`;

export const MenuItemText = styled.Text`
  font-size: 16px;
  color: ${COLORS.text};
  margin-left: ${SPACING.sm}px;
  font-weight: 500;
`;

