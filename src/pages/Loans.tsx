import { useCallback, useEffect, useState } from "react";
import { Loader2, Plus } from "lucide-react";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { LoanList } from "@/components/loans/LoanList";
import { LoanRequestModal } from "@/components/books/LoanRequestModal";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { fetchBooks, fetchLoans } from "@/lib/libraryApi";
import type { Book, LoanStatus, LoanWithBook } from "@/lib/types";

export default function Loans() {
  const { profile, user } = useAuth();
  const [loans, setLoans] = useState<LoanWithBook[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [loadingLoans, setLoadingLoans] = useState(true);
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<LoanStatus | "all">("all");
  const [loanModalOpen, setLoanModalOpen] = useState(false);

  const refreshLoans = useCallback(async () => {
    if (!user) return;
    setLoadingLoans(true);
    setError(null);

    try {
      const data = await fetchLoans(user.id, { search, status: statusFilter });
      setLoans(data);
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : "Não foi possível carregar seus empréstimos.");
    } finally {
      setLoadingLoans(false);
    }
  }, [search, statusFilter, user]);

  const refreshBooks = useCallback(async () => {
    setLoadingBooks(true);
    try {
      const data = await fetchBooks({ onlyAvailable: true });
      setBooks(data);
    } catch {
      setBooks([]);
    } finally {
      setLoadingBooks(false);
    }
  }, []);

  useEffect(() => {
    void refreshLoans();
  }, [refreshLoans]);

  useEffect(() => {
    void refreshBooks();
  }, [refreshBooks]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />

      <main className="mx-auto max-w-7xl px-4 pb-12 pt-24 sm:px-6 lg:px-8">
        <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <p className="text-sm font-medium uppercase tracking-[0.22em] text-slate-400">Meus Empréstimos</p>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">Acompanhe prazos e status com clareza.</h1>
            <p className="max-w-3xl text-base leading-7 text-slate-600">
              {profile?.full_name ? `${profile.full_name}, ` : ""}
              veja seus livros ativos, atrasados e devolvidos. Use a busca e o filtro para encontrar rapidamente o histórico que você precisa.
            </p>
          </div>

          <Button type="button" className="rounded-2xl" onClick={() => setLoanModalOpen(true)} disabled={loadingBooks}>
            {loadingBooks ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Novo empréstimo
          </Button>
        </section>

        <div className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <LoanList
            loans={loans}
            loading={loadingLoans}
            error={error}
            search={search}
            onSearchChange={setSearch}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
          />
        </div>
      </main>

      <Footer />

      <LoanRequestModal
        open={loanModalOpen}
        onClose={() => setLoanModalOpen(false)}
        books={books}
        onSuccess={() => {
          void refreshLoans();
          void refreshBooks();
        }}
      />
    </div>
  );
}
