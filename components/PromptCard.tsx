import { Bookmark, BookmarkCheck, Heart, Star, ThumbsDown } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface PromptCardProps {
	id: number;
	title: string;
	description: string;
	category: string;
	price: number;
	rating: number;
	likes: number;
	dislikes: number;
	author: string;
	isPurched: boolean;
	reaction: "like" | "dislike" | null;
	isWishlisted: boolean;
	onPress: () => void;
	onLike: () => void;
	onDislike: () => void;
	onToggleWishlist: () => void;
}

export default function PromptCard({
	title,
	description,
	category,
	rating,
	likes,
	dislikes,
	author,
	onPress,
	onLike,
	onDislike,
	isPurched,
	reaction,
	isWishlisted,
	onToggleWishlist,
}: PromptCardProps) {
	return (
		<TouchableOpacity
			onPress={onPress}
			style={styles.container}>
			<View style={styles.header}>
				<View style={styles.categoryBadge}>
					<Text style={styles.categoryText}>{category}</Text>
				</View>
				<TouchableOpacity
					onPress={onToggleWishlist}
					style={styles.wishlistButton}>
					{isWishlisted ?
						<BookmarkCheck
							size={17}
							color='#4F46E5'
						/>
					:	<Bookmark
							size={17}
							color='#64748B'
						/>
					}
				</TouchableOpacity>
			</View>

			<Text style={styles.title}>{title}</Text>
			<Text
				style={styles.description}
				numberOfLines={2}>
				{description}
			</Text>

			<View style={styles.metaRow}>
				<Text style={styles.author}>by {author}</Text>
				<View style={styles.ratingSection}>
					<Star
						size={14}
						color='#F59E0B'
						fill='#F59E0B'
					/>
					<Text style={styles.rating}>{rating.toFixed(1)}</Text>
				</View>
			</View>

			<View style={styles.actionsRow}>
				<TouchableOpacity
					onPress={onLike}
					style={[styles.reactionButton, reaction === "like" && styles.reactionActive]}>
					<Heart
						size={16}
						color={reaction === "like" ? "#DC2626" : "#64748B"}
						fill={reaction === "like" ? "#DC2626" : "none"}
					/>
					<Text style={[styles.reactionText, reaction === "like" && styles.reactionTextActive]}>{likes}</Text>
				</TouchableOpacity>

				<TouchableOpacity
					onPress={onDislike}
					style={[styles.reactionButton, reaction === "dislike" && styles.reactionActive]}>
					<ThumbsDown
						size={16}
						color={reaction === "dislike" ? "#DC2626" : "#64748B"}
					/>
					<Text style={[styles.reactionText, reaction === "dislike" && styles.reactionTextActive]}>{dislikes}</Text>
				</TouchableOpacity>

				<View style={styles.statusPill}>
					<Text style={styles.statusText}>{isPurched ? "Saved" : "Free"}</Text>
				</View>
			</View>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	container: {
		marginBottom: 14,
		paddingBottom: 14,
		borderBottomWidth: 1,
		borderBottomColor: "#E2E8F0",
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 10,
	},
	categoryBadge: {
		backgroundColor: "#EEF2FF",
		paddingHorizontal: 10,
		paddingVertical: 5,
		borderRadius: 12,
	},
	categoryText: {
		color: "#4F46E5",
		fontSize: 12,
		fontFamily: "Inter-Medium",
	},
	wishlistButton: {
		width: 30,
		height: 30,
		borderRadius: 15,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#F8FAFC",
	},
	title: {
		color: "#1E293B",
		fontSize: 17,
		fontFamily: "Inter-SemiBold",
		marginBottom: 6,
	},
	description: {
		color: "#64748B",
		fontSize: 14,
		fontFamily: "Inter-Regular",
		lineHeight: 20,
		marginBottom: 10,
	},
	metaRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 10,
	},
	author: {
		color: "#64748B",
		fontSize: 13,
		fontFamily: "Inter-Regular",
	},
	ratingSection: {
		flexDirection: "row",
		alignItems: "center",
	},
	rating: {
		color: "#B45309",
		fontSize: 13,
		fontFamily: "Inter-Medium",
		marginLeft: 4,
	},
	actionsRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	reactionButton: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#F8FAFC",
		borderRadius: 16,
		paddingHorizontal: 10,
		paddingVertical: 6,
	},
	reactionActive: {
		backgroundColor: "#FEE2E2",
	},
	reactionText: {
		fontSize: 12,
		color: "#475569",
		fontFamily: "Inter-Medium",
		marginLeft: 4,
	},
	reactionTextActive: {
		color: "#DC2626",
	},
	statusPill: {
		marginLeft: "auto",
		backgroundColor: "#DCFCE7",
		borderRadius: 16,
		paddingHorizontal: 10,
		paddingVertical: 6,
	},
	statusText: {
		color: "#166534",
		fontSize: 12,
		fontFamily: "Inter-SemiBold",
	},
});
