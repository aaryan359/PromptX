import { Tabs } from 'expo-router';
import { DollarSign, MessageCircle, Store, User } from 'lucide-react-native';
import { Platform } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
         
        headerShown: false,
        tabBarActiveTintColor: '#8B5CF6',
        tabBarInactiveTintColor: '#64748B',
        headerPressOpacity:0.2,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          paddingBottom: Platform.OS === 'ios' ? 20 : 5,
          paddingTop: 5,
          height: Platform.OS === 'ios' ? 85 : 80,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
          borderRadius:20,  
          elevation: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          borderRadius:20,
          fontFamily: 'Inter-Medium',
          marginBottom: Platform.OS === 'ios' ? 0 : 5,
        },
        tabBarItemStyle: {
          borderRadius: 20,
          marginHorizontal: 4,
          marginBottom: Platform.OS === 'ios' ? 10 : 0,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Chat',
          tabBarIcon: ({ size, color }) => (
            <MessageCircle size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="marketplace"
        options={{
          title: 'Marketplace',
          tabBarIcon: ({ size, color }) => (
            <Store size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="pricing"
        options={{
          title: 'Pricing',
          tabBarIcon: ({ size, color }) => (
            <DollarSign size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ size, color }) => (
            <User size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}