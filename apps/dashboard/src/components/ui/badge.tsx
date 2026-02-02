import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        success:
          "border-transparent bg-success-600/10 text-success-600 border-success-600/20",
        warning:
          "border-transparent bg-warning-600/10 text-warning-600 border-warning-600/20",
        danger:
          "border-transparent bg-danger-600/10 text-danger-600 border-danger-600/20",
        // Severity variants
        critical:
          "border-transparent bg-severity-critical/10 text-severity-critical border-severity-critical/20",
        high:
          "border-transparent bg-severity-high/10 text-severity-high border-severity-high/20",
        medium:
          "border-transparent bg-severity-medium/10 text-severity-medium border-severity-medium/20",
        low:
          "border-transparent bg-severity-low/10 text-severity-low border-severity-low/20",
        // Sentiment variants
        positive:
          "border-transparent bg-sentiment-positive/10 text-sentiment-positive border-sentiment-positive/20",
        negative:
          "border-transparent bg-sentiment-negative/10 text-sentiment-negative border-sentiment-negative/20",
        neutral:
          "border-transparent bg-sentiment-neutral/10 text-sentiment-neutral border-sentiment-neutral/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
