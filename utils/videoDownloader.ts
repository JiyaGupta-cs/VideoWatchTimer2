import * as FileSystem from 'expo-file-system';

// Directory where videos will be stored
const VIDEO_DIR = FileSystem.documentDirectory + 'videos/';

export const downloadVideo = async (videoId: string, videoUrl: string) => {
  try {
    // Ensure the directory exists
    const dirInfo = await FileSystem.getInfoAsync(VIDEO_DIR);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(VIDEO_DIR, { intermediates: true });
    }

    const fileUri = VIDEO_DIR + videoId + '.mp4';
    const fileExists = await FileSystem.getInfoAsync(fileUri);

    if (!fileExists.exists) {
      console.log(`Downloading ${videoId}...`);
      await FileSystem.downloadAsync(videoUrl, fileUri);
      console.log(`Downloaded ${videoId} to ${fileUri}`);
    } else {
      console.log(`${videoId} already exists locally.`);
    }

    return fileUri;
  } catch (error) {
    console.error('Error downloading video:', error);
    return null;
  }
};

// Get local video URI
export const getVideoUri = async (videoId: string) => {
  const fileUri = VIDEO_DIR + videoId + '.mp4';
  const fileExists = await FileSystem.getInfoAsync(fileUri);
  return fileExists.exists ? fileUri : null;
};
