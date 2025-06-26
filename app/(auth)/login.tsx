import { useSignIn } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
	Alert,
	Image,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";



export default function AuthScreen() {
	const { signIn } = useSignIn();
	const router = useRouter();

	const [loading, setLoading] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleGoogleSignIn = async () => {
		try {
			setLoading(true);
			if (!signIn) {
				Alert.alert(
					"Error",
					"Sign in is not available."
				);
				return;
			}
			await signIn.authenticateWithRedirect({
				strategy: "oauth_google",
				redirectUrl:
					"https://your-app-domain.com/oauth-callback",
				redirectUrlComplete:
					"https://your-app-domain.com/oauth-callback",
			});
		} catch (err: any) {
			Alert.alert("Error", err.errors[0].message);
			console.error(JSON.stringify(err, null, 2));
		} finally {
			setLoading(false);
		}
	};

	const HandleLoginWithEmail = async () => {
		try {
			setLoading(true);
			Alert.alert("Success", "Logged in successfully");
		} catch (error: any) {
			Alert.alert("Error", error.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<SafeAreaView style={styles.safeArea}>
			<ScrollView contentContainerStyle={styles.container}>
				<View style={styles.header}>
					<Text style={styles.title}>
						PromptX
					</Text>
					<Text style={styles.subtitle}>
						Your AI prompt marketplace
					</Text>
				</View>

				<View style={styles.form}>
					<View style={styles.form}>
						<View
							style={
								styles.inputContainer
							}>
							<Ionicons
								name="mail-outline"
								size={20}
								color="#64748B"
								style={
									styles.inputIcon
								}
							/>
							<TextInput
								style={
									styles.input
								}
								placeholder="Email"
								placeholderTextColor="#94A3B8"
								value={email}
								onChangeText={
									setEmail
								}
								keyboardType="email-address"
								autoCapitalize="none"
							/>
						</View>

						<View
							style={
								styles.inputContainer
							}>
							<Ionicons
								name="lock-closed-outline"
								size={20}
								color="#64748B"
								style={
									styles.inputIcon
								}
							/>
							<TextInput
								style={
									styles.input
								}
								placeholder="Password"
								placeholderTextColor="#94A3B8"
								value={password}
								onChangeText={
									setPassword
								}
								secureTextEntry
							/>
						</View>

						<TouchableOpacity
							style={
								styles.forgotPassword
							}>
							<Text
								style={
									styles.forgotPasswordText
								}>
								Forgot password?
							</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={
								styles.primaryButton
							}
							onPress={
								HandleLoginWithEmail
							}
							disabled={loading}>
							<Text
								style={
									styles.primaryButtonText
								}>
								{loading
									? "Logging in..."
									: "Login"}
							</Text>
						</TouchableOpacity>
					</View>

					<View style={styles.dividerContainer}>
						<View
							style={
								styles.dividerLine
							}
						/>
						<Text
							style={
								styles.dividerText
							}>
							OR
						</Text>
						<View
							style={
								styles.dividerLine
							}
						/>
					</View>
					<TouchableOpacity
						style={styles.socialButton}
						onPress={handleGoogleSignIn}
						disabled={loading}>
						<Image
							source={require("../../assets/images/googleicon.png")}
							style={
								styles.socialIcon
							}
						/>
						<Text
							style={
								styles.socialButtonText
							}>
							{loading
								? "Logging in..."
								: "Continue with Google"}
						</Text>
					</TouchableOpacity>
				</View>
				<View>
					<Text style={styles.termsText}>
						If you are a new user then
						Register first
						<TouchableOpacity
							onPress={() =>
								router.push(
									"/(auth)/register"
								)
							}>
							<Text
								style={{
									color: "#6366F1",
									marginLeft: 4,
									fontWeight: "bold",
									fontSize: 14,
								}}>
								Register
							</Text>
						</TouchableOpacity>
					</Text>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: "#FFFFFF",
	},
	container: {
		flexGrow: 1,
		paddingHorizontal: 24,
		paddingBottom: 40,
		justifyContent: "center",
	},
	header: {
		marginBottom: 32,
		alignItems: "center",
	},
	title: {
		fontSize: 28,
		fontWeight: "bold",
		color: "#1E293B",
		fontFamily: "Inter-Bold",
		marginBottom: 8,
	},
	subtitle: {
		fontSize: 16,
		color: "#64748B",
		fontFamily: "Inter-Regular",
	},
	form: {
		width: "100%",
	},
	socialButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#FFFFFF",
		borderWidth: 1,
		borderColor: "#E2E8F0",
		borderRadius: 12,
		paddingVertical: 16,
	},
	socialIcon: {
		width: 20,
		height: 20,
		marginRight: 10,
	},
	socialButtonText: {
		color: "#1E293B",
		fontFamily: "Inter-SemiBold",
		fontSize: 16,
	},
	dividerContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginVertical: 2,
	},
	dividerLine: {
		flex: 1,
		height: 1,
		backgroundColor: "#E2E8F0",
	},
	dividerText: {
		color: "#64748B",
		fontFamily: "Inter-Medium",
		fontSize: 14,
		marginHorizontal: 12,
	},
	localAuthOptions: {
		gap: 12,
	},
	localAuthButton: {
		backgroundColor: "#F8FAFC",
		borderWidth: 1,
		borderColor: "#E2E8F0",
		borderRadius: 12,
		paddingVertical: 16,
		alignItems: "center",
	},
	registerButton: {
		backgroundColor: "#6366F1",
		borderColor: "#6366F1",
	},
	localAuthButtonText: {
		color: "#1E293B",
		fontFamily: "Inter-SemiBold",
		fontSize: 16,
	},
	registerButtonText: {
		color: "#FFFFFF",
	},
	termsContainer: {
		marginTop: 20,
		paddingHorizontal: 24,
	},
	termsText: {
		color: "#64748B",
		fontFamily: "Inter-Regular",
		fontSize: 12,
		textAlign: "center",
		marginTop: 8,
	},

	inputContainer: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#F8FAFC",
		borderWidth: 1,
		borderColor: "#E2E8F0",
		borderRadius: 12,
		paddingHorizontal: 16,
		paddingVertical: 8,
		marginBottom: 8,
	},
	inputIcon: {
		marginRight: 12,
	},
	input: {
		flex: 1,
		color: "#1E293B",
		fontFamily: "Inter-Medium",
		fontSize: 16,
	},
	forgotPassword: {
		alignSelf: "flex-end",
		marginBottom: 14,
	},
	forgotPasswordText: {
		color: "#6366F1",
		fontFamily: "Inter-Medium",
		fontSize: 14,
	},
	primaryButton: {
		backgroundColor: "#6366F1",
		borderRadius: 12,
		paddingVertical: 16,
		alignItems: "center",
		marginBottom: 2,
	},
	primaryButtonText: {
		color: "#FFFFFF",
		fontFamily: "Inter-SemiBold",
		fontSize: 16,
	},

	githubButton: {
		backgroundColor: "#1E293B",
		borderColor: "#1E293B",
	},

	githubButtonText: {
		color: "#FFFFFF",
	},
	footer: {
		flexDirection: "row",
		justifyContent: "center",
		marginTop: 24,
	},
	footerText: {
		color: "#64748B",
		fontFamily: "Inter-Regular",
		fontSize: 14,
	},
	footerLink: {
		color: "#6366F1",
		fontFamily: "Inter-SemiBold",
		fontSize: 14,
		marginLeft: 4,
	},
});
