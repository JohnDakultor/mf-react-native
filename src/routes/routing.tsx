import React, { useReducer, useEffect, useMemo, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import {
  createStackNavigator,
  StackNavigationOptions,
} from "@react-navigation/stack";
import * as SecureStore from "expo-secure-store";
import { AuthContext } from "../utils/authContext";
import LoginScreen from "../screens/login";
import EmailVerificationScreen from "../components/emailVerification";
import CodeVerificationScreen from "../components/codeVerification";
import CompleteRegistrationScreen from "../components/completeRegistration";
import HomeScreen from "../screens/home";
import SplashScreen from "../splashScreen";
import BottomTabNavigator from "../components/navBar";
import { loginUser } from "../api/axios";
import { jwtDecode } from "jwt-decode";

import {
  Modal,
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { DeviceEventEmitter } from "react-native";

import { CommonActions } from "@react-navigation/native";

import { navigationRef } from "../utils/navigationRef";

type AuthState = {
  isLoading: boolean;
  isSignout: boolean;
  userToken: string | null;
  userId: string | null;
};

type AuthAction =
  | { type: "RESTORE_TOKEN"; token: string | null; userId: string | null }
  | { type: "SIGN_IN"; token: string; userId: string }
  | { type: "SIGN_OUT" };

type RootStackParamList = {
  Login: undefined;
  EmailVerification: undefined;
  CodeVerification: undefined;
  CompleteRegistration: undefined;
  Main: undefined;
};

type SignInParams = {
  username: string;
  password: string;
};

const Stack = createStackNavigator<RootStackParamList>();

const initialState: AuthState = {
  isLoading: false,
  isSignout: false,
  userToken: null,
  userId: null,
};

function reducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "RESTORE_TOKEN":
      return {
        ...state,
        userToken: action.token,
        userId: action.userId,
        isLoading: false,
      };
    case "SIGN_IN":
      return {
        ...state,
        isSignout: false,
        userToken: action.token,
        userId: action.userId,
      };
    case "SIGN_OUT":
      return {
        ...state,
        isSignout: true,
        userToken: null,
        userId: null,
      };
    default:
      return state;
  }
}

const Routing: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const [sessionExpired, setSessionExpired] = useState<boolean>(false);

  useEffect(() => {
    if (!state.userToken) return;
    const { exp } = jwtDecode<{ exp: number }>(state.userToken);
    const msUntilExpiry = exp * 1000 - Date.now();
    const handle = setTimeout(() => setSessionExpired(true), msUntilExpiry);
    return () => clearTimeout(handle);
  }, [state.userToken]);

  // Restore token & userId on load
  useEffect(() => {
    (async () => {
      let userToken = null,
        userId = null;
      try {
        userToken = await SecureStore.getItemAsync("userToken");
        userId = await SecureStore.getItemAsync("userId");
      } catch (e) {
        console.error("Failed to restore token", e);
      }
      dispatch({ type: "RESTORE_TOKEN", token: userToken, userId });
    })();
  }, []);

  const authContext = useMemo(
    () => ({
      signIn: async ({ username, password }: SignInParams) => {
        const { token } = await loginUser(username, password);
        const decoded = jwtDecode<{ userId: string }>(token);
        await SecureStore.setItemAsync("userToken", token);
        await SecureStore.setItemAsync("userId", decoded.userId.toString());
        dispatch({ type: "SIGN_IN", token, userId: decoded.userId });
      },
      signOut: async () => {
        await SecureStore.deleteItemAsync("userToken");
        await SecureStore.deleteItemAsync("userId");
        dispatch({ type: "SIGN_OUT" });
      },
      userToken: state.userToken,
      userId: state.userId,
    }),
    [state.userToken, state.userId]
  );

  if (state.isLoading) {
    return <SplashScreen />;
  }

  const screenOptions: StackNavigationOptions = { headerShown: false };

  return (
    <>
      <Modal visible={sessionExpired} transparent animationType="fade">
        <View style={styles.backdrop}>
          <View style={styles.modal}>
            <Text style={styles.title}>Session Expired</Text>
            <Text>Your session has expired. Please log in again.</Text>
            <TouchableOpacity
              style={styles.button}
              activeOpacity={0.8}
              onPress={() => {
                setSessionExpired(false);
                authContext.signOut();
              }}
            >
              <Text style={styles.buttonText}>Log In Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <AuthContext.Provider value={authContext}>
        <NavigationContainer ref={navigationRef}>
          <Stack.Navigator screenOptions={screenOptions}>
            {state.userToken == null ? (
              // No token → user is signed out
              <>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen
                  name="EmailVerification"
                  component={EmailVerificationScreen}
                />
                <Stack.Screen
                  name="CodeVerification"
                  component={CodeVerificationScreen}
                />
                <Stack.Screen
                  name="CompleteRegistration"
                  component={CompleteRegistrationScreen}
                />
              </>
            ) : (
              // User is signed in
              <Stack.Screen name="Main" component={BottomTabNavigator} />
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </AuthContext.Provider>
    </>
  );
};

export default Routing;

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: 300,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    alignItems: "center",
  },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 8 },
  message: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#0047AB",
    paddingVertical: 7,
    paddingHorizontal: 25,
    borderRadius: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    marginTop: 30,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
