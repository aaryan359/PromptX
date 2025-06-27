import { ChatService } from '@/api/Chat';
import ChatMessage from '@/components/ChatMessage';
import CustomHeader from '@/components/CustomHeader';
import SystemPromptButton from '@/components/SystemPromptButton';
import VoiceInput from '@/components/VoiceInput';
import { formatLLMResponse } from '@/utils/messageFormatter'; // Import the formatter

import { LinearGradient } from 'expo-linear-gradient';
import { Code, Code2, FileText, Palette, PenTool, Send, Sparkles, User } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

const systemPrompts = [
  {
    id: 'software_engineer',
    title: 'Software',
    icon: Code,
    prompt: 'software_engineer',
  },
  {
    id: 'Designer',
    title: 'Designer',
    icon: Palette,
    prompt: 'Designer',
  },
  {
    id: 'Content_Creator',
    title: 'Content',
    icon: PenTool,
    prompt: 'Content_Creator',
  },
  {
    id: 'Writer',
    title: 'Writer',
    icon: FileText,
    prompt: 'Writer',
  },
  {
    id: 'General_AI',
    title: 'General',
    icon: Sparkles,
    prompt: 'General_AI',
  },
  {
    id:'Data_Scientist',
    title:'Data Scientist',
    icon:Code2,
    prompt:'Data_Scientist'
  },
  {
    id:'DevOps_Engineer',
    title:'DevOps Engineer',
    icon:Code2,
    prompt:'DevOps_Engineer'
  },
  {
    id:'Best_Friend_AI',
    title:'Best Friend',
    icon:User,
    prompt:'Best_Friend_AI'
  }
];

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState(systemPrompts[4]); 
  const [isLoading, setIsLoading] = useState(false);
  const [showAllPrompts, setShowAllPrompts] = useState(false);
  const [hasSubscription, setHasSubscription] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    const welcomeMessage: Message = {
      id: '1',
      content: 'Hello! I\'m your AI assistant. Choose a system prompt above to get started, or ask me anything!',
      role: 'assistant',
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  }, []);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    // Create user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputText,
      role: 'user',
      timestamp: new Date(),
    };

    // Optimistically add user message to UI
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);
    

    try {
      // Send both the system prompt and user message to backend
      const response = await ChatService.sendMessage({
        systemPrompt: selectedPrompt.prompt,
        userMessage: inputText
      });

      console.log("response from llm is", response.data);
      
      // Use the enhanced formatter to clean the response
      let aiResponseContent = '';
      
      if (response.data && typeof response.data === 'object') {
        const llmResponse = response.data.response || '';
        aiResponseContent = formatLLMResponse(llmResponse);
      } else {
        const rawResponse = typeof response.data === 'string' ? response.data : '';
        aiResponseContent = formatLLMResponse(rawResponse);
      }

      // Fallback if formatter returns empty
      if (!aiResponseContent || aiResponseContent.trim().length === 0) {
        aiResponseContent = 'I received your message. How can I help you today?';
      }

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponseContent,
        role: 'assistant',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('API Error:', error);
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, there was an error processing your request. Please try again.',
        role: 'assistant',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorResponse]);
      
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to send message',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowMorePrompts = () => {
    if (!hasSubscription) {
      Toast.show({
        type: 'info',
        text1: 'Please Upgrade',
        text2: 'Subscribe to access all expert prompts',
      });
      return;
    }
    setShowAllPrompts(true);
  };

  const handleVoiceTranscription = (text: string) => {
    setInputText(text);
  };

  const defaultVisiblePrompts = [systemPrompts[4], systemPrompts[0]];

  const visiblePrompts = showAllPrompts 
    ? (hasSubscription ? systemPrompts : defaultVisiblePrompts) 
    : defaultVisiblePrompts;

  return (
    <LinearGradient colors={['#F5F7FF', '#E8ECFF']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <CustomHeader />
        
        {/* System Prompts Row */}
        <View style={styles.promptsContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.promptsContent}
          >
            {visiblePrompts.map((prompt) => (
              <SystemPromptButton
                key={prompt.id}
                title={prompt.title}
                icon={prompt.icon}
                onPress={() => setSelectedPrompt(prompt)}
                isSelected={selectedPrompt.id === prompt.id}
                disabled={false}
              />
            ))}
            
            {!showAllPrompts && systemPrompts.length > 2 && (
              <TouchableOpacity 
                style={styles.moreButton}
                onPress={handleShowMorePrompts}
              >
                <LinearGradient 
                  colors={['#A1A1AA', '#A1A1AA']} 
                  style={styles.moreButtonGradient}
                >
                  <Text style={styles.moreButtonText}>More</Text>
                  <View style={styles.iconContainer}>
                    <View style={styles.premiumBadge}>
                      <Text style={styles.premiumBadgeText}>pro</Text>
                    </View>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>

        {/* Chat Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message.content}
              isUser={message.role === 'user'}
              timestamp={message.timestamp}
            />
          ))}
          {isLoading && (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>AI is thinking...</Text>
            </View>
          )}
        </ScrollView>

        {/* Input Area */}
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
              onSubmitEditing={handleSendMessage}
              returnKeyType="send"
              editable={!isLoading}
            />
            <TouchableOpacity 
              onPress={handleSendMessage} 
              style={styles.sendButton}
              disabled={isLoading || !inputText.trim()}
            >
              <LinearGradient 
                colors={['#8B5CF6', '#7C3AED']} 
                style={styles.sendGradient}
              >
                <Send size={20} color="#FFFFFF" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
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
  promptsContainer: {
    maxHeight: 50,
    marginTop: 10,
    paddingHorizontal: 15,
  },
  promptsContent: {
    paddingRight: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  moreButton: {
    marginRight: 12,
  },
  moreButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
    borderRadius: 12,
  },
  moreButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    marginLeft: 4
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
    paddingBottom: 10,
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
    marginLeft: 8,
    alignSelf: 'flex-end',
  },
  sendGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    position: 'relative',
    marginRight: 4,
  },
  premiumBadge: {
    position: 'absolute',
    right: -13,
    top: -15,
    backgroundColor: '#F59E0B',
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  premiumBadgeText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: 'bold',
  },
});