import { playAudio } from '../../src/utils/audio';
import Sound from 'react-native-sound';

const mockSoundInstance = {
  play: jest.fn((playCallback) => {
    if (playCallback) {
      playCallback(true);
    }
    return mockSoundInstance;
  }),
  release: jest.fn(),
};

jest.mock('react-native-sound', () => {
  const SoundMock = jest.fn().mockImplementation((url, _, callback) => {
    // Simulate successful loading
    if (callback) {
      setTimeout(() => callback(null), 0);
    }
    return mockSoundInstance;
  });

  SoundMock.setCategory = jest.fn();

  return SoundMock;
});

describe('playAudio', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should play audio successfully', async () => {
    const audioUrl = 'https://example.com/audio.mp3';

    await playAudio(audioUrl);

    expect(Sound).toHaveBeenCalledWith(
      audioUrl,
      '',
      expect.any(Function),
    );
  });

  it('should reject when audio URL is empty', async () => {
    await expect(playAudio('')).rejects.toThrow('No audio URL provided');
  });

  it('should reject when audio URL is null', async () => {
    await expect(playAudio(null as any)).rejects.toThrow('No audio URL provided');
  });

  it('should handle sound loading error', async () => {
    const error = new Error('Failed to load sound');
    (Sound as jest.Mock).mockImplementationOnce((url, _, callback) => {
      const mockSound = {
        play: jest.fn(),
        release: jest.fn(),
      };

      if (callback) {
        setTimeout(() => callback(error), 0);
      }

      return mockSound;
    });

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    await expect(playAudio('https://example.com/audio.mp3')).rejects.toEqual(error);

    expect(consoleErrorSpy).toHaveBeenCalledWith('Error loading sound:', error);

    consoleErrorSpy.mockRestore();
  });

  it('should handle playback failure', async () => {
    (Sound as jest.Mock).mockImplementationOnce((url, _, callback) => {
      const mockSound = {
        play: jest.fn((playCallback) => {
          if (playCallback) {
            playCallback(false); // Playback failed
          }
          return mockSound;
        }),
        release: jest.fn(),
      };

      if (callback) {
        setTimeout(() => callback(null), 0);
      }

      return mockSound;
    });

    await expect(playAudio('https://example.com/audio.mp3')).rejects.toThrow(
      'Playback failed',
    );
  });

  it('should release sound after successful playback', async () => {
    const mockRelease = jest.fn();
    (Sound as jest.Mock).mockImplementationOnce((url, _, callback) => {
      const mockSound = {
        play: jest.fn((playCallback) => {
          if (playCallback) {
            playCallback(true);
          }
          return mockSound;
        }),
        release: mockRelease,
      };

      if (callback) {
        setTimeout(() => callback(null), 0);
      }

      return mockSound;
    });

    await playAudio('https://example.com/audio.mp3');

    expect(mockRelease).toHaveBeenCalled();
  });

  it('should release sound after failed playback', async () => {
    const mockRelease = jest.fn();
    (Sound as jest.Mock).mockImplementationOnce((url, _, callback) => {
      const mockSound = {
        play: jest.fn((playCallback) => {
          if (playCallback) {
            playCallback(false);
          }
          return mockSound;
        }),
        release: mockRelease,
      };

      if (callback) {
        setTimeout(() => callback(null), 0);
      }

      return mockSound;
    });

    try {
      await playAudio('https://example.com/audio.mp3');
    } catch (error) {
      // Expected to throw
    }

    expect(mockRelease).toHaveBeenCalled();
  });
});

