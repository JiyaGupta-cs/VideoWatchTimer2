import { Image, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { useUser } from '@clerk/clerk-expo';
import { supabase } from '../../utils/SupabaseConfig';

const Home = () => {
  const { user } = useUser();

  useEffect(() => {
    updateProfileImage();
  }, []);

  const updateProfileImage = async () => {
    const { data, error } = await supabase
      .from('Users')
      .update({ profileImage: user?.imageUrl })
      .eq('email', user?.emailAddresses[0].emailAddress)
      .is('profileImage', null)
      .select();
    console.log(data, error);
  };
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text>Welcome, {user?.emailAddresses[0].emailAddress} 🎉</Text>
    </View>
  );
};

export default Home;
