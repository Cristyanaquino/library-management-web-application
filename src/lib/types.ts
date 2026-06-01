export type Genre =
  | "Ficção"
  | "Não-Ficção"
  | "Fantasia"
  | "Romance"
  | "Terror"
  | "Biografia"
  | "Ciências"
  | "História"
  | "Infantil"
  | "Tecnologia";

export type Book = {
  id: string;
  title: string;
  author: string;
  genre: Genre | string;
  isbn: string | null;
  cover_url: string | null;
  is_available: boolean;
  created_at: string;
};

export type Profile = {
  id: string;
  full_name: string;
  email: string;
  created_at: string;
};

export type LoanStatus = "active" | "returned" | "overdue";

export type Loan = {
  id: string;
  user_id: string;
  book_id: string;
  loan_date: string;
  due_date: string;
  status: LoanStatus;
  created_at: string;
};

export type LoanWithBook = Loan & {
  book: Book | null;
};

export type AuthUser = {
  id: string;
  email: string | null;
  user_metadata?: Record<string, unknown>;
};
