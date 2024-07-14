'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { useI18n } from '@/locales/client';
import useBaseSheetFilterStore from '@/store/base-sheet-filter.store';
import {
  originalToSlug,
  slugToOriginal,
  transformStatus,
} from '@/utils/common.util';
import { format, isSameDay } from 'date-fns';
import { Calendar as CalendarIcon, Filter } from 'iconsax-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import { FaChevronDown } from 'react-icons/fa6';
import { FiX } from 'react-icons/fi';

type TFilterByType = 'date' | 'status' | 'total-amount';

type TBaseSheetFilterProps = {
  listType: Array<TFilterByType>;
  listStatus?: Array<string>;
};

export default function BaseSheetFilter({
  listType,
  listStatus,
}: TBaseSheetFilterProps) {
  // hooks
  const t = useI18n();
  const searchParams = useSearchParams();
  const qs = useMemo(() => new URLSearchParams(searchParams), [searchParams]);
  const router = useRouter();
  const pathname = usePathname();

  // search params
  const start_date = searchParams.get('start_date');
  const end_date = searchParams.get('end_date');
  const min_price = searchParams.get('min_price');
  const max_price = searchParams.get('max_price');
  const status = searchParams.getAll('status');

  // state
  const [filterBy, setFilterBy] = useState<TFilterByType>('date');
  const [startDate, setStartDate] = useState<Date | undefined>(
    start_date ? new Date(start_date) : undefined,
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    end_date ? new Date(end_date) : undefined,
  );
  const [minPrice, setMinPrice] = useState<number>(min_price ? +min_price : 0);
  const [maxPrice, setMaxPrice] = useState<number>(max_price ? +max_price : 0);
  const [selectedStatus, setSelectedStatus] = useState<Array<string>>(status);

  // store
  const { isOpen, toggle } = useBaseSheetFilterStore();

  // handle apply
  const handleApplyFilter = useCallback(() => {
    if (filterBy === 'date') {
      if (startDate && endDate) {
        qs.set('start_date', format(startDate, 'yyyy-MM-dd'));
        qs.set('end_date', format(endDate, 'yyyy-MM-dd'));
      }
    } else if (filterBy === 'status') {
      qs.delete('status');
      selectedStatus.map((status) => qs.append('status', status));
    } else if (filterBy === 'total-amount') {
      qs.set('min_price', minPrice.toString());
      qs.set('max_price', maxPrice.toString());
    }
    toggle();
    router.push(`${pathname}?${qs}`);
  }, [
    qs,
    pathname,
    startDate,
    endDate,
    filterBy,
    selectedStatus,
    router,
    toggle,
    minPrice,
    maxPrice,
  ]);

  // handle reset
  const handleResetFilter = useCallback(() => {
    router.push(pathname);
    toggle();
    setSelectedStatus([]);
  }, [router, toggle, pathname]);

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
          <Filter size={16} />
          {t('common.filter')}
        </Button>
      </SheetTrigger>
      <SheetContent className=" flex flex-col gap-4 overflow-y-auto bg-white p-4 py-0">
        <SheetHeader className=" sticky top-0 gap-2 bg-white pt-4">
          <div className="flex items-center justify-between">
            <SheetTitle>
              <div className="flex items-center gap-2">
                <Filter size={24} />
                {t('common.filter')}
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
          <div className=" flex flex-col gap-2">
            <Label className=" text-sm">Select All</Label>
            <Select
              value={filterBy}
              onValueChange={(value) => setFilterBy(value as TFilterByType)}
            >
              <SelectTrigger className="">
                <SelectValue placeholder="Select Vendor" />
              </SelectTrigger>
              <SelectContent>
                {listType.map((type) => (
                  <SelectItem
                    key={type}
                    value={type}
                  >
                    Filter by {slugToOriginal(type)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Label className=" text-sm">Filter Options</Label>
          {filterBy === 'date' && (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        ' justify-between',
                        startDate && 'text-muted-foreground',
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4" />
                        {startDate ? (
                          format(startDate, 'd LLL yyyy')
                        ) : (
                          <span>Start Date</span>
                        )}
                      </div>
                      <FaChevronDown size={10} />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0"
                    align="end"
                  >
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        ' justify-between',
                        endDate && 'text-muted-foreground',
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4" />
                        {endDate ? (
                          format(endDate, 'd LLL yyyy')
                        ) : (
                          <span>End Date</span>
                        )}
                      </div>
                      <FaChevronDown size={10} />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0"
                    align="end"
                  >
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className=" flex items-center gap-2">
                <Checkbox
                  checked={
                    isSameDay(
                      startDate ?? '',
                      new Date(new Date().setHours(0, 0, 0, 0)),
                    ) &&
                    isSameDay(
                      endDate ?? '',
                      new Date(new Date().setHours(0, 0, 0, 0)),
                    )
                  }
                  id="today"
                  onCheckedChange={(checeked) => {
                    if (checeked) {
                      setEndDate(new Date(new Date().setHours(0, 0, 0, 0)));
                      setStartDate(new Date(new Date().setHours(0, 0, 0, 0)));
                    } else {
                      setStartDate(undefined);
                      setEndDate(undefined);
                    }
                  }}
                />
                <Label
                  className=" text-sm font-normal"
                  htmlFor="today"
                >
                  Today
                </Label>
              </div>
              <div className=" flex items-center gap-2">
                <Checkbox
                  id="yesterday"
                  checked={
                    isSameDay(
                      startDate ?? '',
                      new Date(
                        new Date(new Date().setHours(0, 0, 0, 0)).getTime() -
                          1 * 24 * 60 * 60 * 1000,
                      ),
                    ) &&
                    isSameDay(
                      endDate ?? '',
                      new Date(new Date().setHours(0, 0, 0, 0)),
                    )
                  }
                  onCheckedChange={(checeked) => {
                    if (checeked) {
                      setEndDate(new Date(new Date().setHours(0, 0, 0, 0)));
                      setStartDate(
                        new Date(
                          new Date(new Date().setHours(0, 0, 0, 0)).getTime() -
                            1 * 24 * 60 * 60 * 1000,
                        ),
                      );
                    } else {
                      setStartDate(undefined);
                      setEndDate(undefined);
                    }
                  }}
                />
                <Label
                  className=" text-sm font-normal"
                  htmlFor="yesterday"
                >
                  Yesterday
                </Label>
              </div>
              <div className=" flex items-center gap-2">
                <Checkbox
                  checked={
                    isSameDay(
                      startDate ?? '',
                      new Date(
                        new Date(new Date().setHours(0, 0, 0, 0)).getTime() -
                          7 * 24 * 60 * 60 * 1000,
                      ),
                    ) &&
                    isSameDay(
                      endDate ?? '',
                      new Date(new Date().setHours(0, 0, 0, 0)),
                    )
                  }
                  id="last-7-days"
                  onCheckedChange={(checeked) => {
                    if (checeked) {
                      setEndDate(new Date(new Date().setHours(0, 0, 0, 0)));
                      setStartDate(
                        new Date(
                          new Date(new Date().setHours(0, 0, 0, 0)).getTime() -
                            7 * 24 * 60 * 60 * 1000,
                        ),
                      );
                    } else {
                      setStartDate(undefined);
                      setEndDate(undefined);
                    }
                  }}
                />
                <Label
                  className=" text-sm font-normal"
                  htmlFor="last-7-days"
                >
                  Last 7 days
                </Label>
              </div>
              <div className=" flex items-center gap-2">
                <Checkbox
                  checked={
                    isSameDay(
                      startDate ?? '',
                      new Date(
                        new Date(new Date().setHours(0, 0, 0, 0)).getTime() -
                          30 * 24 * 60 * 60 * 1000,
                      ),
                    ) &&
                    isSameDay(
                      endDate ?? '',
                      new Date(new Date().setHours(0, 0, 0, 0)),
                    )
                  }
                  id="last-30-days"
                  onCheckedChange={(checeked) => {
                    if (checeked) {
                      setEndDate(new Date(new Date().setHours(0, 0, 0, 0)));
                      setStartDate(
                        new Date(
                          new Date(new Date().setHours(0, 0, 0, 0)).getTime() -
                            30 * 24 * 60 * 60 * 1000,
                        ),
                      );
                    } else {
                      setStartDate(undefined);
                      setEndDate(undefined);
                    }
                  }}
                />
                <Label
                  className=" text-sm font-normal"
                  htmlFor="last-30-days"
                >
                  Last 30 days
                </Label>
              </div>
            </div>
          )}

          {filterBy === 'status' && (
            <div className="flex flex-col gap-4">
              <div className=" flex items-center gap-2">
                <Checkbox
                  checked={listStatus?.every((status) =>
                    selectedStatus?.includes(status),
                  )}
                  id="all"
                  onCheckedChange={(checked) => {
                    if (checked) {
                      if (listStatus) {
                        setSelectedStatus(listStatus.map((status) => status));
                      }
                    } else {
                      setSelectedStatus([]);
                    }
                  }}
                />
                <Label
                  className=" text-sm font-normal"
                  htmlFor="all"
                >
                  All
                </Label>
              </div>
              {listStatus &&
                listStatus.map((item) => (
                  <div
                    key={originalToSlug(item)}
                    className=" flex items-center gap-2"
                  >
                    <Checkbox
                      checked={selectedStatus.includes(item)}
                      id={item}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedStatus((prev) => [
                            ...prev,
                            originalToSlug(item),
                          ]);
                        } else {
                          setSelectedStatus(
                            selectedStatus.filter((status) => status !== item),
                          );
                        }
                      }}
                    />
                    <Label
                      className=" text-sm font-normal"
                      htmlFor={item}
                    >
                      {transformStatus(item)}
                    </Label>
                  </div>
                ))}
            </div>
          )}

          {filterBy === 'total-amount' && (
            <div className="flex flex-col gap-2">
              <Slider
                defaultValue={[minPrice, maxPrice]}
                max={1000}
                // step={1}
                min={0}
                onValueChange={(values) => {
                  setMinPrice(values[0]);
                  setMaxPrice(values[1]);
                }}
              />
              <div className="flex items-center justify-between">
                <p className=" text-xs font-medium text-neutral-800">
                  ${minPrice}
                </p>
                <p className=" text-xs font-medium text-neutral-800">
                  ${maxPrice}
                </p>
              </div>
            </div>
          )}
          {/* end: main form */}
        </div>
        <div className=" sticky bottom-0 flex flex-col space-y-2 bg-white py-4 pt-2">
          <Button onClick={handleApplyFilter}>Apply Filter</Button>
          <Button
            onClick={handleResetFilter}
            variant="ghost-primary"
          >
            Reset Filter
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
