import { ActivityIndicator, View } from 'react-native';
import { useEffect } from 'react';
import { createTable } from '../utils/db';
const StartPage = () => {
  useEffect(() => {
    (async () => {
      console.log('Creating Table...................');
      await createTable();
    })();
  }, []);
  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
};

export default StartPage;
