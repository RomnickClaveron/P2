import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome5 } from "@expo/vector-icons";

export default function Appointment() {
  const [appointments, setAppointments] = useState([
    { id: 1, doctor: "Dr. Jane Smith", specialty: "Neurologist", status: "Pending", date: "2025-04-02", time: "2:00 PM" },
  ]);
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

  if (loading) return <View style={styles.loadingContainer}><ActivityIndicator size="large" color={COLORS.primary} /></View>;

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Section */}
        <View style={[styles.card, styles.profileSection]}>
          <Image source={require("../assets/images/adaptive-icon.png")} style={styles.avatar} />
          <View>
            <Text style={styles.sectionTitle}>Appointments for</Text>
            <Text style={styles.fullname}>{fullname}</Text>
          </View>
        </View>

        {error && <Text style={styles.error}>{error}</Text>}

        {/* Upcoming Appointments Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
        </View>
        <View style={styles.hr} />

        {/* Appointment List */}
        {appointments.length > 0 ? (
          appointments.map((appt) => (
            <View key={appt.id} style={styles.card}>
              <View style={styles.row}>
                <FontAwesome5 name="user-md" size={20} color={COLORS.primary} />
                <View style={styles.details}>
                  <Text style={styles.bold}>{appt.doctor}</Text>
                  <Text style={styles.text}>{appt.specialty}</Text>
                </View>
                <Text style={[styles.status, appt.status === "Pending" ? styles.pending : styles.completed]}>
                  ● {appt.status}
                </Text>
              </View>
              <View style={styles.row}>
                <FontAwesome5 name="calendar" size={14} color={COLORS.text} />
                <Text style={styles.text}>{appt.date}</Text>
                <FontAwesome5 name="clock" size={14} color={COLORS.text} style={{ marginLeft: 15 }} />
                <Text style={styles.text}>{appt.time}</Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.noAppointments}>No upcoming appointments.</Text>
        )}

        {/* Create New Appointment Button */}
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Create New</Text>
          <FontAwesome5 name="plus" size={15} color={COLORS.white} />
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const COLORS = {
  primary: "#007bff",
  secondary: "#FF8C00",
  text: "#2C3E50",
  background: "#F5FCFF",
  card: "#E3F2FD",
  white: "#FFF",
  error: "red",
  pending: "#FF8C00",
  completed: "#28A745",
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { paddingHorizontal: 15, paddingBottom: 20, alignItems: "center" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },

  /* Profile Section */
  profileSection: { flexDirection: "row", alignItems: "center", backgroundColor: COLORS.card, padding: 15 },
  avatar: { width: 60, height: 60, borderRadius: 30, marginRight: 15 },
  fullname: { fontSize: 18, fontWeight: "600", color: COLORS.text },

  /* Section Titles */
  section: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%", maxWidth: 350, marginTop: 20 },
  sectionTitle: { fontSize: 20, fontWeight: "700", color: COLORS.text },
  hr: { borderBottomColor: "#00000020", borderBottomWidth: 1, marginVertical: 10, width: "100%", maxWidth: 350 },

  /* Appointments */
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    width: "100%",
    maxWidth: 350,
  },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginVertical: 5 },
  details: { flex: 1, marginLeft: 10 },
  bold: { fontSize: 16, fontWeight: "bold", color: COLORS.text },
  text: { fontSize: 14, color: COLORS.text },
  status: { fontSize: 14, fontWeight: "bold" },
  pending: { color: COLORS.pending },
  completed: { color: COLORS.completed },

  /* Error & No Appointments */
  error: { fontSize: 16, color: COLORS.error, textAlign: "center", marginVertical: 10 },
  noAppointments: { fontSize: 16, color: "#555", textAlign: "center", marginTop: 10 },

  /* Button */
  button: { flexDirection: "row", backgroundColor: COLORS.primary, padding: 12, borderRadius: 10, alignItems: "center", justifyContent: "center", width: "100%", maxWidth: 350, marginTop: 20 },
  buttonText: { color: COLORS.white, fontSize: 16, fontWeight: "bold", marginRight: 8 },
});
