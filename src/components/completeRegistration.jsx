import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { completeRegistration } from "../api/axios";
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';


const CompleteRegistrationScreen = ({ route }) => {
  const { email } = route.params;
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    username: "",
    birthdate: "",
    contactNumber: "",
    referredBy: "",
  });


  const navigation = useNavigation();
  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    try {
      const requiredFields = [
        "firstName",
        "middleName",
        "lastName",
        "username",
        "birthdate",
        "contactNumber",
        "referredBy",
        "password",
      ];

      for (const field of requiredFields) {
        if (!formData[field]) {
          alert(
            `Please enter your ${field
              .replace(/([A-Z])/g, " $1")
              .toLowerCase()}.`
          );
          return;
        }
      }
      const payload = { ...formData, email };
      const response = await completeRegistration(payload);
      console.log("Registration successful:", response.data);
      alert("Registration completed successfully!");
      navigation.navigate("Login");
    } catch (err) {
      // AxiosError: err.message is now "PasswordStrengthError: Password is too weak"
      const frontendMsg = err.response?.data?.error || err.message;
      Alert.alert("Registration failed", frontendMsg);
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
    top: 20,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
    top: 13,
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
