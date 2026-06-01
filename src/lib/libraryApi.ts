import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { EMPTY_FILTER, GENRES } from "@/lib/utils";
import type { AuthUser, Book, LoanStatus, LoanWithBook, Profile } from "@/lib/types";

export const demoProfile: Profile = {
  id: "demo-profile",
  full_name: "Bibliotecário Demo",
  email: "demo@biblioteca.local",
  created_at: new Date().toISOString(),
};

export const demoBooks: Book[] = [
  {
    id: "demo-book-1",
    title: "O Horizonte de Papel",
    author: "Lia Montenegro",
    genre: "Ficção",
    isbn: "9780000000011",
    cover_url: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=1200&q=80",
    is_available: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "demo-book-2",
    title: "Mapas do Amanhã",
    author: "Caio Nunes",
    genre: "Tecnologia",
    isbn: "9780000000028",
    cover_url: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80",
    is_available: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "demo-book-3",
    title: "Sombras na Estante",
    author: "Helena Duarte",
    genre: "Terror",
    isbn: "9780000000035",
    cover_url: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=80",
    is_available: false,
    created_at: new Date().toISOString(),
  },
  {
    id: "demo-book-4",
    title: "Atlas da Memória",
    author: "Rafael Sampaio",
    genre: "História",
    isbn: "9780000000042",
    cover_url: "https://images.unsplash.com/photo-1513001900722-370f803f498d?auto=format&fit=crop&w=1200&q=80",
    is_available: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "demo-book-5",
    title: "Entre Páginas e Estrelas",
    author: "Marina Costa",
    genre: "Romance",
    isbn: "9780000000059",
    cover_url: "https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=1200&q=80",
    is_available: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "demo-book-6",
    title: "Pequenos Grandes Cientistas",
    author: "Nina Freire",
    genre: "Infantil",
    isbn: "9780000000066",
    cover_url: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1200&q=80",
    is_available: true,
    created_at: new Date().toISOString(),
  },
];

export const demoLoans: LoanWithBook[] = [
  {
    id: "demo-loan-1",
    user_id: demoProfile.id,
    book_id: demoBooks[0].id,
    loan_date: "2026-05-15",
    due_date: "2026-06-05",
    status: "active",
    created_at: new Date().toISOString(),
    book: demoBooks[0],
  },
  {
    id: "demo-loan-2",
    user_id: demoProfile.id,
    book_id: demoBooks[2].id,
    loan_date: "2026-04-09",
    due_date: "2026-05-02",
    status: "overdue",
    created_at: new Date().toISOString(),
    book: demoBooks[2],
  },
];

function normalizeSearch(value: string) {
  return value.trim().replace(/[%,]/g, " ");
}

function normalizeBookRelation(value: Book | Book[] | null | undefined) {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

function matchesBook(book: Book, search = EMPTY_FILTER, genre = EMPTY_FILTER) {
  const normalizedSearch = normalizeSearch(search).toLowerCase();
  const genreMatches = genre === EMPTY_FILTER || book.genre === genre;
  const searchMatches =
    !normalizedSearch ||
    [book.title, book.author, book.genre, book.isbn ?? ""].some((item) =>
      item.toLowerCase().includes(normalizedSearch),
    );

  return genreMatches && searchMatches;
}

export async function fetchProfile(userId: string) {
  if (!supabase) return demoProfile;

  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, email, created_at")
    .eq("id", userId)
    .maybeSingle();

  if (error) throw error;
  return data as Profile | null;
}

export async function upsertProfile(user: AuthUser, fullName?: string | null) {
  if (!supabase || !user.email) return null;

  const payload = {
    id: user.id,
    full_name:
      fullName?.trim() ||
      (typeof user.user_metadata?.full_name === "string" ? user.user_metadata.full_name : "") ||
      user.email.split("@")[0],
    email: user.email,
  };

  const { error } = await supabase.from("profiles").upsert(payload);
  if (error) throw error;
  return payload;
}

export async function fetchBooks(options: { search?: string; genre?: string; onlyAvailable?: boolean } = {}) {
  const { search = "", genre = EMPTY_FILTER, onlyAvailable = false } = options;

  if (!supabase) {
    return demoBooks.filter((book) => matchesBook(book, search, genre) && (!onlyAvailable || book.is_available));
  }

  let query = supabase
    .from("books")
    .select("id, title, author, genre, isbn, cover_url, is_available, created_at")
    .order("created_at", { ascending: false });

  if (genre !== EMPTY_FILTER) query = query.eq("genre", genre);
  if (onlyAvailable) query = query.eq("is_available", true);

  const normalizedSearch = normalizeSearch(search);
  if (normalizedSearch) {
    query = query.or(
      `title.ilike.%${normalizedSearch}%,author.ilike.%${normalizedSearch}%,genre.ilike.%${normalizedSearch}%,isbn.ilike.%${normalizedSearch}%`,
    );
  }

  const { data, error } = await query;
  if (error) throw error;

  return (data ?? []) as Book[];
}

export async function fetchLoans(userId: string, options: { status?: LoanStatus | "all"; search?: string } = {}) {
  const { status = "all", search = "" } = options;

  if (!supabase) {
    return demoLoans.filter((loan) => {
      const statusMatches = status === "all" || loan.status === status;
      const normalized = search.trim().toLowerCase();
      const searchMatches = !normalized || loan.book?.title.toLowerCase().includes(normalized);
      return loan.user_id === userId && statusMatches && searchMatches;
    });
  }

  let query = supabase
    .from("loans")
    .select("id, user_id, book_id, loan_date, due_date, status, created_at, book:books(id, title, author, genre, isbn, cover_url, is_available, created_at)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (status !== "all") query = query.eq("status", status);

  const { data, error } = await query;
  if (error) throw error;

  const rows = (data ?? []).map((row) => ({
    ...row,
    book: normalizeBookRelation((row as { book?: Book[] | Book | null }).book),
  })) as LoanWithBook[];
  const normalized = search.trim().toLowerCase();
  return normalized ? rows.filter((loan) => loan.book?.title.toLowerCase().includes(normalized)) : rows;
}

export async function createLoan(userId: string, bookId: string, dueDate: string) {
  if (!supabase) {
    const book = demoBooks.find((item) => item.id === bookId) ?? null;
    return {
      id: `demo-loan-${Date.now()}`,
      user_id: userId,
      book_id: bookId,
      loan_date: new Date().toISOString().slice(0, 10),
      due_date: dueDate,
      status: "active" as const,
      created_at: new Date().toISOString(),
      book,
    };
  }

  const { data, error } = await supabase
    .from("loans")
    .insert({ user_id: userId, book_id: bookId, due_date: dueDate })
    .select("id, user_id, book_id, loan_date, due_date, status, created_at, book:books(id, title, author, genre, isbn, cover_url, is_available, created_at)")
    .single();

  if (error) throw error;
  const row = data as unknown as { book?: Book[] | Book | null } & Omit<LoanWithBook, "book">;
  return {
    ...row,
    book: normalizeBookRelation(row.book),
  } satisfies LoanWithBook;
}

export { isSupabaseConfigured, GENRES };
