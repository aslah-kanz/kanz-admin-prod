'use client';

import { useGetPurchases } from '@/api/purchase.api';
import BaseFilterTable from '@/components/common/base-filter-table';
import BasePagination from '@/components/common/base-pagination';
import BaseSearch from '@/components/common/base-search';
import BaseSheetFilter from '@/components/common/base-sheet-filter';
import BaseTableSkeleton from '@/components/common/base-table-skeleton';
import EmptyState from '@/components/common/empty-state';
import DialogDelete from '@/components/dialog/dialog-delete';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
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
} from '@/components/ui/sheet';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  TDefaultPageParams,
  TDefaultSearchParams,
  TListColumnOptions,
} from '@/types/common.type';
import {
  // createFullName,
  getBadgeVariant,
  slugToOriginal,
} from '@/utils/common.util';
import { format } from 'date-fns';
import { CloudPlus, TaskSquare, UserEdit } from 'iconsax-react';
import Link from 'next/link';
import { useState } from 'react';
import { FiX } from 'react-icons/fi';
import { toast } from 'sonner';

type TOrderManagementPageParams = TDefaultPageParams & {
  searchParams: TDefaultSearchParams & {
    column: string[] | undefined;
  };
};

export default function OrderManagementPage({
  searchParams,
}: TOrderManagementPageParams) {
  const [showDeleteOrder, setShowDeleteOrder] = useState<boolean>(false);
  const [showAssign, setShowAssign] = useState<boolean>(false);
  const [showDataTables, setShowDataTables] = useState<boolean>(false);

  // fetch
  const { data: purchases, isLoading } = useGetPurchases({
    page: (Number(searchParams.page || 1) - 1).toString(),
    search: searchParams.search,
    size: searchParams.size,
    order: 'desc',
    sort: 'createdAt',
  });

  const { column } = searchParams;

  const columnOptions: TListColumnOptions[] = [
    {
      id: 1,
      slug: 'invoice',
      label: 'Invoice',
    },
    {
      id: 2,
      slug: 'orderDate',
      label: 'Order Date',
    },
    {
      id: 3,
      slug: 'vendor',
      label: 'Vendor',
    },
    {
      id: 4,
      slug: 'grandTotal',
      label: 'Grand Total',
    },
    {
      id: 5,
      slug: 'status',
      label: 'Status',
    },
    {
      id: 6,
      slug: 'action',
      label: 'Action',
    },
  ] as const;

  const selectedColumn = column
    ? columnOptions.filter((item) => column?.includes(item.slug))
    : columnOptions;

  return (
    <>
      <div className=" h-full w-full p-4 lg:p-6">
        <div className=" flex w-full flex-col rounded-lg border p-5">
          {/* begin: filter, search and action */}
          <div className="flex flex-col items-stretch justify-between gap-2 rounded-lg border bg-neutral-100 p-1.5 lg:flex-row lg:items-center">
            <div className="flex flex-wrap items-center">
              <Button
                className="text-xs"
                variant="transparent"
                onClick={() => {
                  toast.success('Data Downloaded', {
                    description: 'The data has been successfully downloaded',
                  });
                }}
              >
                <CloudPlus size={16} />
                Download PDF
              </Button>
              <div className=" h-8 w-px border-r"></div>

              <BaseSheetFilter
                listType={['date', 'status', 'total-amount']}
                listStatus={[
                  'Waiting to Assign',
                  'On Process',
                  'Shipped',
                  'Completed',
                  'Canceled',
                ]}
              />
              <div className=" h-8 w-px border-r"></div>
              <BaseFilterTable listColumn={columnOptions} />
            </div>
            <BaseSearch className=" hidden lg:block" />
          </div>
          <BaseSearch className=" mt-2 block lg:hidden" />
          {/* end: filter, search and action */}

          {/* begin: empty state */}
          {/* <EmptyState description="We couldn't find any data matching your search. Please double-check your keywords or try different search terms" /> */}
          {/* end: empty state */}

          {isLoading ? (
            <BaseTableSkeleton col={7} />
          ) : purchases && purchases.totalCount > 0 ? (
            <>
              <div className=" mt-4 overflow-hidden rounded-lg border">
                <Table className="whitespace-nowrap [&_tr:nth-child(even)]:bg-neutral-100">
                  <TableHeader>
                    <TableRow className=" bg-neutral-200 [&_th]:capitalize">
                      {selectedColumn.map((column) => (
                        <TableHead key={column.id}>{column.label}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {purchases &&
                      purchases.content.map((purchase) => (
                        <TableRow key={purchase.id}>
                          {selectedColumn.map((column) => {
                            if (column.slug === 'invoice') {
                              return <TableCell>{purchase.invoice}</TableCell>;
                            }
                            if (column.slug === 'orderDate') {
                              return (
                                <TableCell>
                                  {format(purchase.orderDate, 'PPP')}
                                </TableCell>
                              );
                            }
                            if (column.slug === 'grandTotal') {
                              return (
                                <TableCell>SAR {purchase.grandTotal}</TableCell>
                              );
                            }
                            if (column.slug === 'vendor') {
                              return (
                                <TableCell>{purchase.vendor}</TableCell>
                                // <TableCell>
                                //   {purchase.store.length === 0 ? (
                                //     <div className="flex items-center gap-4">
                                //       <p>Not Assigned</p>
                                //       <Button
                                //         variant="destructive"
                                //         size="sm"
                                //         onClick={() =>
                                //           setShowAssign((prev) => !prev)
                                //         }
                                //       >
                                //         <UserEdit size={16} />
                                //         Assign
                                //       </Button>
                                //     </div>
                                //   ) : (
                                //     purchase.store
                                //       .map((item) => item.name)
                                //       .join(', ')
                                //   )}
                                // </TableCell>
                              );
                            }
                            if (column.slug === 'status') {
                              return (
                                <TableCell>
                                  <Badge
                                    variant={getBadgeVariant(purchase.status)}
                                  >
                                    {slugToOriginal(purchase.status)}
                                  </Badge>
                                </TableCell>
                              );
                            }
                            if (column.slug === 'action') {
                              return (
                                <TableCell>
                                  <Button
                                    variant="ghost-primary"
                                    asChild
                                  >
                                    <Link
                                      href={`/purchase-management/${purchase.id}`}
                                    >
                                      View Detail
                                    </Link>
                                  </Button>
                                </TableCell>
                              );
                            }
                            return null;
                          })}
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
              <BasePagination totalCount={65} />
            </>
          ) : (
            <EmptyState />
          )}
        </div>
      </div>

      {/* begin: drawer assign */}
      <Sheet
        open={showAssign}
        onOpenChange={setShowAssign}
      >
        <SheetContent className=" flex flex-col gap-4 overflow-y-auto bg-white p-4 py-0">
          <SheetHeader className=" sticky top-0 gap-2 bg-white pt-4">
            <div className="flex items-center justify-between">
              <SheetTitle>
                <div className="flex items-center gap-2">
                  <UserEdit size={24} />
                  Assign
                </div>
              </SheetTitle>
              <SheetClose>
                <FiX />
              </SheetClose>
            </div>
            <hr />
          </SheetHeader>

          <div className=" flex flex-col gap-2">
            {/* begin: main form */}
            <div className=" flex flex-col gap-2">
              <Label className=" text-sm">Choose Vendor</Label>
              <Select>
                <SelectTrigger className="">
                  <SelectValue placeholder="Select Vendor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Vendor 1</SelectItem>
                  <SelectItem value="dark">Vendor XYZ</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* end: main form */}
          </div>
          <div className=" sticky bottom-0 flex flex-col space-y-2 bg-white py-4 pt-2">
            <Button
              onClick={() => {
                setShowAssign((prev) => !prev);
              }}
            >
              Assign to Vendor
            </Button>
          </div>
        </SheetContent>
      </Sheet>
      {/* end: drawer assign */}

      {/* begin: drawer data tables */}
      <Sheet
        open={showDataTables}
        onOpenChange={setShowDataTables}
      >
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
              <Checkbox />
              <Label className=" text-sm font-normal">Select All</Label>
            </div>
            <div className=" flex items-center gap-2">
              <Checkbox />
              <Label className=" text-sm font-normal">Number</Label>
            </div>
            <div className=" flex items-center gap-2">
              <Checkbox />
              <Label className=" text-sm font-normal">Order Date</Label>
            </div>
            <div className=" flex items-center gap-2">
              <Checkbox />
              <Label className=" text-sm font-normal">Customer</Label>
            </div>
            <div className=" flex items-center gap-2">
              <Checkbox />
              <Label className=" text-sm font-normal">Total Amount</Label>
            </div>
            <div className=" flex items-center gap-2">
              <Checkbox />
              <Label className=" text-sm font-normal">Status</Label>
            </div>
            <div className=" flex items-center gap-2">
              <Checkbox />
              <Label className=" text-sm font-normal">Vendor</Label>
            </div>
            <div className=" flex items-center gap-2">
              <Checkbox />
              <Label className=" text-sm font-normal">Total Products</Label>
            </div>
            <div className=" flex items-center gap-2">
              <Checkbox />
              <Label className=" text-sm font-normal">Shipment</Label>
            </div>
            <div className=" flex items-center gap-2">
              <Checkbox />
              <Label className=" text-sm font-normal">Voucher Code</Label>
            </div>
            {/* end: main form */}
          </div>
          <div className=" sticky bottom-0 flex flex-col space-y-2 bg-white py-4 pt-2">
            <Button
              onClick={() => {
                setShowDataTables((prev) => !prev);
              }}
            >
              Apply Data Table
            </Button>
            <Button
              onClick={() => {
                setShowDataTables((prev) => !prev);
              }}
              variant="ghost-primary"
            >
              Reset
            </Button>
          </div>
        </SheetContent>
      </Sheet>
      {/* end: drawer data tables */}

      {/* begin: dialog delete product family */}
      <DialogDelete
        open={showDeleteOrder}
        onOpenChange={setShowDeleteOrder}
      />
      {/* end: dialog delete role */}
    </>
  );
}
