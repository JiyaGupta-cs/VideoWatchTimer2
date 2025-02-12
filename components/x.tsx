import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Video } from 'expo-av';
import { saveWatchTime } from '../utils/db';

interface VideoPlayerProps {
  videoId: string;
  videoPath: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoId, videoPath }) => {
  const [watchTime, setWatchTime] = useState(0);

  return (
    <View style={styles.container}>
      <Text>Playing: {videoId}</Text>
      <Video
        source={{ uri: videoPath }}
        style={styles.video}
        useNativeControls
        // onPlaybackStatusUpdate={status => {
        //   if (status.positionMillis) {
        //     setWatchTime(status.positionMillis);
        //   }
        //   if (status.didJustFinish) {
        //     saveWatchTime(videoId, watchTime);
        //   }
        // }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center', marginTop: 20 },
  video: { width: 300, height: 200 },
});

export default VideoPlayer;
