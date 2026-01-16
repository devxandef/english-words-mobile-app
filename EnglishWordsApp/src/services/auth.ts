import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

type User = FirebaseAuthTypes.User;

class AuthService {
  private authInstance = auth();

  async signUp(email: string, password: string): Promise<User> {
    try {
      const userCredential = await this.authInstance.createUserWithEmailAndPassword(
        email,
        password,
      );
      return userCredential.user;
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('Este email já está em uso');
      }
      if (error.code === 'auth/invalid-email') {
        throw new Error('Email inválido');
      }
      if (error.code === 'auth/weak-password') {
        throw new Error('Senha muito fraca');
      }
      throw new Error(error.message || 'Erro ao criar conta');
    }
  }

  async signIn(email: string, password: string): Promise<User> {
    try {
      const userCredential = await this.authInstance.signInWithEmailAndPassword(
        email,
        password,
      );
      return userCredential.user;
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        throw new Error('Usuário não encontrado');
      }
      if (error.code === 'auth/wrong-password') {
        throw new Error('Senha incorreta');
      }
      if (error.code === 'auth/invalid-email') {
        throw new Error('Email inválido');
      }
      throw new Error(error.message || 'Erro ao fazer login');
    }
  }

  async signOut(): Promise<void> {
    try {
      await this.authInstance.signOut();
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao fazer logout');
    }
  }

  getCurrentUser(): User | null {
    return this.authInstance.currentUser;
  }

  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return this.authInstance.onAuthStateChanged(callback);
  }
}

export const authService = new AuthService();

