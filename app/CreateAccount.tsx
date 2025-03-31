import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter, Stack } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";

export default function CreateAccount() {
  const router = useRouter();
  const [fullname, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const handleSignUp = async () => {
    if (!fullname.trim()) {
      Alert.alert("Error", "Full Name is required.");
      return;
    }
    if (!username.trim()) {
      Alert.alert("Error", "Username is required.");
      return;
    }
    if (password.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    setLoading(true);

    const payload = { fullname, username, password, type_id: 1 };

    try {
      const response = await axios.post(
        "https://devapi-618v.onrender.com/api/auth/register",
        payload
      );

      if (response.status === 200 || response.status === 201) {
        Alert.alert("Success", "Account created successfully.");
        router.push("/Signin"); // Redirect to the login page
      } else {
        Alert.alert(
          "Signup Failed",
          "An unexpected error occurred. Please try again."
        );
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("Error Details:", error.response?.data);
        if (axios.isAxiosError(error) && error.response) {
          Alert.alert(
            "Signup Failed",
            error.response.data?.message || "An error occurred during registration."
          );
        } else {
          Alert.alert("Signup Failed", "An unexpected error occurred.");
        }
      } else {
        console.log("Unexpected Error:", error);
        Alert.alert("Signup Failed", "An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
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
              <Text style={styles.med}> Med</Text>
            </View>

            <Text style={styles.sign}>Create Account</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Full Name</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your full name"
                  placeholderTextColor="#999"
                  value={fullname}
                  onChangeText={setFullName}
                  autoCapitalize="words"
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Username</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your username"
                  placeholderTextColor="#999"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                  autoComplete="username"
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Create a password</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="**********"
                  placeholderTextColor="#999"
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (text.length < 8) {
                      setPasswordError(
                        "Password must be at least 8 characters long."
                      );
                    } else {
                      setPasswordError(""); // Clear error if valid
                    }
                  }}
                  secureTextEntry={!passwordVisible}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setPasswordVisible(!passwordVisible)}
                >
                  <FontAwesome
                    name={passwordVisible ? "eye-slash" : "eye"}
                    size={20}
                    color="#777"
                  />
                </TouchableOpacity>
              </View>
              {passwordError ? (
                <Text style={styles.errorText}>{passwordError}</Text>
              ) : null}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Confirm password</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="**********"
                  placeholderTextColor="#999"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!confirmPasswordVisible}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() =>
                    setConfirmPasswordVisible(!confirmPasswordVisible)
                  }
                >
                  <FontAwesome
                    name={confirmPasswordVisible ? "eye-slash" : "eye"}
                    size={20}
                    color="#777"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.signUpButton, loading && styles.disabledButton]}
              onPress={handleSignUp}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Sign Up</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.signInRedirect}
              onPress={() => router.push("/Signin")}
            >
              <Text>
                Already have an account?{" "}
                <Text style={styles.loginText}>Log in</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
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
  logoContainer: { flexDirection: "row", justifyContent: "center" },
  naga: { fontSize: 28, fontWeight: "700", color: "#007bff" },
  med: { fontSize: 28, fontWeight: "700", color: "#28a745" },
  sign: { fontSize: 24, fontWeight: "bold", paddingLeft: 5, color: "#1170B3" },
  inputContainer: { marginBottom: 15 },
  label: { fontSize: 16, color: "#333", fontWeight: "500", marginBottom: 5 },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#F5F5F5",
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
    paddingHorizontal: 10,
    color: "#000",
  },
  signUpButton: {
    backgroundColor: "#28B6F6",
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },
  disabledButton: { backgroundColor: "#aaa" },
  buttonText: { color: "white", fontSize: 16, fontWeight: "bold" },
  signInRedirect: { marginTop: 20, alignSelf: "center" },
  loginText: { color: "#007bff", fontWeight: "bold" },
  errorText: { color: "red", fontSize: 14, marginTop: 5 },
});
