import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';

interface PaymentMethod {
  id: string;
  label: string;
  logo: any;
}

const paymentMethods: PaymentMethod[] = [
  { id: 'gcash', label: 'GCash', logo: require('../../assets/gcash.png') },
  { id: 'paymaya', label: 'PayMaya', logo: require('../../assets/maya.png') },
  { id: 'card', label: 'Card', logo: require('../../assets/card.jpg') },
];

const screenWidth = Dimensions.get('window').width;

const DepositScreen: React.FC = () => {
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [cardNumber, setCardNumber] = useState<string>('');
  const [expiry, setExpiry] = useState<string>('');
  const [cvc, setCvc] = useState<string>('');
  const [amount, setAmount] = useState<string>('');

  const [showWarning, setShowWarning] = useState<boolean>(false);

  const animatedHeight = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedHeight, {
      toValue: selectedMethod === 'card' ? 150 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [selectedMethod]);

  const handleConfirm = () => {
    if (!selectedMethod || !amount) {
      Alert.alert('Please fill in all required fields');
      return;
    }
    if (selectedMethod === 'card' && (!cardNumber || !expiry || !cvc)) {
      Alert.alert('Please complete the card details');
      return;
    }

    Alert.alert('Deposit Confirmed', `Via ${selectedMethod.toUpperCase()} - ₱${amount}`);
  };

  const numericsOnly = (
    text: string
  ) => {
    const numericValue = text.replace(/[^0-9]/g, '');

    if (text !== numericValue) {
        setShowWarning(true);
    }else{
        setShowWarning(false);
    }

    setAmount(numericValue);
    return numericValue;
  } 

  return (
    
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <Text style={styles.title}>Deposit</Text>

          <View style={styles.radioGroup}>
            {paymentMethods.map((method) => (
              <TouchableOpacity
                key={method.id}
                style={[styles.radioItem, selectedMethod === method.id && styles.radioItemSelected]}
                onPress={() => setSelectedMethod(method.id)}
                activeOpacity={0.8}
              >
                <View style={styles.radioContent}>
                  <Image source={method.logo} style={styles.icon} />
                  <Text style={styles.radioLabel}>{method.label}</Text>
                </View>
                <View
                  style={[
                    styles.radioCircle,
                    selectedMethod === method.id && styles.radioCircleSelected,
                  ]}
                />
              </TouchableOpacity>
            ))}
          </View>

          {/* Animated Card Info */}
          <Animated.View style={[styles.animatedContainer, { height: animatedHeight }]}>
            {selectedMethod === 'card' && (
              <View style={styles.cardInputGroup}>
                <Text style={styles.sectionLabel}>Card Information</Text>
                <TextInput
                  style={styles.input}
                  placeholder="1234 5678 9012 3456"
                  keyboardType="number-pad"
                  value={cardNumber}
                  onChangeText={setCardNumber}
                />
                <View style={styles.inputRow}>
                  <TextInput
                    style={[styles.input, styles.halfInput]}
                    placeholder="MM/YY"
                    value={expiry}
                    onChangeText={setExpiry}
                  />
                  <TextInput
                    style={[styles.input, styles.halfInput]}
                    placeholder="CVC"
                    keyboardType="number-pad"
                    value={cvc}
                    onChangeText={setCvc}
                  />
                </View>
              </View>
            )}
          </Animated.View>

          <View style={styles.footerSection}>
            <Text style={styles.totalText}>Deposit total</Text>
            <Text style={styles.totalAmount}>₱{amount || '0.00'}</Text>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Enter amount"
            keyboardType="numeric"
            value={amount}
            onChangeText={numericsOnly}

          />
          {showWarning && (
  <Text style={styles.warningText}>Only numbers and one decimal point are allowed</Text>
)}


          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
            <Text style={styles.confirmText}>Confirm Order</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 40,
    alignItems: 'center',
    paddingBottom: 120
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: screenWidth * 0.9,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    top:20
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  radioGroup: {
    marginBottom: 20,
  },
  radioItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  radioItemSelected: {
    borderColor: '#007aff',
    backgroundColor: '#e6f0ff',
  },
  radioContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioLabel: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#aaa',
  },
  radioCircleSelected: {
    borderColor: '#007aff',
    backgroundColor: '#007aff',
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  animatedContainer: {
    overflow: 'visible',
    bottom: 20,
    
  },
  cardInputGroup: {
    backgroundColor: '#f0f6ff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  footerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    top:15,
  },
  totalText: {
    fontSize: 13,
    color: '#333',
  },
  totalAmount: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333',
  },
  confirmButton: {
    backgroundColor: '#007aff',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  confirmText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  warningText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
  },
  
});

export default DepositScreen;
