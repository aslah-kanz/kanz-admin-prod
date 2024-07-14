'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { VariantProps, cva } from 'class-variance-authority';
import { Skeleton } from '../ui/skeleton';

const skeletonVariants = cva('w-full', {
  variants: {
    variant: {
      input: 'h-10',
      textarea: 'h-20',
      editor: 'h-[255px]',
      image: ' aspect-[2/1]',
    },
  },
  defaultVariants: {
    variant: 'input',
  },
});

export interface BaseSkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {}

export default function BaseSkeleton({ variant }: BaseSkeletonProps) {
  return (
    <div className=" space-y-2">
      <Skeleton className=" h-5 w-24" />
      <Skeleton className={cn(skeletonVariants({ variant }))} />
    </div>
  );
}
