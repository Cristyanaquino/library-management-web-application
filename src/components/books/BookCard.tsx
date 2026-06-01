import { BookOpen, LibraryBig } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Book } from "@/lib/types";
import { initialsFromName } from "@/lib/utils";

type BookCardProps = {
  book: Book;
  onRequestLoan?: (book: Book) => void;
};

export function BookCard({ book, onRequestLoan }: BookCardProps) {
  const cover = book.cover_url?.trim();

  return (
    <article className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[3/4] overflow-hidden bg-slate-100">
        {cover ? (
          <img
            src={cover}
            alt={`Capa de ${book.title}`}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-900 to-slate-700 text-white">
            <div className="space-y-3 text-center">
              <LibraryBig className="mx-auto h-10 w-10 text-white/80" />
              <div className="text-3xl font-semibold tracking-tight">{initialsFromName(book.title)}</div>
            </div>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/85 to-transparent p-4 text-white">
          <p className="text-xs uppercase tracking-[0.2em] text-white/70">{book.genre}</p>
          <h3 className="mt-1 line-clamp-2 text-lg font-semibold">{book.title}</h3>
        </div>
      </div>
      <div className="space-y-4 p-4">
        <div className="space-y-2">
          <p className="text-sm text-slate-600">{book.author}</p>
          <div className="flex items-center justify-between gap-3">
            <Badge tone={book.is_available ? "emerald" : "slate"}>{book.is_available ? "Disponível" : "Indisponível"}</Badge>
            <span className="text-xs uppercase tracking-[0.18em] text-slate-400">{book.isbn || "Sem ISBN"}</span>
          </div>
        </div>
        <Button
          type="button"
          className="w-full rounded-2xl"
          onClick={() => onRequestLoan?.(book)}
          disabled={!book.is_available}
        >
          <BookOpen className="h-4 w-4" />
          {book.is_available ? "Solicitar Empréstimo" : "Aguardando devolução"}
        </Button>
      </div>
    </article>
  );
}
