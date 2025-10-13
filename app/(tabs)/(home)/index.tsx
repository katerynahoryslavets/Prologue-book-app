
import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Platform } from 'react-native';
import { Stack } from 'expo-router';
import { useTheme } from '@react-navigation/native';
import { SearchBar } from '@/components/SearchBar';
import { BookItem } from '@/components/BookItem';
import { colors, commonStyles } from '@/styles/commonStyles';
import { searchBooks } from '@/data/mockBooks';
import { useBooksContext } from '@/contexts/BooksContext';
import { Book } from '@/types/Book';
import { IconSymbol } from '@/components/IconSymbol';

export default function HomeScreen() {
  const theme = useTheme();
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { currentlyReading, completedBooks } = useBooksContext();

  const handleSearch = (query: string) => {
    console.log('Searching for:', query);
    setSearchQuery(query);
    if (query.trim()) {
      const results = searchBooks(query);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const renderCurrentlyReading = () => {
    if (currentlyReading.length === 0) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Currently Reading</Text>
        {currentlyReading.map((book) => (
          <BookItem 
            key={book.id} 
            book={book} 
            showActions={false}
          />
        ))}
      </View>
    );
  };

  const renderRecentlyCompleted = () => {
    if (completedBooks.length === 0) return null;

    const recentBooks = completedBooks.slice(-3); // Show last 3 completed books

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recently Completed</Text>
        {recentBooks.map((book) => (
          <BookItem 
            key={book.id} 
            book={book} 
            showActions={false}
          />
        ))}
      </View>
    );
  };

  const renderSearchResults = () => {
    if (!searchQuery) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Search Results {searchResults.length > 0 && `(${searchResults.length})`}
        </Text>
        {searchResults.length > 0 ? (
          searchResults.map((book) => (
            <BookItem key={book.id} book={book} />
          ))
        ) : (
          <View style={styles.emptyState}>
            <IconSymbol name="book" size={48} color={colors.textSecondary} />
            <Text style={styles.emptyStateText}>No books found</Text>
            <Text style={styles.emptyStateSubtext}>
              Try searching with different keywords
            </Text>
          </View>
        )}
      </View>
    );
  };

  const renderWelcome = () => {
    if (searchQuery || currentlyReading.length > 0 || completedBooks.length > 0) {
      return null;
    }

    return (
      <View style={styles.welcomeSection}>
        <IconSymbol name="book.fill" size={64} color={colors.primary} />
        <Text style={styles.welcomeTitle}>Welcome to BookTracker</Text>
        <Text style={styles.welcomeText}>
          Start by searching for books you want to read or add to your wishlist
        </Text>
      </View>
    );
  };

  return (
    <>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: 'BookTracker',
            headerStyle: {
              backgroundColor: colors.background,
            },
            headerTintColor: colors.text,
          }}
        />
      )}
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <SearchBar onSearch={handleSearch} />
        
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            Platform.OS !== 'ios' && styles.scrollContentWithTabBar
          ]}
          showsVerticalScrollIndicator={false}
        >
          {renderWelcome()}
          {renderCurrentlyReading()}
          {renderRecentlyCompleted()}
          {renderSearchResults()}
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
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    ...commonStyles.subtitle,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  welcomeSection: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  welcomeTitle: {
    ...commonStyles.title,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  welcomeText: {
    ...commonStyles.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 32,
  },
  emptyStateText: {
    ...commonStyles.text,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 4,
  },
  emptyStateSubtext: {
    ...commonStyles.textSecondary,
    textAlign: 'center',
  },
});
