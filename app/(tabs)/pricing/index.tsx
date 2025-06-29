import { LinearGradient } from "expo-linear-gradient";
import { Check, Crown, Star, Zap } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Image, Modal } from "react-native";

import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const { width, height } = Dimensions.get("window");
const CARD_WIDTH = Math.min(width * 0.8, 350); // Max width of 350 for larger screens
const CARD_MARGIN = width * 0.02;
const PEEK_WIDTH = width * 0.1;

const pricingPlans = [
	{
		id: "free",
		name: "Free",
		price: "$0",
		period: "forever",
		description: "Perfect for getting started",
		features: [
			"Basic AI chat functionality",
			"Access to 2 system prompts",
			"Voice input capability",
			"Browse free prompts",
			"50 messages history",
		],
		icon: Zap,
		popular: false,
		buttonText: "Current Plan",
		gradient: ["#6B7280", "#4B5563"],
	},
	{
		id: "premium",
		name: "Premium",
		price: "$9.99",
		period: "per month",
		description: "For power users",
		features: [
			"Unlimited AI messages",
			"All system prompts",
			"Priority response speed",
			"Buy/sell prompts",
			"Unlimited history",
			"Export conversations",
			"Advanced voice",
			"Custom prompts",
		],
		icon: Crown,
		popular: true,
		buttonText: "Upgrade Now",
		gradient: ["#8B5CF6", "#7C3AED"],
	},
	{
		id: "pro",
		name: "Pro",
		price: "$19.99",
		period: "per month",
		description: "For teams & businesses",
		features: [
			"Everything in Premium",
			"Team collaboration",
			"API access",
			"White-label solution",
			"Priority support",
			"Advanced analytics",
			"Custom AI training",
			"Bulk operations",
		],
		icon: Star,
		popular: false,
		buttonText: "Contact Sales",
		gradient: ["#F59E0B", "#D97706"],
	},
];

export default function PricingScreen() {
	const scrollViewRef = useRef<ScrollView>(null);
	const [showPaymentModal, setShowPaymentModal] = useState(false);
	const [selectedPlan, setSelectedPlan] = useState<any>(null);
	const [copied, setCopied] = useState(false);

	const upiId = "yourupi@bank";
	const qrCodeUrl = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=yourupi@bank&pn=PromptMarket";

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
		const plan = pricingPlans.find((p) => p.id === planId);
		if (planId === "premium" || planId === "pro") {
			setSelectedPlan(plan);
			setShowPaymentModal(true);
		} else {
			// Handle free plan or other logic
      Toast.show({
        type:'info',
        text1:'Plan already activated',
        text2:'You are already on the Free plan.'
      })
		}
	};
	const handleCopyUPI = async () => {
		// await Clipboard.setStringAsync(upiId);
		setCopied(true);
		setTimeout(() => setCopied(false), 1200);
	};

	return (
		<LinearGradient
			colors={["#F5F7FF", "#E8ECFF"]}
			style={styles.container}>
			<SafeAreaView style={styles.safeArea}>
				<ScrollView contentContainerStyle={styles.scrollContent}>
					<View style={styles.carouselContainer}>
						<ScrollView
							ref={scrollViewRef}
							horizontal
							showsHorizontalScrollIndicator={false}
							contentContainerStyle={[styles.horizontalScroll, { paddingHorizontal: PEEK_WIDTH }]}
							snapToInterval={CARD_WIDTH + CARD_MARGIN * 2}
							decelerationRate='fast'>
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
												{ translateY: index === 1 ? -height * 0.025 : 0 },
												{ scale: index === 1 ? 1 : 0.95 },
											],
										},
									]}>
									{plan.popular && (
										<View style={styles.popularBadge}>
											<Text style={styles.popularText}>Most Popular</Text>
										</View>
									)}

									<LinearGradient
										colors={plan.gradient as [string, string]}
										style={styles.planHeader}
										start={{ x: 0, y: 0 }}
										end={{ x: 1, y: 1 }}>
										<plan.icon
											size={width * 0.08}
											color='#FFFFFF'
										/>
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
												<View
													key={i}
													style={styles.featureRow}>
													<Check
														size={width * 0.04}
														color='#10B981'
													/>
													<Text style={styles.featureText}>
														{feature}
													</Text>
												</View>
											))}
										</View>

										<TouchableOpacity
											onPress={() => handlePlanSelect(plan.id)}
											style={styles.selectButton}>
											<LinearGradient
												colors={
													(plan.id === "free"
														? ["#E5E7EB", "#D1D5DB"]
														: plan.gradient) as [string, string]
												}
												style={styles.selectGradient}
												start={{ x: 0, y: 0 }}
												end={{ x: 1, y: 1 }}>
												<Text style={styles.selectButtonText}>
													{plan.buttonText}
												</Text>
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
							<Text style={styles.faqAnswer}>Yes, you can upgrade or downgrade your plan at any time.</Text>
						</View>

						<View style={styles.faqItem}>
							<Text style={styles.faqQuestion}>Q. Is there a free trial?</Text>
							<Text style={styles.faqAnswer}>Yes, we offer a 7-day free trial for Premium plans.</Text>
						</View>

						<View style={styles.faqItem}>
							<Text style={styles.faqQuestion}>Q. What payment methods are accepted?</Text>
							<Text style={styles.faqAnswer}>
								We accept credit cards, PayPal, and Apple Pay/Google Pay.
							</Text>
						</View>
					</View>

					<View style={styles.footer}>
						<Text style={styles.footerText}>All plans come with a 30-day money-back guarantee</Text>
					</View>
				</ScrollView>

				<Modal
					visible={showPaymentModal}
					transparent
					animationType='slide'
					onRequestClose={() => setShowPaymentModal(false)}>
					<View
						style={{
							flex: 1,
							backgroundColor: "rgba(0,0,0,0.18)",
							justifyContent: "flex-end",
						}}>
						<View
							style={{
								width: "100%",
								backgroundColor: "#fff",
								borderRadius: 18,
								padding: 10,
								alignItems: "center",
								position: "relative",
							}}>
							<TouchableOpacity
								style={{ position: "absolute", right: 12, top: 12, zIndex: 2, padding: 4 }}
								onPress={() => setShowPaymentModal(false)}>
								<Text style={{ fontSize: 18, color: "#64748B" }}>✕</Text>
							</TouchableOpacity>
							<Text style={{ fontSize: 22, fontWeight: "bold", color: "#7C3AED", marginBottom: 8 }}>
								{selectedPlan?.name} Plan
							</Text>
							<Text style={{ color: "#475569", fontSize: 16, marginBottom: 12, textAlign: "center" }}>
								{selectedPlan?.description}
							</Text>
							<View style={{ width: "100%", marginBottom: 12 }}>
								{selectedPlan?.features?.map((feature: string, idx: number) => (
									<View
										key={idx}
										style={{
											flexDirection: "row",
											alignItems: "center",
											marginBottom: 6,
										}}>
										<Check
											size={18}
											color='#10B981'
										/>
										<Text
											style={{
												color: "#475569",
												fontSize: Math.max(width * 0.032, 12),
												fontFamily: "Inter-Regular",
												marginLeft: width * 0.025,
												lineHeight: height * 0.024,
											}}>
											{feature}
										</Text>
									</View>
								))}
							</View>
							<Text style={{ color: "#7C3AED", fontSize: 18, fontWeight: "bold", marginBottom: 8 }}>
								Pay {selectedPlan?.price} / {selectedPlan?.period}
							</Text>
							<Image
								source={{ uri: qrCodeUrl }}
								style={{
									width: 180,
									height: 180,
									marginBottom: 12,
									borderRadius: 12,
									backgroundColor: "#F1F5F9",
								}}
								resizeMode='contain'
							/>
							<Text style={{ fontSize: 15, color: "#6366F1", fontWeight: "bold", marginBottom: 4 }}>
								UPI ID:
							</Text>
							<View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
								<Text style={{ fontSize: 15, color: "#1E293B", marginRight: 8 }}>{upiId}</Text>
								<TouchableOpacity
									onPress={handleCopyUPI}
									style={{
										backgroundColor: "#E0E7FF",
										borderRadius: 8,
										paddingHorizontal: 10,
										paddingVertical: 4,
										marginLeft: 4,
									}}>
									<Text style={{ color: "#6366F1", fontSize: 13 }}>
										{copied ? "Copied!" : "Copy"}
									</Text>
								</TouchableOpacity>
							</View>
							<Text style={{ color: "#64748B", fontSize: 13, textAlign: "center", marginBottom: 8 }}>
								After payment, contact support or tap "I have paid".
							</Text>
							<TouchableOpacity
								style={{
									width: "100%",
									marginTop: 10,
									backgroundColor: "#6366F1",
									borderRadius: 10,
									paddingVertical: 12,
									alignItems: "center",
								}}
								onPress={() => {
									setShowPaymentModal(false);
									Alert.alert("Thank you!", "Your payment will be verified soon.");
								}}>
								<Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>I have paid</Text>
							</TouchableOpacity>
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
		backgroundColor: "#F5F7FF",
	},
	safeArea: {
		flex: 1,
		marginTop: height * 0.012,
	},
	scrollContent: {
		paddingBottom: height * 0.05,
	},
	carouselContainer: {
		width: "100%",
	},
	header: {
		paddingHorizontal: width * 0.025,
		paddingVertical: height * 0.012,
		alignItems: "center",
	},
	title: {
		color: "#1E293B",
		fontSize: Math.max(width * 0.07, 24),
		fontFamily: "Inter-Bold",
		textAlign: "center",
	},
	subtitle: {
		color: "#64748B",
		fontSize: Math.max(width * 0.04, 14),
		fontFamily: "Inter-Regular",
		textAlign: "center",
		lineHeight: width * 0.05,
	},
	horizontalScroll: {
		paddingVertical: height * 0.025,
		alignItems: "center",
	},
	planCard: {
		borderRadius: width * 0.05,
		backgroundColor: "#FFFFFF",
		overflow: "hidden",
		position: "relative",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: height * 0.012 },
		shadowOpacity: 0.1,
		shadowRadius: width * 0.05,
		elevation: 5,
		borderWidth: 1,
		borderColor: "#E2E8F0",
		minHeight: height * 0.65,
	},
	highlightedCard: {
		shadowColor: "#8B5CF6",
		shadowOffset: { width: 0, height: height * 0.018 },
		shadowOpacity: 0.2,
		shadowRadius: width * 0.06,
		elevation: 10,
	},
	popularBadge: {
		position: "absolute",
		top: height * 0.02,
		right: width * 0.04,
		backgroundColor: "#EF4444",
		paddingHorizontal: width * 0.03,
		paddingVertical: height * 0.005,
		borderRadius: width * 0.03,
		zIndex: 1,
	},
	popularText: {
		color: "#FFFFFF",
		fontSize: Math.max(width * 0.03, 10),
		fontFamily: "Inter-Bold",
	},
	planHeader: {
		padding: width * 0.04,
		alignItems: "center",
		minHeight: height * 0.25,
		justifyContent: "center",
	},
	planName: {
		color: "#FFFFFF",
		fontSize: Math.max(width * 0.055, 18),
		fontFamily: "Inter-Bold",
		marginTop: height * 0.01,
	},
	priceContainer: {
		flexDirection: "row",
		alignItems: "baseline",
		marginTop: height * 0.005,
	},
	price: {
		color: "#FFFFFF",
		fontSize: Math.max(width * 0.08, 28),
		fontFamily: "Inter-Bold",
	},
	period: {
		color: "#FFFFFF",
		fontSize: Math.max(width * 0.035, 12),
		fontFamily: "Inter-Regular",
		opacity: 0.9,
		marginLeft: width * 0.01,
	},
	description: {
		color: "#FFFFFF",
		fontSize: Math.max(width * 0.035, 12),
		fontFamily: "Inter-Regular",
		opacity: 0.7,
		textAlign: "center",
		marginTop: height * 0.005,
	},
	planBody: {
		padding: width * 0.04,
		flex: 1,
		justifyContent: "space-between",
	},
	featuresContainer: {
		flex: 1,
	},
	featureRow: {
		flexDirection: "row",
		alignItems: "flex-start",
		marginBottom: height * 0.01,
	},
	featureText: {
		color: "#475569",
		fontSize: Math.max(width * 0.032, 12),
		fontFamily: "Inter-Regular",
		marginLeft: width * 0.025,
		flex: 1,
		lineHeight: height * 0.024,
	},
	selectButton: {
		borderRadius: width * 0.03,
		overflow: "hidden",
		marginTop: height * 0.02,
	},
	selectGradient: {
		paddingVertical: height * 0.017,
		alignItems: "center",
		borderRadius: width * 0.03,
	},
	selectButtonText: {
		color: "#FFFFFF",
		fontSize: Math.max(width * 0.04, 14),
		fontFamily: "Inter-SemiBold",
	},
	faqContainer: {
		paddingHorizontal: width * 0.06,
		marginTop: height * 0.02,
	},
	faqTitle: {
		color: "#1E293B",
		fontSize: Math.max(width * 0.055, 18),
		fontFamily: "Inter-Bold",
		marginBottom: height * 0.02,
		textAlign: "left",
	},
	faqItem: {
		marginBottom: height * 0.015,
		backgroundColor: "#FFFFFF",
		borderRadius: width * 0.03,
		padding: width * 0.04,
		borderWidth: 1,
		borderColor: "#E2E8F0",
	},
	faqQuestion: {
		color: "#1E293B",
		fontSize: Math.max(width * 0.04, 14),
		fontFamily: "Inter-SemiBold",
		marginBottom: height * 0.005,
	},
	faqAnswer: {
		color: "#64748B",
		fontSize: Math.max(width * 0.035, 12),
		fontFamily: "Inter-Regular",
		lineHeight: height * 0.024,
	},
	footer: {
		paddingHorizontal: width * 0.06,
		alignItems: "center",
		marginTop: height * 0.02,
	},
	footerText: {
		color: "#64748B",
		fontSize: Math.max(width * 0.025, 10),
		fontFamily: "Inter-Regular",
		textAlign: "center",
	},
});
