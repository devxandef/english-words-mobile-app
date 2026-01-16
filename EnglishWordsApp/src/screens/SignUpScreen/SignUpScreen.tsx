import React, { useState } from 'react';
import { ScrollView, Platform } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { COLORS } from '../../constants';
import { SignUpScreenProps } from './SignUpScreen.types';
import {
  Container,
  Content,
  Title,
  Subtitle,
  Input,
  Button,
  ButtonText,
  SecondaryButton,
  SecondaryButtonText,
  ErrorText,
  PasswordHint,
} from './SignUpScreen.styles';

export const SignUpScreen: React.FC<SignUpScreenProps> = ({ navigation }) => {
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await signUp(email.trim(), password);
    } catch (err: any) {
      setError(err.message || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Content
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          keyboardShouldPersistTaps="handled"
        >
          <Title>Criar Conta</Title>
          <Subtitle>Cadastre-se para começar</Subtitle>

          <Input
            placeholder="Email"
            placeholderTextColor={COLORS.textSecondary}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Input
            placeholder="Senha"
            placeholderTextColor={COLORS.textSecondary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
          />

          <PasswordHint>
            A senha deve ter pelo menos 6 caracteres
          </PasswordHint>

          <Input
            placeholder="Confirmar Senha"
            placeholderTextColor={COLORS.textSecondary}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            autoCapitalize="none"
          />

          {error ? <ErrorText>{error}</ErrorText> : null}

          <Button onPress={handleSignUp} disabled={loading}>
            <ButtonText>{loading ? 'Cadastrando...' : 'Cadastrar'}</ButtonText>
          </Button>

          <SecondaryButton
            onPress={() => navigation.navigate('Login')}
            disabled={loading}
          >
            <SecondaryButtonText>
              Já tem conta? Faça login
            </SecondaryButtonText>
          </SecondaryButton>
        </ScrollView>
      </Content>
    </Container>
  );
};

