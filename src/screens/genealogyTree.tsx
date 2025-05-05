// GenealogyTree.tsx
import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Dimensions } from "react-native";
import axios from "axios";
import { RouteProp, useRoute } from "@react-navigation/native";
import Tree from "../components/tree";

const { width } = Dimensions.get('window');

type RootStackParamList = {
  GenealogyTree: {
    authToken: string;
    userId: string;
  };
};

type TreeNode = {
  name: string;
  attributes: {
    status: string;
    level: string;
    interestRate: string;
    joinDate: string;
    totalSavings: string;
  };
  children?: TreeNode[];
};

const GenealogyTree: React.FC = () => {
  const route = useRoute<RouteProp<RootStackParamList, "GenealogyTree">>();

  const [treeData, setTreeData] = useState<TreeNode | null>(null);
  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGenealogyData();
  }, []);

  const fetchGenealogyData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Simulate no API response by forcing dummy data
      const useDummyData = true;

      if (useDummyData) {
        throw new Error("Simulated API failure");
      }

      const response = await axios.get("https://your-backend.com/genealogy", {
        headers: {
          Authorization: `Bearer ${route.params.authToken}`,
        },
        params: {
          userId: route.params.userId,
        },
      });

      const data = response.data;

      if (!data.user || !data.downlines || data.downlines.length === 0) {
        throw new Error("No data returned");
      }

      const transformedData = transformDataToTree(data);
      setTreeData(transformedData);
      setSelectedNode(transformedData);
    } catch (err: any) {
      console.log("Using dummy data:", err.message);
      // Use fallback dummy data with more levels for testing
      const dummyData: TreeNode = {
        name: "You",
        attributes: {
          status: "active",
          level: "L0",
          interestRate: "2.4%",
          joinDate: "2024-01-01",
          totalSavings: "₱1,000",
        },
        children: [
          {
            name: "Dan",
            attributes: {
              status: "active",
              level: "L1",
              interestRate: "2.4%",
              joinDate: "2024-02-01",
              totalSavings: "₱500",
            },
            children: [
              {
                name: "Miguel",
                attributes: {
                  status: "inactive",
                  level: "L2",
                  interestRate: "1.2%",
                  joinDate: "2024-03-01",
                  totalSavings: "₱200",
                },
                children: [
                  {
                    name: "Mary",
                    attributes: {
                      status: "active",
                      level: "L3",
                      interestRate: "1.2%",
                      joinDate: "2024-04-01",
                      totalSavings: "₱100",
                    },
                  }
                ]
              },
            ],
          },
          {
            name: "Joy",
            attributes: {
              status: "inactive",
              level: "L1",
              interestRate: "1.2%",
              joinDate: "2024-02-15",
              totalSavings: "₱300",
            },
            children: [
              {
                name: "Kaasag",
                attributes: {
                  status: "active",
                  level: "L2",
                  interestRate: "1.2%",
                  joinDate: "2024-03-15",
                  totalSavings: "₱150",
                },
              }
            ]
          },
        ],
      };

      setTreeData(dummyData);
      setSelectedNode(dummyData);
    } finally {
      setLoading(false);
    }
  };

  const transformDataToTree = (apiData: any): TreeNode => ({
    name: apiData.user?.name || "You",
    attributes: {
      status: apiData.user?.status || "inactive",
      level: "L0",
      interestRate: "2.4%",
      joinDate: apiData.user?.joinDate || "N/A",
      totalSavings: apiData.user?.totalSavings || "₱0",
    },
    children:
      apiData.downlines?.map((downline: any, index: number) => ({
        name: downline.name || `L${index + 1}`,
        attributes: {
          status: downline.status || "inactive",
          level: `L${index + 1}`,
          interestRate: index < 2 ? "2.4%" : index < 4 ? "1.2%" : "2.4%",
          joinDate: downline.joinDate || "N/A",
          totalSavings: downline.totalSavings || "₱0",
        },
        children:
          downline.downlines?.map((sub: any, subIndex: number) => ({
            name: sub.name || `L${index + 1}-${subIndex + 1}`,
            attributes: {
              status: sub.status || "inactive",
              level: `L${index + 1}-${subIndex + 1}`,
              interestRate: "1.2%",
              joinDate: sub.joinDate || "N/A",
              totalSavings: sub.totalSavings || "₱0",
            },
          })) || [],
      })) || [],
  });

  const renderNodeInfo = () => {
    if (!selectedNode) return null;

    return (
      <View style={styles.infoPanel}>
        <Text style={styles.infoTitle}>{selectedNode.name}</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Status:</Text>
          <Text style={[
            styles.infoValue,
            selectedNode.attributes.status === 'active' ? styles.activeStatus : styles.inactiveStatus
          ]}>
            {selectedNode.attributes.status}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Level:</Text>
          <Text style={styles.infoValue}>{selectedNode.attributes.level}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Interest:</Text>
          <Text style={styles.infoValue}>{selectedNode.attributes.interestRate}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Savings:</Text>
          <Text style={styles.infoValue}>{selectedNode.attributes.totalSavings}</Text>
        </View>
      </View>
    );
  };

  if (loading && !treeData) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#2F80ED" />
        <Text style={styles.loadingText}>Loading your money tree...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={fetchGenealogyData}>
          <Text style={styles.refreshButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContainer}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Money Tree</Text>
        <Text style={styles.subtitle}>Your growing community of savers</Text>
      </View>
      
      <View style={styles.ctaContainer}>
        <Text style={styles.ctaTitle}>Build Your Own Savers Club Today!</Text>
        <Text style={styles.ctaSubtitle}>Unlock Maximum Benefits When You Grow Your Community.</Text>
        
        <View style={styles.benefitsContainer}>
          <View style={styles.benefitRow}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.benefitItem}>Invite Friends & Family</Text>
          </View>
          <View style={styles.benefitRow}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.benefitItem}>Watch Your Community Grow</Text>
          </View>
          <View style={styles.benefitRow}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.benefitItem}>Earn Community Benefits</Text>
          </View>
        </View>
      </View>
      
      {renderNodeInfo()}
      
      <View style={styles.treeWrapper}>
        <ScrollView 
          horizontal 
          disableScrollViewPanResponder={true}
          contentContainerStyle={styles.treeContainer}
          showsHorizontalScrollIndicator={false}
        >
          {treeData && (
            <Tree 
              treeData={treeData} 
              onNodeSelect={setSelectedNode} 
            //   containerWidth={Math.max(width * 1.5, 600)} // Adjust based on tree size
            />
          )}
        </ScrollView>
      </View>
      
      <View style={styles.interestAllocation}>
        <Text style={styles.interestTitle}>L11 Interest Allocation</Text>
        <Text style={styles.interestSubtitle}>Annual rates</Text>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.interestRates}
        >
          <View style={styles.rateBox}>
            <Text style={styles.rateValue}>2.4%</Text>
            <Text style={styles.rateLabel}>YOU</Text>
          </View>
          <View style={styles.rateBox}>
            <Text style={styles.rateValue}>2.4%</Text>
            <Text style={styles.rateLabel}>L1</Text>
          </View>
          <View style={styles.rateBox}>
            <Text style={styles.rateValue}>1.2%</Text>
            <Text style={styles.rateLabel}>L2</Text>
          </View>
          <View style={styles.rateBox}>
            <Text style={styles.rateValue}>1.2%</Text>
            <Text style={styles.rateLabel}>L3</Text>
          </View>
          <View style={styles.rateBox}>
            <Text style={styles.rateValue}>2.4%</Text>
            <Text style={styles.rateLabel}>L4</Text>
          </View>
          <View style={styles.rateBox}>
            <Text style={styles.rateValue}>2.4%</Text>
            <Text style={styles.rateLabel}>L5</Text>
          </View>
        </ScrollView>
        
        <Text style={styles.interestNote}>Interest rates per level. Grow your community to maximize returns!</Text>
      </View>
      
      <View style={styles.navigation}>
        <TouchableOpacity style={styles.navButton}>
          <Text style={styles.navItem}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Text style={styles.navItem}>Deposit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Text style={[styles.navItem, styles.activeNavItem]}>Money Tree</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Text style={styles.navItem}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Text style={styles.navItem}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContainer: {
    paddingBottom: 30,
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2F80ED",
    textAlign: "center",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#828282",
    textAlign: "center",
    marginBottom: 20,
  },
  ctaContainer: {
    backgroundColor: "#F7FAFF",
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E0E9FF",
  },
  ctaTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2D3748",
    marginBottom: 8,
  },
  ctaSubtitle: {
    fontSize: 14,
    color: "#718096",
    marginBottom: 12,
    lineHeight: 20,
  },
  benefitsContainer: {
    marginLeft: 4,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  bullet: {
    color: "#2F80ED",
    marginRight: 8,
  },
  benefitItem: {
    fontSize: 14,
    color: "#4A5568",
    lineHeight: 20,
  },
  infoPanel: {
    backgroundColor: "#F7FAFF",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E0E9FF",
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2D3748",
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: "#718096",
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: "#2D3748",
  },
  activeStatus: {
    color: "#27AE60",
  },
  inactiveStatus: {
    color: "#EB5757",
  },
  treeWrapper: {
    minHeight: 200,
    marginBottom: 20,
  },
  treeContainer: {
    padding: 10,
    minWidth: width,
  },
  interestAllocation: {
    backgroundColor: "#F7FAFF",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E0E9FF",
  },
  interestTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2D3748",
    marginBottom: 4,
  },
  interestSubtitle: {
    fontSize: 14,
    color: "#718096",
    marginBottom: 16,
  },
  interestRates: {
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  rateBox: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 12,
    minWidth: 70,
    borderWidth: 1,
    borderColor: "#E0E9FF",
    shadowColor: "#2F80ED",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  rateValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2F80ED",
    marginBottom: 4,
  },
  rateLabel: {
    fontSize: 12,
    color: "#718096",
    fontWeight: '500',
  },
  interestNote: {
    fontSize: 12,
    color: "#718096",
    fontStyle: "italic",
    marginTop: 12,
  },
  navigation: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderTopColor: "#EDF2F7",
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: "#FFFFFF",
  },
  navButton: {
    paddingHorizontal: 8,
  },
  navItem: {
    fontSize: 12,
    color: "#A0AEC0",
    fontWeight: '500',
  },
  activeNavItem: {
    color: "#2F80ED",
    fontWeight: "700",
  },
  errorText: {
    textAlign: "center",
    color: "#EB5757",
    fontSize: 16,
    marginBottom: 16,
  },
  refreshButton: {
    backgroundColor: "#2F80ED",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    shadowColor: "#2F80ED",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  refreshButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
  loadingText: {
    textAlign: "center",
    marginTop: 16,
    color: "#718096",
    fontSize: 14,
  },
});

export default GenealogyTree;