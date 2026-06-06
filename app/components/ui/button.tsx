import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "~/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        "view-switcher": "",
        link: "text-primary underline-offset-4 hover:underline",
        "cn-primary":
          "border-0 font-mono text-[12.5px] tracking-[0.1em] uppercase font-medium rounded-[10px] text-white cursor-pointer no-underline bg-gradient-to-b from-[#ff3b3b] to-cn-accent-deep shadow-[0_8px_30px_-8px_(--cn-accent-glow),inset_0_1px_0_rgba(255,255,255,0.25)] transition-[transform_.18s_ease,box-shadow_.25s_ease] hover:-translate-y-0.5 hover:shadow-[0_14px_40px_-8px_(--cn-accent-glow),inset_0_1px_0_rgba(255,255,255,0.3)]",
        "cn-ghost":
          "border border-cn-line-strong font-mono text-[12.5px] tracking-[0.1em] uppercase font-medium rounded-[10px] bg-white/[0.03] text-cn-text cursor-pointer no-underline transition-[transform_.18s_ease,background_.25s_ease,border-color_.25s_ease] hover:-translate-y-0.5 hover:bg-white/[0.06] hover:border-cn-text",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        xs: "h-6 gap-1 rounded-md px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-xs": "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
        cn: "px-5 py-3 gap-[9px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
