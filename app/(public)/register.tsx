import * as React from 'react';
import {
  Button,
  TextInput,
  View,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import { useState } from "react";
import { Stack } from "expo-router";
import { supabase } from '../../utils/SupabaseConfig';

const Register = () => {
  const { isLoaded, signUp, setActive } = useSignUp();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  // Create the user and send the verification email
  const onSignUpPress = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      setLoading(true);
      // Create the user on Clerk
      await signUp.create({
        emailAddress,
        password,
        firstName,
        lastName,
        username
      });

      // Send verification Email
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // change the UI to verify the email address
      setPendingVerification(true);
    } catch (err: any) {
      alert(err.errors[0].message);
    } finally {
      setLoading(false);
    }
  };

  // Verify the email address
  const onPressVerify = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      setLoading(true);
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        if (signUp?.emailAddress) {

          const { data, error } = await supabase
            .from('Users')
            .insert([
              { name: signUp?.firstName,email : signUp?.emailAddress, username: signUp?.username },
            ])
            .select()


          if (data) {
            console.log(data);
          }
          if (error) {
            console.log(error);
          }

        }
      } else {
        console.log("Sign up status:", completeSignUp.status);
      }
    } catch (err: any) {
      alert(err.errors[0].message);
    } finally {
      setLoading(false);
    }
  };

  // Don't render the form until Clerk is loaded
  if (!isLoaded) {
    return (
      <View style={[styles.container, styles.spinnerContainer]}>
        <ActivityIndicator size="large" color="#6c47ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerBackVisible: !pendingVerification }} />
      {loading && (
        <View style={styles.spinnerContainer}>
          <ActivityIndicator size="large" color="#6c47ff" />
        </View>
      )}

      {!pendingVerification && (
        <>

          <TextInput
            autoCapitalize="none"
            placeholder="Enter your first name"
            value={firstName}
            onChangeText={setFirstName}
            style={styles.inputField}
            keyboardType="name-phone-pad"
            autoComplete="cc-given-name"
            autoCorrect={false}
            returnKeyType="next"
            textContentType="givenName"
          />
          <TextInput
            autoCapitalize="none"
            placeholder="Enter your last name"
            value={lastName}
            onChangeText={setLastName}
            style={styles.inputField}
            keyboardType="name-phone-pad"
            autoComplete="cc-family-name"
            autoCorrect={false}
            returnKeyType="next"
            textContentType="familyName"
          />
          <TextInput
            autoCapitalize="none"
            placeholder="Pick a username"
            value={username}
            onChangeText={setUsername}
            style={styles.inputField}
            keyboardType="name-phone-pad"
            autoComplete="username"
            autoCorrect={false}
            returnKeyType="next"
            textContentType="username"
          />
          <TextInput
            autoCapitalize="none"
            placeholder="Enter your email address"
            value={emailAddress}
            onChangeText={setEmailAddress}
            style={styles.inputField}
            keyboardType="email-address"
            autoComplete="email"
            autoCorrect={false}
            returnKeyType="next"
            textContentType="emailAddress"
          />
          <TextInput
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.inputField}
            autoCapitalize="none"
            autoComplete="password"
            autoCorrect={false}
            returnKeyType="done"
            textContentType="newPassword"
          />

          <Button onPress={onSignUpPress} title="Sign up" color={"#6c47ff"} />
        </>
      )}

      {pendingVerification && (
        <>
          <View>
            <TextInput
              value={code}
              placeholder="Code..."
              style={styles.inputField}
              onChangeText={setCode}
              keyboardType="number-pad"
              autoComplete="one-time-code"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
              maxLength={6}
            />
          </View>
          <Button
            onPress={onPressVerify}
            title="Verify Email"
            color={"#6c47ff"}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
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
  button: {
    margin: 8,
    alignItems: "center",
  },
  spinnerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Register;
