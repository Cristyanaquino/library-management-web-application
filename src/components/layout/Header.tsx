import { BookText, Menu } from "lucide-react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { SidebarDrawer } from "@/components/layout/SidebarDrawer";
import { useAuth } from "@/hooks/useAuth";
import { SearchBar } from "@/components/books/SearchBar";

type HeaderProps = {
  searchValue?: string;
  onSearchSubmit?: (value: string) => void;
};

export function Header({ searchValue = "", onSearchSubmit }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(searchValue);
  const { profile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [, setSearchParams] = useSearchParams();

  useEffect(() => {
    setDraft(searchValue);
  }, [searchValue]);

  const handleSearchSubmit = onSearchSubmit ?? ((value: string) => {
    const params = new URLSearchParams();
    if (value.trim()) params.set("q", value.trim());
    navigate({ pathname: "/", search: params.toString() ? `?${params.toString()}` : "" });
  });

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm">
              <BookText className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Biblioteca</p>
              <p className="text-sm font-semibold text-slate-900">Aurora</p>
            </div>
          </Link>

          <div className="hidden flex-1 justify-center md:flex">
            <div className="w-full max-w-xl">
              <SearchBar value={draft} onChange={setDraft} onSubmit={handleSearchSubmit} compact />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 lg:flex">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              {profile?.full_name ?? "Leitor"}
            </div>
            <Button type="button" variant="outline" size="icon" onClick={() => setOpen(true)} aria-label="Abrir menu">
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {location.pathname === "/" ? (
          <div className="border-t border-slate-200/70 px-4 py-3 md:hidden">
            <SearchBar value={draft} onChange={setDraft} onSubmit={handleSearchSubmit} />
          </div>
        ) : null}
      </header>

      <SidebarDrawer
        open={open}
        onClose={() => setOpen(false)}
        searchValue={searchValue}
        onSearchSubmit={(value) => {
          handleSearchSubmit(value);
          setSearchParams((current) => {
            const next = new URLSearchParams(current);
            if (value.trim()) next.set("q", value.trim());
            else next.delete("q");
            return next;
          });
          setOpen(false);
        }}
      />
    </>
  );
}
