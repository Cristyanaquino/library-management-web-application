import { format, isAfter, parseISO } from "date-fns";

import type { LoanStatus } from "@/lib/types";

export const GENRES = [
  "Ficção",
  "Não-Ficção",
  "Fantasia",
  "Romance",
  "Terror",
  "Biografia",
  "Ciências",
  "História",
  "Infantil",
  "Tecnologia",
] as const;

export const EMPTY_FILTER = "Todos";

export function formatDate(value: string) {
  try {
    return format(parseISO(value), "dd/MM/yyyy");
  } catch {
    return value;
  }
}

export function formatDateTime(value: string) {
  try {
    return format(parseISO(value), "dd/MM/yyyy 'às' HH:mm");
  } catch {
    return value;
  }
}

export function getLoanStatusInfo(status: LoanStatus | string, dueDate: string) {
  const overdue = status === "active" && isAfter(new Date(), parseISO(dueDate));
  const finalStatus = overdue ? "overdue" : status;

  const info = {
    active: {
      label: "Ativo",
      className: "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200",
    },
    overdue: {
      label: "Atrasado",
      className: "bg-rose-100 text-rose-700 ring-1 ring-rose-200",
    },
    returned: {
      label: "Devolvido",
      className: "bg-slate-100 text-slate-700 ring-1 ring-slate-200",
    },
  } as const;

  return info[finalStatus as keyof typeof info] ?? info.active;
}

export function initialsFromName(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function safeText(value: string | null | undefined, fallback = "") {
  return value?.trim() || fallback;
}
