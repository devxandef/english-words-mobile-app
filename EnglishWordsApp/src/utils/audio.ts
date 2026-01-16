import Sound from 'react-native-sound';

Sound.setCategory('Playback');

export const playAudio = (audioUrl: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!audioUrl) {
      reject(new Error('No audio URL provided'));
      return;
    }

    const sound = new Sound(audioUrl, '', (error) => {
      if (error) {
        console.error('Error loading sound:', error);
        reject(error);
        return;
      }

      sound.play((success) => {
        if (success) {
          sound.release();
          resolve();
        } else {
          sound.release();
          reject(new Error('Playback failed'));
        }
      });
    });
  });
};

