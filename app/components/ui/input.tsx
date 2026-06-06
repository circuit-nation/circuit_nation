import * as React from "react";
import { cn } from "~/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex w-full min-w-0 rounded-[12px] border border-cn-line-strong bg-cn-bg/60 px-[18px] py-[15px] text-sm font-body text-cn-text placeholder:text-cn-muted-2 outline-none transition-[border-color] duration-200 focus:border-cn-accent disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

export { Input };
