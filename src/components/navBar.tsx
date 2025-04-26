import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import HomeScreen from '../screens/home';
import DepositScreen from '../screens/deposit';
import GenealogyTreeScreen from '../screens/genealogyTree';
import ProfileScreen from '../screens/profile';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
  
            switch (route.name) {
              case 'Home':
                iconName = 'home';
                break;
              case 'Deposit':
                iconName = 'money';
                break;
              case 'Genealogy':
                iconName = 'sitemap';
                break;
              case 'Profile':
                iconName = 'user';
                break;
              default:
                iconName = 'circle';
            }
  
            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#0047AB',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: {
            position: 'absolute',
            bottom: 16,
            left: 16,
            right: 16,
            elevation: 5,
            backgroundColor: '#ffffff',
            borderRadius: 20,
            height: 70,
            paddingBottom: 10,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
          },
          headerShown: false,
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Deposit" component={DepositScreen} />
        <Tab.Screen name="Genealogy" component={GenealogyTreeScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    );
  };
export default BottomTabNavigator;
