import {
    Bookmark,
    Crown,
    Edit,
    HelpCircle,
    LogOut,
    PlusCircle,
    Settings,
    Shield,
    Star,
    User,
    Zap
} from 'lucide-react-native';
import React from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: () => {} },
      ]
    );
  };

  const handleAction = (action: string) => {
    console.log('Action:', action);
    // Implement navigation or actions
  };

  const user = {
    picture: 'ww',
    name: 'Aryan Meena',
    email: 'emailemail@email.com',
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Profile Header */}
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              {user.picture ? (
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {user.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
              ) : (
                <View style={styles.avatar}>
                  <User size={32} color="#6366F1" />
                </View>
              )}
              <TouchableOpacity style={styles.editButton}>
                <Edit size={14} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <View style={styles.userInfoContainer}>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userEmail}>{user.email}</Text>
              </View>

              <View style={styles.planContainer}>
                <View style={styles.planBadge}>
                  <Crown size={14} color="#F59E0B" />
                  <Text style={styles.planText}>Premium Plan</Text>
                </View>
                <TouchableOpacity 
                  style={styles.upgradeButton}
                  onPress={() => handleAction('upgrade')}
                >
                  <Text style={styles.upgradeText}>Upgrade</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          
          {/* My Prompts Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>My Prompts</Text>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => handleAction('my-prompts')}
            >
              <Bookmark size={20} color="#6366F1" />
              <Text style={styles.menuText}>Saved Prompts</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>24</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => handleAction('created-prompts')}
            >
              <PlusCircle size={20} color="#6366F1" />
              <Text style={styles.menuText}>Created Prompts</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>12</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => handleAction('favorites')}
            >
              <Star size={20} color="#6366F1" />
              <Text style={styles.menuText}>Favorites</Text>
            </TouchableOpacity>
          </View>

          {/* Account Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account</Text>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => handleAction('settings')}
            >
              <Settings size={20} color="#6366F1" />
              <Text style={styles.menuText}>Settings</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => handleAction('privacy')}
            >
              <Shield size={20} color="#6366F1" />
              <Text style={styles.menuText}>Privacy & Security</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => handleAction('subscription')}
            >
              <Zap size={20} color="#F59E0B" />
              <Text style={styles.menuText}>Subscription</Text>
              <View style={styles.premiumBadge}>
                <Text style={styles.premiumBadgeText}>PRO</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Support Section */}
          <View style={styles.section}>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => handleAction('help')}
            >
              <HelpCircle size={20} color="#6366F1" />
              <Text style={styles.menuText}>Help Center</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.menuItem, styles.logoutItem]}
              onPress={handleSignOut}
            >
              <LogOut size={20} color="#EF4444" />
              <Text style={[styles.menuText, styles.logoutText]}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
    paddingTop: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24, 
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E0E7FF',
  },
  avatarText: {
    color: '#6366F1',
    fontSize: 32,
    fontFamily: 'Inter-Bold',
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#6366F1',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  userInfoContainer: {
    flex: 1,
  },
  userInfo: {
    marginBottom: 12,
  },
  userName: {
    color: '#1E293B',
    fontSize: 22,
    fontFamily: 'Inter-Bold',
    marginBottom: 2,
  },
  userEmail: {
    color: '#64748B',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  planContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  planBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  planText: {
    color: '#B45309',
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 4,
  },
  upgradeButton: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  upgradeText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
  },
 
  section: {
    marginBottom: 10,
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionTitle: {
    color: '#1E293B',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 4,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  menuText: {
    color: '#1E293B',
    fontSize: 15,
    fontFamily: 'Inter-Medium',
    marginLeft: 12,
    flex: 1,
  },
  badge: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Inter-Bold',
  },
  premiumBadge: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  premiumBadgeText: {
    color: '#1E293B',
    fontSize: 10,
    fontFamily: 'Inter-Bold',
  },
  logoutItem: {
    backgroundColor: '#FEE2E2',
    borderColor: '#FECACA',
  },
  logoutText: {
    color: '#DC2626',
  },
});