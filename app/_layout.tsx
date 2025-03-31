import { Stack, useRouter, useSegments } from "expo-router";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function Layout() {
  const router = useRouter();
  const segments = useSegments();

  const hideNavBar =
    segments.length === 0 ||
    segments[0] === "Signin" ||
    segments[0] === "CreateAccount" ||
    segments[0] === "ForgotPassword";

  const isHome = segments.length === 0 || segments[0] === "Home";

  return (
    <View style={styles.container}>
      {/* Header */}
      {!hideNavBar && (
        <LinearGradient colors={["#0056b3", "#28a745"]} style={styles.header}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => {
              if (isHome) {
                console.log("Open Notifications");
              } else {
                console.log("Back button pressed");
                router.back();
              }
            }}
          >
            <Ionicons
              name={isHome ? "notifications-outline" : "arrow-back"}
              size={30}
              color="#fff"
            />
          </TouchableOpacity>

          <Text style={styles.headerText}>
            Naga <Text style={styles.med}>Med</Text>
          </Text>

          <View style={styles.iconPlaceholder} />
        </LinearGradient>
      )}

      {/* Stack Navigation */}
      <View style={styles.content}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="Signin" />
          <Stack.Screen name="Home" />
          <Stack.Screen name="Profile" />
          <Stack.Screen name="Appointment" />
          <Stack.Screen name="Doctors" />
          <Stack.Screen name="Status" />
          <Stack.Screen name="CreateAppointment" />
        </Stack>
      </View>

      {/* Bottom Navigation Bar */}
      {!hideNavBar && (
        <LinearGradient colors={["#0056b3", "#28a745"]} style={styles.navBar}>
          <TouchableOpacity style={styles.navButton} onPress={() => router.push("/Home")}>
            <FontAwesome5 name="home" size={20} color="#fff" />
            <Text style={styles.navText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton} onPress={() => router.push("/Appointment")}>
            <FontAwesome5 name="calendar-alt" size={20} color="#fff" />
            <Text style={styles.navText}>Appointment</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton} onPress={() => router.push("/Status")}>
            <FontAwesome5 name="chart-line" size={20} color="#fff" />
            <Text style={styles.navText}>Status</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton} onPress={() => router.push("/Profile")}>
            <FontAwesome5 name="user" size={20} color="#fff" />
            <Text style={styles.navText}>Profile</Text>
          </TouchableOpacity>
        </LinearGradient>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 80,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "transparent",
    elevation: 3,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  med: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#34c759", // Light green to highlight "Med"
  },
  iconButton: {
    padding: 10,
  },
  iconPlaceholder: {
    width: 40, // Keeps layout balanced when no icon on the right
  },
  navBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    position: "absolute",
    bottom: 0,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "transparent",
    elevation: 5,
  },
  navButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  navText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 5,
  },
});
