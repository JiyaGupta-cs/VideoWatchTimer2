import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { Slot, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import '../global.css';
import { createTable } from "../utils/db";
import { downloadVideo } from "../utils/videoDownloader";
const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;
const VIDEO_LIST = [
  { id: 'video_1', url: 'https://example.com/video1.mp4' },
  { id: 'video_2', url: 'https://example.com/video2.mp4' },
  { id: 'video_3', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'}
];
const InitialLayout = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    console.log("Auth State Changed:", { isSignedIn });

    if (isSignedIn) {
      router.replace("/home");
    } else {
      router.replace("/login");
    }
  }, [isLoaded, isSignedIn]);
  useEffect(() => {
    (async () => {
      await createTable();

      // Download all videos
      for (const video of VIDEO_LIST) {
        await downloadVideo(video.id, video.url);
      }
    })();
  }, []);
  return <Slot />;
};

const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

const RootLayout = () => {
  return (
    <ClerkProvider
      publishableKey={CLERK_PUBLISHABLE_KEY}
      tokenCache={tokenCache}
    >
      <InitialLayout />
    </ClerkProvider>
  );
};

export default RootLayout;
