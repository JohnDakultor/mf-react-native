import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { AuthContext } from "../utils/authContext";
import Icon from "react-native-vector-icons/FontAwesome";
import { profile } from "../api/axios";

const ProfileScreen = () => {
  const { signOut, userId } = useContext(AuthContext);
  const [userData, setUserData] = useState<{
    first_name: string;
    last_name: string;
    email: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          onPress: () => signOut(),
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  useEffect(() => {
    const fetchProfile = async () => {
      console.log("Fetched userId from context:", userId);
      if (!userId) return; 
      try {
        const data = await profile(userId);
        console.log("Profile data:", data);
        setUserData({
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email
        });
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchProfile();
  }, [userId]);
  
  return (
    <View style={styles.container}>
      <View style={styles.profileCard}>
        <Image
          source={{ uri: 'https://i.pravatar.cc/150?img=12' }}
          style={styles.avatar}
        />
        {loading ? (
          <ActivityIndicator size="small" color="#0047AB" />
        ) : (
          <>
            <Text style={styles.name}>
              {userData?.first_name} {userData?.last_name}
            </Text>
            <Text style={styles.email}>{userData?.email}</Text>
          </>
        )}
      </View>

      <View style={styles.menu}>
        <TouchableOpacity style={styles.menuItem}>
          <Icon name="cog" size={20} color="#0047AB" />
          <Text style={styles.menuText}>Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Icon name="info-circle" size={20} color="#0047AB" />
          <Text style={styles.menuText}>About</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
          <Icon name="sign-out" size={20} color="#d9534f" />
          <Text style={[styles.menuText, { color: "#d9534f" }]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f9fc",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  profileCard: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  name: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
  },
  email: {
    fontSize: 14,
    color: "#777",
    marginTop: 4,
  },
  menu: {
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    elevation: 3,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },
  menuText: {
    marginLeft: 12,
    fontSize: 16,
    color: "#0047AB",
    fontWeight: "500",
  },
});
