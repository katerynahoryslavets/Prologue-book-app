
import React from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { colors, commonStyles } from '@/styles/commonStyles';
import { mockBooks } from '@/data/mockBooks';
import { useBooksContext } from '@/contexts/BooksContext';
import { IconSymbol } from '@/components/IconSymbol';

export default function BookDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    addToWishlist,
    removeFromWishlist,
    startReading,
    isInWishlist,
    isCurrentlyReading,
    isCompleted,
  } = useBooksContext();

  const book = mockBooks.find(b => b.id === id);

  if (!book) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'Book Not Found' }} />
        <View style={styles.errorContainer}>
          <IconSymbol name="exclamationmark.triangle" size={48} color={colors.textSecondary} />
          <Text style={styles.errorText}>Book not found</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

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

  const renderActionButtons = () => (
    <View style={styles.actionButtons}>
      <TouchableOpacity 
        style={[styles.actionButton, inWishlist && styles.activeWishlistButton]}
        onPress={handleWishlistToggle}
      >
        <IconSymbol 
          name={inWishlist ? 'heart.fill' : 'heart'} 
          size={20} 
          color={inWishlist ? colors.card : colors.primary} 
        />
        <Text style={[styles.actionButtonText, inWishlist && styles.activeWishlistButtonText]}>
          {inWishlist ? 'In Wishlist' : 'Add to Wishlist'}
        </Text>
      </TouchableOpacity>

      {!currentlyReading && !completed && (
        <TouchableOpacity 
          style={[styles.actionButton, styles.readButton]}
          onPress={handleStartReading}
        >
          <IconSymbol name="book.fill" size={20} color={colors.card} />
          <Text style={[styles.actionButtonText, styles.readButtonText]}>
            Start Reading
          </Text>
        </TouchableOpacity>
      )}

      {currentlyReading && (
        <View style={[styles.actionButton, styles.statusButton]}>
          <IconSymbol name="book.fill" size={20} color={colors.secondary} />
          <Text style={[styles.actionButtonText, { color: colors.secondary }]}>
            Currently Reading
          </Text>
        </View>
      )}

      {completed && (
        <View style={[styles.actionButton, styles.statusButton]}>
          <IconSymbol name="checkmark.circle.fill" size={20} color={colors.secondary} />
          <Text style={[styles.actionButtonText, { color: colors.secondary }]}>
            Completed
          </Text>
        </View>
      )}
    </View>
  );

  const renderReviews = () => {
    if (!book.reviews || book.reviews.length === 0) {
      return (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reviews</Text>
          <View style={styles.emptyReviews}>
            <IconSymbol name="star" size={32} color={colors.textSecondary} />
            <Text style={styles.emptyReviewsText}>No reviews yet</Text>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Reviews ({book.reviews.length})</Text>
        {book.reviews.map((review) => (
          <View key={review.id} style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <Text style={styles.reviewerName}>{review.reviewer}</Text>
              <View style={styles.reviewRating}>
                {[...Array(5)].map((_, i) => (
                  <IconSymbol
                    key={i}
                    name={i < review.rating ? 'star.fill' : 'star'}
                    size={14}
                    color={i < review.rating ? colors.accent : colors.textSecondary}
                  />
                ))}
              </View>
            </View>
            <Text style={styles.reviewComment}>{review.comment}</Text>
            <Text style={styles.reviewDate}>
              {new Date(review.date).toLocaleDateString()}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: book.title,
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
        }} 
      />
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.coverContainer}>
            {book.coverUrl ? (
              <Image source={{ uri: book.coverUrl }} style={styles.cover} />
            ) : (
              <View style={[styles.cover, styles.placeholderCover]}>
                <IconSymbol name="book" size={48} color={colors.textSecondary} />
              </View>
            )}
          </View>
          
          <View style={styles.bookInfo}>
            <Text style={styles.title}>{book.title}</Text>
            <Text style={styles.author}>by {book.author}</Text>
            
            {book.rating && (
              <View style={styles.ratingContainer}>
                <View style={styles.stars}>
                  {[...Array(5)].map((_, i) => (
                    <IconSymbol
                      key={i}
                      name={i < Math.floor(book.rating!) ? 'star.fill' : 'star'}
                      size={16}
                      color={i < Math.floor(book.rating!) ? colors.accent : colors.textSecondary}
                    />
                  ))}
                </View>
                <Text style={styles.ratingText}>{book.rating.toFixed(1)}</Text>
              </View>
            )}
            
            <View style={styles.metadata}>
              {book.publishedDate && (
                <Text style={styles.metadataText}>Published: {book.publishedDate}</Text>
              )}
              {book.pageCount && (
                <Text style={styles.metadataText}>{book.pageCount} pages</Text>
              )}
            </View>
          </View>
        </View>

        {renderActionButtons()}

        {book.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{book.description}</Text>
          </View>
        )}

        {book.categories && book.categories.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <View style={styles.categories}>
              {book.categories.map((category, index) => (
                <View key={index} style={styles.categoryTag}>
                  <Text style={styles.categoryText}>{category}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {renderReviews()}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorText: {
    ...commonStyles.text,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  backButton: {
    ...commonStyles.button,
  },
  backButtonText: {
    ...commonStyles.buttonText,
  },
  header: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: colors.card,
    marginBottom: 16,
  },
  coverContainer: {
    marginRight: 16,
  },
  cover: {
    width: 120,
    height: 180,
    borderRadius: 8,
  },
  placeholderCover: {
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
    lineHeight: 26,
  },
  author: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stars: {
    flexDirection: 'row',
    marginRight: 8,
  },
  ratingText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  metadata: {
    marginTop: 'auto',
  },
  metadataText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.card,
  },
  activeWishlistButton: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  readButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  statusButton: {
    backgroundColor: colors.card,
    borderColor: colors.secondary,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: 8,
  },
  activeWishlistButtonText: {
    color: colors.card,
  },
  readButtonText: {
    color: colors.card,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    ...commonStyles.subtitle,
    marginBottom: 12,
  },
  description: {
    ...commonStyles.text,
    lineHeight: 24,
  },
  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryTag: {
    backgroundColor: colors.highlight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  categoryText: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '500',
  },
  emptyReviews: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyReviewsText: {
    ...commonStyles.textSecondary,
    marginTop: 8,
  },
  reviewCard: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  reviewRating: {
    flexDirection: 'row',
  },
  reviewComment: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 8,
  },
  reviewDate: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});
