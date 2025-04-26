import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { completeRegistration } from "../api/axios";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../utils/types";

// Define the shape of registration payload and navigation params
interface RegistrationPayload {
  firstName: string;
  middleName: string;
  lastName: string;
  username: string;
  birthdate: string;
  contactNumber: string;
  referredBy: string;
  password: string;
  email: string;
}

type Props = NativeStackScreenProps<RootStackParamList, "CompleteRegistration">;

const CompleteRegistrationScreen: React.FC<Props> = ({ route, navigation }) => {
  const { email } = route.params;

  const [formData, setFormData] = useState<Omit<RegistrationPayload, "email">>({
    firstName: "",
    middleName: "",
    lastName: "",
    username: "",
    birthdate: "",
    contactNumber: "",
    referredBy: "",
    password: "",
  });

  const handleInputChange = (name: keyof typeof formData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    // Ensure all required fields are filled
    for (const [key, value] of Object.entries(formData)) {
      if (!value) {
        Alert.alert(
          "Missing Field",
          `Please enter your ${key.replace(/([A-Z])/g, " $1").toLowerCase()}.`
        );
        return;
      }
    }

    const payload: RegistrationPayload = { ...formData, email };

    try {
      const response = await completeRegistration(payload);
      console.log("Registration successful:", response.data);
      Alert.alert("Success", "Registration completed successfully!");
      navigation.navigate("Login");
    } catch (error: unknown) {
      // Extract message from AxiosError or generic error
      const errorMessage =
        typeof error === "object" && error !== null && "message" in error
          ? (error as Error).message
          : String(error);
      Alert.alert("Registration failed", errorMessage);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Step 3: Complete Registration</Text>
      <Text style={styles.subtitle}>
        Please fill in your details to complete registration
      </Text>

      <View style={styles.stepsIndicator}>
        <View style={styles.step} />
        <View style={styles.step} />
        <View style={[styles.step, styles.activeStep]} />
      </View>

      <View style={styles.formSection}>
        <Text style={styles.sectionLabel}>First Name*</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your first name"
          value={formData.firstName}
          onChangeText={(text) => handleInputChange("firstName", text)}
        />
      </View>

      <View style={styles.formSection}>
        <Text style={styles.sectionLabel}>Middle Name*</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your middle name"
          value={formData.middleName}
          onChangeText={(text) => handleInputChange("middleName", text)}
        />
      </View>

      <View style={styles.formSection}>
        <Text style={styles.sectionLabel}>Last Name*</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your last name"
          value={formData.lastName}
          onChangeText={(text) => handleInputChange("lastName", text)}
        />
      </View>

      <View style={styles.formSection}>
        <Text style={styles.sectionLabel}>User Name*</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your username for your referrer"
          value={formData.username}
          onChangeText={(text) => handleInputChange("username", text)}
        />
      </View>

      <View style={styles.formSection}>
        <Text style={styles.sectionLabel}>Birthdate*</Text>
        <TextInput
          style={styles.input}
          placeholder="MM/DD/YYYY"
          value={formData.birthdate}
          onChangeText={(text) => handleInputChange("birthdate", text)}
          keyboardType="numbers-and-punctuation"
        />
      </View>

      <View style={styles.formSection}>
        <Text style={styles.sectionLabel}>Contact Number*</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your contact number"
          value={formData.contactNumber}
          onChangeText={(text) => handleInputChange("contactNumber", text)}
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.formSection}>
        <Text style={styles.sectionLabel}>Password*</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          value={formData.password}
          onChangeText={(text) => handleInputChange("password", text)}
          secureTextEntry={true}
        />
      </View>

      <View style={styles.formSection}>
        <Text style={styles.sectionLabel}>Referred By*</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter the username who referred you"
          value={formData.referredBy}
          onChangeText={(text) => handleInputChange("referredBy", text)}
        />
      </View>

      <View style={styles.formSection}>
        <Text style={styles.sectionLabel}>Email* (Verified)</Text>
        <Text style={styles.verifiedEmail}>{email}</Text>
      </View>

      <TouchableOpacity style={styles.primaryButton} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Complete Registration</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
    textAlign: "center",
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  stepsIndicator: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 30,
  },
  step: {
    width: 30,
    height: 5,
    backgroundColor: "#E0E0E0",
    marginHorizontal: 5,
    borderRadius: 5,
  },
  activeStep: {
    backgroundColor: "#4CAF50",
  },
  formSection: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
  },
  verifiedEmail: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    backgroundColor: "#F5F5F5",
    color: "#4CAF50",
  },
  primaryButton: {
    backgroundColor: "#0047AB",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CompleteRegistrationScreen;
