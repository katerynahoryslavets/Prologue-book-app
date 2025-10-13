
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Book, UserBook, ReadingProgress } from '../types/Book';

interface BooksContextType {
  wishlist: UserBook[];
  currentlyReading: UserBook[];
  completedBooks: UserBook[];
  addToWishlist: (book: Book) => void;
  removeFromWishlist: (bookId: string) => void;
  startReading: (book: Book) => void;
  updateProgress: (bookId: string, currentPage: number) => void;
  markAsCompleted: (bookId: string) => void;
  isInWishlist: (bookId: string) => boolean;
  isCurrentlyReading: (bookId: string) => boolean;
  isCompleted: (bookId: string) => boolean;
}

const BooksContext = createContext<BooksContextType | undefined>(undefined);

export const useBooksContext = () => {
  const context = useContext(BooksContext);
  if (!context) {
    throw new Error('useBooksContext must be used within a BooksProvider');
  }
  return context;
};

interface BooksProviderProps {
  children: ReactNode;
}

export const BooksProvider: React.FC<BooksProviderProps> = ({ children }) => {
  const [wishlist, setWishlist] = useState<UserBook[]>([]);
  const [currentlyReading, setCurrentlyReading] = useState<UserBook[]>([]);
  const [completedBooks, setCompletedBooks] = useState<UserBook[]>([]);

  const addToWishlist = (book: Book) => {
    console.log('Adding book to wishlist:', book.title);
    const userBook: UserBook = {
      ...book,
      isInWishlist: true,
      dateAdded: new Date().toISOString(),
    };
    setWishlist(prev => [...prev, userBook]);
  };

  const removeFromWishlist = (bookId: string) => {
    console.log('Removing book from wishlist:', bookId);
    setWishlist(prev => prev.filter(book => book.id !== bookId));
  };

  const startReading = (book: Book) => {
    console.log('Starting to read book:', book.title);
    const userBook: UserBook = {
      ...book,
      isInWishlist: false,
      dateAdded: new Date().toISOString(),
      progress: {
        bookId: book.id,
        currentPage: 0,
        totalPages: book.pageCount || 0,
        status: 'reading',
        startDate: new Date().toISOString(),
      },
    };
    
    // Remove from wishlist if it exists there
    setWishlist(prev => prev.filter(b => b.id !== book.id));
    setCurrentlyReading(prev => [...prev, userBook]);
  };

  const updateProgress = (bookId: string, currentPage: number) => {
    console.log('Updating progress for book:', bookId, 'to page:', currentPage);
    setCurrentlyReading(prev => 
      prev.map(book => {
        if (book.id === bookId && book.progress) {
          return {
            ...book,
            progress: {
              ...book.progress,
              currentPage,
            },
          };
        }
        return book;
      })
    );
  };

  const markAsCompleted = (bookId: string) => {
    console.log('Marking book as completed:', bookId);
    const bookToComplete = currentlyReading.find(book => book.id === bookId);
    if (bookToComplete && bookToComplete.progress) {
      const completedBook: UserBook = {
        ...bookToComplete,
        progress: {
          ...bookToComplete.progress,
          status: 'completed',
          finishDate: new Date().toISOString(),
          currentPage: bookToComplete.progress.totalPages,
        },
      };
      
      setCurrentlyReading(prev => prev.filter(book => book.id !== bookId));
      setCompletedBooks(prev => [...prev, completedBook]);
    }
  };

  const isInWishlist = (bookId: string): boolean => {
    return wishlist.some(book => book.id === bookId);
  };

  const isCurrentlyReading = (bookId: string): boolean => {
    return currentlyReading.some(book => book.id === bookId);
  };

  const isCompleted = (bookId: string): boolean => {
    return completedBooks.some(book => book.id === bookId);
  };

  const value: BooksContextType = {
    wishlist,
    currentlyReading,
    completedBooks,
    addToWishlist,
    removeFromWishlist,
    startReading,
    updateProgress,
    markAsCompleted,
    isInWishlist,
    isCurrentlyReading,
    isCompleted,
  };

  return (
    <BooksContext.Provider value={value}>
      {children}
    </BooksContext.Provider>
  );
};
