import ChatMessage from '@/components/ChatMessage';
import CustomHeader from '@/components/CustomHeader';
import SystemPromptButton from '@/components/SystemPromptButton';
import VoiceInput from '@/components/VoiceInput';
import { LinearGradient } from 'expo-linear-gradient';
import { Code, FileText, Palette, PenTool, Send, Sparkles } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';

import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const systemPrompts = [
  {
    id: 'software-engineer',
    title: 'Software Engineer',
    icon: Code,
    prompt: 'You are an expert software engineer with deep knowledge in programming languages, software architecture, and best practices. Help users with coding problems, system design, and technical solutions.',
  },
  {
    id: 'designer',
    title: 'Designer',
    icon: Palette,
    prompt: 'You are a creative UI/UX designer with expertise in visual design, user experience, and modern design trends. Help users with design concepts, color schemes, layouts, and user interfaces.',
  },
  {
    id: 'content-creator',
    title: 'Content Creator',
    icon: PenTool,
    prompt: 'You are a skilled content creator with expertise in social media, video content, and digital marketing. Help users create engaging content, develop content strategies, and grow their online presence.',
  },
  {
    id: 'writer',
    title: 'Writer',
    icon: FileText,
    prompt: 'You are a professional writer with expertise in various writing styles, grammar, and storytelling. Help users with creative writing, editing, professional communication, and content development.',
  },
  {
    id: 'general',
    title: 'General AI',
    icon: Sparkles,
    prompt: 'You are a helpful AI assistant ready to help with any questions or tasks. Provide accurate, helpful, and engaging responses to a wide variety of topics.',
  },
];

export default function ChatScreen() {
  const buttonClickCount = 0;
  const user = {
    picture: 'ww',
    name: 'Aryan Meena',
    email: 'emailemail@email.com',
  };
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState(systemPrompts[4]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    const welcomeMessage: Message = {
      id: '1',
      text: 'Hello! I\'m your AI assistant. Choose a system prompt above to get started, or ask me anything!',
      isUser: false,
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  }, []);

const handlePromptSelect = (prompt: typeof systemPrompts[0]) => {
    if (buttonClickCount >= 2 && !user) {
      setShowAuthModal(true);
      return;
    }
    
    setSelectedPrompt(prompt);
  
    
    // Add system message
    const systemMessage: Message = {
      id: Date.now().toString(),
      text: `Switched to ${prompt.title} mode. I'm ready to help you with ${prompt.title.toLowerCase()}-related questions!`,
      isUser: false,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, systemMessage]);
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateAIResponse(inputText, selectedPrompt),
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const generateAIResponse = (input: string, prompt: typeof systemPrompts[0]) => {
    // Simulate different responses based on selected prompt
    const responses = {
      'software-engineer': [
        'Based on your question about programming, I recommend using a clean architecture approach...',
        'For this technical challenge, consider implementing the following solution...',
        'From a software engineering perspective, the best practice would be to...',
      ],
      'designer': [
        'From a design standpoint, I suggest using a clean, modern aesthetic with...',
        'Consider these UI/UX principles for better user experience...',
        'The visual hierarchy could be improved by...',
      ],
      'content-creator': [
        'For engaging content, try focusing on storytelling elements that...',
        'Your content strategy should include these key components...',
        'To boost engagement, consider creating content that...',
      ],
      'writer': [
        'From a writing perspective, your piece could benefit from...',
        'Consider restructuring your content to improve readability by...',
        'The narrative flow would be stronger if you...',
      ],
      'general': [
        'That\'s an interesting question! Based on my knowledge...',
        'I can help you with that. Here\'s what I recommend...',
        'Great question! Let me provide you with a comprehensive answer...',
      ],
    };

    const promptResponses = responses[prompt.id as keyof typeof responses] || responses.general;
    return promptResponses[Math.floor(Math.random() * promptResponses.length)];
  };

  const handleVoiceTranscription = (text: string) => {
    setInputText(text);
  };

  const handleAuthModalClose = () => {
    setShowAuthModal(false);
  };

  const handleSignIn = async () => {
   
    setShowAuthModal(false);
  };
 


  return (
    <LinearGradient colors={['#F5F7FF', '#E8ECFF']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>

        
       <CustomHeader />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.promptsContainer}
          contentContainerStyle={styles.promptsContent}
        >
          {systemPrompts.map((prompt) => (
            <SystemPromptButton
              key={prompt.id}
              title={prompt.title}
              icon={prompt.icon}
              onPress={() => handlePromptSelect(prompt)}
              isSelected={selectedPrompt.id === prompt.id}
            />
          ))}
        </ScrollView>

        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message.text}
              isUser={message.isUser}
              timestamp={message.timestamp}
            />
          ))}
          {isLoading && (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>AI is thinking...</Text>
            </View>
          )}
        </ScrollView>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.inputContainer}
        >
          <View style={styles.inputRow}>
            <VoiceInput onTranscription={handleVoiceTranscription} />
            <TextInput
              style={styles.textInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Type your message..."
              placeholderTextColor="#64748B"
              multiline
              maxLength={1000}
            />
            <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
              <LinearGradient colors={['#8B5CF6', '#7C3AED']} style={styles.sendGradient}>
                <Send size={20} color="#FFFFFF" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>

        <Modal
          visible={showAuthModal}
          transparent
          animationType="fade"
          onRequestClose={handleAuthModalClose}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Authentication Required</Text>
              <Text style={styles.modalText}>
                You've used more than 2 system prompts. Please sign in with Google to continue using all features.
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity onPress={handleAuthModalClose} style={styles.cancelButton}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSignIn} style={styles.signInButton}>
                  <LinearGradient colors={['#8B5CF6', '#7C3AED']} style={styles.signInGradient}>
                    <Text style={styles.signInButtonText}>Sign In</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FF',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 15,
    paddingVertical: 16,
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  title: {
    color: '#1E293B',
    fontSize: 24,
    fontFamily: 'Inter-Bold',
  },
  subtitle: {
    color: '#64748B',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginTop: 4,
  },
  promptsContainer: {
    maxHeight: 40,
    marginTop:10,
    paddingHorizontal: 15,
    backgroundColor: '#FFFFFF',
  
  },
  promptsContent: {
    paddingRight: 20,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 15,
  
  },
  messagesContent: {
    paddingBottom: 10,
    
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  loadingText: {
    color: '#64748B',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    fontStyle: 'italic',
  },
  inputContainer: {
    paddingHorizontal: 10,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 25,
    paddingHorizontal: 16,
    color: '#1E293B',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    maxHeight: 100,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  sendButton: {
    alignSelf: 'flex-end',
  },

  sendGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  modalTitle: {
    color: '#1E293B',
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  modalText: {
    color: '#64748B',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F1F5F9',
  },
  cancelButtonText: {
    color: '#1E293B',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },
  signInButton: {
    flex: 1,
  },
  signInGradient: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  signInButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
});