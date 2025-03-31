import { Text, View, TouchableOpacity, StyleSheet, Image, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

const windowWidth = Dimensions.get("window").width;

export default function Index() {
  const router = useRouter();

  const handleSignIn = () => {
    router.push("/Signin");
  };

  const handleSignUp = () => {
    router.push("/CreateAccount");
  };

  return (
    <LinearGradient colors={["#1170B3", "#82C45C"]} style={styles.gradientBackground}>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image
            source={require("../assets/images/NagaMedLogo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.signInButton, styles.signUpButton]} onPress={handleSignUp}>
            <Text style={styles.signUpButtonText}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    width: "100%",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 60,
  },
  logo: {
    maxWidth: 300,
    maxHeight: 300,
    borderRadius: 16,
  },
  buttonContainer: {
    width: "100%",
    gap: 16,
  },
  signInButton: {
    backgroundColor: "#28B6F6",
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  signUpButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#28B6F6",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  signUpButtonText: {
    color: "#28B6F6",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
