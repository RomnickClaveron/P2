import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome5 } from "@expo/vector-icons";

export default function Status() {
  const [fullname, setFullName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const appointments = [
    { id: 1, doctor: "Dr. John Doe", specialty: "Cardiologist", status: "Confirmed", date: "March 30, 2025", time: "10:00 AM" },
    { id: 2, doctor: "Dr. Jane Smith", specialty: "Neurologist", status: "Pending", date: "April 2, 2025", time: "2:00 PM" },
    { id: 3, doctor: "Dr. Emily White", specialty: "Dermatologist", status: "Cancelled", date: "April 5, 2025", time: "4:30 PM" },
  ];

  useEffect(() => {
    const fetchFullName = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        const token = await AsyncStorage.getItem("authToken");

        if (userId && token) {
          const response = await fetch(`https://devapi-618v.onrender.com/api/user/${userId}`, {
            method: "GET",
            headers: { Authorization: `${token.trim()}`, Accept: "application/json", "Content-Type": "application/json" },
          });

          if (!response.ok) throw new Error("Failed to fetch user profile.");
          const data = await response.json();
          setFullName(data.fullname);
        } else setFullName("Guest");
      } catch {
        setError("Failed to retrieve full name.");
      } finally {
        setLoading(false);
      }
    };
    fetchFullName();
  }, []);

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#007BFF" /><Text>Loading...</Text></View>;

  return (
    <View style={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileCard}>
        <Image source={require("../assets/images/healthrecords.png")} style={styles.avatar} />
        <View>
          <Text style={styles.greeting}>Hello, {error ? "Guest" : fullname}!</Text>
          <Text style={styles.info}>Check the status of your appointments below.</Text>
        </View>
      </View>

      {error && <Text style={styles.error}>{error}</Text>}

      {/* Appointment List */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {appointments.map((appt) => (
          <View key={appt.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <FontAwesome5 name="user-md" size={20} color="#007BFF" />
              <View style={styles.details}>
                <Text style={styles.cardTitle}>{appt.doctor}</Text>
                <Text style={styles.cardSubText}>{appt.specialty}</Text>
              </View>
              <View style={[styles.statusBadge, statusStyles[appt.status.toLowerCase()]]}>
                <Text style={styles.statusText}>{appt.status}</Text>
              </View>
            </View>
            <View style={styles.schedule}>
              <View style={styles.scheduleItem}>
                <FontAwesome5 name="calendar" size={14} color="#2C3E50" />
                <Text style={styles.scheduleText}>{appt.date}</Text>
              </View>
              <View style={styles.scheduleItem}>
                <FontAwesome5 name="clock" size={14} color="#2C3E50" />
                <Text style={styles.scheduleText}>{appt.time}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Book New Appointment Button */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Book New Appointment</Text>
        <FontAwesome5 name="plus" size={15} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
}

const COLORS = {
  primary: "#007BFF",
  confirmed: "#28A745",
  pending: "#FF8C00",
  cancelled: "#DC3545",
  text: "#2C3E50",
  background: "#F5FCFF",
  card: "#FFFFFF",
};

const statusStyles: Record<string, any> = {
  confirmed: { backgroundColor: COLORS.confirmed },
  pending: { backgroundColor: COLORS.pending },
  cancelled: { backgroundColor: COLORS.cancelled },
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, paddingHorizontal: 15, alignItems: "center" },
  center: { flexGrow: 1, alignItems: "center", justifyContent: "center" },
  scrollContainer: { paddingTop: 10, paddingBottom: 20 },

  /* Profile Section */
  profileCard: { 
    flexDirection: "row", 
    alignItems: "center", 
    backgroundColor: COLORS.card, 
    padding: 20, 
    borderRadius: 10, 
    width: "100%", 
    marginTop: 20 
  },
  avatar: { width: 60, height: 60, borderRadius: 30, marginRight: 15 },
  greeting: { fontSize: 20, fontWeight: "700", color: COLORS.text },
  info: { fontSize: 13, color: "#555", marginTop: 3 },

  /* Error Message */
  error: { fontSize: 16, color: "red", textAlign: "center", marginVertical: 10 },

  /* Appointment Cards */
  card: { 
    backgroundColor: COLORS.card, 
    borderRadius: 10, 
    padding: 15, 
    marginBottom: 15, 
    shadowColor: "#000", 
    shadowOpacity: 0.1, 
    shadowRadius: 5, 
    elevation: 3, 
    width: "100%", 
    maxWidth: 350 
  },
  cardHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  details: { flex: 1, marginLeft: 5 },
  cardTitle: { fontSize: 18, fontWeight: "bold", color: COLORS.text },
  cardSubText: { fontSize: 14, color: "#555", marginVertical: 5 },

  /* Status Badge */
  statusBadge: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 20 },
  statusText: { fontSize: 14, fontWeight: "bold", color: "#FFF" },

  /* Schedule */
  schedule: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  scheduleItem: { flexDirection: "row", alignItems: "center" },
  scheduleText: { marginLeft: 5, fontSize: 14, color: COLORS.text },

  /* Button */
  button: { 
    flexDirection: "row", 
    backgroundColor: COLORS.primary, 
    padding: 12, 
    borderRadius: 10, 
    alignItems: "center", 
    justifyContent: "center", 
    width: "100%", 
    maxWidth: 350, 
    marginTop: 20 
  },
  buttonText: { color: COLORS.card, fontSize: 16, fontWeight: "bold", marginRight: 8 },
});
