import { ChatService } from '@/api/Chat';
import ChatMessage from '@/components/ChatMessage';
import CustomHeader from '@/components/CustomHeader';
import SystemPromptButton from '@/components/SystemPromptButton';
import { formatLLMResponse } from '@/utils/messageFormatter';
import { LinearGradient } from 'expo-linear-gradient';
import { Code, Code2, FileText, Palette, PenTool, Send, Sparkles, User } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
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
  systemPrompt?: string;
}

interface ChatHistoryItem {
  id: number;
  systemPrompt?: string;
  aiResponse: string;
  userPrompt: string;
  createdAt: Date;
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
  const [refreshing, setRefreshing] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const systemPromptCache = useRef<{ [promptId: string]: boolean }>({});
  const [referesh,setRefresh] = useState(false);

  // Load chat history on initial render
 useEffect(() => {
    const loadInitialData = async () => {
      const welcomeMessage: Message = {
        id: '1',
        content: 'Hello! I\'m your AI assistant. Choose a system prompt above to get started, or ask me anything!',
        role: 'assistant',
        timestamp: new Date(),
      };
      
      try {
        setRefreshing(true);
        const response = await ChatService.getChatHistory();
        
        if (response.data && response.data.chats) {
        // Process messages in correct order (user first, then assistant)
        const historyMessages = response.data.chats.reduce((acc: Message[], chat: ChatHistoryItem) => {
          return [
            ...acc,
            {
              id: `ai-${chat.id}`,
              content: formatLLMResponse(chat.aiResponse), 
              role: 'assistant' as const,
              timestamp: new Date(chat.createdAt),
              systemPrompt: chat.systemPrompt
            },
            {
              id: `user-${chat.id}`,
              content: chat.userPrompt,
              role: 'user' as const,
              timestamp: new Date(chat.createdAt),
              systemPrompt: chat.systemPrompt
            }
            
          ];
        }, []).reverse();
          
          
          setMessages(historyMessages.length > 0 ? historyMessages : [welcomeMessage]);
        } else {
          setMessages([welcomeMessage]);
        }
      } catch (error) {
        console.error('Failed to fetch chat history:', error);
        setMessages([welcomeMessage]);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to load chat history',
        });
      } finally {
        setRefreshing(false);
        
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    };

    loadInitialData();
  }, [referesh]);


  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    // Create user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputText,
      role: 'user',
      timestamp: new Date(),
      systemPrompt: selectedPrompt.prompt
    };

    // Optimistically add user message to UI
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Send both the system prompt and user message to backend
      let payload: any = { userMessage: inputText };
      if (!systemPromptCache.current[selectedPrompt.id]) {
        payload.systemPrompt = selectedPrompt.prompt;
        systemPromptCache.current[selectedPrompt.id] = true; // Mark as sent/cached
      }

      const response = await ChatService.sendMessage(payload);
      
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
        systemPrompt: selectedPrompt.prompt
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
  
  useEffect(() => {
    if (messages.length > 0) {
      const timer = setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [messages]);


  // Reset cache when prompt changes
  useEffect(() => {
    systemPromptCache.current[selectedPrompt.id] = false;
  }, [selectedPrompt.id]);


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



  const defaultVisiblePrompts = [systemPrompts[4], systemPrompts[0]];

  const visiblePrompts = showAllPrompts 
    ? (hasSubscription ? systemPrompts : defaultVisiblePrompts) 
    : defaultVisiblePrompts;

  return (
    <LinearGradient colors={['#F5F7FF', '#E8ECFF']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={{ flex: 1, paddingBottom:5}}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 10}
          >
          <CustomHeader />

          <View>  
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
          </View>

          {/* Chat Messages with pull-to-refresh */}
          <ScrollView
            ref={scrollViewRef}
            style={styles.messagesContainer}
            contentContainerStyle={styles.messagesContent}
            
            onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => setRefresh(prev => !prev)}
                  colors={['#8B5CF6']}
                tintColor={'#8B5CF6'}
              />
            }
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

          <View style={styles.inputRow}>
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
    flex:1,
    	backgroundColor: "#F8FAFC",
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    
  },
  promptsContainer: {
    maxHeight: 50,
    marginTop: 10,
    paddingHorizontal: 15,
  },
  promptsContent: {
    paddingRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  moreButton: {
    marginRight: 10,
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
    paddingBottom:10

  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal:10
  
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