import * as Clipboard from 'expo-clipboard';
import * as Speech from "expo-speech";
import { Copy, Volume2, VolumeX } from "lucide-react-native";
import React, { useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  timestamp: Date;
}

export default function ChatMessage({
  message,
  isUser,
  timestamp,
}: ChatMessageProps) {

  const [isSpeaking, setIsSpeaking] = useState(false);
   const [copiedText, setCopiedText] = useState('');
  const speakingRef = useRef(false);

  const speakMessage = () => {
    if (!isUser && !isSpeaking) {
      // Clean message for speech by removing extra formatting
      const cleanMessage = message
        .replace(/```[\s\S]*?```/g, '') // Remove code blocks
        .replace(/\n\s+/g, '\n') // Remove excessive indentation
        .replace(/^\d+\.\s/gm, '') // Remove numbered list markers
        .replace(/^•\s/gm, '') // Remove bullet points
        .replace(/^---$/gm, '') 
        .replace(/"/g, '')
        .trim();

      setIsSpeaking(true);
      speakingRef.current = true;

      Speech.speak(cleanMessage, {
        language:'en-US',
        pitch: 1,
        rate: 0.8,
        onDone: () => {
          setIsSpeaking(false);
          speakingRef.current = false;
        },
        onStopped: () => {
          setIsSpeaking(false);
          speakingRef.current = false;
        },
        onError: () => {
          setIsSpeaking(false);
          speakingRef.current = false;
        }
      });
    }
  };


  const stopSpeaking = () => {
    if (isSpeaking || speakingRef.current) {
      Speech.stop();
      setIsSpeaking(false);
      speakingRef.current = false;
    }
  };
  
  const copyToClipBoard = async(data:string)=>{
     await Clipboard.setStringAsync(data);
  }

  // Enhanced function to render formatted message
  const renderFormattedMessage = (text: string) => {
    const lines = text.split('\n');
    const components = [];
    let currentIndex = 0;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const key = `line-${currentIndex++}`;
      
      // Handle empty lines
      if (line.trim() === '') {
        components.push(<Text key={key}>{'\n'}</Text>);
        continue;
      }
      
      // Handle horizontal rules
      if (line.trim() === '---') {
        components.push(
          <View key={key} style={styles.horizontalRule}>
            <View style={styles.ruleLine} />
          </View>
        );
        continue;
      }
      
      // Handle code blocks (language headers)
      if (line.endsWith('Code:') || line.endsWith('Terminal:') || line.includes('JavaScript:') || line.includes('Python:')) {
        components.push(
          <Text key={key} style={styles.codeHeader}>
            {line}
          </Text>
        );
        continue;
      }
      
      // Handle code content (indented or within code blocks)
      if (line.startsWith('  ') && line.trim().length > 0) {
        components.push(
          <View key={key} style={styles.codeBlockContainer}>
            <Text style={styles.codeBlock}>
              {line.replace(/^  /, '')}
            </Text>
          </View>
        );
        continue;
      }
      
      // Handle section headers (lines ending with :)
      if (line.endsWith(':') && !line.includes('Code:') && line.trim().length < 50) {
        components.push(
          <Text key={key} style={styles.sectionHeader}>
            {line}
          </Text>
        );
        continue;
      }
      
      // Handle numbered lists
      if (/^\d+\.\s/.test(line)) {
        components.push(
          <Text key={key} style={styles.listItem}>
            {line}
          </Text>
        );
        continue;
      }
      
      // Handle bullet points
      if (line.startsWith('• ')) {
        components.push(
          <Text key={key} style={styles.bulletItem}>
            {line}
          </Text>
        );
        continue;
      }
      
      // Handle quoted text
      if (line.startsWith('"') && line.endsWith('"')) {
        components.push(
          <Text key={key} style={styles.quotedText}>
            {line}
          </Text>
        );
        continue;
      }
      
      // Regular text
      components.push(
        <Text key={key} style={styles.regularText}>
          {line}
          {'\n'}
        </Text>
      );
    }
    
    return components;
  };

  return (
    <View style={[
      styles.container,
      isUser ? styles.userContainer : styles.aiContainer
    ]}>
      {isUser ? (
        <View style={styles.messageBox}>
          <Text style={styles.userMessage}>
            {message}
          </Text>
        </View>
      ) : (
        <View style={styles.aiMessageBox}>
          <View style={styles.aiMessageContent}>
            {renderFormattedMessage(message)}
          </View>
          <TouchableOpacity
            style={styles.speakButton}
            onPress={isSpeaking ? stopSpeaking : speakMessage}
          >
            {isSpeaking ? (
              <VolumeX size={16} color="#8B5CF6" />
            ) : (
              <Volume2 size={16} color="#8B5CF6" />
            )}
          </TouchableOpacity>
          <TouchableOpacity
  style={styles.copyButton}
  onPress={() => {
    copyToClipBoard(message);
    setCopiedText('copied');
    setTimeout(() => setCopiedText(''), 1200);
  }}
>
  <Copy size={16} color={copiedText === 'copied' ? "#10B981" : "#8B5CF6"} />
</TouchableOpacity>
        </View>
      )}
      <Text style={styles.timestamp}>
        {timestamp.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 5,
    maxWidth: "85%",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  userContainer: {
    alignSelf: "flex-end",
    alignItems: "flex-end",
    backgroundColor: "#3456d178",
  },
  aiContainer: {
    alignSelf: "flex-start",
    alignItems: "flex-start",
    backgroundColor: "#FFFFFF",
  },
  copyButton: {
  marginLeft: 8,
  padding: 4,
  marginTop: 4,
},
  messageBox: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "flex-end",
    maxWidth: "100%",
  },
  aiMessageBox: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "flex-start",
    maxWidth: "100%",
  },
  aiMessageContent: {
    flex: 1,
  },
  userMessage: {
    color: "#1E293B",
    fontSize: 15,
    fontFamily: "Inter-Medium",
    lineHeight: 20,
  },
  // Styled text components for AI messages
  regularText: {
    color: "#1E293B",
    fontSize: 15,
    fontFamily: "Inter-Regular",
    lineHeight: 22,
  },
  sectionHeader: {
    color: "#1E293B",
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
    lineHeight: 24,
    marginTop: 8,
    marginBottom: 4,
  },
  codeHeader: {
    color: "#7C3AED",
    fontSize: 14,
    fontFamily: "Inter-Medium",
    marginTop: 8,
    marginBottom: 4,
  },
  codeBlockContainer: {
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    marginVertical: 2,
    borderLeftWidth: 3,
    borderLeftColor: "#E2E8F0",
  },
  codeBlock: {
    fontFamily: 'Courier New',
    fontSize: 13,
    color: "#374151",
    paddingHorizontal: 12,
    paddingVertical: 8,
    lineHeight: 18,
  },
  listItem: {
    color: "#1E293B",
    fontSize: 15,
    fontFamily: "Inter-Regular",
    lineHeight: 22,
    marginLeft: 8,
    marginVertical: 2,
  },
  bulletItem: {
    color: "#1E293B",
    fontSize: 15,
    fontFamily: "Inter-Regular",
    lineHeight: 22,
    marginLeft: 8,
    marginVertical: 2,
  },
  quotedText: {
    color: "#6B7280",
    fontSize: 15,
    fontFamily: "Inter-Regular",
    fontStyle: 'italic',
    lineHeight: 22,
    marginVertical: 4,
    paddingLeft: 12,
    borderLeftWidth: 2,
    borderLeftColor: "#D1D5DB",
  },
  horizontalRule: {
    marginVertical: 12,
    alignItems: 'center',
  },
  ruleLine: {
    width: '100%',
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  speakButton: {
    marginLeft: 8,
    padding: 4,
    marginTop: 4,
  },
  timestamp: {
    color: "#9CA3AF",
    fontSize: 10,
    marginRight: 12,
    marginLeft: 17,
    fontFamily: "Inter-Regular",
    marginTop: -7,
    marginBottom: 5
  },
});