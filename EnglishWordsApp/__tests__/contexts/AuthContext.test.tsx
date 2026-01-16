import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { AuthProvider, useAuth } from '../../src/contexts/AuthContext';
import { authService } from '../../src/services/auth';
import { storageService } from '../../src/services/storage';

jest.mock('../../src/services/auth');
jest.mock('../../src/services/storage');

const mockedAuthService = authService as jest.Mocked<typeof authService>;
const mockedStorageService = storageService as jest.Mocked<typeof storageService>;

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useAuth', () => {
    it('should throw error when used outside AuthProvider', () => {
      // Suppress console.error for this test
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      expect(() => {
        renderHook(() => useAuth());
      }).toThrow('useAuth must be used within an AuthProvider');

      consoleErrorSpy.mockRestore();
    });

    it('should provide auth context when used inside AuthProvider', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current).toBeDefined();
      expect(result.current).toHaveProperty('user');
      expect(result.current).toHaveProperty('loading');
      expect(result.current).toHaveProperty('signIn');
      expect(result.current).toHaveProperty('signUp');
      expect(result.current).toHaveProperty('signOut');
    });
  });

  describe('AuthProvider', () => {
    it('should initialize with null user and loading true', async () => {
      let authStateCallback: ((user: any) => void) | null = null;
      const unsubscribe = jest.fn();

      mockedAuthService.onAuthStateChanged.mockImplementation((callback) => {
        authStateCallback = callback;
        // Call immediately with null
        setTimeout(() => callback(null), 0);
        return unsubscribe;
      });

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      // Initially loading should be true
      expect(result.current.loading).toBe(true);

      // Wait for auth state to be set
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });

    it('should set user when auth state changes to logged in', async () => {
      const mockUser = {
        uid: '123',
        email: 'test@example.com',
      } as any;

      let authStateCallback: ((user: any) => void) | null = null;
      const unsubscribe = jest.fn();

      mockedAuthService.onAuthStateChanged.mockImplementation((callback) => {
        authStateCallback = callback;
        return unsubscribe;
      });

      mockedStorageService.loadFromFirestore.mockResolvedValue({
        favorites: [],
        history: [],
      });

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        if (authStateCallback) {
          authStateCallback(mockUser);
        }
      });

      await waitFor(() => {
        expect(result.current.user).toEqual(mockUser);
        expect(result.current.loading).toBe(false);
      });

      expect(mockedStorageService.setUserId).toHaveBeenCalledWith('123');
      expect(mockedStorageService.loadFromFirestore).toHaveBeenCalled();
    });

    it('should clear user when auth state changes to logged out', async () => {
      let authStateCallback: ((user: any) => void) | null = null;
      const unsubscribe = jest.fn();

      mockedAuthService.onAuthStateChanged.mockImplementation((callback) => {
        authStateCallback = callback;
        return unsubscribe;
      });

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        if (authStateCallback) {
          authStateCallback(null);
        }
      });

      await waitFor(() => {
        expect(result.current.user).toBeNull();
        expect(result.current.loading).toBe(false);
      });

      expect(mockedStorageService.setUserId).toHaveBeenCalledWith(null);
    });

    it('should handle error when loading from Firestore', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      const mockUser = {
        uid: '123',
        email: 'test@example.com',
      } as any;

      let authStateCallback: ((user: any) => void) | null = null;
      const unsubscribe = jest.fn();

      mockedAuthService.onAuthStateChanged.mockImplementation((callback) => {
        authStateCallback = callback;
        return unsubscribe;
      });

      mockedStorageService.loadFromFirestore.mockRejectedValue(
        new Error('Firestore error'),
      );

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        if (authStateCallback) {
          authStateCallback(mockUser);
        }
      });

      await waitFor(() => {
        expect(result.current.user).toEqual(mockUser);
        expect(result.current.loading).toBe(false);
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error loading data from Firestore:',
        expect.any(Error),
      );

      consoleErrorSpy.mockRestore();
    });
  });

  describe('signIn', () => {
    it('should call authService.signIn', async () => {
      let authStateCallback: ((user: any) => void) | null = null;
      const unsubscribe = jest.fn();

      mockedAuthService.onAuthStateChanged.mockImplementation((callback) => {
        authStateCallback = callback;
        setTimeout(() => callback(null), 0);
        return unsubscribe;
      });

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      mockedAuthService.signIn.mockResolvedValue({} as any);

      await act(async () => {
        await result.current.signIn('test@example.com', 'password123');
      });

      expect(mockedAuthService.signIn).toHaveBeenCalledWith(
        'test@example.com',
        'password123',
      );
    });
  });

  describe('signUp', () => {
    it('should call authService.signUp', async () => {
      let authStateCallback: ((user: any) => void) | null = null;
      const unsubscribe = jest.fn();

      mockedAuthService.onAuthStateChanged.mockImplementation((callback) => {
        authStateCallback = callback;
        setTimeout(() => callback(null), 0);
        return unsubscribe;
      });

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      mockedAuthService.signUp.mockResolvedValue({} as any);

      await act(async () => {
        await result.current.signUp('test@example.com', 'password123');
      });

      expect(mockedAuthService.signUp).toHaveBeenCalledWith(
        'test@example.com',
        'password123',
      );
    });
  });

  describe('signOut', () => {
    it('should sync data to Firestore before signing out', async () => {
      const mockUser = {
        uid: '123',
        email: 'test@example.com',
      } as any;

      let authStateCallback: ((user: any) => void) | null = null;
      const unsubscribe = jest.fn();

      mockedAuthService.onAuthStateChanged.mockImplementation((callback) => {
        authStateCallback = callback;
        return unsubscribe;
      });

      mockedStorageService.loadFromFirestore.mockResolvedValue({
        favorites: [],
        history: [],
      });

      mockedStorageService.syncToFirestore.mockResolvedValue();
      mockedAuthService.signOut.mockResolvedValue();

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        if (authStateCallback) {
          authStateCallback(mockUser);
        }
      });

      await waitFor(() => {
        expect(result.current.user).toEqual(mockUser);
      });

      await act(async () => {
        await result.current.signOut();
      });

      expect(mockedStorageService.syncToFirestore).toHaveBeenCalled();
      expect(mockedAuthService.signOut).toHaveBeenCalled();
      expect(mockedStorageService.setUserId).toHaveBeenCalledWith(null);
    });

    it('should handle sync error gracefully', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      const mockUser = {
        uid: '123',
        email: 'test@example.com',
      } as any;

      let authStateCallback: ((user: any) => void) | null = null;
      const unsubscribe = jest.fn();

      mockedAuthService.onAuthStateChanged.mockImplementation((callback) => {
        authStateCallback = callback;
        return unsubscribe;
      });

      mockedStorageService.loadFromFirestore.mockResolvedValue({
        favorites: [],
        history: [],
      });

      mockedStorageService.syncToFirestore.mockRejectedValue(
        new Error('Sync error'),
      );
      mockedAuthService.signOut.mockResolvedValue();

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        if (authStateCallback) {
          authStateCallback(mockUser);
        }
      });

      await waitFor(() => {
        expect(result.current.user).toEqual(mockUser);
      });

      await act(async () => {
        await result.current.signOut();
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error syncing data before logout:',
        expect.any(Error),
      );
      expect(mockedAuthService.signOut).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });

    it('should sign out even when user is null', async () => {
      let authStateCallback: ((user: any) => void) | null = null;
      const unsubscribe = jest.fn();

      mockedAuthService.onAuthStateChanged.mockImplementation((callback) => {
        authStateCallback = callback;
        setTimeout(() => callback(null), 0);
        return unsubscribe;
      });

      mockedAuthService.signOut.mockResolvedValue();

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.signOut();
      });

      expect(mockedStorageService.syncToFirestore).not.toHaveBeenCalled();
      expect(mockedAuthService.signOut).toHaveBeenCalled();
    });
  });
});

