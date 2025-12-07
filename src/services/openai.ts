import type { Book, Genre } from '../types/book';

interface OpenAIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string | Array<{ type: string; text?: string; image_url?: { url: string } }>;
}

interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

interface AnalyzedBook {
  title: string;
  author: string;
  summary: string;
  genre: Genre;
}

const VALID_GENRES: Genre[] = ['Fiction', 'Tech', 'Essay', 'Science', 'Biography', 'Self-Help'];

function validateGenre(genre: string): Genre {
  if (VALID_GENRES.includes(genre as Genre)) {
    return genre as Genre;
  }
  return 'Fiction'; // Default fallback
}

export async function analyzeBookshelfImage(
  imageBase64: string,
  apiKey: string
): Promise<Book[]> {
  const prompt = `Tu es un expert en livres. Analyse cette photo d'étagère de livres et identifie TOUS les livres visibles.

Pour chaque livre que tu peux identifier (même partiellement), fournis:
- title: Le titre exact du livre
- author: Le nom de l'auteur (si tu le connais, sinon mets "Auteur inconnu")
- summary: Un résumé de 2-3 phrases en français décrivant le livre
- genre: Une de ces catégories: Fiction, Tech, Essay, Science, Biography, Self-Help

IMPORTANT: 
- Identifie le MAXIMUM de livres possibles, même si tu ne vois que partiellement le titre
- Les livres peuvent être en français ou dans d'autres langues
- Réponds UNIQUEMENT avec un tableau JSON valide, sans markdown, sans explication

Format attendu:
[{"title": "Titre", "author": "Auteur", "summary": "Résumé...", "genre": "Fiction"}]`;

  const messages: OpenAIMessage[] = [
    {
      role: 'user',
      content: [
        {
          type: 'text',
          text: prompt,
        },
        {
          type: 'image_url',
          image_url: {
            url: imageBase64,
          },
        },
      ],
    },
  ];

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages,
      max_tokens: 4096,
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      error.error?.message || `Erreur API OpenAI: ${response.status}`
    );
  }

  const data: OpenAIResponse = await response.json();
  const content = data.choices[0]?.message?.content;

  console.log('OpenAI raw response:', content);

  if (!content) {
    throw new Error('Réponse vide de l\'API OpenAI');
  }

  // Parse the JSON response
  let analyzedBooks: AnalyzedBook[];
  try {
    // Clean up potential markdown code blocks
    const cleanContent = content
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();
    console.log('Cleaned content:', cleanContent);
    analyzedBooks = JSON.parse(cleanContent);
  } catch (e) {
    console.error('Failed to parse OpenAI response:', content, e);
    throw new Error('Impossible de parser la réponse de l\'IA');
  }

  if (!Array.isArray(analyzedBooks)) {
    throw new Error('Format de réponse invalide');
  }

  // Convert to Book objects with placeholder covers initially
  const books: Book[] = analyzedBooks.map((book) => {
    const title = book.title || 'Titre inconnu';
    const author = book.author || 'Auteur inconnu';
    
    return {
      id: crypto.randomUUID(),
      title,
      author,
      summary: book.summary || 'Aucun résumé disponible.',
      genre: validateGenre(book.genre),
      status: Math.random() > 0.3 ? 'available' : 'lent' as const,
      coverUrl: generatePlaceholderCover(title, author), // Placeholder initially
    };
  });

  return books;
}

// Load covers progressively and call onUpdate for each book
export async function loadBookCovers(
  books: Book[],
  onUpdate: (bookId: string, coverUrl: string) => void
): Promise<void> {
  // Load all covers in parallel, updating as each one resolves
  await Promise.all(
    books.map(async (book) => {
      const coverUrl = await getBookCover(book.title, book.author);
      // Only update if we found a real cover (not placeholder)
      if (!coverUrl.includes('placehold.co')) {
        onUpdate(book.id, coverUrl);
      }
    })
  );
}

// Color palette for placeholder covers
const COVER_COLORS = [
  { bg: '6366f1', text: 'ffffff' }, // Indigo
  { bg: '8b5cf6', text: 'ffffff' }, // Violet
  { bg: 'ec4899', text: 'ffffff' }, // Pink
  { bg: 'f59e0b', text: 'ffffff' }, // Amber
  { bg: '10b981', text: 'ffffff' }, // Emerald
  { bg: '3b82f6', text: 'ffffff' }, // Blue
  { bg: 'ef4444', text: 'ffffff' }, // Red
  { bg: '14b8a6', text: 'ffffff' }, // Teal
];

// Generate a hash from string for consistent color selection
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

// Generate placeholder cover with title
function generatePlaceholderCover(title: string, author: string): string {
  const colorIndex = hashString(title + author) % COVER_COLORS.length;
  const color = COVER_COLORS[colorIndex];
  
  // Truncate title for display
  const displayTitle = title.length > 30 ? title.slice(0, 27) + '...' : title;
  const displayAuthor = author.length > 20 ? author.slice(0, 17) + '...' : author;
  const text = encodeURIComponent(`${displayTitle}\\n\\n${displayAuthor}`);
  
  return `https://placehold.co/300x400/${color.bg}/${color.text}?text=${text}&font=playfair-display`;
}

// Search Open Library for ISBN by title and author
async function searchOpenLibraryISBN(title: string, author: string): Promise<string | null> {
  try {
    const query = encodeURIComponent(`${title} ${author}`);
    const searchUrl = `https://openlibrary.org/search.json?q=${query}&limit=1&fields=isbn`;
    
    const response = await fetch(searchUrl);
    if (!response.ok) return null;
    
    const data = await response.json();
    const isbns = data.docs?.[0]?.isbn;
    
    if (isbns && isbns.length > 0) {
      // Prefer ISBN-13 (starts with 978 or 979)
      const isbn13 = isbns.find((isbn: string) => isbn.startsWith('978') || isbn.startsWith('979'));
      return isbn13 || isbns[0];
    }
  } catch (e) {
    console.log('Open Library search failed:', e);
  }
  return null;
}

// Try to get cover from Open Library, fallback to placeholder
export async function getBookCover(title: string, author: string): Promise<string> {
  // Search for ISBN via Open Library Search API
  const isbn = await searchOpenLibraryISBN(title, author);
  
  if (isbn) {
    const openLibraryUrl = `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg?default=false`;
    
    try {
      const response = await fetch(openLibraryUrl, { method: 'HEAD' });
      
      // If response is OK (not 404), the cover exists
      if (response.ok) {
        console.log(`Found cover for "${title}" with ISBN: ${isbn}`);
        return `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`;
      }
    } catch (e) {
      console.log('Open Library cover fetch failed for ISBN:', isbn, e);
    }
  }
  
  // Fallback to styled placeholder
  console.log(`No cover found for "${title}", using placeholder`);
  return generatePlaceholderCover(title, author);
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result); // Already includes data:image/...;base64, prefix
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
