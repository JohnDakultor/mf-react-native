import React, { useState, useEffect } from "react";
import * as Clipboard from "expo-clipboard";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Modal,
} from "react-native";
import axios from "axios";
import {
  MaterialIcons,
  FontAwesome5,
  Entypo,
  Feather,
} from "@expo/vector-icons";

const HomeScreen = () => {
  const [breakdownVisible, setBreakdownVisible] = useState(false);

  const [activeTab, setActiveTab] = useState("Time Deposit");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    balances: {
      timeDeposit: 0,
      interest: 0,
      primeWallet: 0,
    },
    projectedInterest: 0,
    referral: {
      active: false,
      link: "",
    //   requirement: "",
    },
    transactions: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("https://backend.com/api/home");
        setData(res.data);
      } catch (error) {
        console.error("Failed to fetch home data:", error);
        // Dummy fallback data
        setData({
          balances: {
            timeDeposit: 5000,
            interest: 320.5,
            primeWallet: 1250,
          },
          projectedInterest: 250,
          referral: {
            active: true,
            link: "https://yourapp.com/signup?ref=ABC123",
            // requirement: "awdasfasfasdf",
          },
          transactions: [
            { label: "Deposit", amount: 5000 },
            { label: "Interest", amount: 320.5 },
          ],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCopyReferralLink = () => {
    if (referral.link) {
      Clipboard.setStringAsync(referral.link);
      Alert.alert("Copied!", "Referral link copied to clipboard.");
    }
  };

  const {
    balances = {},
    projectedInterest = 0,
    referral = {},
    transactions = [],
  } = data;

  const getBalance = () => {
    switch (activeTab) {
      case "Interest":
        return balances.interest || 0;
      case "Prime Wallet":
        return balances.primeWallet || 0;
      default:
        return balances.timeDeposit || 0;
    }
  };

  const renderWalletIcon = () => {
    switch (activeTab) {
      case "Interest":
        return <FontAwesome5 name="piggy-bank" size={24} color="#0047AB" />;
      case "Prime Wallet":
        return <Entypo name="wallet" size={24} color="#28a745" />;
      default:
        return <Feather name="credit-card" size={24} color="#0047AB" />;
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0047AB" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabContainer}>
        {["Time Deposit", "Interest", "Prime Wallet"].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabButton, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Wallet Info */}
      <View style={styles.card}>
        {renderWalletIcon()}
        <Text style={styles.walletTitle}>{activeTab} Balance</Text>
        <Text style={styles.walletAmount}>Php {getBalance().toFixed(2)}</Text>
        <Text style={styles.walletNote}>
          {activeTab === "Time Deposit"
            ? "Earns monthly interest"
            : activeTab === "Interest"
            ? "Interest Earned"
            : "Available for withdrawal"}
        </Text>
      </View>

      {/* Projected Interest */}
      <View style={styles.card}>
        <View style={styles.interestHeader}>
          <Text style={styles.sectionTitle}>Projected Monthly Interest</Text>
          <TouchableOpacity onPress={() => setBreakdownVisible(true)}>
            <Text style={styles.breakdownLink}>Show breakdown</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.walletAmount}>
          Php {projectedInterest.toFixed(2)}
        </Text>
        <Text style={styles.walletNote}>
          {balances.timeDeposit === 0
            ? "0% of Time Deposit"
            : `${((projectedInterest / balances.timeDeposit) * 100).toFixed(
                2
              )}% of Time Deposit`}
        </Text>
      </View>

      {/* Referral */}
      <View style={styles.referralCard}>
        <TouchableOpacity onPress={handleCopyReferralLink}>
          <View style={styles.referralHeader}>
            <Feather name="link" size={20} color="#fff" />
            <Text style={styles.referralText}>Your Referral Link</Text>
            <Feather name="copy" size={20} color="#fff" />
          </View>

          <View style={styles.referralInfo}>
            <View style={styles.dot} />
            <Text style={styles.referralNote}>
              {referral.active ? referral.link : referral.requirement}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Transactions */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        {transactions.length === 0 ? (
          <Text style={styles.noTransactionText}>
            No transactions to display
          </Text>
        ) : (
          transactions.map((tx, idx) => (
            <View key={idx} style={styles.transactionItem}>
              <Text style={styles.txLabel}>{tx.label}</Text>
              <Text style={styles.txAmount}>Php {tx.amount.toFixed(2)}</Text>
            </View>
          ))
        )}
      </View>

      <Modal
        transparent={true}
        animationType="fade"
        visible={breakdownVisible}
        onRequestClose={() => setBreakdownVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Interest Breakdown</Text>
            <Text style={styles.modalText}>
              Your Time Deposit is: Php {balances.timeDeposit.toFixed(2)}
            </Text>
            <Text style={styles.modalText}>
              Projected Monthly Interest Rate: 5%
            </Text>
            <Text style={styles.modalText}>
              Calculation: {balances.timeDeposit.toFixed(2)} × 0.05 = Php{" "}
              {(balances.timeDeposit * 0.05).toFixed(2)}
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setBreakdownVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#fff", top: 30 },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: "#eee",
    alignItems: "center",
  },
  activeTab: { borderBottomColor: "#0047AB" },
  tabText: { color: "#888", fontSize: 14 },
  activeTabText: { color: "#0047AB", fontWeight: "600" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    marginBottom: 16,
  },
  walletTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 10,
    color: "#0047AB",
  },
  walletAmount: { fontSize: 24, fontWeight: "600", marginTop: 4 },
  walletNote: { color: "#666", fontSize: 13 },
  interestHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: { fontSize: 16, fontWeight: "bold", color: "#0047AB" },
  breakdownLink: {
    color: "#0047AB",
    textDecorationLine: "underline",
    fontSize: 13,
  },
  referralCard: {
    backgroundColor: "#0047AB",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
  },
  referralHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  referralText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    flex: 1,
    textAlign: "center",
  },
  referralInfo: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FFD700",
    marginRight: 8,
  },
  referralNote: { color: "#fff", fontSize: 13 },
  noTransactionText: { color: "#999", marginTop: 8, fontSize: 14 },
  transactionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },
  txLabel: { color: "#333", fontSize: 14 },
  txAmount: { fontWeight: "600", color: "#0047AB" },
  modalBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "80%",
    alignItems: "center",
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#0047AB",
  },
  modalText: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
    marginBottom: 8,
  },
  closeButton: {
    marginTop: 15,
    backgroundColor: "#0047AB",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default HomeScreen;
