import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useRouter, Stack } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { jwtDecode } from "jwt-decode"; // Corrected import for jwtDecode

export default function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleSignIn = async () => {
    console.log("Signing in with:", username, password);

    try {
      const response = await fetch("https://devapi-618v.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      console.log("API Response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Invalid credentials");
      }

      const { token } = data;
      if (!token) {
        throw new Error("Missing token in response");
      }

      // Decode token and store `id`
      const decodedToken = jwtDecode(token);
      console.log("Decoded Token:", decodedToken);

      const userId = decodedToken.id; // Use `id` instead of `userId`
      if (!userId) {
        throw new Error("Missing `id` in token");
      }

      // Store `id` and `token` in AsyncStorage
      await AsyncStorage.setItem("userId", String(userId));
      await AsyncStorage.setItem("authToken", token);

      Alert.alert("Login Successful", "Welcome back!", [
        { text: "OK", onPress: () => router.push("/Home") },
      ]);

      router.push("/Home");
    } catch (error) {
      console.error("Error logging in:", error.message);
      setErrorMessage(error.message || "Network error. Please try again.");
    }
  };

  return (
    <>
      <Stack.Screen />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <LinearGradient
          colors={["#1170B3", "#82C45C"]}
          style={styles.gradientBackground}
        >
          <View style={styles.formContainer}>
            <View style={styles.logoContainer}>
              <Text style={styles.naga}>Naga</Text>
              <Text style={styles.med}>Med</Text>
            </View>

            <Text style={styles.sign}>Sign In</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Username</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your username"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoComplete="username"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
              />
            </View>

            {/* Error Message */}
            {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

            <TouchableOpacity
              style={styles.forgotPassword}
              onPress={() => router.push("/ForgotPassword")}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
              <Text style={styles.buttonText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </KeyboardAvoidingView>
    </>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  formContainer: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  logoContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  naga: {
    fontSize: 50,
    fontWeight: "bold",
    color: "#1170B3",
  },
  med: {
    fontSize: 50,
    fontWeight: "bold",
    color: "#82C45C",
  },
  sign: {
    fontSize: 24,
    fontWeight: "bold",
    paddingLeft: 5,
    color: "#1170B3",
    marginBottom: 16,
    textAlign: "center",
  },
  inputContainer: {
    gap: 8,
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: "#F5F5F5",
  },
  signInButton: {
    backgroundColor: "#28B6F6",
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  forgotPassword: {
    alignSelf: "flex-end",
  },
  forgotPasswordText: {
    color: "#28B6F6",
    fontSize: 14,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: 10,
    textAlign: "center",
  },
});
