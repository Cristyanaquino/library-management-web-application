import { forwardRef } from "react";

import { cn } from "@/utils/cn";

export const Label = forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(function Label(
  { className, ...props },
  ref,
) {
  return <label ref={ref} className={cn("text-sm font-medium text-slate-700", className)} {...props} />;
});
