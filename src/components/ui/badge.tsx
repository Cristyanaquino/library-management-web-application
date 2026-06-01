import { cn } from "@/utils/cn";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  tone?: "slate" | "emerald" | "rose" | "amber" | "violet";
};

export function Badge({ className, tone = "slate", ...props }: BadgeProps) {
  const tones = {
    slate: "bg-slate-100 text-slate-700 ring-slate-200",
    emerald: "bg-emerald-100 text-emerald-700 ring-emerald-200",
    rose: "bg-rose-100 text-rose-700 ring-rose-200",
    amber: "bg-amber-100 text-amber-700 ring-amber-200",
    violet: "bg-violet-100 text-violet-700 ring-violet-200",
  } as const;

  return <span className={cn("inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ring-1", tones[tone], className)} {...props} />;
}
