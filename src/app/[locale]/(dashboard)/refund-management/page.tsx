'use client';

import { useGetRefunds } from '@/api/refund.api';
import BasePagination from '@/components/common/base-pagination';
import BaseSearch from '@/components/common/base-search';
import BaseSheetFilter from '@/components/common/base-sheet-filter';
import BaseTableSkeleton from '@/components/common/base-table-skeleton';
import EmptyState from '@/components/common/empty-state';
import DialogApprove from '@/components/dialog/dialog-approve';
import DialogFollowUp from '@/components/dialog/dialog-follow-up';
import DialogReject from '@/components/dialog/dialog-reject';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TDefaultSearchParams, TDefaultPageParams } from '@/types/common.type';
import {
  createFullName,
  getBadgeVariant,
  slugToOriginal,
} from '@/utils/common.util';
import { getLang } from '@/utils/locale.util';
import { format } from 'date-fns';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

type TRefundManagementPageParams = TDefaultPageParams & {
  searchParams: TDefaultSearchParams & {
    column: string[] | undefined;
    start_date: string;
    end_date: string;
    status: string;
  };
};

export default function RefundManagementPage({
  searchParams,
}: TRefundManagementPageParams) {
  const params = useParams();
  const router = useRouter();
  const [showApprove, setShowApprove] = useState<boolean>(false);
  const [showReject, setShowReject] = useState<boolean>(false);
  const [showFollowUp, setShowFollowUp] = useState<boolean>(false);

  // fetch
  const { data: refunds, isLoading: loadingGetRefunds } = useGetRefunds({
    search: searchParams.search,
    page: (Number(searchParams.page || 1) - 1).toString(),
    size: searchParams.size,
    order: 'desc',
    sort: 'createdAt',
    startCreatedAt: searchParams.start_date,
    endCreatedAt: searchParams.end_date,
    status: searchParams.status,
  });

  return (
    <>
      <div className=" h-full w-full p-4 lg:p-6">
        <div className=" flex w-full flex-col rounded-lg border p-5">
          {/* begin: filter, search and action */}
          <div className="flex items-center justify-between rounded-lg border bg-neutral-100 p-1.5">
            <div className="flex items-center">
              <BaseSheetFilter
                listType={['date', 'status']}
                listStatus={[
                  'pending',
                  'reviewed',
                  'approved',
                  'rejected',
                  'completed',
                  'canceled',
                ]}
              />
              {/* <Button
                className=" text-xs"
                variant="transparent"
                onClick={() => setShowDataTables((prev) => !prev)}
              >
                <TaskSquare size={16} />
                Data Tables
              </Button> */}
            </div>
            <BaseSearch className=" hidden lg:block" />
          </div>
          <BaseSearch className=" mt-2 block lg:hidden" />
          {/* end: filter, search and action */}

          {loadingGetRefunds ? (
            <BaseTableSkeleton />
          ) : refunds && refunds.totalCount > 0 ? (
            <>
              <div className=" mt-4 overflow-hidden rounded-lg border">
                <Table className="whitespace-nowrap ">
                  <TableHeader>
                    <TableRow className=" bg-neutral-200 [&_th]:capitalize">
                      <TableHead>Refund ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>CO Number</TableHead>
                      <TableHead>PO Number</TableHead>
                      <TableHead>Store</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Mpn</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className=" [&_tr:nth-child(even)]:bg-neutral-100">
                    {refunds &&
                      refunds.content.map((refund) => (
                        <TableRow key={refund.id}>
                          <TableCell>{refund.number}</TableCell>
                          <TableCell>
                            {format(refund.createdAt, 'dd MMM yyyy HH:mm')}
                          </TableCell>
                          <TableCell>
                            {refund.purchaseQuote.customerOrderInvoiceNumber}
                          </TableCell>
                          <TableCell>
                            {refund.purchaseQuote.invoiceNumber}
                          </TableCell>
                          <TableCell>
                            {refund.purchaseQuote.store.name}
                          </TableCell>
                          <TableCell>
                            {createFullName(
                              refund.principal.firstName,
                              refund.principal.lastName,
                            )}
                          </TableCell>
                          <TableCell>{refund.product.mpn}</TableCell>
                          <TableCell>
                            {getLang(params, refund.product.name)}
                          </TableCell>
                          <TableCell>
                            <Badge variant={getBadgeVariant(refund.status)}>
                              {slugToOriginal(refund.status)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost-primary"
                              onClick={() => {
                                router.push(`/refund-management/${refund.id}`);
                              }}
                            >
                              View Detail
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
              <BasePagination totalCount={refunds?.totalCount ?? 0} />
            </>
          ) : (
            <EmptyState />
          )}
        </div>
      </div>

      <DialogReject
        open={showReject}
        setOpen={setShowReject}
        onReject={(_payload) => {
          setShowReject((prev) => !prev);
          toast.success('Success to reject');
        }}
      />

      <DialogFollowUp
        open={showFollowUp}
        setOpen={setShowFollowUp}
        onFollowUp={(_payload) => {
          setShowFollowUp((prev) => !prev);
          toast.success('Success to follow up');
        }}
      />
      <DialogApprove
        open={showApprove}
        setOpen={setShowApprove}
        onApprove={(_payload) => {
          setShowApprove((prev) => !prev);
          toast.success('Success to approve');
        }}
      />
    </>
  );
}
