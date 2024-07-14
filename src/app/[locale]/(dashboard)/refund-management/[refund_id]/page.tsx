'use client';

import {
  useGetRefundById,
  useRejectRefund,
  useApproveRefund,
} from '@/api/refund.api';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Warning2 } from 'iconsax-react';
import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { TDefaultParams } from '@/types/common.type';
import RefundDetailLoading from '@/components/refund-management/refund-detail-loading';
import { getLang } from '@/utils/locale.util';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import {
  createFullName,
  getBadgeVariant,
  transformStatus,
} from '@/utils/common.util';
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useForm, SubmitHandler } from 'react-hook-form';
import * as yup from 'yup';
import { LuLoader2 } from 'react-icons/lu';
import { yupResolver } from '@hookform/resolvers/yup';
import { useQueryClient } from 'react-query';
import { HTTP_STATUS } from '@/constants/common.constant';

type TOrderDetailPageParams = {
  params: TDefaultParams & {
    refund_id: string;
  };
};

const schema = yup.object().shape({
  adminComment: yup.string().min(1).required('required').label('comment'),
});

type TSchema = yup.InferType<typeof schema>;

export default function RefundDetailPage({ params }: TOrderDetailPageParams) {
  const { data, isLoading } = useGetRefundById(params.refund_id);

  const queryClient = useQueryClient();

  // reject
  const { mutate: mutateReject, isLoading: isLoadingReject } =
    useRejectRefund();
  const [isOpenReject, setIsOpenReject] = useState(false);
  const formReject = useForm<TSchema>({
    resolver: yupResolver(schema),
    defaultValues: {
      adminComment: '',
    },
  });

  const actualSubmitReject: SubmitHandler<TSchema> = useCallback(
    (values) => {
      mutateReject(
        { id: params.refund_id, payload: values },
        {
          onSuccess: (resp) => {
            if (resp.code === HTTP_STATUS.SUCCESS) {
              toast.success('Reject refund success');
              queryClient.invalidateQueries({ queryKey: ['refunds'] });
              setIsOpenReject(false);
            } else {
              toast.error('Reject refund failed', {
                description: resp.message,
              });
            }
          },
        },
      );
    },
    [mutateReject, params.refund_id, queryClient],
  );

  useEffect(() => {
    formReject.reset();
    formReject.clearErrors();
  }, [formReject, isOpenReject]);

  // approve
  const { mutate: mutateApprove, isLoading: isLoadingApprove } =
    useApproveRefund();
  const [isOpenApprove, setIsOpenApprove] = useState(false);
  const formApprove = useForm<TSchema>({
    resolver: yupResolver(schema),
    defaultValues: {
      adminComment: '',
    },
  });

  const actualSubmitApprove: SubmitHandler<TSchema> = useCallback(
    (values) => {
      mutateApprove(
        { id: params.refund_id, payload: values },
        {
          onSuccess: (resp) => {
            if (resp.code === HTTP_STATUS.SUCCESS) {
              toast.success('Approve refund success');
              queryClient.invalidateQueries({ queryKey: ['refunds'] });
              setIsOpenApprove(false);
            } else {
              toast.error('Approve refund failed', {
                description: resp.message,
              });
            }
          },
        },
      );
    },
    [mutateApprove, params.refund_id, queryClient],
  );

  useEffect(() => {
    formApprove.reset();
    formApprove.clearErrors();
  }, [formApprove, isOpenApprove]);

  const [previewImage, setPreviewImage] = useState<string>('');
  const [openPreviewImage, setOpenPreviewImage] = useState<boolean>(false);

  if (isLoading) {
    return <RefundDetailLoading />;
  }

  return (
    <>
      <div className=" w-full p-6">
        <div className=" w-full rounded-lg border p-5">
          <div className=" mt-8 flex flex-col gap-6">
            <div className="grid grid-cols-12 gap-2">
              <div className=" col-span-12 sm:col-span-5">
                <p className=" text-sm font-medium text-neutral-500">
                  Refund ID
                </p>
              </div>
              <div className=" col-span-12 sm:col-span-7">
                <Input
                  readOnly
                  value={data?.number}
                  className=" border-none bg-neutral-100 focus-visible:ring-0 focus-visible:ring-transparent"
                />
              </div>
            </div>
            <div className="grid grid-cols-12 gap-2">
              <div className=" col-span-12 sm:col-span-5">
                <p className=" text-sm font-medium text-neutral-500">
                  Invoice Number
                </p>
              </div>
              <div className=" col-span-12 sm:col-span-7">
                <Input
                  readOnly
                  value={data?.purchaseQuote.invoiceNumber}
                  className=" border-none bg-neutral-100 focus-visible:ring-0 focus-visible:ring-transparent"
                />
              </div>
            </div>
            <div className="grid grid-cols-12 gap-2">
              <div className=" col-span-12 sm:col-span-5">
                <p className=" text-sm font-medium text-neutral-500">Store</p>
              </div>
              <div className=" col-span-12 sm:col-span-7">
                <Input
                  readOnly
                  value={data?.purchaseQuote.store.name}
                  className=" border-none bg-neutral-100 focus-visible:ring-0 focus-visible:ring-transparent"
                />
              </div>
            </div>
            <div className="grid grid-cols-12 gap-2">
              <div className=" col-span-12 sm:col-span-5">
                <p className=" text-sm font-medium text-neutral-500">
                  Customer Name
                </p>
              </div>
              <div className=" col-span-12 sm:col-span-7">
                <Input
                  readOnly
                  value={createFullName(
                    data?.principal.firstName || '-',
                    data?.principal.lastName || '-',
                  )}
                  className=" border-none bg-neutral-100 focus-visible:ring-0 focus-visible:ring-transparent"
                />
              </div>
            </div>
            <div className="grid grid-cols-12 gap-2">
              <div className=" col-span-12 sm:col-span-5">
                <p className=" text-sm font-medium text-neutral-500">
                  Customer Email
                </p>
              </div>
              <div className=" col-span-12 sm:col-span-7">
                <Input
                  readOnly
                  value={data?.principal.email}
                  className=" border-none bg-neutral-100 focus-visible:ring-0 focus-visible:ring-transparent"
                />
              </div>
            </div>
            <div className="grid grid-cols-12 gap-2">
              <div className=" col-span-12 sm:col-span-5">
                <p className=" text-sm font-medium text-neutral-500">
                  Refund Date
                </p>
              </div>
              <div className=" col-span-12 sm:col-span-7">
                <Input
                  readOnly
                  value={
                    data?.createdAt
                      ? format(data?.createdAt, 'dd MMM yyyy HH:mm')
                      : '-'
                  }
                  className=" border-none bg-neutral-100 focus-visible:ring-0 focus-visible:ring-transparent"
                />
              </div>
            </div>
            <div className="grid grid-cols-12 gap-2">
              <div className=" col-span-12 sm:col-span-5">
                <p className=" text-sm font-medium text-neutral-500">
                  Refund Attachment
                </p>
              </div>
              <div className=" col-span-12 flex grid-cols-3 gap-6 sm:col-span-7">
                {data?.images.map((image) => (
                  <div
                    key={image.id}
                    className=" relative w-full overflow-hidden rounded-lg hover:cursor-pointer"
                  >
                    {image.url && (
                      <Image
                        src={image.url}
                        alt=""
                        width={280}
                        height={280}
                        className=" rounded-lg border object-cover object-center"
                        onClick={() => {
                          setPreviewImage(image.url || '');
                          setOpenPreviewImage(true);
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-12 gap-2">
              <div className=" col-span-12 sm:col-span-5">
                <p className=" text-sm font-medium text-neutral-500">Reason</p>
              </div>
              <div className=" col-span-12 sm:col-span-7">
                <Textarea
                  className="border-none bg-neutral-100 focus-visible:ring-0 focus-visible:ring-transparent"
                  readOnly
                  value={data?.reason}
                />
              </div>
            </div>
            <div className="grid grid-cols-12 gap-2">
              <div className=" col-span-12 sm:col-span-5">
                <p className=" text-sm font-medium text-neutral-500">
                  Admin Comment
                </p>
              </div>
              <div className=" col-span-12 sm:col-span-7">
                <Textarea
                  className="border-none bg-neutral-100 focus-visible:ring-0 focus-visible:ring-transparent"
                  readOnly
                  value={data?.adminComment}
                />
              </div>
            </div>
            <div className="grid grid-cols-12 gap-2">
              <div className=" col-span-12 sm:col-span-5">
                <p className=" text-sm font-medium text-neutral-500">
                  Vendor Comment
                </p>
              </div>
              <div className=" col-span-12 sm:col-span-7">
                <Textarea
                  className="border-none bg-neutral-100 focus-visible:ring-0 focus-visible:ring-transparent"
                  readOnly
                  value={data?.vendorComment}
                />
              </div>
            </div>
            <div className="grid grid-cols-12 gap-2">
              <div className=" col-span-12 sm:col-span-5">
                <p className=" text-sm font-medium text-neutral-500">Status</p>
              </div>
              <div className=" col-span-12 sm:col-span-7">
                <Badge variant={getBadgeVariant(data?.status || '')}>
                  {transformStatus(data?.status || '')}
                </Badge>
              </div>
            </div>
          </div>

          <hr className="mt-10" />
          <div className=" w-full">
            <Table>
              <TableHeader>
                <TableRow className=" border-none font-medium uppercase">
                  <TableHead>Product</TableHead>
                  <TableHead>Sku</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead className=" text-right">Price</TableHead>
                  <TableHead className=" text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className=" border-none [&_td]:pb-0">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className=" relative aspect-square h-12">
                        {data?.product.image.url && (
                          <Image
                            src={data?.product.image.url}
                            alt=""
                            fill
                            className=" object-contain object-center"
                          />
                        )}
                      </div>
                      <div className="">
                        <p>
                          {data?.product.name
                            ? getLang(params, data?.product.name)
                            : '-'}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{data?.purchaseQuote?.vendorSku}</TableCell>
                  <TableCell>{data?.quantity}</TableCell>
                  <TableCell className=" text-right">
                    SAR {data?.price}
                  </TableCell>
                  <TableCell className=" text-right">
                    SAR {data?.subTotal}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {data?.status === 'pending' && (
            <div className=" mt-8 flex justify-end gap-4">
              {/* <Button
              variant="ghost"
              className=" text-primary"
            >
              Cancel
            </Button> */}
              <Button
                variant="outline"
                onClick={() => setIsOpenReject((prev) => !prev)}
              >
                Reject refund
              </Button>
              <Button onClick={() => setIsOpenApprove((prev) => !prev)}>
                Approve refund
              </Button>
            </div>
          )}
        </div>
      </div>

      <Dialog
        open={openPreviewImage}
        onOpenChange={(open) => setOpenPreviewImage(open)}
      >
        <DialogContent className=" min-h-[800px] min-w-[1200px]">
          <Image
            src={previewImage}
            fill
            alt="preview"
          />
        </DialogContent>
      </Dialog>

      {/* dialog reject refund */}
      <Dialog
        open={isOpenReject}
        onOpenChange={(open) => setIsOpenReject(open)}
      >
        <DialogContent className=" max-w-[414px]">
          <Form {...formReject}>
            <form
              onSubmit={formReject.handleSubmit(actualSubmitReject)}
              className=" w-full"
            >
              <div className="flex flex-col items-center justify-center gap-4">
                <div className=" rounded-full bg-red-200 p-2">
                  <Warning2
                    className=" text-red-500"
                    size={20}
                  />
                </div>

                <div className=" space-y-1 text-center">
                  <p className=" font-medium text-neutral-800">Reject refund</p>
                  <p className=" text-center text-sm text-neutral-500">
                    Are you sure you want to proceed with rejecting the refund
                    request? This action is irreversible
                  </p>
                </div>

                <div className=" mt-4 flex w-full flex-col gap-4">
                  <FormField
                    control={formReject.control}
                    name="adminComment"
                    render={({ field }) => (
                      <FormItem>
                        <Textarea
                          placeholder="Comment"
                          value={field.value}
                          onChange={field.onChange}
                          className=" w-full"
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className=" mt-4 flex w-full gap-4">
                  <DialogClose asChild>
                    <Button
                      variant="secondary"
                      className=" w-full"
                    >
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button
                    className=" w-full"
                    type="submit"
                    disabled={isLoadingReject}
                  >
                    {isLoadingReject && (
                      <LuLoader2
                        className=" animate-spin text-white"
                        size={16}
                      />
                    )}
                    Reject
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* dialog approve refund */}
      <Dialog
        open={isOpenApprove}
        onOpenChange={(open) => setIsOpenApprove(open)}
      >
        <DialogContent className=" max-w-[414px]">
          <Form {...formApprove}>
            <form
              onSubmit={formApprove.handleSubmit(actualSubmitApprove)}
              className=" w-full"
            >
              <div className="flex flex-col items-center justify-center gap-4">
                <div className=" rounded-full bg-red-200 p-2">
                  <Warning2
                    className=" text-red-500"
                    size={20}
                  />
                </div>

                <div className=" space-y-1 text-center">
                  <p className=" font-medium text-neutral-800">
                    Approve refund
                  </p>
                  <p className=" text-center text-sm text-neutral-500">
                    Are you sure you want to proceed with approving the refund
                    request? This action is irreversible
                  </p>
                </div>

                <div className=" mt-4 flex w-full flex-col gap-4">
                  <FormField
                    control={formApprove.control}
                    name="adminComment"
                    render={({ field }) => (
                      <FormItem>
                        <Textarea
                          placeholder="Comment"
                          value={field.value}
                          onChange={field.onChange}
                          className=" w-full"
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className=" mt-4 flex w-full gap-4">
                  <DialogClose asChild>
                    <Button
                      variant="secondary"
                      className=" w-full"
                    >
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button
                    className=" w-full"
                    type="submit"
                    disabled={isLoadingApprove}
                  >
                    {isLoadingApprove && (
                      <LuLoader2
                        className=" animate-spin text-white"
                        size={16}
                      />
                    )}
                    Approve
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
