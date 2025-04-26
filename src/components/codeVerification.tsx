import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { getCode } from '../api/axios';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../utils/types';


// Props type for this screen
type Props = NativeStackScreenProps<
  RootStackParamList,
  'CodeVerification'
>;

const CodeVerificationScreen: React.FC<Props> = ({ route, navigation }) => {
  const [code, setCode] = useState<string>('');
  const [resendTime, setResendTime] = useState<number>(60);
  const { email } = route.params;

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (resendTime > 0) {
      timer = setInterval(() => {
        setResendTime(prev => prev - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [resendTime]);

  const handleVerify = async () => {
    if (code.length === 6) {
      try {
        await getCode(email, code);
        navigation.navigate('CompleteRegistration', { email });
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        console.error('Verification failed:', message);
        Alert.alert('Invalid or expired code', message);
      }
    }
  };

  const handleResendCode = () => {
    setResendTime(60);
    // TODO: call API to resend code
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Enter Verification Code</Text>

      <View style={styles.stepsIndicator}>
        <View style={styles.step} />
        <View style={[styles.step, styles.activeStep]} />
        <View style={styles.step} />
      </View>

      <Text style={styles.sectionTitle}>Step 2: Verify Code</Text>
      <Text style={styles.sectionSubtitle}>
        Enter the verification code sent to your email to continue with registration.
      </Text>

      <View style={styles.emailContainer}>
        <Text style={styles.emailText}>
          A verification code has been sent to{' '}
          <Text style={styles.emailHighlight}>{email}</Text>
        </Text>
      </View>

      <Text style={styles.inputLabel}>Verification Code</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter the 6-digit code"
        value={code}
        onChangeText={setCode}
        keyboardType="number-pad"
        maxLength={6}
      />

      <TouchableOpacity
        style={[styles.primaryButton, code.length !== 6 && styles.disabledButton]}
        onPress={handleVerify}
        disabled={code.length !== 6}
      >
        <Text style={styles.buttonText}>Verify &amp; Continue →</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleResendCode}
        disabled={resendTime > 0}
        style={styles.resendButton}
      >
        <Text style={styles.resendText}>
          {resendTime > 0 ? `Resend in ${resendTime}s` : 'Resend Code'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.secondaryText}>
          Want to use a different email? Go back
        </Text>
      </TouchableOpacity>
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
  title: {
    fontSize: 24,
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
  emailContainer: {
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  emailText: {
    color: '#555',
    textAlign: 'center',
  },
  emailHighlight: {
    fontWeight: 'bold',
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
  resendButton: {
    alignItems: 'center',
    marginBottom: 15,
  },
  resendText: {
    color: '#0047AB',
    fontSize: 14,
  },
  secondaryText: {
    color: '#0047AB',
    textAlign: 'center',
    fontSize: 14,
  },
});

export default CodeVerificationScreen;
