import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium text-sm transition-colors focus-visible:outline-none  disabled:pointer-events-none disabled:opacity-50 ',
  {
    variants: {
      variant: {
        default: 'bg-primary text-white hover:bg-primary/90 ',
        destructive: 'bg-red-50 text-red-500 fill-red-500 hover:bg-red-50/90 ',
        info: 'bg-blue-50 text-blue-500 fill-blue-500 hover:bg-blue-50/90 ',
        success:
          'bg-green-50 text-green-500 fill-green-500 hover:bg-green-50/90',
        outline: 'border border-neutral-200 bg-white text-neutral-500',
        'outline-primary':
          'border border-primary bg-white text-primary hover:bg-primary hover:text-white ',
        secondary: 'bg-neutral-100 text-neutral-900 hover:bg-neutral-100/80 ',
        ghost:
          'hover:bg-primary text-gray-500 fill-gray-500 hover:text-white hover:fill-white',
        transparent:
          'text-xs text-neutral-800 hover:bg-transparent hover:text-neutral-800',
        'transparent-destructive':
          'text-xs text-red-500 hover:bg-transparent hover:text-red-500/90',
        'ghost-primary':
          'hover:bg-primary text-primary fill-primary hover:fill-white hover:text-white ',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
        'icon-sm': 'h-8 w-8',
        filter: 'h-10 py-2 px-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
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
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
