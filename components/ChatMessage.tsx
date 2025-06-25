import * as Speech from "expo-speech";
import { Volume2 } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ChatMessageProps {
	message: string;
	isUser: boolean;
	timestamp: Date;
}

export default function ChatMessage({
	message,
	isUser,
	timestamp,
}: ChatMessageProps) {
	const speakMessage = () => {
		if (!isUser) {
			Speech.speak(message, {
				language: "en-US",
				pitch: 1.0,
				rate: 0.8,
			});
		}
	};

	return (
		<View
			style={[
				styles.container,
				isUser
					? styles.userContainer
					: styles.aiContainer,
			]}>
			{isUser ? (
				<View
					style={styles.messageBox}>
					<Text style={styles.userMessage}>
						{message}
					</Text>
				</View>
			) : (
				<View style={styles.aiMessageBox}>
					<Text style={styles.aiMessage}>
						{message}
					</Text>
					<TouchableOpacity
						style={styles.speakButton}
						onPress={speakMessage}>
						<Volume2
							size={16}
							color="#8B5CF6"
						/>
					</TouchableOpacity>
				</View>
			)}
			<Text style={styles.timestamp}>
				{timestamp.toLocaleTimeString([], {
					hour: "2-digit",
					minute: "2-digit",
				})}
			</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		marginVertical: 5,
		maxWidth: "85%",
		borderRadius: 20,
	
		borderWidth: 1,
		borderColor: "#E2E8F0",
	},
	userContainer: {
		alignSelf: "flex-end",
		alignItems: "flex-end",
    backgroundColor: "#3456d178",
	},
	aiContainer: {
		alignSelf: "flex-start",
		alignItems: "flex-start",
    	backgroundColor: "#FFFFFF",
	},
	messageBox: {
		paddingHorizontal: 16,
		paddingVertical: 12,
		borderRadius: 20,
		flexDirection: "row",
		alignItems: "flex-end",
		maxWidth: "100%",

	},
	aiMessageBox: {
		paddingHorizontal: 16,
		paddingVertical: 12,
		borderRadius: 20,
		flexDirection: "row",
		alignItems: "flex-end",
		maxWidth: "100%",
	},
	userMessage: {
		color: "#1E293B",
		fontSize: 15,
		fontFamily: "Inter-Medium",
		lineHeight: 20,	
	},
	aiMessage: {
		color: "#1E293B",
		fontSize: 15,
		fontFamily: "Inter-Medium",
		lineHeight: 20,
		flex: 1,
	},
	speakButton: {
		marginLeft: 8,
		padding: 4,
	},
	timestamp: {
		color: "#9CA3AF",
		fontSize: 10,
    marginRight:12,
    marginLeft:17,
		fontFamily: "Inter-Regular",
		marginTop: -7,
    marginBottom:5
	},
});
