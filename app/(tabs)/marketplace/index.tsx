import { MarketPlaceService } from '@/api/MarketPlace';
import CustomHeader from '@/components/CustomHeader';
import FilterModal from '@/components/FilterModal';
import PromptCard from '@/components/PromptCard';
import { LinearGradient } from 'expo-linear-gradient';
import { Filter, Search, TrendingUp } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

interface Author {
  name: string;
}

interface Prompt {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  rating: number;
  likesCount:number
  author: Author;
  content: string;
  outputImage : [];
  outputText :string,
}

const categories = [
  'All',
  'Writing',
  'Coding',
  'Productivity',
  'Education',
  'Design',
  'Marketing',
  'Fun',
  'Other',
];

export default function MarketplaceScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [showPromptModal, setShowPromptModal] = useState(false);
  const [likedPrompts, setLikedPrompts] = useState<Set<string>>(new Set());
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [currentFilters, setCurrentFilters] = useState({
                                                       sortBy: 'newest',
                                                       price: 'all',
                                                       rating: 'all',
                                                       category: 'All'
                                                          });

  const fetchPrompts = async () => {
    setLoading(true);
    try {
      const respons = await MarketPlaceService.getPromptByQuery(selectedCategory);
      console.log("promtp from backend is",respons.data);
      setPrompts(respons.data);
    } catch (error: any) {
      if (error?.response?.status === 429) {
        Toast.show({
          type: 'error',
          text1: 'Rate limit exceeded',
          text2: 'You are sending requests too quickly. Please wait and try again.',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error fetching prompts',
          text2: 'Check your internet connection',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrompts();
  }, [selectedCategory]);


  const handlePromptPress = (prompt: Prompt) => {
    setSelectedPrompt(prompt);
    setShowPromptModal(true);
  };

  const handleLike = (promptId: string) => {
    setLikedPrompts((prev) => {
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
  };

  const handlePurchasePrompt = () => {
    // Handle prompt purchase
    // console.log('Purchase prompt:', selectedPrompt?.id);
    setShowPromptModal(false);
  };
 

  return (
    <LinearGradient colors={['#F5F7FF', '#E8ECFF']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <CustomHeader/>

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
         <TouchableOpacity 
  style={styles.filterButton}
  onPress={() => setShowFilterModal(true)}
>
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
            <Text style={styles.statText}>{prompts.length} prompts found</Text>
          </View>
        </View>

        {loading ? (
          <View style={styles.loaderContainer}>
            
              <ActivityIndicator size="large" color="#6941C6" />
            
          </View>
        ) : (
          <ScrollView style={styles.promptsList} contentContainerStyle={styles.promptsContent}>
            {prompts.map((prompt) => (
              <PromptCard
                key={prompt.id}
                id={prompt.id}
                title={prompt.title}
                description={prompt.description}
                category={prompt.category}
                price={prompt.price}
                rating={prompt.rating}
                likes={prompt.likesCount + (likedPrompts.has(prompt.id) ? 1 : 0)}
                author={prompt.author.name}
                onPress={() => handlePromptPress(prompt)}
                onLike={() => handleLike(prompt.id)}
              />
            ))}
            {prompts.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No prompts found.</Text>
              </View>
            )}
          </ScrollView>
        )}



        <Modal
          visible={showPromptModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowPromptModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHandle} />

              <ScrollView style={styles.modalScroll}>
                <Text style={styles.modalTitle}>{selectedPrompt?.title}</Text>
                <View style={styles.modalCategory}>
                <Text style={styles.modelCategoryText}>{selectedPrompt?.category}</Text>
                </View>
                <Text style={styles.modalDescription}>{selectedPrompt?.description}</Text>

                          <View style={styles.section}>

                                 <Text style={ styles.sectionTitle }> Text Output </Text>

                                 <View style={styles.menuItem}>
                                       <Text style={ styles.menuText }>
                                               {
                                                selectedPrompt?.outputText
                                               }
                                        </Text>
                                 </View>
                          </View>
                          <View style={styles.section}>

                                 <Text style={ styles.sectionTitle }> Text Output </Text>

                                 <View style={styles.menuItem}>
                                   {
                                    selectedPrompt?.outputImage && <Image source={selectedPrompt?.outputImage}  style={ styles.menuText }>
                                                
                                        </Image>
                                  }
                                        
                                 </View>
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

        <FilterModal
  visible={showFilterModal}
  onClose={() => setShowFilterModal(false)}
  onApply={(filters:any) => {
    setCurrentFilters(filters);
    // Here you would typically refetch data with the new filters
    // For example: fetchPromptsWithFilters(filters);
  }}
  currentFilters={currentFilters}
/>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
   backgroundColor: "#F8FAFC",
    alignItems: 'flex-start',
    paddingHorizontal:10
    
  },
  subtitle: {
    color: '#64748B',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginRight:10,
    
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    marginBottom: 10,
    marginTop:5,
    gap:5
  },
  modalHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    alignSelf: 'center',
    marginTop: 5,
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
    paddingHorizontal: 16,
    backgroundColor: "#F8FAFC",
  },
  promptsContent: {
    paddingBottom: 100,
  },
  loaderContainer: {
   backgroundColor: "#F8FAFC",
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  emptyState: {
    alignItems: 'center',
    marginTop: 40,
  },
  emptyStateText: {
    color: '#64748B',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
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
    paddingHorizontal:20,
    paddingVertical:10
  },
  modalTitle: {
    color: '#1E293B',
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
  },
  modalCategory: {
    backgroundColor: '#8B5CF6',
    borderColor: '#7C3AED',
    maxHeight: 35,
    width:'30%',
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  
  },
  modelCategoryText:{
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    alignSelf:'center'
  },

  modalDescription: {
    color: '#475569',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    lineHeight: 24,
    marginBottom: 5,
  },
  modalStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
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

	section: {
		marginBottom: 10,
		borderRadius: 12,
		padding: 10,
		backgroundColor: "#F8FAFC",
		borderWidth: 1,
		borderColor: "#E2E8F0",
	},
	sectionTitle: {
		color: "#1E293B",
		fontSize: 16,
		fontFamily: "Inter-SemiBold",
		marginBottom: 8,
	},
	menuItem: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 8,
		paddingHorizontal: 4,
		borderRadius: 8,
		marginBottom: 4,
		backgroundColor: "#FFFFFF",
		borderWidth: 1,
		borderColor: "#E2E8F0",
	},
	menuText: {
		color: "#1E293B",
		fontSize: 15,
		fontFamily: "Inter-Medium",
		marginLeft: 12,
		flex: 1,
	},
paywallContainer: {
  backgroundColor: '#F1F5F9',
  borderRadius: 8,
  padding: 16,
  alignItems: 'center',
},
paywallText: {
  color: '#64748B',
  fontSize: 14,
  fontFamily: 'Inter-Medium',
  marginBottom: 12,
},
subscribeButton: {
  width: '100%',
},
subscribeButtonGradient: {
  paddingVertical: 10,
  borderRadius: 8,
  alignItems: 'center',
},
subscribeButtonText: {
  color: '#FFFFFF',
  fontFamily: 'Inter-SemiBold',
  fontSize: 14,
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