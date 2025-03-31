import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Linking, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Home() {
  const [fullname, setFullName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFullName = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        const token = await AsyncStorage.getItem("authToken");

        if (userId && token) {
          const response = await fetch(`https://devapi-618v.onrender.com/api/user/${userId}`, {
            method: "GET",
            headers: {
              Authorization: `${token.trim()}`,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            throw new Error("Failed to fetch user profile.");
          }

          const data = await response.json();
          setFullName(data.fullname);
        } else {
          setFullName("Guest");
        }
      } catch (error) {
        setError("Failed to retrieve full name.");
      } finally {
        setLoading(false);
      }
    };
    fetchFullName();
  }, []);

  const links = [
    {
      title: "5 Tips for a Healthy Lifestyle",
      url: "https://healthmatters.nyp.org/habits-for-a-healthy-new-year/",
      image: require("../assets/images/adaptive-icon.png"),
    },
    {
      title: "The Importance of Regular Checkups",
      url: "https://mypvhc.com/importance-regular-check-ups/",
      image: require("../assets/images/adaptive-icon.png"),
    },
    {
      title: "How to Manage Stress Effectively",
      url: "https://example.com/manage-stress",
      image: require("../assets/images/adaptive-icon.png"),
    },
  ];

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0056b3" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileSection}>
        <Image source={require("../assets/images/adaptive-icon.png")} style={styles.avatar} />
        <Text style={styles.welcomeText}>Good day, {error ? "Guest" : fullname}!</Text>
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}

      {/* Upcoming Appointments */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
        <Text style={styles.viewAll}>View all</Text>
      </View>
      <View style={styles.hr} />

      <View style={styles.appointmentCard}>
        <Text style={styles.noAppointmentsText}>No upcoming appointments.</Text>
      </View>

      {/* Health Tips & News */}
      <Text style={styles.sectionTitle}>Health Tips & News</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} pagingEnabled contentContainerStyle={styles.scrollViewContent}>
        {links.map((item, index) => (
          <TouchableOpacity key={index} onPress={() => Linking.openURL(item.url)} style={styles.linkbox}>
            <Image source={item.image} style={styles.linkboxImage} />
            <View style={styles.linkboxTextWrapper}>
              <Text style={styles.linkboxTitle}>{item.title}</Text>
              <Text style={styles.linkboxSource}>Read More →</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5FCFF", paddingHorizontal: 15 }, 
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },

  /* Profile Section */
  profileSection: { 
    flexDirection: "row", 
    alignItems: "center", 
    marginVertical: 20, 
    padding: 15, 
    borderRadius: 10,
    backgroundColor: "#E3F2FD",
    shadowColor: "#000", 
    shadowOpacity: 0.1, 
    shadowRadius: 5, 
    elevation: 2,
  },
  avatar: { width: 60, height: 60, borderRadius: 30, marginRight: 15 },
  welcomeText: { fontSize: 20, fontWeight: "700", color: "#2C3E50" },

  /* Error Message */
  errorText: { fontSize: 16, color: "red", textAlign: "center", marginVertical: 10 },

  /* Section Headers */
  section: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginVertical: 10 },
  sectionTitle: { fontSize: 20, fontWeight: "700", color: "#2C3E50" },
  viewAll: { fontSize: 14, color: "#0056b3", fontWeight: "600" },

  /* Horizontal Rule */
  hr: { borderBottomColor: "#00000020", borderBottomWidth: 1, marginVertical: 10 },

  /* Upcoming Appointments */
  appointmentCard: {
    backgroundColor: "#E3F2FD",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  noAppointmentsText: { fontSize: 16, color: "#2C3E50", paddingVertical: 10 },
  
  /* Health Tips */
  scrollViewContent: { paddingHorizontal: 5, gap: 15, paddingBottom: 20, paddingTop: 20 },
  linkbox: {
    paddingBottom: 10,
    width: 220,
    backgroundColor: "#FFF",
    borderRadius: 10,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  linkboxImage: { width: "100%", height: 120, resizeMode: "cover" },
  linkboxTextWrapper: { padding: 10 },
  linkboxTitle: { fontSize: 16, fontWeight: "700", color: "#2C3E50" },
  linkboxSource: { fontSize: 14, color: "#007BFF", marginTop: 5 },
});
