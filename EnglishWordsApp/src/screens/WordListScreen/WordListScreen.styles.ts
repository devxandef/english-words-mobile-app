import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING } from '../../constants';

export const Container = styled.View`
  flex: 1;
  background-color: ${COLORS.backgroundDark};
`;

export const SafeAreaContainer = styled(SafeAreaView)`
  flex: 1;
  background-color: ${COLORS.header};
`;

export const Title = styled.Text`
  font-size: 28px;
  font-weight: 800;
  color: ${COLORS.header};
  padding: ${SPACING.lg}px ${SPACING.md}px ${SPACING.md}px;
  background-color: ${COLORS.backgroundLight};
  letter-spacing: -0.5px;
`;

export const HeaderContainer = styled.View`
  z-index: 10;
  elevation: 2;
  shadow-color: ${COLORS.shadow};
  shadow-offset: 0px 2px;
  shadow-opacity: 1;
  shadow-radius: 4px;
`;

export const UserHeader = styled.View`
  background-color: ${COLORS.header};
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  padding: ${SPACING.sm}px ${SPACING.md}px;
`;

export const TabBarContainer = styled.View`
  background-color: ${COLORS.header};
  flex-direction: row;
  align-items: center;
`;

export const TabBarWrapper = styled.View`
  flex: 1;
`;

export const WordsGrid = styled.View`
  flex: 1;
  padding: ${SPACING.md}px ${SPACING.sm}px;
`;

export const EmptyContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: ${SPACING.xl}px;
`;

export const EmptyText = styled.Text`
  font-size: 16px;
  color: ${COLORS.textSecondary};
  text-align: center;
  font-weight: 500;
  line-height: 24px;
`;

