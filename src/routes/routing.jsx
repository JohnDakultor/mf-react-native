// import React, { useMemo, useState } from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
// import LoginForm from '../screens/login';
// import EmailVerificationScreen from '../components/emailVerification';
// import CodeVerificationScreen from '../components/codeVerification';
// import CompleteRegistrationScreen from '../components/completeRegistration';
// import HomeScreen from '../screens/home';

// const Stack = createStackNavigator();

// const Routing = () => {
//     return (
//         <NavigationContainer>
//             <Stack.Navigator initialRouteName="Login">
//                 <Stack.Screen name="Login" component={LoginForm} options={{ headerShown: false }} />
//                 <Stack.Screen name="EmailVerification" component={EmailVerificationScreen} options={{ headerShown: false }} />
//                 <Stack.Screen name="CodeVerification" component={CodeVerificationScreen} options={{ headerShown: false }} />
//                 <Stack.Screen name="CompleteRegistration" component={CompleteRegistrationScreen} options={{ headerShown: false }} />
//                 <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
//             </Stack.Navigator>
            
//         </NavigationContainer>
//     )
// }

// export default Routing;


import React, { useReducer, useEffect, useMemo } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as SecureStore from "expo-secure-store";
import { AuthContext } from "../utils/authContext";
import LoginScreen from "../screens/login";
import EmailVerificationScreen from "../components/emailVerification";
import CodeVerificationScreen from "../components/codeVerification";
import CompleteRegistrationScreen from '../components/completeRegistration';
import HomeScreen from "../screens/home";
import SplashScreen from '../splashScreen';

import BottomTabNavigator from '../components/navBar';

import { loginUser } from "../api/axios";

const Stack = createStackNavigator();

const initialState = {
  isLoading: true,
  isSignout: false,
  userToken: null,
};

function reducer(prev, action) {
  switch (action.type) {
    case "RESTORE_TOKEN":
      return { ...prev, userToken: action.token, isLoading: false };
    case "SIGN_IN":
      return { ...prev, isSignout: false, userToken: action.token };
    case "SIGN_OUT":
      return { ...prev, isSignout: true, userToken: null };
    default:
      return prev;
  }
}

const Routing = function () {
  const [state, dispatch] = useReducer(reducer, initialState);

  // On app load, pull token from storage
  useEffect(() => {
    (async () => {
      let userToken = null;
      try { userToken = await SecureStore.getItemAsync("userToken"); }
      catch {}
      dispatch({ type: "RESTORE_TOKEN", token: userToken });
    })();
  }, []);

  // Memoize auth functions so they don't re‑render every time
  const authContext = useMemo(() => ({
    signIn: async ({ username, password }) => {
      // call your backend login, e.g. const { token } = await loginUser(...)
      const { token } = await loginUser(username, password);
      await SecureStore.setItemAsync("userToken", token);
      dispatch({ type: "SIGN_IN", token });
    },
    signOut: async () => {
      await SecureStore.deleteItemAsync("userToken");
      dispatch({ type: "SIGN_OUT" });
    },
    signUp: async (data) => {
      // optional: handle sign up flow similarly
    },
    userToken: state.userToken,
  }), [state.userToken]);

  if (state.isLoading) {
    return <SplashScreen />;
  }

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <Stack.Navigator>
          {state.userToken == null ? (
            // No token → user is signed out
            <>
              <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
              <Stack.Screen name="EmailVerification" component={EmailVerificationScreen} />
              <Stack.Screen name="CodeVerification" component={CodeVerificationScreen} />
              <Stack.Screen name="CompleteRegistration" component={CompleteRegistrationScreen} />
            </>
          ) : (
            // User is signed in
            <Stack.Screen name="Main" component={BottomTabNavigator} options={{ headerShown: false }} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}

export default Routing;