import { Image, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { useUser } from '@clerk/clerk-expo';
import { supabase } from '../../utils/SupabaseConfig';
import VideoPlayer from '../../components/x';

const Home = () => {

  
  return (
    <View className="flex-1 items-center justify-center bg-white">
      {/* <VideoPlayer /> */}
    </View>
  );
};

export default Home;
