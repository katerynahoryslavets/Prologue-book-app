
export interface Book {
  id: string;
  title: string;
  author: string;
  description?: string;
  coverUrl?: string;
  isbn?: string;
  publishedDate?: string;
  pageCount?: number;
  categories?: string[];
  rating?: number;
  reviews?: Review[];
}

export interface Review {
  id: string;
  bookId: string;
  rating: number;
  comment: string;
  reviewer: string;
  date: string;
}

export interface ReadingProgress {
  bookId: string;
  currentPage: number;
  totalPages: number;
  status: 'reading' | 'completed' | 'want-to-read';
  startDate?: string;
  finishDate?: string;
}

export interface UserBook extends Book {
  progress?: ReadingProgress;
  isInWishlist: boolean;
  dateAdded: string;
}
