import { DollarSign, Heart, Star } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface PromptCardProps {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  rating: number;
  likes: number;
  author: string;
  isPurched:boolean
  onPress: () => void;
  onLike: () => void;
}

export default function PromptCard({
  title,
  description,
  category,
  price,
  rating,
  likes,
  author,
  onPress,
  onLike,
  isPurched
}: PromptCardProps) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{category}</Text>
          </View>
          <TouchableOpacity onPress={onLike} style={styles.likeButton}>
            <Heart size={16} color="#EF4444" fill={likes > 0 ? "#EF4444" : "none"} />
            <Text style={styles.likeCount}>{likes}</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description} numberOfLines={2}>{description}</Text>
        
        <View style={styles.footer}>
          <View style={styles.authorSection}>
            <Text style={styles.author}>by {author}</Text>
            <View style={styles.ratingSection}>
              <Star size={14} color="#F59E0B" fill="#F59E0B" />
              <Text style={styles.rating}>{rating.toFixed(1)}</Text>
            </View>
          </View>
          
          {!isPurched && <View style={styles.priceSection}>
            <DollarSign size={16} color={price === 0 ? "#10B981" : "#8B5CF6"} />
            <Text style={[styles.price, { color: price === 0 ? "#10B981" : "#8B5CF6" }]}>
              {price === 0 ? 'Free' : price.toFixed(2)}
            </Text>
          </View>}
          {
            isPurched && <View style={styles.priceSection}>
            <Text style={[styles.price, { color: price === 0 ? "#10B981" : "#8B5CF6" }]}>
              Purchased
            </Text>
          </View>
          }
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop:5,
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  card: {

  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryBadge: {
    backgroundColor: '#E9D5FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    color: '#8B5CF6',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeCount: {
    color: '#EF4444',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    marginLeft: 4,
  },
  title: {
    color: '#1E293B',
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
  },
  description: {
    color: '#64748B',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  authorSection: {
    flex: 1,
  },
  author: {
    color: '#64748B',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginBottom: 4,
  },
  ratingSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    color: '#B45309',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    marginLeft: 4,
  },
  priceSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 4,
  },
});