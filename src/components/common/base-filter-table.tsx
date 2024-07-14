'use client';

import { useI18n } from '@/locales/client';
import useBaseFilterTable from '@/store/base-filter-table.store';
import { TListColumnOptions } from '@/types/common.type';
import { TaskSquare } from 'iconsax-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import { FiX } from 'react-icons/fi';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet';

type TBaseFilterTableProps = {
  listColumn: Array<TListColumnOptions>;
};

export default function BaseFilterTable({ listColumn }: TBaseFilterTableProps) {
  const t = useI18n();
  const { isOpen, toggle } = useBaseFilterTable();
  const searchParams = useSearchParams();
  const qs = useMemo(() => new URLSearchParams(searchParams), [searchParams]);
  const router = useRouter();
  const pathname = usePathname();

  const [selectedColumn, setSelectedColumn] = useState<
    Array<TListColumnOptions>
  >([]);

  // handle apply
  const handleApply = useCallback(() => {
    qs.delete('column');
    selectedColumn.map((column) => qs.append('column', column.slug));
    toggle();
    router.push(`${pathname}?${qs}`);
  }, [router, pathname, qs, toggle, selectedColumn]);

  // handle reset
  const handleReset = useCallback(() => {
    router.push(pathname);
    toggle();
  }, [router, pathname, toggle]);

  return (
    <Sheet
      open={isOpen}
      onOpenChange={toggle}
    >
      <SheetTrigger asChild>
        <Button
          className="text-xs"
          variant="transparent"
        >
          <TaskSquare size={16} />
          {t('common.dataTables')}
        </Button>
      </SheetTrigger>
      <SheetContent className=" flex flex-col gap-4 overflow-y-auto bg-white p-4 py-0">
        <SheetHeader className=" sticky top-0 gap-2 bg-white pt-4">
          <div className="flex items-center justify-between">
            <SheetTitle>
              <div className="flex items-center gap-2">
                <TaskSquare size={24} />
                Data Tables
              </div>
            </SheetTitle>
            <SheetClose>
              <FiX />
            </SheetClose>
          </div>
          <hr />
        </SheetHeader>

        <div className=" flex flex-col gap-4">
          {/* begin: main form */}
          <div className=" flex items-center gap-2">
            <Checkbox
              checked={listColumn.every((column) =>
                selectedColumn.map((item) => item.id).includes(column.id),
              )}
              onCheckedChange={(checked) => {
                if (checked) {
                  setSelectedColumn(listColumn);
                } else {
                  setSelectedColumn([]);
                }
              }}
            />
            <Label className=" text-sm font-normal">Select All</Label>
          </div>
          {listColumn.map((column) => (
            <div
              key={column.id}
              className=" flex items-center gap-2"
            >
              <Checkbox
                checked={selectedColumn
                  .map((item) => item.id)
                  .includes(column.id)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedColumn([...selectedColumn, column]);
                  } else {
                    setSelectedColumn(
                      selectedColumn.filter((item) => item.id !== column.id),
                    );
                  }
                }}
              />
              <Label className=" text-sm font-normal">{column.label}</Label>
            </div>
          ))}
          {/* end: main form */}
        </div>
        <div className=" sticky bottom-0 flex flex-col space-y-2 bg-white py-4 pt-2">
          <Button onClick={handleApply}>Apply Data Table</Button>
          <Button
            onClick={handleReset}
            variant="ghost-primary"
          >
            Reset
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
