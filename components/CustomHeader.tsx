import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SignOutButton } from './SignOutButton';

const CustomHeader = () => {
    const { user } = useUser();

    return (
        <View style={styles.headerContainer}>
            {/* Left side - App Logo/Name */}
            <View style={styles.logoContainer}>
                <Text style={styles.logoText}>PromptX</Text>
            </View>

            {/* Right side - User/Auth controls */}
            <View style={styles.authContainer}>
                <SignedIn>
                    <View style={styles.userProfile}>
                        {user?.imageUrl ? (
                            <Image 
                                source={{ uri: user.imageUrl }} 
                                style={styles.profileImage}
                            />
                        ) : (
                            <View style={styles.profilePlaceholder}>
                                <Ionicons name="person" size={20} color="#fff" />
                            </View>
                        )}
                        <View style={styles.userInfo}>
                            <Text style={styles.userEmail} numberOfLines={1}>
                                {user?.emailAddresses[0]?.emailAddress}
                            </Text>
                            <SignOutButton style={styles.signOutButton} />
                        </View>
                    </View>
                </SignedIn>
                <SignedOut>
                    <View style={styles.authButtons}>
                        <Link href="/(auth)/login" asChild>
                            <TouchableOpacity style={styles.authButton}>
                                <Text style={styles.authButtonText}>Sign In</Text>
                            </TouchableOpacity>
                        </Link>
                        <Link href="/(auth)/register" asChild>
                            <TouchableOpacity style={[styles.authButton, styles.signUpButton]}>
                                <Text style={[styles.authButtonText, styles.signUpButtonText]}>Sign Up</Text>
                            </TouchableOpacity>
                        </Link>
                    </View>
                </SignedOut>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    logoContainer: {
        flex: 1,
    },
    logoText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#4a6fa5',
    },
    authContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    userProfile: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    profilePlaceholder: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#4a6fa5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    userInfo: {
        maxWidth: 150,
    },
    userEmail: {
        fontSize: 14,
        color: '#333',
    },
    signOutButton: {
        marginTop: 2,
    },
    authButtons: {
        flexDirection: 'row',
        gap: 8,
    },
    authButton: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 6,
        backgroundColor: '#f0f0f0',
    },
    signUpButton: {
        backgroundColor: '#4a6fa5',
    },
    authButtonText: {
        fontSize: 14,
        color: '#333',
    },
    signUpButtonText: {
        color: '#fff',
    },
});

export default CustomHeader;