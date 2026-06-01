import { useEffect, useMemo, useState } from "react";
import { addDays, format } from "date-fns";
import { Loader2, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { createLoan } from "@/lib/libraryApi";
import { useAuth } from "@/hooks/useAuth";
import { loanRequestSchema, type LoanRequestFormValues } from "@/lib/validations";
import type { Book } from "@/lib/types";

type LoanRequestModalProps = {
  open: boolean;
  onClose: () => void;
  books: Book[];
  initialBookId?: string;
  onSuccess?: () => void;
};

export function LoanRequestModal({ open, onClose, books, initialBookId, onSuccess }: LoanRequestModalProps) {
  const { user } = useAuth();
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const defaultDueDate = useMemo(() => format(addDays(new Date(), 14), "yyyy-MM-dd"), []);

  const form = useForm<LoanRequestFormValues>({
    resolver: zodResolver(loanRequestSchema),
    defaultValues: {
      bookId: initialBookId || books[0]?.id || "",
      dueDate: defaultDueDate,
    },
  });

  useEffect(() => {
    if (!open) return;
    form.reset({
      bookId: initialBookId || books[0]?.id || "",
      dueDate: defaultDueDate,
    });
    setMessage(null);
  }, [books, defaultDueDate, form, initialBookId, open]);

  if (!open) return null;

  async function onSubmit(values: LoanRequestFormValues) {
    if (!user) {
      setMessage("Você precisa estar autenticado para solicitar um empréstimo.");
      return;
    }

    setSubmitting(true);
    setMessage(null);

    try {
      await createLoan(user.id, values.bookId, values.dueDate);
      setMessage("Solicitação enviada com sucesso.");
      onSuccess?.();
      window.setTimeout(() => onClose(), 900);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Não foi possível concluir a solicitação.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 px-3 py-4 backdrop-blur-sm sm:items-center">
      <button type="button" className="absolute inset-0 cursor-default" aria-label="Fechar modal" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-slate-500">Solicitação de empréstimo</p>
            <h2 className="text-xl font-semibold text-slate-900">Escolha um livro e o prazo de devolução</h2>
          </div>
          <Button type="button" variant="ghost" size="icon" onClick={onClose} aria-label="Fechar">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <Label htmlFor="bookId">Livro</Label>
            <Select id="bookId" {...form.register("bookId")}>
              {books.length === 0 ? <option value="">Nenhum livro disponível</option> : null}
              {books.map((book) => (
                <option key={book.id} value={book.id}>
                  {book.title} - {book.author}
                </option>
              ))}
            </Select>
            {form.formState.errors.bookId ? <p className="text-sm text-rose-600">{form.formState.errors.bookId.message}</p> : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">Prazo de devolução</Label>
            <Input id="dueDate" type="date" {...form.register("dueDate")} />
            {form.formState.errors.dueDate ? <p className="text-sm text-rose-600">{form.formState.errors.dueDate.message}</p> : null}
          </div>

          {message ? <p className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">{message}</p> : null}

          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={submitting || books.length === 0}>
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Confirmar empréstimo
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
