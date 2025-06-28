import { MarketPlaceService } from '@/api/MarketPlace';
import { PlusCircle, UploadCloud } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

const MODELS = [
  { label: 'GPT-4', value: 'gpt-4' },
  { label: 'Llama 3', value: 'llama-3' },
  { label: 'Anthropic', value: 'anthropic' },
  { label: 'Gemini', value: 'gemini' },
  { label: 'Other', value: 'other' },
];

const CATEGORIES = [
  'Writing',
  'Coding',
  'Productivity',
  'Education',
  'Design',
  'Marketing',
  'Fun',
  'Other',
];

export default function AddPromptScreen() {
  const [userPrompt, setUserPrompt] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [promptTitle , setPromptTitle] = useState('');
  const [promptDescription, setPromptDescription] = useState('');
  const [selectedModel, setSelectedModel] = useState(MODELS[0].value);
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [price, setPrice] = useState('');
  const [isFree, setIsFree] = useState(true);
  const [outputImages, setOutputImages] = useState<string[]>([]);
  const [outputText, setOutputText] = useState('');

  
  const handleImageUpload = () => {
    setOutputImages([...outputImages, 'https://placehold.co/80x80']);
  };



  const handleSubmit = async () => {

    if (!promptTitle.trim()) {
      Toast.show({
          type:'error',
          text1:'Enter all the details',
          text2:'Prompt Title is required '
        })
      return;
    }
    if (!promptDescription.trim()) {
      Toast.show({
          type:'error',
          text1:'Enter all the details',
          text2:'Prompt Description is required '
        })
      return;
    }

    if (!userPrompt.trim()) {
      Toast.show({
          type:'error',
          text1:'Enter all the details',
          text2:'User prompt is required '
        })
      return;
    }
       
  try {

    const priceFloat = parseFloat(price);
      const promptData = {
         promptTitle,
         promptDescription,
         userPrompt,
         systemPrompt,
         selectedCategory,
         selectedModel,
         isFree,
         price:priceFloat,
         outputText,
         outputImages
      }
      const response = await MarketPlaceService.AddPrompt(promptData)
      if(response.success){
        Toast.show({
          type:'success',
          text1:'Prompt added successfully',
          text2:'Your prompt has been added to the market!'
        })
      }

      setPromptTitle('');
      setOutputImages([])
      setIsFree(false);
      setOutputText('')
      setPromptDescription('')
      setSelectedCategory(CATEGORIES[0])
      setSystemPrompt('')
      setUserPrompt('')
      setIsFree(true)
      setSelectedModel(MODELS[0].value)

  } catch (error:any) {

    Toast.show({
      type:'error',
      text1:'failed to add prompt',
      text2:error.message
    })
  }
    
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Add Your Prompt</Text>

             <View style={styles.section}>
            <View>

            <Text style={styles.label}>Prompt Title <Text style={{color:'#EF4444'}}>*</Text></Text>
            <TextInput
              style={styles.input}
              placeholder="Enter prompt title..."
              value={promptTitle}
              onChangeText={setPromptTitle}
              multiline
              maxLength={500}
              placeholderTextColor="#94A3B8"
            />
            </View>

            <View style={{marginTop:5}}>
            <Text style={styles.label}>Prompt Description <Text style={{color:'#EF4444'}}>*</Text> </Text>
            <TextInput
              style={styles.input}
              placeholder="Enter system prompt (optional)..."
              value={promptDescription}
              onChangeText={setPromptDescription}
              multiline
              maxLength={500}
              placeholderTextColor="#94A3B8"
            />
            </View>
          </View>

          {/* User Prompt  and system prompt*/}
          <View style={styles.section}>
            <View>

            <Text style={styles.label}>User Prompt <Text style={{color:'#EF4444'}}>*</Text></Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your prompt..."
              value={userPrompt}
              onChangeText={setUserPrompt}
              multiline
              maxLength={500}
              placeholderTextColor="#94A3B8"
            />
            </View>
            <View style={{marginTop:5}}>
            <Text style={styles.label}>System Prompt <Text style={styles.optional}>(optional)</Text></Text>
            <TextInput
              style={styles.input}
              placeholder="Enter system prompt (optional)..."
              value={systemPrompt}
              onChangeText={setSystemPrompt}
              multiline
              maxLength={500}
              placeholderTextColor="#94A3B8"
            />
            </View>
          </View>

          {/* Model Selection */}
          <View style={styles.section}>
            <Text style={styles.label}>Model Used</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.modelRow}>
              {MODELS.map((model) => (
                <TouchableOpacity
                  key={model.value}
                  style={[
                    styles.modelButton,
                    selectedModel === model.value && styles.modelButtonSelected,
                  ]}
                  onPress={() => setSelectedModel(model.value)}
                >
                  <Text
                    style={[
                      styles.modelButtonText,
                      selectedModel === model.value && styles.modelButtonTextSelected,
                    ]}
                  >
                    {model.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            </ScrollView>
          </View>

          {/* Category Selection */}
          <View style={styles.section}>
            <Text style={styles.label}>Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.categoryRow}>
                {CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.categoryButton,
                      selectedCategory === cat && styles.categoryButtonSelected,
                    ]}
                    onPress={() => setSelectedCategory(cat)}
                  >
                    <Text
                      style={[
                        styles.categoryButtonText,
                        selectedCategory === cat && styles.categoryButtonTextSelected,
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Price Section */}
          <View style={styles.section}>
            <Text style={styles.label}>Price</Text>
            <View style={styles.priceRow}>
              <TouchableOpacity
                style={[styles.freeButton, isFree && styles.freeButtonActive]}
                onPress={() => setIsFree(true)}
              >
                <Text style={[styles.freeButtonText, isFree && styles.freeButtonTextActive]}>Free</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.freeButton, !isFree && styles.freeButtonActive]}
                onPress={() => setIsFree(false)}
              >
                <Text style={[styles.freeButtonText, !isFree && styles.freeButtonTextActive]}>Paid</Text>
              </TouchableOpacity>
              {!isFree && (

                <TextInput
                  style={styles.priceInput}
                  placeholder="₹ Price"
                  value={price}
                  onChangeText={setPrice}
                  keyboardType="numeric"
                  placeholderTextColor="#94A3B8"
                />
              )}
            </View>
          </View>

          {/* Output Section */}
          <View style={styles.section}>
            <Text style={styles.label}>Output (optional)</Text>
            <View style={styles.outputRow}>
              <TouchableOpacity style={styles.uploadButton} onPress={handleImageUpload}>
                <UploadCloud size={18} color="#6366F1" />
                <Text style={styles.uploadButtonText}>Image</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginTop: 8}}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                {outputImages.map((img, idx) => (
                  <Image
                    key={idx}
                    source={{ uri: img }}
                    style={styles.outputImage}
                  />
                ))}
              </View>
            </ScrollView>
            <TextInput
              style={[styles.input, {marginTop: 8}]}
              placeholder="Output text (optional)..."
              value={outputText}
              onChangeText={setOutputText}
              multiline
              maxLength={500}
              placeholderTextColor="#94A3B8"
            />
          </View>

          
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <PlusCircle size={20} color="#fff" />
            <Text style={styles.submitButtonText}>Submit Prompt</Text>
          </TouchableOpacity>

          
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  safeArea: { flex:1 },
  scrollContent: { paddingBottom:44  },
  title: {
    fontSize: 20,
    color: '#1E293B',
    fontFamily: 'Inter-Bold',
    marginLeft: 24,
    marginBottom: 5,
  },
  section: {
    marginBottom: 8,
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  label: {
    color: '#1E293B',
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 6,
  },
  optional: {
    color: '#64748B',
    fontSize: 13,
    fontFamily: 'Inter-Regular',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 10,
    fontSize: 15,
    color: '#1E293B',
    fontFamily: 'Inter-Regular',
    minHeight: 44,
    marginBottom: 1,
  },
  modelRow: {
    flexDirection: 'row',
    
  
  },
  modelButton: {
    backgroundColor: '#E0E7FF',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 4,
  },
  modelButtonSelected: {
    backgroundColor: '#6941C6',
  },
  modelButtonText: {
    color: '#6941C6',
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  modelButtonTextSelected: {
    color: '#fff',
  },
  categoryRow: {
    flexDirection: 'row',
  },
  categoryButton: {
    backgroundColor: '#E0E7FF',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 4,
  },
  categoryButtonSelected: {
    backgroundColor: '#6941C6',
  },
  categoryButtonText: {
    color: '#6941C6',
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  categoryButtonTextSelected: {
    color: '#fff',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  freeButton: {
    backgroundColor: '#E0E7FF',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
  },
  freeButtonActive: {
    backgroundColor: '#6941C6',
  },
  freeButtonText: {
    color: '#6941C6',
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  freeButtonTextActive: {
    color: '#fff',
  },
  priceInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 4,
    fontSize: 15,
    color: '#6941C6',
    fontFamily: 'Inter-Regular',
    width: 80,
    marginLeft: 4,
  },
  outputRow: {
    flexDirection: 'row',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0E7FF',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  uploadButtonText: {
    color: '#6941C6',
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginLeft: 4,
  },
  outputImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  pdfBadge: {
    backgroundColor: '#F59E0B',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 8,
  },
  pdfBadgeText: {
    color: '#fff',
    fontFamily: 'Inter-Bold',
    fontSize: 13,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6941C6',
    borderRadius: 24,
    paddingVertical: 12,
    justifyContent: 'center',
    marginHorizontal: 40,
    marginTop: 2,
    gap: 12,
  },
  submitButtonText: {
    color: '#fff',
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
  },
  successBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 30,
    marginTop: 18,
    justifyContent: 'center',
    gap: 10,
  },
  successText: {
    color: '#22C55E',
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
  },
});