import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariant = {
  default:
    'border-transparent bg-neutral-900 text-neutral-50 hover:bg-neutral-900/80 ',
  secondary:
    'border-transparent bg-neutral-100 text-neutral-900 hover:bg-neutral-100/80 ',
  destructive:
    'border-transparent bg-red-500 text-neutral-50 hover:bg-red-500/80 ',
  outline: 'text-neutral-950 dark:text-neutral-50',
  'waiting-confirmation': 'border-transparent bg-violet-100 text-violet-500',
  violet: 'border-transparent bg-violet-50 text-violet-500',
  yellow: 'border-transparent bg-yellow-50 text-yellow-500',
  green: 'border-transparent bg-green-50 text-green-500',
  red: 'border-transparent bg-red-50 text-red-500',
  neutral: 'border-transparent bg-neutral-200 text-neutral-500',
  blue: 'border-transparent bg-blue-50 text-blue-500',
  amber: 'border-transparent bg-amber-50 text-amber-500',
  purple: 'border-transparent bg-purple-50 text-purple-500',
  indigo: 'border-transparent bg-indigo-50 text-indigo-500',
  orange: 'border-transparent bg-orange-50 text-orange-500',
};

export type TBadgeVariant = keyof typeof badgeVariant;

const badgeVariants = cva(
  'inline-flex items-center w-fit rounded-md border border-neutral-200 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 ',
  {
    variants: {
      variant: badgeVariant,
      size: {
        default: 'px-1.5 py-0.5',
        lg: 'px-2.5 h-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'lg',
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
