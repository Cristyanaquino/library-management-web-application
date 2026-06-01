import { Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: (value: string) => void;
  placeholder?: string;
  compact?: boolean;
};

export function SearchBar({ value, onChange, onSubmit, placeholder = "Buscar livros, autores ou ISBN", compact = false }: SearchBarProps) {
  return (
    <form
      className="relative flex w-full items-center gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit?.(value);
      }}
    >
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className={compact ? "h-10 rounded-full pl-11 pr-11" : "pl-11 pr-11"}
        />
        {value ? (
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            aria-label="Limpar busca"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>
      {onSubmit ? (
        <Button type="submit" size={compact ? "sm" : "default"} className={compact ? "rounded-full" : "rounded-full"}>
          Buscar
        </Button>
      ) : null}
    </form>
  );
}
