'use client';

import { useGetOrders } from '@/api/order.api';
import BasePagination from '@/components/common/base-pagination';
import BaseSearch from '@/components/common/base-search';
import BaseSheetFilter from '@/components/common/base-sheet-filter';
import BaseTableSkeleton from '@/components/common/base-table-skeleton';
import EmptyState from '@/components/common/empty-state';
import DialogDelete from '@/components/dialog/dialog-delete';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import { useI18n } from '@/locales/client';
import { TDefaultPageParams } from '@/types/common.type';
import { getBadgeVariant, transformStatus } from '@/utils/common.util';
import { currency } from '@/utils/currency.util';
import { format } from 'date-fns';
import { CloudPlus, UserEdit } from 'iconsax-react';
import Link from 'next/link';
import { useState } from 'react';
import { FiX } from 'react-icons/fi';
import { toast } from 'sonner';

export default function OrderManagementPage({
  searchParams,
}: TDefaultPageParams) {
  const t = useI18n();
  const [showDeleteOrder, setShowDeleteOrder] = useState<boolean>(false);
  const [showAssign, setShowAssign] = useState<boolean>(false);

  // fetch
  const { data: orders, isLoading: loadingGetOrders } = useGetOrders({
    page: (Number(searchParams.page || 1) - 1).toString(),
    search: searchParams.search,
    size: searchParams.size,
    order: 'desc',
    sort: 'createdAt',
  });

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
                {t('common.download')}
              </Button>
              <div className=" h-8 w-px border-r"></div>
              <BaseSheetFilter
                listType={['date', 'status', 'total-amount']}
                listStatus={[
                  'open',
                  'inPayment',
                  'paid',
                  'failed',
                  'onPlaced',
                  'onProcess',
                  'onDelivery',
                  'canceled',
                  'completed',
                ]}
              />
              <div className=" h-8 w-px border-r"></div>
            </div>
            <BaseSearch className=" hidden lg:block" />
          </div>
          <BaseSearch className=" mt-2 block lg:hidden" />
          {/* end: filter, search and action */}

          {loadingGetOrders ? (
            <BaseTableSkeleton />
          ) : orders && orders.totalCount > 0 ? (
            <>
              <div className=" mt-4 overflow-hidden rounded-lg border">
                <Table className="whitespace-nowrap [&_tr:nth-child(even)]:bg-neutral-100">
                  <TableHeader>
                    <TableRow className=" bg-neutral-200 [&_th]:capitalize">
                      <TableHead>{t('common.orderId')}</TableHead>
                      <TableHead>{t('common.orderDate')}</TableHead>
                      <TableHead>{t('common.totalAmount')}</TableHead>
                      <TableHead>{t('common.status')}</TableHead>
                      <TableHead>{t('common.action')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders &&
                      orders.content.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell>{order.id}</TableCell>
                          <TableCell>
                            {order.createdAt
                              ? format(order.createdAt, 'dd MMM yyyy HH:mm:SS')
                              : ''}
                          </TableCell>
                          <TableCell>
                            SAR {currency(order.grandTotal)}
                          </TableCell>
                          <TableCell>
                            <Badge variant={getBadgeVariant(order.status)}>
                              {transformStatus(order.status)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost-primary"
                                asChild
                                size="sm"
                              >
                                <Link href={`/order-management/${order.id}`}>
                                  View Detail
                                </Link>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
              <BasePagination totalCount={orders.totalCount} />
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

      {/* begin: dialog delete product family */}
      <DialogDelete
        open={showDeleteOrder}
        onOpenChange={setShowDeleteOrder}
      />
      {/* end: dialog delete role */}
    </>
  );
}
