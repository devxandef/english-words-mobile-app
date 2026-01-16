import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAvoidingView } from 'react-native';
import { COLORS, SPACING } from '../../constants';

export const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${COLORS.backgroundLight};
`;

export const Content = styled(KeyboardAvoidingView)`
  flex: 1;
  justify-content: center;
  padding: ${SPACING.xl}px ${SPACING.lg}px;
`;

export const Title = styled.Text`
  font-size: 32px;
  font-weight: 800;
  color: ${COLORS.header};
  text-align: center;
  margin-bottom: ${SPACING.xs}px;
  letter-spacing: -0.5px;
`;

export const Subtitle = styled.Text`
  font-size: 16px;
  color: ${COLORS.textSecondary};
  text-align: center;
  margin-bottom: ${SPACING.xl}px;
`;

export const Input = styled.TextInput`
  background-color: ${COLORS.background};
  border: 1px solid ${COLORS.borderLight};
  border-radius: 12px;
  padding: ${SPACING.md}px;
  font-size: 16px;
  color: ${COLORS.text};
  margin-bottom: ${SPACING.md}px;
`;

export const Button = styled.TouchableOpacity`
  background-color: ${COLORS.header};
  border-radius: 12px;
  padding: ${SPACING.md}px;
  align-items: center;
  margin-top: ${SPACING.md}px;
  shadow-color: ${COLORS.header};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.3;
  shadow-radius: 4px;
  elevation: 3;
`;

export const ButtonText = styled.Text`
  color: ${COLORS.background};
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.5px;
`;

export const SecondaryButton = styled.TouchableOpacity`
  margin-top: ${SPACING.md}px;
  padding: ${SPACING.md}px;
  align-items: center;
`;

export const SecondaryButtonText = styled.Text`
  color: ${COLORS.header};
  font-size: 16px;
  font-weight: 600;
`;

export const ErrorText = styled.Text`
  color: ${COLORS.favorite};
  font-size: 14px;
  text-align: center;
  margin-top: ${SPACING.sm}px;
  margin-bottom: ${SPACING.sm}px;
`;

export const PasswordHint = styled.Text`
  color: ${COLORS.textSecondary};
  font-size: 12px;
  margin-bottom: ${SPACING.md}px;
  padding-horizontal: ${SPACING.xs}px;
`;

