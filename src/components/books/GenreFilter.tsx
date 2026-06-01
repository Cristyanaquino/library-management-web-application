import { cn } from "@/utils/cn";

import { GENRES } from "@/lib/libraryApi";
import { EMPTY_FILTER } from "@/lib/utils";

type GenreFilterProps = {
  value: string;
  onChange: (genre: string) => void;
};

export function GenreFilter({ value, onChange }: GenreFilterProps) {
  const genres = [EMPTY_FILTER, ...GENRES];

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
      {genres.map((genre) => {
        const active = genre === value;
        return (
          <button
            key={genre}
            type="button"
            onClick={() => onChange(genre)}
            className={cn(
              "whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition",
              active
                ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900",
            )}
          >
            {genre}
          </button>
        );
      })}
    </div>
  );
}
