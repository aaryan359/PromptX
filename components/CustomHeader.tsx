import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const CustomHeader = () => {
    // Replace with your actual user data
    const user = {
        name: "John Doe",
        imageUrl: null, // Set to null for placeholder
    };

    return (
        <View style={styles.headerContainer}>
            {/* Left side - Hamburger menu and App Name */}
            <View style={styles.leftContainer}>
                <TouchableOpacity style={styles.menuButton}>
                    <Ionicons name="menu" size={22} color="#6941C6" />
                </TouchableOpacity>
                <Text style={styles.logoText}>PromptX</Text>
            </View>

            {/* Right side - Search and Profile */}
            <View style={styles.rightContainer}>
                <TouchableOpacity style={styles.searchButton}>
                    <Ionicons name="search" size={20} color="#6941C6" />
                </TouchableOpacity>
                
                {user.imageUrl ? (
                    <Image 
                        source={{ uri: user.imageUrl }} 
                        style={styles.profileImage}
                    />
                ) : (
                    <View style={styles.profilePlaceholder}>
                        <MaterialIcons name="person" size={20} color="#fff" />
                    </View>
                )}
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
        elevation: 5,
    },
    leftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    menuButton: {
        marginRight: 5,
    },
    logoText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#6941C6',
        fontFamily: 'Inter-Bold',
    },
    rightContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    searchButton: {
        padding: 6,
    },
    profileImage: {
        width: 35,
        height: 35,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    profilePlaceholder: {
        width: 35,
        height: 35,
        borderRadius: 30,
        backgroundColor: '#6941C6',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    notificationBadge: {
        position: 'absolute',
        right: -1,
        top: -5,
        backgroundColor: '#ff3b30',
        borderRadius: 10,
        width: 18,
        height: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
});

export default CustomHeader;