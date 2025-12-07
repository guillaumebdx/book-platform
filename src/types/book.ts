export type BookStatus = 'available' | 'lent';

export type Genre = 'Fiction' | 'Tech' | 'Essay' | 'Science' | 'Biography' | 'Self-Help';

export interface Book {
  id: string;
  title: string;
  author: string;
  summary: string;
  coverUrl: string;
  status: BookStatus;
  genre: Genre;
}
