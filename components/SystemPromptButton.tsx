import { LinearGradient } from 'expo-linear-gradient';
import { LucideIcon } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface SystemPromptButtonProps {
  title: string;
  icon: LucideIcon;
  onPress: () => void;
  isSelected: boolean;
}

export default function SystemPromptButton({ title, icon: Icon, onPress, isSelected }: SystemPromptButtonProps) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <LinearGradient
        colors={isSelected ? ['#8B5CF6', '#8B5CF6'] : ['#A1A1AA', '#A1A1AA']}
        style={styles.button}
      >
        <Icon size={20} color="#FFFFFF" />
        <Text style={styles.text}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginRight: 12,
    marginBottom: 8,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 12,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    marginLeft: 4
  },
});