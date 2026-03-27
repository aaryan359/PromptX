import * as Clipboard from "expo-clipboard";
import * as Speech from "expo-speech";
import { Copy, Volume2, VolumeX } from "lucide-react-native";
import React, { useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ChatMessageProps {
	message: string;
	isUser: boolean;
	timestamp: Date;
}

export default function ChatMessage({ message, isUser, timestamp }: ChatMessageProps) {
	const [isSpeaking, setIsSpeaking] = useState(false);
	const [copiedText, setCopiedText] = useState("");
	const speakingRef = useRef(false);

	const speakMessage = () => {
		if (!isUser && !isSpeaking) {
			const cleanMessage = message
				.replace(/```[\s\S]*?```/g, "")
				.replace(/\n\s+/g, "\n")
				.replace(/^\d+\.\s/gm, "")
				.replace(/^•\s/gm, "")
				.replace(/^---$/gm, "")
				.replace(/"/g, "")
				.trim();

			setIsSpeaking(true);
			speakingRef.current = true;

			Speech.speak(cleanMessage, {
				language: "en-US",
				pitch: 1,
				rate: 0.8,
				onDone: () => {
					setIsSpeaking(false);
					speakingRef.current = false;
				},
				onStopped: () => {
					setIsSpeaking(false);
					speakingRef.current = false;
				},
				onError: () => {
					setIsSpeaking(false);
					speakingRef.current = false;
				},
			});
		}
	};

	const stopSpeaking = () => {
		if (isSpeaking || speakingRef.current) {
			Speech.stop();
			setIsSpeaking(false);
			speakingRef.current = false;
		}
	};

	const copyToClipBoard = async (data: string) => {
		await Clipboard.setStringAsync(data);
	};

	const renderInlineStyledText = (line: string) => {
		const parts: Array<{ text: string; style: "normal" | "bold" | "code" }> = [];
		const regex = /(\*\*[^*]+\*\*|`[^`]+`)/g;
		let lastIndex = 0;
		let match: RegExpExecArray | null;

		while ((match = regex.exec(line)) !== null) {
			if (match.index > lastIndex) {
				parts.push({ text: line.slice(lastIndex, match.index), style: "normal" });
			}

			const token = match[0];
			if (token.startsWith("**") && token.endsWith("**")) {
				parts.push({ text: token.slice(2, -2), style: "bold" });
			} else if (token.startsWith("`") && token.endsWith("`")) {
				parts.push({ text: token.slice(1, -1), style: "code" });
			}

			lastIndex = regex.lastIndex;
		}

		if (lastIndex < line.length) {
			parts.push({ text: line.slice(lastIndex), style: "normal" });
		}

		return parts.map((part, index) => (
			<Text
				key={`part-${index}`}
				style={[styles.regularText, part.style === "bold" && styles.inlineBold, part.style === "code" && styles.inlineCode]}>
				{part.text}
			</Text>
		));
	};

	const renderFormattedMessage = (text: string) => {
		const lines = text.split("\n");
		const components = [];
		let currentIndex = 0;

		for (let index = 0; index < lines.length; index++) {
			const line = lines[index];
			const key = `line-${currentIndex++}`;

			if (line.trim() === "") {
				components.push(<Text key={key}>{"\n"}</Text>);
				continue;
			}

			if (line.trim() === "---") {
				components.push(
					<View
						key={key}
						style={styles.horizontalRule}>
						<View style={styles.ruleLine} />
					</View>,
				);
				continue;
			}

			if (line.endsWith("Code:") || line.endsWith("Terminal:") || line.includes("JavaScript:") || line.includes("Python:")) {
				components.push(
					<Text
						key={key}
						style={styles.codeHeader}>
						{line}
					</Text>,
				);
				continue;
			}

			if (line.startsWith("  ") && line.trim().length > 0) {
				components.push(
					<View
						key={key}
						style={styles.codeBlockContainer}>
						<Text style={styles.codeBlock}>{line.replace(/^  /, "")}</Text>
					</View>,
				);
				continue;
			}

			if (line.endsWith(":") && !line.includes("Code:") && line.trim().length < 50) {
				components.push(
					<Text
						key={key}
						style={styles.sectionHeader}>
						{line}
					</Text>,
				);
				continue;
			}

			if (/^\d+\.\s/.test(line)) {
				components.push(
					<Text
						key={key}
						style={styles.listItem}>
						{line}
					</Text>,
				);
				continue;
			}

			if (line.startsWith("• ")) {
				components.push(
					<Text
						key={key}
						style={styles.bulletItem}>
						{line}
					</Text>,
				);
				continue;
			}

			if (line.startsWith('"') && line.endsWith('"')) {
				components.push(
					<Text
						key={key}
						style={styles.quotedText}>
						{line}
					</Text>,
				);
				continue;
			}

			components.push(
				<Text
					key={key}
					style={styles.regularText}>
					{renderInlineStyledText(line)}
					{"\n"}
				</Text>,
			);
		}

		return components;
	};

	return (
		<View style={[styles.container, isUser ? styles.userContainer : styles.aiContainer]}>
			{isUser ?
				<View style={styles.userBubble}>
					<Text style={styles.userMessage}>{message}</Text>
				</View>
			:	<View style={styles.aiBubble}>
					<View style={styles.aiMessageContent}>{renderFormattedMessage(message)}</View>
					<View style={styles.aiActionsRow}>
						<TouchableOpacity
							style={styles.actionButton}
							onPress={isSpeaking ? stopSpeaking : speakMessage}>
							{isSpeaking ?
								<VolumeX
									size={16}
									color='#8B5CF6'
								/>
							:	<Volume2
									size={16}
									color='#8B5CF6'
								/>
							}
						</TouchableOpacity>
						<TouchableOpacity
							style={[styles.actionButton, styles.actionButtonSpacing]}
							onPress={() => {
								copyToClipBoard(message);
								setCopiedText("copied");
								setTimeout(() => setCopiedText(""), 1200);
							}}>
							<Copy
								size={16}
								color={copiedText === "copied" ? "#10B981" : "#8B5CF6"}
							/>
						</TouchableOpacity>
					</View>
				</View>
			}
			<Text style={[styles.timestamp, isUser ? styles.userTimestamp : styles.aiTimestamp]}>
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
		marginVertical: 6,
		width: "100%",
	},
	userContainer: {
		alignSelf: "stretch",
		alignItems: "flex-end",
	},
	aiContainer: {
		alignSelf: "stretch",
		alignItems: "flex-start",
	},
	userBubble: {
		maxWidth: "90%",
		backgroundColor: "#4F46E5",
		borderRadius: 22,
		paddingHorizontal: 16,
		paddingVertical: 12,
	},
	aiBubble: {
		width: "100%",
		maxWidth: "98%",
		backgroundColor: "#FFFFFF",
		borderRadius: 16,
		paddingHorizontal: 14,
		paddingVertical: 12,
		borderWidth: 1,
		borderColor: "#E2E8F0",
	},
	aiMessageContent: {
		width: "100%",
	},
	aiActionsRow: {
		marginTop: 8,
		flexDirection: "row",
		justifyContent: "flex-end",
	},
	actionButton: {
		padding: 6,
		borderRadius: 10,
		backgroundColor: "#F8FAFC",
		borderWidth: 1,
		borderColor: "#E2E8F0",
	},
	actionButtonSpacing: {
		marginLeft: 6,
	},
	userMessage: {
		color: "#FFFFFF",
		fontSize: 15,
		fontFamily: "Inter-Medium",
		lineHeight: 22,
	},
	regularText: {
		color: "#1E293B",
		fontSize: 15,
		fontFamily: "Inter-Regular",
		lineHeight: 23,
	},
	inlineBold: {
		fontFamily: "Inter-SemiBold",
		color: "#0F172A",
	},
	inlineCode: {
		fontFamily: "Inter-Medium",
		backgroundColor: "#EEF2FF",
		color: "#4F46E5",
		borderRadius: 6,
		paddingHorizontal: 4,
	},
	sectionHeader: {
		color: "#1E293B",
		fontSize: 16,
		fontFamily: "Inter-SemiBold",
		lineHeight: 24,
		marginTop: 8,
		marginBottom: 4,
	},
	codeHeader: {
		color: "#7C3AED",
		fontSize: 14,
		fontFamily: "Inter-Medium",
		marginTop: 8,
		marginBottom: 4,
	},
	codeBlockContainer: {
		backgroundColor: "#F8F9FA",
		borderRadius: 8,
		marginVertical: 2,
		borderLeftWidth: 3,
		borderLeftColor: "#E2E8F0",
	},
	codeBlock: {
		fontFamily: "Courier New",
		fontSize: 13,
		color: "#374151",
		paddingHorizontal: 12,
		paddingVertical: 8,
		lineHeight: 18,
	},
	listItem: {
		color: "#1E293B",
		fontSize: 15,
		fontFamily: "Inter-Regular",
		lineHeight: 22,
		marginLeft: 4,
		marginVertical: 2,
	},
	bulletItem: {
		color: "#1E293B",
		fontSize: 15,
		fontFamily: "Inter-Regular",
		lineHeight: 22,
		marginLeft: 4,
		marginVertical: 2,
	},
	quotedText: {
		color: "#6B7280",
		fontSize: 15,
		fontFamily: "Inter-Regular",
		fontStyle: "italic",
		lineHeight: 22,
		marginVertical: 4,
		paddingLeft: 12,
		borderLeftWidth: 2,
		borderLeftColor: "#D1D5DB",
	},
	horizontalRule: {
		marginVertical: 12,
		alignItems: "center",
	},
	ruleLine: {
		width: "100%",
		height: 1,
		backgroundColor: "#E2E8F0",
	},
	timestamp: {
		color: "#9CA3AF",
		fontSize: 11,
		fontFamily: "Inter-Regular",
		marginTop: 5,
	},
	userTimestamp: {
		marginRight: 8,
	},
	aiTimestamp: {
		marginLeft: 6,
	},
});
