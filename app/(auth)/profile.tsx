import { View, Button, StyleSheet } from "react-native";
import { useAuth } from '@clerk/clerk-expo';
const Profile = () => {
  const { signOut } = useAuth();
  const logout = async () => {
    signOut();
  };

  return (
    <View style={styles.container}>

      <Button onPress={logout} title="Logout" color={"#6c47ff"} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 40,
  },
  inputField: {
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderColor: "#6c47ff",
    borderRadius: 4,
    padding: 10,
    backgroundColor: "#fff",
  },
});

export default Profile;
