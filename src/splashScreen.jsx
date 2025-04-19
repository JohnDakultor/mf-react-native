import React from 'react';
import { View, Image, ActivityIndicator, StyleSheet } from 'react-native';

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      {/* Replace with your own logo */}
      <Image
        source={require('../assets/mf_splash.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <ActivityIndicator size="large" style={styles.spinner} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',       // adjust to match your brand
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 200,
    height: 200,
  },
  spinner: {
    marginTop: 20,
  },
});