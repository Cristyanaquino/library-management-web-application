import { useEffect, useState } from "react";
import { MessageCircleMore, X } from "lucide-react";
import { NavLink } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/books/SearchBar";
import { useAuth } from "@/hooks/useAuth";

type SidebarDrawerProps = {
  open: boolean;
  onClose: () => void;
  searchValue: string;
  onSearchSubmit: (value: string) => void;
};

const navItems = [
  { to: "/about", label: "Quem Somos" },
  { to: "/contact", label: "Contato" },
  { to: "/loans", label: "Meus Empréstimos" },
];

export function SidebarDrawer({ open, onClose, searchValue, onSearchSubmit }: SidebarDrawerProps) {
  const { profile, signOut } = useAuth();
  const [query, setQuery] = useState(searchValue);

  useEffect(() => {
    setQuery(searchValue);
  }, [searchValue, open]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose, open]);

  return (
    <div className={open ? "fixed inset-0 z-50" : "pointer-events-none fixed inset-0 z-50"} aria-hidden={!open}>
      <button
        type="button"
        className={`absolute inset-0 bg-slate-950/50 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
        aria-label="Fechar menu"
      />
      <aside
        className={`absolute right-0 top-0 h-full w-full max-w-sm border-l border-slate-200 bg-white shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Biblioteca Aurora</p>
            <p className="text-sm font-medium text-slate-900">Menu e busca</p>
          </div>
          <Button type="button" variant="ghost" size="icon" onClick={onClose} aria-label="Fechar menu">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-6 p-5">
          <SearchBar value={query} onChange={setQuery} onSubmit={(value) => {
            onSearchSubmit(value);
            onClose();
          }} compact />

          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    isActive ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-900">{profile?.full_name ?? "Leitor"}</p>
            <p className="mt-1 text-sm text-slate-500">{profile?.email ?? "Sem email cadastrado"}</p>
            <div className="mt-4 flex flex-col gap-2">
              <a href="mailto:biblioteca@exemplo.com" className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-950">
                <MessageCircleMore className="h-4 w-4" />
                suporte@biblioteca.com
              </a>
              <Button
                type="button"
                variant="outline"
                onClick={async () => {
                  await signOut();
                  onClose();
                }}
              >
                Sair da conta
              </Button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
