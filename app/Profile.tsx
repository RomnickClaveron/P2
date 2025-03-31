import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Modal } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export default function Profile() {
  interface User {
    fullname: string;
    username: string;
    type_id: string;
  }

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [updatedFullname, setUpdatedFullname] = useState("");
  const [updatedUsername, setUpdatedUsername] = useState("");
  const [updatedPassword, setUpdatedPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false); // State to toggle password change

  useEffect(() => {
    getUserByIdFromStorage();
  }, []);

  const getUserByIdFromStorage = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem("userId");
      const token = await AsyncStorage.getItem("authToken");

      if (storedUserId && token) {
        fetchProfile(storedUserId, token);
      } else {
        Alert.alert("Error", "User ID or Token not found.");
        setLoading(false);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to retrieve authentication data.");
      setLoading(false);
    }
  };

  const fetchProfile = async (userId: string, token: string) => {
    try {
      const response = await fetch(`https://devapi-618v.onrender.com/api/user/${userId}`, {
        method: "GET",
        headers: {
          "Authorization": `${token.trim()}`,
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user profile.");
      }

      const data = await response.json();
      setUser(data);
      setUpdatedFullname(data.fullname);
      setUpdatedUsername(data.username);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch profile details.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const userId = await AsyncStorage.getItem("userId");

      if (!userId || !token) {
        Alert.alert("Error", "User ID or Token is missing.");
        return;
      }

      if (!updatedFullname.trim() || !updatedUsername.trim()) {
        Alert.alert("Error", "Full Name and Username cannot be empty.");
        return;
      }

      // Build the request body
      const requestBody: any = {
        fullname: updatedFullname.trim(),
        username: updatedUsername.trim(),
        type_id: user?.type_id !== undefined ? Number(user.type_id) : 4, // Ensure type_id is always a valid number
      };

      // Include the password only if the user has opted to change it and provided a non-empty value
      if (isChangingPassword && updatedPassword.trim()) {
        requestBody.password = updatedPassword.trim();
      }

      console.log("Request Body:", requestBody);

      const response = await fetch(`https://devapi-618v.onrender.com/api/user/${userId}`, {
        method: "PUT",
        headers: {
          Authorization: `${token.trim()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const responseData = await response.json();
        throw new Error(responseData.error || "Failed to update profile.");
      }

      Alert.alert("Success", "Profile updated successfully.");
      console.log("Profile updated successfully:", {
        fullname: updatedFullname,
        username: updatedUsername,
        ...(isChangingPassword && updatedPassword.trim() && { password: "Password updated" }),
      });

      setModalVisible(false);

      setUser((prevUser) => ({
        ...prevUser,
        fullname: updatedFullname,
        username: updatedUsername,
        type_id: prevUser?.type_id || "",
      }));

      // Clear the password field and toggle after a successful update
      setUpdatedPassword("");
      setIsChangingPassword(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to update profile.";
      Alert.alert("Error", errorMessage);
    }
  };

  const handleLogout = async () => {
    try {
      console.log("Logging out...");
  
      // Clear AsyncStorage
      await AsyncStorage.removeItem("authToken");
      await AsyncStorage.removeItem("userId");
      console.log("User data cleared from AsyncStorage.");
  
      Alert.alert("Logged Out", "You have been logged out successfully.");
  
      // Replace the current screen with the Sign-in screen
      router.replace("/Signin");
  
      console.log("Navigated to /Signin, preventing back navigation.");
    } catch (error) {
      console.error("Error logging out:", error);
      Alert.alert("Error", "Failed to log out.");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const userId = await AsyncStorage.getItem("userId");
  
      if (!userId || !token) {
        Alert.alert("Error", "User ID or Token is missing.");
        console.log("Error: User ID or Token is missing.");
        return;
      }
  
      console.log("Attempting to delete account for user ID:", userId);
  

      Alert.alert(
        "Confirm Deletion",
        "Are you absolutely sure you want to delete your account? This action cannot be undone.",
        [
          { text: "Cancel", style: "cancel", onPress: () => console.log("First confirmation canceled.") },
          {
            text: "Proceed",
            style: "destructive",
            onPress: () => {

              Alert.alert(
                "Final Confirmation",
                "This is your last chance! Deleting your account will remove all associated data permanently.",
                [
                  { text: "Cancel", style: "cancel", onPress: () => console.log("Final confirmation canceled.") },
                  {
                    text: "Delete Account",
                    style: "destructive",
                    onPress: async () => {
                      try {
                        console.log("Sending DELETE request to API...");
                        const response = await fetch(`https://devapi-618v.onrender.com/api/user/${userId}`, {
                          method: "DELETE",
                          headers: {
                            Authorization: `${token.trim()}`,
                            "Content-Type": "application/json",
                          },
                        });
  
                        console.log("Response status:", response.status);
  
                        if (!response.ok) {
                          const responseData = await response.json();
                          console.log("API Error Response:", responseData);
                          throw new Error(responseData.error || "Failed to delete account.");
                        }
  
                        console.log("Account deleted successfully from API.");
  
                        Alert.alert("Success", "Your account has been deleted successfully.");
  
                        // Clear AsyncStorage
                        await AsyncStorage.clear();
                        console.log("AsyncStorage cleared.");
  
                        // Redirect to Signin page
                        router.push("/Signin");
                        console.log("Navigating to /Signin...");
                      } catch (error) {
                        console.error("Error deleting account:", error);
                        const errorMessage = error instanceof Error ? error.message : "Failed to delete account.";
                        Alert.alert("Error", errorMessage);
                      }
                    },
                  },
                ]
              );
            },
          },
        ]
      );
    } catch (error) {
      console.error("Error deleting account:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to delete account.";
      Alert.alert("Error", errorMessage);
    }
  };
  
  

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.profileCard}>
        <Text style={styles.title}>User Profile</Text>
        <Text style={styles.info}>Full Name: {user?.fullname}</Text>
        <Text style={styles.info}>Username: {user?.username}</Text>
      </View>
      
      {/* Account Settings Button */}
      <TouchableOpacity style={styles.updateButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.buttonText}>Account Settings</Text>
      </TouchableOpacity>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>

      {/* Modal for Account Settings */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.title}>Account Settings</Text>
            
            {/* Full Name Input */}
            <TextInput
              style={styles.input}
              value={updatedFullname}
              onChangeText={setUpdatedFullname}
              placeholder="Full Name"
            />
            
            {/* Username Input */}
            <TextInput
              style={styles.input}
              value={updatedUsername}
              onChangeText={setUpdatedUsername}
              placeholder="Username"
            />
            
            {/* Toggle Password Change */}
            <TouchableOpacity
              style={styles.toggleButton}
              onPress={() => setIsChangingPassword(!isChangingPassword)}
            >
              <Text style={styles.buttonText}>
                {isChangingPassword ? "Cancel Password Change" : "Change Password"}
              </Text>
            </TouchableOpacity>
            
            {/* Password Input (Visible Only if Changing Password) */}
            {isChangingPassword && (
              <TextInput
                style={styles.input}
                value={updatedPassword}
                onChangeText={setUpdatedPassword}
                placeholder="New Password"
                secureTextEntry={true}
              />
            )}
            
            {/* Save Changes Button */}
            <TouchableOpacity style={styles.updateButton} onPress={handleUpdateProfile}>
              <Text style={styles.buttonText}>Save Changes</Text>
            </TouchableOpacity>
            
            {/* Delete Account Button */}
            <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
              <Text style={styles.buttonText}>Delete Account</Text>
            </TouchableOpacity>
            
            {/* Cancel Button */}
            <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F5FCFF", padding: 20 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  profileCard: { width: "100%", maxWidth: 350, backgroundColor: "#fff", borderRadius: 12, padding: 20, alignItems: "center", shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 5, elevation: 4 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10, color: "#333" },
  info: { fontSize: 16, color: "#555", marginBottom: 10 },
  updateButton: { width: "100%", backgroundColor: "#007bff", paddingVertical: 12, borderRadius: 8, alignItems: "center", marginTop: 15 },
  logoutButton: { width: "100%", backgroundColor: "#f50505", paddingVertical: 12, borderRadius: 8, alignItems: "center", marginTop: 10 },
  cancelButton: { width: "100%", backgroundColor: "#6c757d", paddingVertical: 12, borderRadius: 8, alignItems: "center", marginTop: 10 },
  deleteButton: { width: "100%", backgroundColor: "#f50505", paddingVertical: 12, borderRadius: 8, alignItems: "center", marginTop: 10 },
  toggleButton: { width: "100%", backgroundColor: "#6c757d", paddingVertical: 12, borderRadius: 8, alignItems: "center", marginTop: 10 },
  buttonText: { color: "white", fontSize: 18, fontWeight: "bold" },
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalView: { width: "90%", backgroundColor: "#fff", padding: 20, borderRadius: 12, alignItems: "center" },
  input: { width: "100%", padding: 10, borderWidth: 1, borderColor: "#ccc", borderRadius: 8, marginBottom: 10 },
});
