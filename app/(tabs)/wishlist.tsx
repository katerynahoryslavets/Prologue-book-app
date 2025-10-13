
import React from 'react';
import { View, Text, ScrollView, StyleSheet, Platform } from 'react-native';
import { Stack } from 'expo-router';
import { BookItem } from '@/components/BookItem';
import { colors, commonStyles } from '@/styles/commonStyles';
import { useBooksContext } from '@/contexts/BooksContext';
import { IconSymbol } from '@/components/IconSymbol';

export default function WishlistScreen() {
  const { wishlist } = useBooksContext();

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <IconSymbol name="heart" size={64} color={colors.textSecondary} />
      <Text style={styles.emptyStateTitle}>Your Wishlist is Empty</Text>
      <Text style={styles.emptyStateText}>
        Search for books and add them to your wishlist to keep track of what you want to read
      </Text>
    </View>
  );

  const renderWishlistStats = () => (
    <View style={styles.statsContainer}>
      <View style={styles.statCard}>
        <Text style={styles.statNumber}>{wishlist.length}</Text>
        <Text style={styles.statLabel}>Books in Wishlist</Text>
      </View>
    </View>
  );

  return (
    <>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: 'Wishlist',
            headerStyle: {
              backgroundColor: colors.background,
            },
            headerTintColor: colors.text,
          }}
        />
      )}
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {wishlist.length > 0 && renderWishlistStats()}
        
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            Platform.OS !== 'ios' && styles.scrollContentWithTabBar
          ]}
          showsVerticalScrollIndicator={false}
        >
          {wishlist.length === 0 ? (
            renderEmptyState()
          ) : (
            <View style={styles.booksContainer}>
              {wishlist.map((book) => (
                <BookItem key={book.id} book={book} />
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  scrollContentWithTabBar: {
    paddingBottom: 100, // Extra padding for floating tab bar
  },
  statsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  statCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  booksContainer: {
    paddingTop: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 32,
  },
  emptyStateTitle: {
    ...commonStyles.title,
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 12,
  },
  emptyStateText: {
    ...commonStyles.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});
