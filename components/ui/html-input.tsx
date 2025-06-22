import * as React from "react";
import { cn } from "@/lib/utils";

export interface HtmlInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const HtmlInput = React.forwardRef<HTMLInputElement, HtmlInputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "shadow-xs focus-visible:ring-ring/50 dark:bg-input/30 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base transition-[color,box-shadow] selection:bg-primary selection:text-primary-foreground file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
HtmlInput.displayName = "HtmlInput";

export { HtmlInput };
