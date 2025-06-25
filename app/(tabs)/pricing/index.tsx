import { LinearGradient } from 'expo-linear-gradient';
import { Check, Crown, Star, Zap } from 'lucide-react-native';
import React, { useEffect, useRef } from 'react';
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.65; 
const CARD_MARGIN = width * 0.001;
const PEEK_WIDTH = width * 0.12;

const pricingPlans = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for getting started',
    features: [
      'Basic AI chat functionality',
      'Access to 2 system prompts',
      'Voice input capability',
      'Browse free prompts',
      '50 messages history',
    ],
    icon: Zap,
    popular: false,
    buttonText: 'Current Plan',
    gradient: ['#6B7280', '#4B5563']
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '$9.99',
    period: 'per month',
    description: 'For power users',
    features: [
      'Unlimited AI messages',
      'All system prompts',
      'Priority response speed',
      'Buy/sell prompts',
      'Unlimited history',
      'Export conversations',
      'Advanced voice',
      'Custom prompts',
    ],
    icon: Crown,
    popular: true,
    buttonText: 'Upgrade Now',
    gradient: ['#8B5CF6', '#7C3AED'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$19.99',
    period: 'per month',
    description: 'For teams & businesses',
    features: [
      'Everything in Premium',
      'Team collaboration',
      'API access',
      'White-label solution',
      'Priority support',
      'Advanced analytics',
      'Custom AI training',
      'Bulk operations',
    ],
    icon: Star,
    popular: false,
    buttonText: 'Contact Sales',
    gradient: ['#F59E0B', '#D97706'],
  },
];

export default function PricingScreen() {


  const scrollViewRef = useRef<ScrollView>(null);
  useEffect(() => {
    // Scroll to the second card (Premium) when component mounts
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({
        x: CARD_WIDTH + CARD_MARGIN * 2 - PEEK_WIDTH,
        animated: false,
      });
    }, 50);
  }, []);


  const handlePlanSelect = (planId: string) => {
    console.log('Selected plan:', planId);
    // Handle plan selection/purchase
  };

  return (
    <LinearGradient colors={['#F5F7FF', '#E8ECFF']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          <View style={styles.carouselContainer}>
            <ScrollView
              ref={scrollViewRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={[
                styles.horizontalScroll,
                { paddingHorizontal: PEEK_WIDTH },
              ]}
              snapToInterval={CARD_WIDTH + CARD_MARGIN * 2}
              decelerationRate="fast"
            >
              {pricingPlans.map((plan, index) => (
                <View 
                  key={plan.id} 
                  style={[
                    styles.planCard,
                    index === 1 && styles.highlightedCard,
                    { 
                      width: CARD_WIDTH,
                      marginHorizontal: CARD_MARGIN,
                      // Scale down non-center cards slightly
                      transform: [
                        { translateY: index === 1 ? -20 : 0 },
                        { scale: index === 1 ? 1 : 0.95 }
                      ],
                    }
                  ]}
                >
                  {plan.popular && (
                    <View style={styles.popularBadge}>
                      <Text style={styles.popularText}>Most Popular</Text>
                    </View>
                  )}
                  
                  <LinearGradient
                    colors={plan.gradient as [string, string]}
                    style={styles.planHeader}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <plan.icon size={32} color="#FFFFFF" />
                    <Text style={styles.planName}>{plan.name}</Text>
                    <View style={styles.priceContainer}>
                      <Text style={styles.price}>{plan.price}</Text>
                      <Text style={styles.period}>/{plan.period}</Text>
                    </View>
                    <Text style={styles.description}>{plan.description}</Text>
                  </LinearGradient>

                  <View style={styles.planBody}>
                    <View style={styles.featuresContainer}>
                      {plan.features.map((feature, i) => (
                        <View key={i} style={styles.featureRow}>
                          <Check size={16} color="#10B981" />
                          <Text style={styles.featureText}>{feature}</Text>
                        </View>
                      ))}
                    </View>

                    <TouchableOpacity
                      onPress={() => handlePlanSelect(plan.id)}
                      style={styles.selectButton}
                    >
                      <LinearGradient
                        colors={
                          (plan.id === 'free'
                            ? ['#E5E7EB', '#D1D5DB']
                            : plan.gradient) as [string, string]
                        }
                        style={styles.selectGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                      >
                        <Text style={styles.selectButtonText}>{plan.buttonText}</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
          <View style={styles.faqContainer}>
            <Text style={styles.faqTitle}>Frequently Asked Questions</Text>
            
            <View style={styles.faqItem}>
              <Text style={styles.faqQuestion}>Q. Can I change my plan anytime?</Text>
              <Text style={styles.faqAnswer}>
                Yes, you can upgrade or downgrade your plan at any time.
              </Text>
            </View>

            <View style={styles.faqItem}>
              <Text style={styles.faqQuestion}>Q. Is there a free trial?</Text>
              <Text style={styles.faqAnswer}>
                Yes, we offer a 7-day free trial for Premium plans.
              </Text>
            </View>

            <View style={styles.faqItem}>
              <Text style={styles.faqQuestion}>Q. What payment methods are accepted?</Text>
              <Text style={styles.faqAnswer}>
                We accept credit cards, PayPal, and Apple Pay/Google Pay.
              </Text>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              All plans come with a 30-day money-back guarantee
            </Text>
          </View>
        </ScrollView>
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
    marginTop:10
  },
  scrollContent: {
    paddingBottom: 40,

  },
  carouselContainer: {
    width: '100%',
  
  },
  header: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  title: {
    color: '#1E293B',
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
  },
  subtitle: {
    color: '#64748B',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    lineHeight: 20,
  },
  horizontalScroll: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  planCard: {
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  highlightedCard: {
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.2,
    shadowRadius: 25,
    elevation: 10,
  },

  popularBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#EF4444',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  popularText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Inter-Bold',
  },
  planHeader: {
    padding: 5,
    alignItems: 'center',
  },
  planName: {
    color: '#FFFFFF',
    fontSize: 22,
    fontFamily: 'Inter-Bold',

  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    
  },
  price: {
    color: '#FFFFFF',
    fontSize: 32,
    fontFamily: 'Inter-Bold',
  },
  period: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    opacity: 0.9,
    marginLeft: 4,
  },
  description: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    opacity: 0.7,
    textAlign: 'center',
  },
  planBody: {
    padding: 10,
  },
  featuresContainer: {
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  featureText: {
    color: '#475569',
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    marginLeft: 10,
    flex: 1,
    lineHeight: 20,
  },
  selectButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  selectGradient: {
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 12,
  },
  selectButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  faqContainer: {
    paddingHorizontal: 24,
    marginTop:-10
  },
  faqTitle: {
    color: '#1E293B',
    fontSize: 22,
    fontFamily: 'Inter-Bold',
    marginBottom: 5,
    textAlign: 'left',
  },
  faqItem: {
    marginBottom: 5,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  faqQuestion: {
    color: '#1E293B',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 2,
  },
  faqAnswer: {
    color: '#64748B',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  footerText: {
    color: '#64748B',
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
   
});