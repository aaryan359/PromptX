import PromptCard from '@/components/PromptCard';
import { LinearGradient } from 'expo-linear-gradient';
import { Filter, Plus, Search, TrendingUp } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Prompt {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  rating: number;
  likes: number;
  author: string;
  content: string;
}

const samplePrompts: Prompt[] = [
  {
    id: '1',
    title: 'Professional Email Generator',
    description: 'Generate professional, well-structured emails for any business situation.',
    category: 'Business',
    price: 4.99,
    rating: 4.8,
    likes: 156,
    author: 'Sarah Johnson',
    content: 'You are a professional business communication expert...',
  },
  {
    id: '2',
    title: 'Creative Story Starter',
    description: 'Get unique and engaging story ideas with character development.',
    category: 'Creative',
    price: 0,
    rating: 4.6,
    likes: 203,
    author: 'Mike Chen',
    content: 'You are a creative writing assistant that helps generate...',
  },
  {
    id: '3',
    title: 'Code Review Assistant',
    description: 'Comprehensive code review with best practices and optimization tips.',
    category: 'Tech',
    price: 7.99,
    rating: 4.9,
    likes: 89,
    author: 'Alex Rodriguez',
    content: 'You are an expert software engineer conducting a thorough code review...',
  },
  {
    id: '4',
    title: 'Social Media Caption Creator',
    description: 'Generate engaging captions for Instagram, Twitter, and LinkedIn posts.',
    category: 'Marketing',
    price: 2.99,
    rating: 4.5,
    likes: 312,
    author: 'Emma Davis',
    content: 'You are a social media expert who creates viral-worthy captions...',
  },
  {
    id: '5',
    title: 'Recipe Optimizer',
    description: 'Transform any recipe to be healthier while maintaining great taste.',
    category: 'Lifestyle',
    price: 0,
    rating: 4.7,
    likes: 128,
    author: 'Chef Marcus',
    content: 'You are a nutritional expert and chef who specializes in...',
  },
];

const categories = ['All', 'Business', 'Creative', 'Tech', 'Marketing', 'Lifestyle'];

export default function MarketplaceScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [showPromptModal, setShowPromptModal] = useState(false);
  const [likedPrompts, setLikedPrompts] = useState<Set<string>>(new Set());

  const filteredPrompts = samplePrompts.filter(prompt => {
    const matchesSearch = prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         prompt.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || prompt.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handlePromptPress = (prompt: Prompt) => {
    setSelectedPrompt(prompt);
    setShowPromptModal(true);
  };

  const handleLike = (promptId: string) => {
    setLikedPrompts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(promptId)) {
        newSet.delete(promptId);
      } else {
        newSet.add(promptId);
      }
      return newSet;
    });
  };

  const handleUsePrompt = () => {
    setShowPromptModal(false);
    // Navigate to chat screen with selected prompt
    // This would typically use navigation to switch tabs and pass the prompt
  };

  const handlePurchasePrompt = () => {
    // Handle prompt purchase
    console.log('Purchase prompt:', selectedPrompt?.id);
    setShowPromptModal(false);
  };
  return (
    <LinearGradient colors={['#F5F7FF', '#E8ECFF']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          
          <Text style={styles.subtitle}>Discover and share AI prompts</Text>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchBox}>
            <Search size={20} color="#64748B" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search prompts..."
              placeholderTextColor="#64748B"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={20} color="#8B5CF6" />
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
          contentContainerStyle={styles.categoriesContent}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              onPress={() => setSelectedCategory(category)}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.selectedCategoryButton,
              ]}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category && styles.selectedCategoryText,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <TrendingUp size={16} color="#10B981" />
            <Text style={styles.statText}>{filteredPrompts.length} prompts found</Text>
          </View>
        </View>

        <ScrollView style={styles.promptsList} contentContainerStyle={styles.promptsContent}>
          {filteredPrompts.map((prompt) => (
            <PromptCard
              key={prompt.id}
              id={prompt.id}
              title={prompt.title}
              description={prompt.description}
              category={prompt.category}
              price={prompt.price}
              rating={prompt.rating}
              likes={prompt.likes + (likedPrompts.has(prompt.id) ? 1 : 0)}
              author={prompt.author}
              onPress={() => handlePromptPress(prompt)}
              onLike={() => handleLike(prompt.id)}
            />
          ))}
        </ScrollView>

        <TouchableOpacity style={styles.createButton}>
          <LinearGradient colors={['#8B5CF6', '#7C3AED']} style={styles.createGradient}>
            <Plus size={24} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>

        <Modal
          visible={showPromptModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowPromptModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <ScrollView style={styles.modalScroll}>
                <Text style={styles.modalTitle}>{selectedPrompt?.title}</Text>
                <Text style={styles.modalCategory}>{selectedPrompt?.category}</Text>
                <Text style={styles.modalDescription}>{selectedPrompt?.description}</Text>
                
                <View style={styles.modalStats}>
                  <Text style={styles.modalAuthor}>By {selectedPrompt?.author}</Text>
                  <Text style={styles.modalRating}>★ {selectedPrompt?.rating}</Text>
                </View>
                
                <View style={styles.promptPreview}>
                  <Text style={styles.previewTitle}>Prompt Preview:</Text>
                  <Text style={styles.previewContent}>{selectedPrompt?.content}</Text>
                </View>
              </ScrollView>
              
              <View style={styles.modalActions}>
                <TouchableOpacity
                  onPress={() => setShowPromptModal(false)}
                  style={styles.cancelButton}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                
                {selectedPrompt?.price === 0 ? (
                  <TouchableOpacity onPress={handleUsePrompt} style={styles.useButton}>
                    <LinearGradient colors={['#10B981', '#059669']} style={styles.useGradient}>
                      <Text style={styles.useButtonText}>Use Free</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity onPress={handlePurchasePrompt} style={styles.purchaseButton}>
                    <LinearGradient colors={['#8B5CF6', '#7C3AED']} style={styles.purchaseGradient}>
                      <Text style={styles.purchaseButtonText}>
                        Buy ${selectedPrompt?.price}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                )}
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
    paddingVertical: 10,
    alignItems: 'center',

  },
  subtitle: {
    color: '#64748B',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchInput: {
    flex: 1,
    color: '#1E293B',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginLeft: 12,
  },
  filterButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  categoriesContainer: {
    maxHeight: 35,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  categoriesContent: {
    paddingRight: 20,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  selectedCategoryButton: {
    backgroundColor: '#8B5CF6',
    borderColor: '#7C3AED',
  },
  categoryText: {
    color: '#475569',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  selectedCategoryText: {
    color: '#FFFFFF',
  },
  statsContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    color: '#10B981',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginLeft: 8,
  },
  promptsList: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
  },
  promptsContent: {
    paddingBottom: 100,
  },
  createButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  createGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    paddingBottom: 34,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  modalScroll: {
    padding: 20,
  },
  modalTitle: {
    color: '#1E293B',
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
  },
  modalCategory: {
    color: '#8B5CF6',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginBottom: 16,
  },
  modalDescription: {
    color: '#475569',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    lineHeight: 24,
    marginBottom: 16,
  },
  modalStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  modalAuthor: {
    color: '#64748B',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  modalRating: {
    color: '#D97706',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  promptPreview: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  previewTitle: {
    color: '#1E293B',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
  },
  previewContent: {
    color: '#475569',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
  modalActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
  },
  cancelButtonText: {
    color: '#1E293B',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  useButton: {
    flex: 1,
  },
  useGradient: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  useButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  purchaseButton: {
    flex: 1,
  },
  purchaseGradient: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  purchaseButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
});