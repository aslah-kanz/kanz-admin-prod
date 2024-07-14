'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { TBalance, TWalletHystory } from '@/types/wallet.type';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'iconsax-react';
import Link from 'next/link';
import React from 'react';
import { DateRange } from 'react-day-picker';

export default function IncomeAndWalletPage() {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(),
  });

  // const { data: balance } = useGetWalletBallance();
  // const { data: walletHystory } = useGetWalletHistory({
  //   search: debounceSearch,
  //   page: currentPage,
  // });

  const FAKE_BALANCE: TBalance = {
    balance: 94884,
    currency: 'IDR',
  };

  const FAKE_HISTORY: TWalletHystory[] = [
    {
      id: 1,
      date: '2024-03-17',
      orderNumber: '#INV884545',
      details: 'lorem ipsum',
      amount: 1000,
    },
    {
      id: 2,
      date: '2024-03-18',
      orderNumber: '#INV884548',
      details: 'lorem ipsum',
      amount: 2000,
    },
  ];

  return (
    <div className=" flex h-full w-full flex-col rounded-lg border">
      <div className=" border-b p-5">
        <p className=" text-lg font-medium text-neutral-800">
          Total Income/Wallet
        </p>
      </div>
      <div className=" h-full w-full p-5">
        <div className=" w-full rounded-lg border">
          <div className=" border-b p-5">
            <p className=" text-lg font-medium text-neutral-800">Earnings</p>
          </div>
          <div className=" p-5">
            <p className=" text-sm text-neutral-500">
              Last 30 day earnings calculated. Apart from arranging the order of
              topics.
            </p>
            <div className="mt-6 flex items-center justify-between">
              <div className="flex flex-col rounded-md border border-dashed px-6 py-4">
                <h1 className=" text-3xl font-semibold text-neutral-800">
                  {`${FAKE_BALANCE.currency}${FAKE_BALANCE.balance}`}
                </h1>
                <p className=" text-sm text-neutral-500">Net Incomce</p>
              </div>
              <Button asChild>
                <Link href="/withdraw">Withdraw Income</Link>
              </Button>
            </div>
          </div>
        </div>
        <div className=" mt-6 w-full rounded-lg border">
          <div className=" flex justify-between border-b p-5">
            <p className=" text-lg font-medium text-neutral-800">History</p>

            <div className="flex">
              {/* <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant="ghost"
                    className={cn(
                      ' justify-start text-left text-xs text-neutral-800 hover:bg-transparent hover:text-neutral-800',
                      !date && 'text-muted-foreground',
                    )}
                  >
                    $0 - $100.00
                    <Tag2 className="ml-2 h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-fit p-5"
                  align="end"
                >
                  <Slider
                    defaultValue={[25, 500]}
                    max={1000}
                    // step={1}
                    min={0}
                  />
                  <div className=" mt-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <p className=" text-xs text-neutral-500">From</p>
                        <div className="relative">
                          <p className=" absolute left-3 top-1/2 -translate-y-1/2 text-sm text-neutral-500">
                            $
                          </p>
                          <Input
                            className=" w-20 pl-5"
                            defaultValue={0}
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <p className=" text-xs text-neutral-500">To</p>
                        <div className="relative">
                          <p className=" absolute left-3 top-1/2 -translate-y-1/2 text-sm text-neutral-500">
                            $
                          </p>
                          <Input
                            className=" w-20 pl-5"
                            defaultValue={0}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className=" mt-4 flex justify-center">
                    <button className=" text-sm text-neutral-500">
                      Clear all
                    </button>
                  </div>
                </PopoverContent>
              </Popover> */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant="ghost"
                    className={cn(
                      ' justify-start text-left text-xs text-neutral-800 hover:bg-transparent hover:text-neutral-800',
                      !date && 'text-muted-foreground',
                    )}
                  >
                    {date?.from ? (
                      date.to ? (
                        <>
                          {format(date.from, 'LLL dd, y')} -{' '}
                          {format(date.to, 'LLL dd, y')}
                        </>
                      ) : (
                        format(date.from, 'LLL dd, y')
                      )
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-2 h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto p-0"
                  align="end"
                >
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setDate}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className=" mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {FAKE_HISTORY.map((items) => {
                  return (
                    <TableRow key={Math.random()}>
                      <TableCell>
                        {format(new Date(items.date), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell>{items.orderNumber}</TableCell>
                      <TableCell>{items.details}</TableCell>
                      <TableCell>
                        <p className=" text-green-600">{`${FAKE_BALANCE.currency}${items.amount}`}</p>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
        {/* begin: empty state */}
        {/* <EmptyState description="We couldn't find any bank account, please add new bank account." /> */}
        {/* end: empty state */}
      </div>
    </div>
  );
}
