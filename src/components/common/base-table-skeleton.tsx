'use client';

import React from 'react';
import { Skeleton } from '../ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';

type TBaseTableSkeletonProps = {
  col?: number;
  row?: number;
};

export default function BaseTableSkeleton({
  col = 4,
  row = 5,
}: TBaseTableSkeletonProps) {
  return (
    <>
      <div className=" mt-4 overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow className=" bg-neutral-200">
              {[...Array(col)].map((_, i) => (
                <TableHead key={i}>
                  <Skeleton className=" h-4 w-24" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(row)].map((_, i) => (
              <TableRow key={i}>
                {[...Array(col)].map((_, j) => (
                  <TableCell
                    key={j}
                    className=" h-16"
                  >
                    <Skeleton className=" h-5 w-24" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className=" mt-8 flex justify-between">
        <Skeleton className=" h-8 w-16" />
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <Skeleton
              key={i}
              className=" aspect-square w-8"
            />
          ))}
        </div>
      </div>
    </>
  );
}
