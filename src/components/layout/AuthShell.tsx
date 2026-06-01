import { BookText } from "lucide-react";
import { Link } from "react-router-dom";
import type { ReactNode } from "react";

type AuthShellProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
};

export function AuthShell({ title, subtitle, children }: AuthShellProps) {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.08),_transparent_45%),linear-gradient(180deg,#f8fafc_0%,#ffffff_100%)] px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-6xl flex-col justify-center gap-10">
        <Link to="/" className="flex items-center gap-3 self-start">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm">
            <BookText className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Biblioteca</p>
            <p className="text-sm font-semibold text-slate-900">Aurora</p>
          </div>
        </Link>

        <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="space-y-5">
            <p className="text-sm font-medium uppercase tracking-[0.22em] text-slate-400">Acesso seguro</p>
            <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">{title}</h1>
            <p className="max-w-xl text-base leading-7 text-slate-600">{subtitle}</p>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/60 sm:p-6">{children}</div>
        </section>
      </div>
    </main>
  );
}
