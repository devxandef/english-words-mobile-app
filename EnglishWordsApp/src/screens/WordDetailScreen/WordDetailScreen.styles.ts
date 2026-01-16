import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING } from '../../constants';

export const SafeAreaContainer = styled(SafeAreaView)`
  flex: 1;
  background-color: ${COLORS.header};
`;

export const Container = styled.View`
  flex: 1;
  background-color: ${COLORS.backgroundDark};
`;

export const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: ${SPACING.md}px ${SPACING.lg}px;
  background-color: ${COLORS.header};
  border-bottom-width: 1px;
  border-bottom-color: ${COLORS.borderLight};
`;

export const HeaderTitle = styled.Text`
  font-size: 20px;
  font-weight: 700;
  color: ${COLORS.background};
  flex: 1;
  text-align: center;
  margin-horizontal: ${SPACING.md}px;
`;

export const CloseButton = styled.TouchableOpacity`
  padding: ${SPACING.sm}px;
  width: 40px;
  height: 40px;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
`;

export const FavoriteButton = styled.TouchableOpacity`
  padding: ${SPACING.sm}px;
  width: 40px;
  height: 40px;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
`;

export const WordCard = styled.View`
  background-color: ${COLORS.primary};
  margin: ${SPACING.lg}px ${SPACING.md}px;
  padding: ${SPACING.xl}px ${SPACING.lg}px;
  border-radius: 16px;
  align-items: center;
  shadow-color: ${COLORS.primary};
  shadow-offset: 0px 4px;
  shadow-opacity: 0.3;
  shadow-radius: 8px;
  elevation: 6;
`;

export const WordText = styled.Text`
  font-size: 36px;
  font-weight: 800;
  color: ${COLORS.background};
  margin-bottom: ${SPACING.sm}px;
  letter-spacing: -0.5px;
`;

export const PhoneticText = styled.Text`
  font-size: 18px;
  color: ${COLORS.background};
  opacity: 0.95;
  font-weight: 500;
  letter-spacing: 0.5px;
`;

export const AudioContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: ${SPACING.md}px;
  padding: ${SPACING.md}px ${SPACING.lg}px;
  background-color: ${COLORS.background};
  border-radius: 12px;
  margin-horizontal: ${SPACING.md}px;
  border: 1px solid ${COLORS.borderLight};
  shadow-color: ${COLORS.shadow};
  shadow-offset: 0px 2px;
  shadow-opacity: 1;
  shadow-radius: 4px;
  elevation: 2;
`;

export const PlayButton = styled.TouchableOpacity`
  width: 48px;
  height: 48px;
  border-radius: 24px;
  background-color: ${COLORS.primary};
  justify-content: center;
  align-items: center;
  margin-right: ${SPACING.md}px;
  shadow-color: ${COLORS.primary};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.3;
  shadow-radius: 4px;
  elevation: 3;
`;

export const ProgressBar = styled.View`
  flex: 1;
  height: 4px;
  background-color: ${COLORS.border};
  border-radius: 2px;
  overflow: hidden;
`;

export const ProgressFill = styled.View`
  height: 100%;
  background-color: ${COLORS.primary};
  width: 0%;
`;

export const Content = styled.View`
  padding: ${SPACING.md}px;
`;

export const SectionTitle = styled.Text`
  font-size: 22px;
  font-weight: 800;
  color: ${COLORS.text};
  margin-top: ${SPACING.lg}px;
  margin-bottom: ${SPACING.md}px;
  letter-spacing: -0.3px;
`;

export const MeaningContainer = styled.View`
  background-color: ${COLORS.background};
  padding: ${SPACING.lg}px;
  border-radius: 12px;
  margin-bottom: ${SPACING.md}px;
  border: 1px solid ${COLORS.borderLight};
  shadow-color: ${COLORS.shadowLight};
  shadow-offset: 0px 1px;
  shadow-opacity: 1;
  shadow-radius: 3px;
  elevation: 1;
`;

export const PartOfSpeech = styled.Text`
  font-size: 14px;
  font-weight: 700;
  color: ${COLORS.primary};
  margin-bottom: ${SPACING.md}px;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

export const DefinitionText = styled.Text`
  font-size: 16px;
  color: ${COLORS.text};
  line-height: 24px;
  margin-bottom: ${SPACING.sm}px;
  letter-spacing: 0.1px;
`;

export const ExampleText = styled.Text`
  font-size: 15px;
  color: ${COLORS.textSecondary};
  font-style: italic;
  margin-top: ${SPACING.md}px;
  padding-left: ${SPACING.md}px;
  padding-right: ${SPACING.sm}px;
  line-height: 22px;
  border-left-width: 3px;
  border-left-color: ${COLORS.primaryLight};
`;

export const NavigationButtons = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding: ${SPACING.md}px;
  background-color: ${COLORS.backgroundLight};
  border-top-width: 1px;
  border-top-color: ${COLORS.borderLight};
`;

export const NavButton = styled.TouchableOpacity<{ disabled?: boolean }>`
  flex: 1;
  padding: ${SPACING.md}px;
  background-color: ${(props) =>
    props.disabled ? COLORS.border : COLORS.primary};
  border-radius: 12px;
  align-items: center;
  margin-horizontal: ${SPACING.sm}px;
  flex-direction: row;
  justify-content: center;
  gap: ${SPACING.xs}px;
  shadow-color: ${COLORS.primary};
  shadow-offset: 0px 2px;
  shadow-opacity: ${(props) => (props.disabled ? 0 : 0.3)};
  shadow-radius: 4px;
  elevation: ${(props) => (props.disabled ? 0 : 3)};
`;

export const NavButtonText = styled.Text<{ disabled?: boolean }>`
  color: ${(props) =>
    props.disabled ? COLORS.textSecondary : COLORS.background};
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.5px;
`;

