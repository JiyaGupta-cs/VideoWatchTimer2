import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Pressable } from 'react-native';
import { useAuth } from '@clerk/clerk-expo';

export const LogoutButton = () => {
  const { signOut } = useAuth();

  const doLogout = () => {
    signOut();
  };

  return (
    <Pressable onPress={doLogout} style={{ marginRight: 10 }}>
      <Ionicons name="log-out-outline" size={24} color={'#fff'} />
    </Pressable>
  );
};

const TabsPage = () => {
  const { isSignedIn } = useAuth();

  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: '#6c47ff',
        },
        headerShown: false,
        headerTintColor: '#fff',
        tabBarStyle: { height: 52 },
      }}>
      <Tabs.Screen
        name="home"
        options={{
          headerTitle: 'Home',
          tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
          tabBarLabel: 'Home',
        }}
        redirect={!isSignedIn}
      />
      <Tabs.Screen
        name="explore"
        options={{
          headerTitle: 'Explore',
          tabBarIcon: ({ color, size }) => <Ionicons name="compass-outline" size={size} color={color} />,
          tabBarLabel: 'Explore',
        }}
        redirect={!isSignedIn}
      />
      <Tabs.Screen
        name="create"
        options={{
          headerTitle: 'Create',
          tabBarIcon: ({ color, size }) => <Ionicons name="add-circle-outline" size={size} color={color} />,
          tabBarLabel: 'Create',
        }}
        redirect={!isSignedIn}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerTitle: 'My Profile',
          tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />,
          tabBarLabel: 'My Profile',
          headerRight: () => <LogoutButton />,
        }}
        redirect={!isSignedIn}
      />
    </Tabs>
  );
};

export default TabsPage;
