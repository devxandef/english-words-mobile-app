import { authService } from '../../src/services/auth';
import auth from '@react-native-firebase/auth';

jest.mock('@react-native-firebase/auth', () => {
  const mockAuth = {
    createUserWithEmailAndPassword: jest.fn(),
    signInWithEmailAndPassword: jest.fn(),
    signOut: jest.fn(),
    currentUser: null,
    onAuthStateChanged: jest.fn(),
  };
  return jest.fn(() => mockAuth);
});

const mockedAuth = auth() as jest.Mocked<typeof auth>;

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('signUp', () => {
    it('should create user successfully', async () => {
      const mockUser = {
        uid: '123',
        email: 'test@example.com',
      };

      mockedAuth.createUserWithEmailAndPassword.mockResolvedValue({
        user: mockUser as any,
      });

      const result = await authService.signUp('test@example.com', 'password123');

      expect(result).toEqual(mockUser);
      expect(mockedAuth.createUserWithEmailAndPassword).toHaveBeenCalledWith(
        'test@example.com',
        'password123',
      );
    });

    it('should throw error for email already in use', async () => {
      const error: any = {
        code: 'auth/email-already-in-use',
        message: 'Email already in use',
      };

      mockedAuth.createUserWithEmailAndPassword.mockRejectedValue(error);

      await expect(
        authService.signUp('test@example.com', 'password123'),
      ).rejects.toThrow('Este email já está em uso');
    });

    it('should throw error for invalid email', async () => {
      const error: any = {
        code: 'auth/invalid-email',
        message: 'Invalid email',
      };

      mockedAuth.createUserWithEmailAndPassword.mockRejectedValue(error);

      await expect(
        authService.signUp('invalid', 'password123'),
      ).rejects.toThrow('Email inválido');
    });

    it('should throw error for weak password', async () => {
      const error: any = {
        code: 'auth/weak-password',
        message: 'Weak password',
      };

      mockedAuth.createUserWithEmailAndPassword.mockRejectedValue(error);

      await expect(
        authService.signUp('test@example.com', '123'),
      ).rejects.toThrow('Senha muito fraca');
    });

    it('should throw generic error for other errors', async () => {
      const error: any = {
        code: 'auth/unknown-error',
        message: 'Unknown error',
      };

      mockedAuth.createUserWithEmailAndPassword.mockRejectedValue(error);

      await expect(
        authService.signUp('test@example.com', 'password123'),
      ).rejects.toThrow('Unknown error');
    });

    it('should throw default error message when error has no message', async () => {
      const error: any = {
        code: 'auth/unknown-error',
      };

      mockedAuth.createUserWithEmailAndPassword.mockRejectedValue(error);

      await expect(
        authService.signUp('test@example.com', 'password123'),
      ).rejects.toThrow('Erro ao criar conta');
    });
  });

  describe('signIn', () => {
    it('should sign in user successfully', async () => {
      const mockUser = {
        uid: '123',
        email: 'test@example.com',
      };

      mockedAuth.signInWithEmailAndPassword.mockResolvedValue({
        user: mockUser as any,
      });

      const result = await authService.signIn('test@example.com', 'password123');

      expect(result).toEqual(mockUser);
      expect(mockedAuth.signInWithEmailAndPassword).toHaveBeenCalledWith(
        'test@example.com',
        'password123',
      );
    });

    it('should throw error for user not found', async () => {
      const error: any = {
        code: 'auth/user-not-found',
        message: 'User not found',
      };

      mockedAuth.signInWithEmailAndPassword.mockRejectedValue(error);

      await expect(
        authService.signIn('test@example.com', 'password123'),
      ).rejects.toThrow('Usuário não encontrado');
    });

    it('should throw error for wrong password', async () => {
      const error: any = {
        code: 'auth/wrong-password',
        message: 'Wrong password',
      };

      mockedAuth.signInWithEmailAndPassword.mockRejectedValue(error);

      await expect(
        authService.signIn('test@example.com', 'wrongpassword'),
      ).rejects.toThrow('Senha incorreta');
    });

    it('should throw error for invalid email', async () => {
      const error: any = {
        code: 'auth/invalid-email',
        message: 'Invalid email',
      };

      mockedAuth.signInWithEmailAndPassword.mockRejectedValue(error);

      await expect(
        authService.signIn('invalid', 'password123'),
      ).rejects.toThrow('Email inválido');
    });

    it('should throw generic error for other errors', async () => {
      const error: any = {
        code: 'auth/unknown-error',
        message: 'Unknown error',
      };

      mockedAuth.signInWithEmailAndPassword.mockRejectedValue(error);

      await expect(
        authService.signIn('test@example.com', 'password123'),
      ).rejects.toThrow('Unknown error');
    });

    it('should throw default error message when error has no message', async () => {
      const error: any = {
        code: 'auth/unknown-error',
      };

      mockedAuth.signInWithEmailAndPassword.mockRejectedValue(error);

      await expect(
        authService.signIn('test@example.com', 'password123'),
      ).rejects.toThrow('Erro ao fazer login');
    });
  });

  describe('signOut', () => {
    it('should sign out successfully', async () => {
      mockedAuth.signOut.mockResolvedValue(undefined);

      await authService.signOut();

      expect(mockedAuth.signOut).toHaveBeenCalled();
    });

    it('should throw error on sign out failure', async () => {
      const error: any = {
        message: 'Sign out failed',
      };

      mockedAuth.signOut.mockRejectedValue(error);

      await expect(authService.signOut()).rejects.toThrow('Sign out failed');
    });

    it('should throw default error message when error has no message', async () => {
      const error: any = {};

      mockedAuth.signOut.mockRejectedValue(error);

      await expect(authService.signOut()).rejects.toThrow('Erro ao fazer logout');
    });
  });

  describe('getCurrentUser', () => {
    it('should return current user when logged in', () => {
      const mockUser = {
        uid: '123',
        email: 'test@example.com',
      };

      mockedAuth.currentUser = mockUser as any;

      const result = authService.getCurrentUser();

      expect(result).toEqual(mockUser);
    });

    it('should return null when not logged in', () => {
      mockedAuth.currentUser = null;

      const result = authService.getCurrentUser();

      expect(result).toBeNull();
    });
  });

  describe('onAuthStateChanged', () => {
    it('should return unsubscribe function', () => {
      const unsubscribe = jest.fn();
      const callback = jest.fn();

      mockedAuth.onAuthStateChanged.mockReturnValue(unsubscribe);

      const result = authService.onAuthStateChanged(callback);

      expect(result).toBe(unsubscribe);
      expect(mockedAuth.onAuthStateChanged).toHaveBeenCalledWith(callback);
    });
  });
});

