import React, { useState } from 'react';
import { ScrollView, Platform, ViewStyle } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { COLORS } from '../../constants';
import { LoginScreenProps } from './LoginScreen.types';
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
} from './LoginScreen.styles';

const scrollContentStyle: ViewStyle = { flexGrow: 1, justifyContent: 'center' };

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const parseErrorMessage = (err: any) => {
    const code = err?.code || '';
    const rawMessage = err?.message || '';

    // Mapeamento específico por código
    if (code === 'auth/network-request-failed') {
      return 'Falha de conexão. Verifique sua internet e tente novamente.';
    }

    if (code === 'auth/too-many-requests') {
      return 'Muitas tentativas. Aguarde um momento e tente novamente.';
    }

    if (code === 'auth/internal-error') {
      return 'Erro interno do servidor. Tente novamente em instantes.';
    }

    if (code === 'auth/invalid-credential' || code === 'auth/wrong-password') {
      return 'Email ou senha incorretos. Confira os dados e tente novamente.';
    }

    if (code === 'auth/invalid-email') {
      return 'Email inválido';
    }

    if (code === 'auth/user-not-found') {
      return 'Usuário não encontrado';
    }

    if (code === 'auth/user-disabled') {
      return 'Conta desativada. Entre em contato com o suporte.';
    }

    if (code === 'auth/operation-not-allowed') {
      return 'Login desabilitado no momento. Tente novamente mais tarde.';
    }

    if (code === 'auth/missing-email') {
      return 'Email não informado.';
    }

    if (code === 'auth/weak-password') {
      return 'Senha muito fraca';
    }

    // Evita exibir mensagens cruas com códigos do Firebase
    if (typeof rawMessage === 'string' && rawMessage.trim().length > 0) {
      if (rawMessage.includes('auth/')) {
        return 'Não foi possível entrar. Confira os dados e tente novamente.';
      }
      return rawMessage;
    }

    return 'Erro ao fazer login. Tente novamente.';
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await signIn(email.trim(), password);
    } catch (err: any) {
      setError(parseErrorMessage(err));
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
          contentContainerStyle={scrollContentStyle}
          keyboardShouldPersistTaps="handled"
        >
          <Title>English Words</Title>
          <Subtitle>Faça login para continuar</Subtitle>

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

          {error ? <ErrorText>{error}</ErrorText> : null}

          <Button onPress={handleLogin} disabled={loading}>
            <ButtonText>{loading ? 'Entrando...' : 'Entrar'}</ButtonText>
          </Button>

          <SecondaryButton
            onPress={() => navigation.navigate('SignUp')}
            disabled={loading}
          >
            <SecondaryButtonText>
              Não tem conta? Cadastre-se
            </SecondaryButtonText>
          </SecondaryButton>
        </ScrollView>
      </Content>
    </Container>
  );
};

