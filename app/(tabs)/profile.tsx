
import React from 'react';
import { View, Text, ScrollView, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import { colors, commonStyles } from '@/styles/commonStyles';
import { useBooksContext } from '@/contexts/BooksContext';
import { IconSymbol } from '@/components/IconSymbol';

export default function ProfileScreen() {
  const { wishlist, currentlyReading, completedBooks } = useBooksContext();

  const totalBooksRead = completedBooks.length;
  const totalPagesRead = completedBooks.reduce((total, book) => {
    return total + (book.pageCount || 0);
  }, 0);

  const currentProgress = currentlyReading.reduce((total, book) => {
    if (book.progress) {
      return total + (book.progress.currentPage / book.progress.totalPages) * 100;
    }
    return total;
  }, 0) / Math.max(currentlyReading.length, 1);

  const renderStatCard = (title: string, value: string | number, icon: string, color: string) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statIcon}>
        <IconSymbol name={icon} size={24} color={color} />
      </View>
      <View style={styles.statContent}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
      </View>
    </View>
  );

  const renderReadingGoals = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Reading Goals</Text>
      <View style={styles.goalCard}>
        <View style={styles.goalHeader}>
          <Text style={styles.goalTitle}>2024 Reading Challenge</Text>
          <Text style={styles.goalProgress}>{totalBooksRead}/50 books</Text>
        </View>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${Math.min((totalBooksRead / 50) * 100, 100)}%` }
            ]} 
          />
        </View>
        <Text style={styles.goalDescription}>
          {totalBooksRead >= 50 
            ? '🎉 Congratulations! You\'ve reached your goal!' 
            : `${50 - totalBooksRead} books to go!`
          }
        </Text>
      </View>
    </View>
  );

  const renderRecentActivity = () => {
    const recentBooks = [...completedBooks, ...currentlyReading]
      .sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
      .slice(0, 3);

    if (recentBooks.length === 0) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        {recentBooks.map((book) => {
          const isCompleted = completedBooks.some(b => b.id === book.id);
          return (
            <View key={book.id} style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <IconSymbol 
                  name={isCompleted ? 'checkmark.circle.fill' : 'book.fill'} 
                  size={20} 
                  color={isCompleted ? colors.secondary : colors.primary} 
                />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>{book.title}</Text>
                <Text style={styles.activityDescription}>
                  {isCompleted ? 'Completed reading' : 'Started reading'} • {book.author}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: 'Profile',
            headerStyle: {
              backgroundColor: colors.background,
            },
            headerTintColor: colors.text,
          }}
        />
      )}
      <ScrollView 
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={[
          styles.scrollContent,
          Platform.OS !== 'ios' && styles.scrollContentWithTabBar
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <IconSymbol name="person.circle.fill" size={80} color={colors.primary} />
          </View>
          <Text style={styles.userName}>Book Lover</Text>
          <Text style={styles.userBio}>
            Passionate reader exploring new worlds through books
          </Text>
        </View>

        <View style={styles.statsGrid}>
          {renderStatCard('Books Read', totalBooksRead, 'book.fill', colors.primary)}
          {renderStatCard('Currently Reading', currentlyReading.length, 'book', colors.secondary)}
          {renderStatCard('Wishlist', wishlist.length, 'heart.fill', colors.accent)}
          {renderStatCard('Pages Read', totalPagesRead.toLocaleString(), 'doc.text', colors.highlight)}
        </View>

        {currentlyReading.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Reading Progress</Text>
            <View style={styles.progressCard}>
              <Text style={styles.progressTitle}>Average Progress</Text>
              <View style={styles.circularProgress}>
                <Text style={styles.progressPercentage}>
                  {Math.round(currentProgress)}%
                </Text>
              </View>
              <Text style={styles.progressDescription}>
                Across {currentlyReading.length} book{currentlyReading.length !== 1 ? 's' : ''}
              </Text>
            </View>
          </View>
        )}

        {renderReadingGoals()}
        {renderRecentActivity()}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <TouchableOpacity style={styles.preferenceItem}>
            <IconSymbol name="bell" size={20} color={colors.textSecondary} />
            <Text style={styles.preferenceText}>Reading Reminders</Text>
            <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.preferenceItem}>
            <IconSymbol name="chart.bar" size={20} color={colors.textSecondary} />
            <Text style={styles.preferenceText}>Reading Statistics</Text>
            <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.preferenceItem}>
            <IconSymbol name="gear" size={20} color={colors.textSecondary} />
            <Text style={styles.preferenceText}>Settings</Text>
            <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  scrollContentWithTabBar: {
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
    backgroundColor: colors.card,
    marginBottom: 16,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  userBio: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  statIcon: {
    marginRight: 12,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 2,
  },
  statTitle: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    ...commonStyles.subtitle,
    marginBottom: 12,
  },
  goalCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  goalProgress: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.accent,
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  goalDescription: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  progressCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  circularProgress: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.highlight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressPercentage: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  progressDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  activityIcon: {
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  activityDescription: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  preferenceText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
  },
});
