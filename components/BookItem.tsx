
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Book } from '../types/Book';
import { colors, commonStyles } from '../styles/commonStyles';
import { useBooksContext } from '../contexts/BooksContext';
import { IconSymbol } from './IconSymbol';

interface BookItemProps {
  book: Book;
  onPress?: () => void;
  showActions?: boolean;
}

export const BookItem: React.FC<BookItemProps> = ({ 
  book, 
  onPress, 
  showActions = true 
}) => {
  const {
    addToWishlist,
    removeFromWishlist,
    startReading,
    isInWishlist,
    isCurrentlyReading,
    isCompleted,
  } = useBooksContext();

  const inWishlist = isInWishlist(book.id);
  const currentlyReading = isCurrentlyReading(book.id);
  const completed = isCompleted(book.id);

  const handleWishlistToggle = () => {
    if (inWishlist) {
      removeFromWishlist(book.id);
    } else {
      addToWishlist(book);
    }
  };

  const handleStartReading = () => {
    startReading(book);
  };

  const getStatusIcon = () => {
    if (completed) return 'checkmark.circle.fill';
    if (currentlyReading) return 'book.fill';
    if (inWishlist) return 'heart.fill';
    return 'heart';
  };

  const getStatusColor = () => {
    if (completed) return colors.secondary;
    if (currentlyReading) return colors.primary;
    if (inWishlist) return colors.accent;
    return colors.textSecondary;
  };

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(`/book-details?id=${book.id}`);
    }
  };

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.coverContainer}>
        {book.coverUrl ? (
          <Image source={{ uri: book.coverUrl }} style={styles.cover} />
        ) : (
          <View style={[styles.cover, styles.placeholderCover]}>
            <IconSymbol name="book" size={24} color={colors.textSecondary} />
          </View>
        )}
      </View>
      
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {book.title}
        </Text>
        <Text style={styles.author} numberOfLines={1}>
          {book.author}
        </Text>
        {book.description && (
          <Text style={styles.description} numberOfLines={3}>
            {book.description}
          </Text>
        )}
        
        {book.rating && (
          <View style={styles.ratingContainer}>
            <IconSymbol name="star.fill" size={14} color={colors.accent} />
            <Text style={styles.rating}>{book.rating.toFixed(1)}</Text>
          </View>
        )}
      </View>
      
      {showActions && (
        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleWishlistToggle}
          >
            <IconSymbol 
              name={getStatusIcon()} 
              size={20} 
              color={getStatusColor()} 
            />
          </TouchableOpacity>
          
          {!currentlyReading && !completed && (
            <TouchableOpacity 
              style={[styles.actionButton, styles.readButton]}
              onPress={handleStartReading}
            >
              <Text style={styles.readButtonText}>Read</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    ...commonStyles.bookItem,
  },
  coverContainer: {
    marginRight: 16,
  },
  cover: {
    width: 60,
    height: 90,
    borderRadius: 6,
  },
  placeholderCover: {
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    ...commonStyles.bookTitle,
  },
  author: {
    ...commonStyles.bookAuthor,
  },
  description: {
    ...commonStyles.bookDescription,
    marginTop: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  rating: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  actions: {
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 12,
  },
  actionButton: {
    padding: 8,
    borderRadius: 6,
    marginBottom: 8,
  },
  readButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  readButtonText: {
    color: colors.card,
    fontSize: 12,
    fontWeight: '600',
  },
});
