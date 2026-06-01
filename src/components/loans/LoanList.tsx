import { useMemo } from "react";
import { CalendarDays, ChevronRight, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { LoanStatus, LoanWithBook } from "@/lib/types";
import { formatDate, getLoanStatusInfo } from "@/lib/utils";

type LoanListProps = {
  loans: LoanWithBook[];
  loading: boolean;
  error: string | null;
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: LoanStatus | "all";
  onStatusChange: (value: LoanStatus | "all") => void;
};

export function LoanList({ loans, loading, error, search, onSearchChange, statusFilter, onStatusChange }: LoanListProps) {
  const visibleLoans = useMemo(() => loans, [loans]);

  return (
    <section className="space-y-4">
      <div className="grid gap-3 md:grid-cols-[1fr_220px]">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Buscar por título do livro"
            className="pl-11"
          />
        </label>

        <Select value={statusFilter} onChange={(event) => onStatusChange(event.target.value as LoanStatus | "all") }>
          <option value="all">Todos os status</option>
          <option value="active">Ativo</option>
          <option value="overdue">Atrasado</option>
          <option value="returned">Devolvido</option>
        </Select>
      </div>

      {loading ? <p className="rounded-3xl border border-slate-200 bg-white px-4 py-6 text-sm text-slate-500">Carregando empréstimos...</p> : null}
      {error ? <p className="rounded-3xl border border-rose-200 bg-rose-50 px-4 py-6 text-sm text-rose-700">{error}</p> : null}

      {!loading && !error && visibleLoans.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white px-4 py-10 text-center text-sm text-slate-500">
          Nenhum empréstimo encontrado para este filtro.
        </div>
      ) : null}

      <div className="space-y-3">
        {visibleLoans.map((loan) => {
          const book = loan.book;
          const statusInfo = getLoanStatusInfo(loan.status, loan.due_date);

          return (
            <article key={loan.id} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex gap-4">
                <div className="h-24 w-16 shrink-0 overflow-hidden rounded-2xl bg-slate-100">
                  {book?.cover_url ? (
                    <img src={book.cover_url} alt={book.title} className="h-full w-full object-cover" />
                  ) : null}
                </div>

                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate text-base font-semibold text-slate-900">{book?.title ?? "Livro não encontrado"}</h3>
                      <p className="truncate text-sm text-slate-600">{book?.author ?? "Autor indisponível"}</p>
                    </div>
                    <Badge className={statusInfo.className}>{statusInfo.label}</Badge>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                    <span className="inline-flex items-center gap-1">
                      <CalendarDays className="h-4 w-4" />
                      Empréstimo: {formatDate(loan.loan_date)}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <CalendarDays className="h-4 w-4" />
                      Devolução: {formatDate(loan.due_date)}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone="slate">{book?.genre ?? "Gênero"}</Badge>
                    {loan.status === "active" ? (
                      <a
                        href="mailto:biblioteca@exemplo.com?subject=Solicita%C3%A7%C3%A3o%20de%20extens%C3%A3o"
                        className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-950"
                      >
                        Pedir extensão
                        <ChevronRight className="h-4 w-4" />
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
