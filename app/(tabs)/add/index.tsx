import { CheckCircle2, PlusCircle, UploadCloud } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
  const [selectedModel, setSelectedModel] = useState(MODELS[0].value);
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [price, setPrice] = useState('');
  const [isFree, setIsFree] = useState(true);
  const [outputImages, setOutputImages] = useState<string[]>([]);
  const [outputText, setOutputText] = useState('');
  const [outputPDFs, setOutputPDFs] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  // Dummy upload handlers
  const handleImageUpload = () => {
    // Replace with real image picker
    setOutputImages([...outputImages, 'https://placehold.co/80x80']);
  };

  const handlePDFUpload = () => {
    // Replace with real file picker
    setOutputPDFs([...outputPDFs, 'Sample.pdf']);
  };

  const handleSubmit = () => {
    if (!userPrompt.trim()) {
      Alert.alert('Validation', 'User prompt is required.');
      return;
    }
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2500);
    // Here you would send the data to your backend
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Add Your Prompt</Text>

          {/* User Prompt */}
          <View style={styles.section}>
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

          {/* System Prompt */}
          <View style={styles.section}>
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

          {/* Model Selection */}
          <View style={styles.section}>
            <Text style={styles.label}>Model</Text>
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
              <TouchableOpacity style={styles.uploadButton} onPress={handlePDFUpload}>
                <UploadCloud size={18} color="#6366F1" />
                <Text style={styles.uploadButtonText}>PDF</Text>
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
                {outputPDFs.map((pdf, idx) => (
                  <View key={idx} style={styles.pdfBadge}>
                    <Text style={styles.pdfBadgeText}>{pdf}</Text>
                  </View>
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

          {/* Submit Button */}
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <PlusCircle size={20} color="#fff" />
            <Text style={styles.submitButtonText}>Submit Prompt</Text>
          </TouchableOpacity>

          {/* Success Message */}
          {submitted && (
            <View style={styles.successBox}>
              <CheckCircle2 size={28} color="#22C55E" />
              <Text style={styles.successText}>Your prompt has been added to the market!</Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  safeArea: { flex: 1 },
  scrollContent: { paddingBottom: 40, paddingTop: 20 },
  title: {
    fontSize: 22,
    color: '#1E293B',
    fontFamily: 'Inter-Bold',
    marginLeft: 24,
    marginBottom: 18,
  },
  section: {
    marginBottom: 14,
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 12,
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
    marginBottom: 2,
  },
  modelRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  modelButton: {
    backgroundColor: '#E0E7FF',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 6,
  },
  modelButtonSelected: {
    backgroundColor: '#6366F1',
  },
  modelButtonText: {
    color: '#6366F1',
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  modelButtonTextSelected: {
    color: '#fff',
  },
  categoryRow: {
    flexDirection: 'row',
    gap: 8,
  },
  categoryButton: {
    backgroundColor: '#E0E7FF',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 6,
  },
  categoryButtonSelected: {
    backgroundColor: '#6366F1',
  },
  categoryButtonText: {
    color: '#6366F1',
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  categoryButtonTextSelected: {
    color: '#fff',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  freeButton: {
    backgroundColor: '#E0E7FF',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
  },
  freeButtonActive: {
    backgroundColor: '#6366F1',
  },
  freeButtonText: {
    color: '#6366F1',
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
    padding: 8,
    fontSize: 15,
    color: '#1E293B',
    fontFamily: 'Inter-Regular',
    width: 80,
    marginLeft: 4,
  },
  outputRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 4,
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
    color: '#6366F1',
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
    backgroundColor: '#6366F1',
    borderRadius: 24,
    paddingVertical: 14,
    justifyContent: 'center',
    marginHorizontal: 40,
    marginTop: 18,
    marginBottom: 10,
    gap: 8,
  },
  submitButtonText: {
    color: '#fff',
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
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