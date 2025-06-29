import { MarketPlaceService } from '@/api/MarketPlace';
import CustomHeader from '@/components/CustomHeader';
import FilterModal from '@/components/FilterModal';
import PromptCard from '@/components/PromptCard';
import { LinearGradient } from 'expo-linear-gradient';
import { Check, Filter, Search, TrendingUp, X } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
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
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  rating: number;
  likesCount: number;
  author: Author;
  content: string;
  userPrompt: string,
  modelUsed:string,
  systemPrompt:string,
  outputImage: string[];
  outputText: string;
  isActivate: boolean;
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
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [showPromptModal, setShowPromptModal] = useState(false);
  const [likedPrompts, setLikedPrompts] = useState<Set<number>>(new Set());
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [isBuying, setIsBuying] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);
  const [copied, setCopied] = useState(false);
  const upiId = "aaryanmeena96-1@okicici";
  const qrCodeUrl = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=yourupi@bank&pn=PromptMarket";

  const [currentFilters, setCurrentFilters] = useState({
    sortBy: 'newest',
    price: 'all',
    rating: 'all',
    category: 'All'
  });

  const fetchPrompts = async () => {
    setLoading(true);
    try {
      console.log(" search qury in fronted function",searchQuery);
      const response = await MarketPlaceService.getPromptByQuery(selectedCategory,searchQuery.trim());
      setPrompts(response.data);
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
  if (debounceTimeout.current) {
    clearTimeout(debounceTimeout.current);
  }
  debounceTimeout.current = setTimeout(() => {
    fetchPrompts();
  }, 500) as unknown as NodeJS.Timeout; 

  return () => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
  };
}, [selectedCategory, searchQuery]);


  const handlePromptPress = (prompt: Prompt) => {
    setSelectedPrompt(prompt);
    setShowPromptModal(true);
  };


  const handleLike = (promptId: number) => {
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

  const handleCopyUPI = async () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const handleUsePrompt = () => {
    Toast.show({
      type:'success',
      text1:'Prompt saved',
      text2:'Prompt Saved Successfully'
    })
    setShowPromptModal(false);
  };

  const handlePurchasePrompt = async () => {
    if (!selectedPrompt) return;
    
    setShowQRModal(true);
    setPaymentDone(false);
    setCopied(false);
    
    // Simulate payment process
    setTimeout(async () => {
      try {
        setIsBuying(true);
        const response = await MarketPlaceService.purchasePrompt(selectedPrompt.id);
        
        if (response.success) {
          setPaymentDone(true);
          // Update the prompt's purchase status
          setPrompts(prev => prev.map(prompt => 
            prompt.id === selectedPrompt.id 
              ? { ...prompt, isActivate: true } 
              : prompt
          ));
          
          // Close modals after delay
          setTimeout(() => {
            setShowQRModal(false);
            setIsBuying(false);
          }, 1000);
        }
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Purchase Failed',
          text2: 'There was an error processing your purchase',
        });
        setIsBuying(false);
      }
    }, 1000);
  };

  useEffect(() => {
    if (paymentDone) {
      const timer = setTimeout(() => {
        setShowQRModal(false);
        setIsBuying(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [paymentDone]);

  return (
    <LinearGradient colors={['#F5F7FF', '#E8ECFF']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <CustomHeader />

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
                isPurched={prompt.isActivate}
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

        {/* Prompt Detail Modal */}
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
                <View style={[{flex:1, flexDirection:'row', gap:5,},styles.section]}>

                  <View style={[styles.modalCategory]}>
                       <Text style={styles.modelCategoryText}>{selectedPrompt?.category}</Text>
                  </View>

                  <View style={styles.modalCategory}>
                       <Text style={styles.modelCategoryText}>{selectedPrompt?.modelUsed}</Text>
                  </View>

                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Description</Text>
                    <View style={styles.menuItem}>
                      <Text style={styles.menuText}>
                        {selectedPrompt?.description}
                      </Text>
                    </View>
                    
                  </View>
                {selectedPrompt?.outputText && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Text Output</Text>
                    <View style={styles.menuItem}>
                      <Text style={styles.menuText}>
                        {selectedPrompt.outputText}
                      </Text>
                    </View>
                  </View>
                  
                )}

                { selectedPrompt?.outputImage?.length  && selectedPrompt?.outputImage?.length > 0  && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Image Output</Text>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      style={styles.imageContainer}>
                      <View style={styles.imageContainer}>
                        {selectedPrompt?.outputImage.map((imageUrl, index) => (
                          <Image
                            key={`image-${index}`}
                            source={{ uri: imageUrl }}
                            style={styles.outputImage}
                            resizeMode="contain"
                          />
                        ))}
                      </View>
                    </ScrollView>
                  </View>
                )}
                  
              
          

                 {selectedPrompt?.isActivate || selectedPrompt?.price == 0  && (selectedPrompt.userPrompt.trim())&& (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>User Prompt</Text>
                    <View style={styles.menuItem}>
                      <Text style={styles.menuText}>
                        {selectedPrompt?.userPrompt}
                      </Text>
                      <TouchableOpacity onPress={handleCopyUPI} style={styles.qrCopyButton}>
                      {copied ?  (
                          <Check size={18} color="#22C55E" />
                       ) : (
                         <Text style={styles.qrCopyText}>Copy</Text>
                       )}
                  </TouchableOpacity>
                    </View>
                  </View>
                )}
                {selectedPrompt?.isActivate || selectedPrompt?.price == 0 && (selectedPrompt.systemPrompt.trim()) && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>System Prompt</Text>
                    <View style={styles.menuItem}>
                      <Text style={styles.menuText}>
                        {selectedPrompt.systemPrompt}
                      </Text>
                      <TouchableOpacity onPress={handleCopyUPI} style={styles.qrCopyButton}>
                    {copied ? (
                      <Check size={18} color="#22C55E" />
                    ) : (
                      <Text style={styles.qrCopyText}>Copy</Text>
                    )}
                  </TouchableOpacity>
                    </View>
                    
                  </View>
                )}


              </ScrollView>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  onPress={() => setShowPromptModal(false)}
                  style={styles.cancelButton}
                  disabled={isBuying}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>


                {selectedPrompt?.price === 0 || selectedPrompt?.isActivate ? (
                  <TouchableOpacity onPress={handleUsePrompt} style={styles.useButton}>
                    <LinearGradient colors={['#10B981', '#059669']} style={styles.useGradient}>
                      <Text style={styles.useButtonText}>
                        Save Prompt
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity 
                    onPress={handlePurchasePrompt} 
                    style={styles.purchaseButton}
                    disabled={isBuying}
                  >
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

        {/* QR Payment Modal */}
        <Modal
          visible={showQRModal}
          transparent
          animationType="slide"
          onRequestClose={() => !isBuying && setShowQRModal(false)}
        >
          <View style={styles.qrModalOverlay}>
            <View style={styles.qrModalContent}>
              <TouchableOpacity
                style={styles.qrModalClose}
                onPress={() => !isBuying && setShowQRModal(false)}
                disabled={isBuying}
              >
                <X size={22} color="#64748B" />
              </TouchableOpacity>
              <Text style={styles.qrModalTitle}>Scan & Pay</Text>
              <Image
                source={{ uri: qrCodeUrl }}
                style={styles.qrImage}
                resizeMode="contain"
              />

              <View>
                <View style={styles.qrUPIRow}>
                  <Text style={styles.qrUPIText}>{upiId}</Text>
                  <TouchableOpacity onPress={handleCopyUPI} style={styles.qrCopyButton}>
                    {copied ? (
                      <Check size={18} color="#22C55E" />
                    ) : (
                      <Text style={styles.qrCopyText}>Copy</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
              
              {isBuying ? (
                <View style={styles.loadingPayment}>
                  <ActivityIndicator size="small" color="#8B5CF6" />
                  <Text style={styles.loadingPaymentText}>Processing payment...</Text>
                </View>
              ) : (
                <Text style={styles.qrNote}>Scan this QR-code for payment</Text>
              )}
            </View>
          </View>
        </Modal>

        <FilterModal
          visible={showFilterModal}
          onClose={() => setShowFilterModal(false)}
          onApply={(filters: any) => {
            setCurrentFilters(filters);
            setShowFilterModal(false);
          }}
          currentFilters={currentFilters}
        />
      </SafeAreaView>
    </LinearGradient>
  );
}

// ... (keep your existing styles)

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
    maxHeight: '85%',
    paddingBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  modalScroll: {
    paddingHorizontal:20,
  },
  modalTitle: {
    color: '#1E293B',
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginBottom: 5,
  },
  modalCategory: {
    backgroundColor: '#8B5CF6',
    borderColor: '#7C3AED',
    maxHeight: 35,
    width:'25%',
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
  imageContainer: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: 10,
},
outputImage: {
  width: 300,
  height: 300,
  borderRadius: 20,
  backgroundColor: '#f0f0f0',
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
  qrModalOverlay: {
     flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    
  },
  qrModalContent: {
   backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    paddingBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal:20,
    paddingVertical:10,
    alignItems:'center'
  },
  qrModalClose: {
    position: 'absolute',
    right: 12,
    top: 12,
    zIndex: 2,
    padding: 4,
  },
  qrModalTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
    marginBottom: 16,
    marginTop: 4,
  },
  qrImage: {
    width: 180,
    height: 180,
    marginBottom: 18,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
  },
  qrModalSubtitle: {
    fontSize: 15,
    color: '#6366F1',
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },

  qrUPIRow: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 12,
		paddingHorizontal: 20,
		borderRadius: 8,
		marginBottom: 4,
		backgroundColor: "#FFFFFF",
		borderWidth: 1,
		borderColor: "#E2E8F0",
	
  },
  qrUPIText: {
    fontSize: 15,
    color: '#1E293B',
    fontFamily: 'Inter-Medium',
    marginRight: 8,
  },
  qrCopyButton: {
    backgroundColor: '#E0E7FF',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginLeft: 4,
  },
  qrCopyText: {
    color: '#6366F1',
    fontFamily: 'Inter-Medium',
    fontSize: 13,
  },
  qrPaidButton: {
    width: '100%',
    marginTop: 10,
  },
  qrPaidGradient: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  qrPaidText: {
    color: '#fff',
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
  qrNote: {
    color: '#64748B',
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
});