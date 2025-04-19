import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import { loginUser } from "../api/axios";

import { useContext } from "react";
import { AuthContext } from "../utils/authContext";

const LoginScreen = () => {
  const navigation = useNavigation();

  
  const { signIn } = useContext(AuthContext);

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState(false);


  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Error", "Please enter both username and password.");
      return;
    }
    try {
      const { token } = await loginUser(username, password);
      // TODO: store token (e.g. AsyncStorage) and navigate
      Alert.alert("Success", "Login successful!");
      // navigation.navigate("Home");
      await signIn({ username, password });
    } catch (err) {
      Alert.alert("Login Failed", err.message);
    }
  };


  const handleSignUp = () => {
    navigation.navigate("EmailVerification");
  };
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome Back</Text>
      <Text style={styles.subHeader}>Please log in to your account</Text>

      <Text style={styles.label}>User Name</Text>
      <View style={styles.inputContainer}>
        <Icon name="user" size={20} color="#888" style={styles.icon} />
        <TextInput
          placeholder="Enter your user name"
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
      </View>

      <Text style={styles.label}>Password</Text>
      <View style={styles.inputContainer}>
        <Icon name="lock" size={20} color="#888" style={styles.icon} />
        <TextInput
          placeholder="Enter your password"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <TouchableOpacity>
        <Text style={styles.forgot}>Forgot password?</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleLogin} style={styles.loginBtn}>
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>

      <Text style={styles.terms}>
        By logging in, you agree to our <Text style={styles.link}>Terms and Conditions</Text>
      </Text>

      <TouchableOpacity onPress={handleSignUp}>
        <Text style={styles.signup}>
          Don't have an account? <Text style={styles.link}>Sign up</Text>
        </Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Image
          source={{ uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Securities_and_Exchange_Commission_of_the_Philippines_%28SEC%29.svg/490px-Securities_and_Exchange_Commission_of_the_Philippines_%28SEC%29.svg.png" }}
          style={styles.secLogo}
        />
        <Text style={styles.secText}>SEC Registered</Text>
      </View>

      <TouchableOpacity style={styles.chatIcon}>
        <Icon name="facebook" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#003366",
    textAlign: "center",
  },
  subHeader: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 30,
  },
  label: {
    fontWeight: "bold",
    color: "#003366",
    marginTop: 10,
  },
  inputContainer: {
    flexDirection: "row",
    backgroundColor: "#f4f4f4",
    borderRadius: 8,
    alignItems: "center",
    paddingHorizontal: 10,
    marginVertical: 5,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
  },
  forgot: {
    color: "#0066cc",
    textAlign: "right",
    marginTop: 5,
  },
  loginBtn: {
    backgroundColor: "#0047AB",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  loginText: {
    color: "#fff",
    fontWeight: "bold",
  },
  terms: {
    textAlign: "center",
    fontSize: 12,
    color: "#666",
    marginTop: 15,
  },
  link: {
    color: "#0047AB",
  },
  signup: {
    textAlign: "center",
    marginTop: 10,
    fontSize: 14,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 30,
    justifyContent: "center",
  },
  secLogo: {
    width: 50,
    height: 30,
    marginRight: 8,
  },
  secText: {
    fontSize: 14,
    fontWeight: "600",
  },
  chatIcon: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "#0066ff",
    padding: 12,
    borderRadius: 30,
    elevation: 5,
  },
});
