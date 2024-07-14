'use client';

import useLangClient from '@/hooks/use-lang-client';
import { DOTS, usePagination } from '@/hooks/use-pagination';
import useWindowSize from '@/hooks/use-window-size';
import { cn } from '@/lib/utils';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback, useMemo } from 'react';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';
import { Button } from '../ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from '../ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

type TBasePaginationProps = {
  totalCount: number;
  withSizeOptions?: boolean;
  customSizeOptions?: number[] | null;
  totalDataTitle?: string;
};

export default function BasePagination({
  totalCount,
  withSizeOptions = true,
  customSizeOptions,
  totalDataTitle = 'data',
}: TBasePaginationProps) {
  // search params
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;
  const size = Number(searchParams.get('size')) || 10;
  const { isAr } = useLangClient();

  // count total page
  const TOTAL_PAGE = Math.ceil(totalCount / size);

  // hooks
  const { width } = useWindowSize();
  const qs = useMemo(() => new URLSearchParams(searchParams), [searchParams]);
  const router = useRouter();
  const pathname = usePathname();
  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount: width < 640 ? 0 : 1,
    pageSize: size,
  });

  /**
   * Handle change size
   * @param value
   */
  const handleSizeChange = useCallback(
    (value: string) => {
      qs.set('size', value);
      qs.set('page', '1');
      router.push(`${pathname}?${qs}`);
    },
    [router, pathname, qs],
  );

  /**
   * Handle prev
   */
  const handlePrev = useCallback(() => {
    qs.set('page', (currentPage - 1).toString());

    router.push(`${pathname}?${qs}`);
  }, [qs, currentPage, pathname, router]);

  /**
   * Handle next
   */
  const handleNext = useCallback(() => {
    qs.set('page', (currentPage + 1).toString());
    router.push(`${pathname}?${qs}`);
  }, [qs, currentPage, pathname, router]);

  /**
   * Handle page change
   * @param value
   */
  const handlePageChange = useCallback(
    (value: number) => {
      qs.set('page', value.toString());
      router.push(`${pathname}?${qs}`);
    },
    [qs, pathname, router],
  );

  const sizeOptions = React.useMemo(() => {
    if (customSizeOptions?.length) {
      return customSizeOptions;
    }

    return [5, 10];
  }, [customSizeOptions]);

  return (
    <div className="mt-8 flex items-center justify-between">
      {/* begin: page size */}
      {withSizeOptions && (
        <div className="flex items-center gap-4">
          <Select
            onValueChange={(value) => handleSizeChange(value)}
            value={size.toString()}
          >
            <SelectTrigger className="h-8 w-fit gap-1 rounded-md border-none bg-neutral-100 px-2">
              <SelectValue placeholder={size} />
            </SelectTrigger>
            <SelectContent className=" min-w-fit">
              {sizeOptions.map((item) => (
                <SelectItem
                  key={item}
                  value={String(item)}
                >
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className=" text-nowrap text-xs text-gray-700">
            Total {totalDataTitle}: {totalCount} rows
          </p>
        </div>
      )}
      {/* end: page size */}

      {/* begin: pagination */}
      <Pagination className={withSizeOptions ? ' justify-end' : ''}>
        <PaginationContent className="flex flex-wrap">
          <PaginationItem>
            <Button
              size="icon-sm"
              variant="ghost"
              onClick={handlePrev}
              disabled={currentPage <= 1}
            >
              <LuChevronLeft
                size={16}
                className={cn({ 'rotate-180': isAr })}
              />
            </Button>
          </PaginationItem>
          {paginationRange.map((pageNumber, i) => {
            if (pageNumber === DOTS) {
              return (
                <PaginationItem key={i}>
                  <PaginationEllipsis />
                </PaginationItem>
              );
            }

            return (
              <PaginationItem key={i}>
                <Button
                  size="icon-sm"
                  variant={
                    Number(pageNumber) === currentPage ? 'destructive' : 'ghost'
                  }
                  onClick={() => handlePageChange(Number(pageNumber))}
                >
                  {pageNumber}
                </Button>
              </PaginationItem>
            );
          })}
          <PaginationItem>
            <Button
              size="icon-sm"
              variant="ghost"
              onClick={handleNext}
              disabled={currentPage === TOTAL_PAGE}
            >
              <LuChevronRight
                size={16}
                className={cn({ 'rotate-180': isAr })}
              />
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      {/* end: pagination */}
    </div>
  );
}
