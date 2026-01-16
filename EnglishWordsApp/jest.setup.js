// Mock React Native modules
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

jest.mock('@react-native-firebase/auth', () => {
  return jest.fn(() => ({
    createUserWithEmailAndPassword: jest.fn(),
    signInWithEmailAndPassword: jest.fn(),
    signOut: jest.fn(),
    currentUser: null,
    onAuthStateChanged: jest.fn(() => jest.fn()),
  }));
});

const mockFieldValue = {
  serverTimestamp: jest.fn(() => 'server-timestamp'),
};

jest.mock('@react-native-firebase/firestore', () => {
  const createMockDoc = () => ({
    get: jest.fn(),
    set: jest.fn(),
    collection: jest.fn(() => createMockCollection()),
  });

  const createMockCollection = () => ({
    doc: jest.fn(() => createMockDoc()),
    collection: jest.fn(() => createMockCollection()),
  });

  const mockFirestoreFunction = jest.fn(() => ({
    collection: jest.fn(() => createMockCollection()),
    batch: jest.fn(() => ({
      set: jest.fn(),
      commit: jest.fn(),
    })),
  }));

  // Add FieldValue as a static property
  mockFirestoreFunction.FieldValue = mockFieldValue;

  return mockFirestoreFunction;
});

jest.mock('react-native-sound', () => {
  const SoundMock = jest.fn().mockImplementation(() => ({
    play: jest.fn((callback) => {
      if (callback) callback(true);
    }),
    release: jest.fn(),
  }));

  SoundMock.setCategory = jest.fn();

  return SoundMock;
});

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

