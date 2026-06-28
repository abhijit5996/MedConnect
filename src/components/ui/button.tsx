import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-br from-[#67D4C1] to-[#40B9A4] text-white shadow-[0_8px_20px_-6px_rgba(64,185,164,0.4)] border-none rounded-full hover:scale-[1.03] transition-all duration-300 hover:shadow-[0_12px_25px_-6px_rgba(64,185,164,0.5)] active:scale-95",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-white/40 bg-white/20 dark:border-white/10 dark:bg-black/20 hover:bg-white/30 dark:hover:bg-black/30 hover:text-foreground backdrop-blur-md rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.02)] transition-all",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-secondary hover:text-foreground rounded-full",
        link: "text-primary underline-offset-4 hover:underline",
        accent: "bg-gradient-to-br from-[#FF9E8C] to-[#FF7B68] text-white shadow-[0_8px_20px_-6px_rgba(255,123,104,0.4)] border-none rounded-full hover:scale-[1.03] transition-all duration-300 hover:shadow-[0_12px_25px_-6px_rgba(255,123,104,0.5)] active:scale-95",
      },
      size: {
        default: "h-10 px-6 py-2",
        sm: "h-9 rounded-full px-4",
        lg: "h-11 rounded-full px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
