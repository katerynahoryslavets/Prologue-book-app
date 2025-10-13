
import { Book } from '../types/Book';

export const mockBooks: Book[] = [
  {
    id: '1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    description: 'A classic American novel set in the Jazz Age, exploring themes of wealth, love, and the American Dream.',
    coverUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=450&fit=crop',
    isbn: '9780743273565',
    publishedDate: '1925',
    pageCount: 180,
    categories: ['Fiction', 'Classic Literature'],
    rating: 4.2,
    reviews: [
      {
        id: '1',
        bookId: '1',
        rating: 5,
        comment: 'A masterpiece of American literature. Fitzgerald\'s prose is beautiful and the story is timeless.',
        reviewer: 'BookLover123',
        date: '2024-01-15'
      },
      {
        id: '2',
        bookId: '1',
        rating: 4,
        comment: 'Great character development and symbolism. A must-read for anyone interested in American literature.',
        reviewer: 'LiteraryFan',
        date: '2024-01-10'
      }
    ]
  },
  {
    id: '2',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    description: 'A gripping tale of racial injustice and childhood innocence in the American South.',
    coverUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=450&fit=crop',
    isbn: '9780061120084',
    publishedDate: '1960',
    pageCount: 376,
    categories: ['Fiction', 'Classic Literature', 'Drama'],
    rating: 4.5,
    reviews: [
      {
        id: '3',
        bookId: '2',
        rating: 5,
        comment: 'An incredibly powerful and moving story. Harper Lee\'s writing is both beautiful and heartbreaking.',
        reviewer: 'ClassicReader',
        date: '2024-01-12'
      }
    ]
  },
  {
    id: '3',
    title: '1984',
    author: 'George Orwell',
    description: 'A dystopian social science fiction novel about totalitarianism and surveillance.',
    coverUrl: 'https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=300&h=450&fit=crop',
    isbn: '9780451524935',
    publishedDate: '1949',
    pageCount: 328,
    categories: ['Fiction', 'Dystopian', 'Science Fiction'],
    rating: 4.3,
    reviews: [
      {
        id: '4',
        bookId: '3',
        rating: 4,
        comment: 'Chilling and prophetic. Orwell\'s vision of the future is both terrifying and thought-provoking.',
        reviewer: 'SciFiFan',
        date: '2024-01-08'
      }
    ]
  },
  {
    id: '4',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    description: 'A romantic novel that critiques the British landed gentry at the end of the 18th century.',
    coverUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=450&fit=crop',
    isbn: '9780141439518',
    publishedDate: '1813',
    pageCount: 432,
    categories: ['Fiction', 'Romance', 'Classic Literature'],
    rating: 4.4,
    reviews: [
      {
        id: '5',
        bookId: '4',
        rating: 5,
        comment: 'Austen\'s wit and social commentary are brilliant. Elizabeth Bennet is one of literature\'s greatest heroines.',
        reviewer: 'RomanceReader',
        date: '2024-01-05'
      }
    ]
  },
  {
    id: '5',
    title: 'The Catcher in the Rye',
    author: 'J.D. Salinger',
    description: 'A controversial novel about teenage rebellion and alienation in post-war America.',
    coverUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=450&fit=crop',
    isbn: '9780316769174',
    publishedDate: '1951',
    pageCount: 277,
    categories: ['Fiction', 'Coming of Age', 'Classic Literature'],
    rating: 3.8,
    reviews: [
      {
        id: '6',
        bookId: '5',
        rating: 4,
        comment: 'Holden Caulfield is a complex and relatable character. The book captures teenage angst perfectly.',
        reviewer: 'YoungReader',
        date: '2024-01-03'
      }
    ]
  }
];

export const searchBooks = (query: string): Book[] => {
  if (!query.trim()) return [];
  
  const lowercaseQuery = query.toLowerCase();
  return mockBooks.filter(book => 
    book.title.toLowerCase().includes(lowercaseQuery) ||
    book.author.toLowerCase().includes(lowercaseQuery) ||
    book.description?.toLowerCase().includes(lowercaseQuery) ||
    book.categories?.some(category => category.toLowerCase().includes(lowercaseQuery))
  );
};
