import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { emailVerify } from '../api/axios';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../utils/types';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'EmailVerification'
>;

const EmailVerificationScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState<string>('');

  const handleSendCode = async () => {
    if (!email) return;

    try {
      await emailVerify(email);
      navigation.navigate('CodeVerification', { email });
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : String(error);
      if (message.includes('already registered')) {
        Alert.alert(
          'Already Registered',
          message,
          [
            {
              text: 'Go to Login',
              onPress: () => navigation.navigate('Login'),
            },
          ]
        );
      } else {
        Alert.alert('Error', message);
      }
    }
  };

  const handleBackToLogIn = () => {
    navigation.navigate('Login');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Unlock Your Earning Potential!</Text>
        <View style={styles.ratesContainer}>
          <View style={styles.rateItem}>
            <Text style={styles.rateLabel}>Bank Rate</Text>
            <Text style={styles.rateValue}>~1%</Text>
          </View>
          <View style={styles.rateItem}>
            <Text style={styles.rateLabel}>Digital Bank</Text>
            <Text style={styles.rateValue}>~4%</Text>
          </View>
          <View style={styles.rateItem}>
            <Text style={styles.rateLabel}>Prime Source</Text>
            <Text style={styles.rateValue}>~20%</Text>
          </View>
        </View>
        <Text style={styles.targetText}>
          Target 20% per annum with Prime Source
        </Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>Verify Your Email</Text>

        <View style={styles.stepsIndicator}>
          <View style={[styles.step, styles.activeStep]} />
          <View style={styles.step} />
          <View style={styles.step} />
        </View>

        <Text style={styles.sectionTitle}>Step 1: Email Verification</Text>
        <Text style={styles.sectionSubtitle}>
          This is the first step of registration. Enter your email address to receive a verification code.
        </Text>

        <Text style={styles.inputLabel}>Email Address</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TouchableOpacity
          style={[styles.primaryButton, !email && styles.disabledButton]}
          onPress={handleSendCode}
          disabled={!email}
        >
          <Text style={styles.buttonText}>Send Verification Code</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleBackToLogIn}>
          <Text style={styles.secondaryText}>
            Already have an account? Login
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: 30,
    paddingTop: 50,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  ratesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  rateItem: {
    alignItems: 'center',
  },
  rateLabel: {
    fontSize: 14,
    color: '#666',
  },
  rateValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  targetText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
    textAlign: 'center',
    marginTop: 10,
  },
  formContainer: {
    marginTop: 20,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  stepsIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  step: {
    width: 30,
    height: 5,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 5,
    borderRadius: 5,
  },
  activeStep: {
    backgroundColor: '#4CAF50',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  primaryButton: {
    backgroundColor: '#0047AB',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  disabledButton: {
    backgroundColor: '#A5D6A7',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryText: {
    color: '#0047AB',
    textAlign: 'center',
    fontSize: 14,
  },
});

export default EmailVerificationScreen;
