import { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useEventListener } from 'expo';
import { getVideoUri } from '../../utils/videoDownloader';
import { saveWatchData } from '../../utils/db';

const videoId = 'video_3';

export default function VideoScreen() {
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [watchTime, setWatchTime] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isCompleted, setIsCompleted] = useState(false);

  const player = useVideoPlayer(videoUri, (player) => {
    player.loop = false;
    player.play();
    player.timeUpdateEventInterval = 1;
  });

  useEventListener(player, "timeUpdate", (payload) => {
    console.log("Player time update: ", payload.currentTime);
    setWatchTime(payload.currentTime);
  });

  useEventListener(player, "playbackRateChange", (payload) => {
    console.log("Player time update: ", payload.playbackRate);
    setPlaybackRate(payload.playbackRate);
  });

  // useEventListener(player, "playToEnd",(payload) => {
  //   console.log("Player completed: ", payload);
  //   setIsCompleted(true);
  // });

  useEffect(() => {
    (async () => {
      const uri = await getVideoUri(videoId);
      setVideoUri(uri);
    })();
  }, []);

  useEffect(() => {
    saveWatchData(videoId, watchTime, playbackRate, isCompleted);
    console.log('Saving watch data: ', watchTime, playbackRate, isCompleted);
  }, [watchTime, playbackRate, isCompleted]);

  return (
    <SafeAreaView edges={["left", "right"]} style={styles.contentContainer}>
      <View>
        {videoUri ? (
          <VideoView style={styles.vwVideo} player={player} />
        ) : (
          <Text>Loading video...</Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,.2)",
    alignItems: "center",
  },
  vwVideo: {
    width: Dimensions.get("window").width,
    height: 300,
  },
});
