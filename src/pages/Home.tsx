import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { useSearchParams } from "react-router-dom";

import { BookCard } from "@/components/books/BookCard";
import { GenreFilter } from "@/components/books/GenreFilter";
import { SearchBar } from "@/components/books/SearchBar";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { LoanRequestModal } from "@/components/books/LoanRequestModal";
import { useAuth } from "@/hooks/useAuth";
import { fetchBooks } from "@/lib/libraryApi";
import type { Book } from "@/lib/types";
import { EMPTY_FILTER } from "@/lib/utils";

export default function Home() {
  const { profile } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBookId, setSelectedBookId] = useState<string | undefined>();
  const [loanModalOpen, setLoanModalOpen] = useState(false);

  const search = searchParams.get("q") ?? "";
  const genre = searchParams.get("genre") ?? EMPTY_FILTER;

  const refreshBooks = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchBooks({ search, genre });
      setBooks(data);
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : "Não foi possível carregar o catálogo.");
    } finally {
      setLoading(false);
    }
  }, [genre, search]);

  useEffect(() => {
    void refreshBooks();
  }, [refreshBooks]);

  const firstName = useMemo(() => {
    const raw = profile?.full_name?.trim() || profile?.email?.split("@")[0] || "Leitor";
    return raw.split(" ")[0] ?? raw;
  }, [profile?.email, profile?.full_name]);

  const updateParams = (updates: Record<string, string | null>) => {
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      Object.entries(updates).forEach(([key, value]) => {
        if (value && value !== EMPTY_FILTER) next.set(key, value);
        else next.delete(key);
      });
      return next;
    });
  };

  const visibleBooks = books;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header
        searchValue={search}
        onSearchSubmit={(value) => updateParams({ q: value })}
      />

      <main className="mx-auto max-w-7xl px-4 pb-12 pt-24 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(15,23,42,0.08),_transparent_40%),linear-gradient(120deg,rgba(15,23,42,0.04),transparent_60%)]" />
          <div className="relative max-w-3xl space-y-5">
            <p className="text-sm font-medium uppercase tracking-[0.22em] text-slate-400">Biblioteca Aurora</p>
            <div className="space-y-3">
              <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">Bem-vindo, {firstName}</h1>
              <p className="max-w-2xl text-base leading-7 text-slate-600">
                Descubra títulos por gênero, refine sua busca e solicite empréstimos com poucos toques.
              </p>
            </div>
            <div className="max-w-2xl">
              <SearchBar
                value={search}
                onChange={(value) => updateParams({ q: value })}
                onSubmit={(value) => updateParams({ q: value })}
              />
            </div>
          </div>
        </section>

        <section className="mt-8 space-y-4">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium uppercase tracking-[0.22em] text-slate-400">Catálogo filtrado</p>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Mais em Alta</h2>
            <p className="max-w-2xl text-sm leading-6 text-slate-600">
              Use os filtros de gênero ou a busca textual para encontrar rapidamente os livros mais relevantes do acervo.
            </p>
          </div>

          <GenreFilter value={genre} onChange={(value) => updateParams({ genre: value })} />
        </section>

        <section className="mt-6">
          {loading ? (
            <div className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-white px-4 py-6 text-sm text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              Carregando catálogo...
            </div>
          ) : null}

          {error ? <p className="rounded-3xl border border-rose-200 bg-rose-50 px-4 py-6 text-sm text-rose-700">{error}</p> : null}

          {!loading && !error && visibleBooks.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-white px-4 py-10 text-center">
              <Sparkles className="mx-auto h-6 w-6 text-slate-400" />
              <p className="mt-3 text-sm font-medium text-slate-900">Nenhum livro encontrado</p>
              <p className="mt-1 text-sm text-slate-500">Tente outro gênero ou remova os filtros para ver mais resultados.</p>
            </div>
          ) : null}

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {visibleBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onRequestLoan={(selected) => {
                  setSelectedBookId(selected.id);
                  setLoanModalOpen(true);
                }}
              />
            ))}
          </div>
        </section>
      </main>

      <Footer />

      <LoanRequestModal
        open={loanModalOpen}
        onClose={() => setLoanModalOpen(false)}
        books={books}
        initialBookId={selectedBookId}
        onSuccess={() => void refreshBooks()}
      />
    </div>
  );
}
