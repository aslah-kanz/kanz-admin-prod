'use client';

import {
  useCancelOrder,
  useCompleteOrder,
  useDeleteOrder,
  useGetOrderById,
} from '@/api/order.api';
import DialogDelete from '@/components/dialog/dialog-delete';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { HTTP_STATUS } from '@/constants/common.constant';
import useLangClient from '@/hooks/use-lang-client';
import { cn } from '@/lib/utils';
import { useI18n } from '@/locales/client';
import { TDefaultParams } from '@/types/common.type';
import {
  createFullName,
  getBadgeVariant,
  slugToOriginal,
} from '@/utils/common.util';
import { currency } from '@/utils/currency.util';
import { getLang } from '@/utils/locale.util';
import { format } from 'date-fns';
import { DocumentDownload } from 'iconsax-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { FaChevronRight } from 'react-icons/fa6';
import { LuLoader2 } from 'react-icons/lu';
import { useQueryClient } from 'react-query';
import { toast } from 'sonner';

type TOrderDetailPageParams = {
  params: TDefaultParams & {
    id: number;
  };
};

export default function OrderDetailPage({ params }: TOrderDetailPageParams) {
  const t = useI18n();
  const { isAr } = useLangClient();
  const queryClient = useQueryClient();
  const router = useRouter();

  const [showDelete, setShowDelete] = useState<boolean>(false);

  const { data: order, isLoading: _loading } = useGetOrderById(params.id);

  const { mutate: cancelOrder, isLoading: loadingCancelOrder } = useCancelOrder(
    {
      onSuccess: (resp) => {
        if (resp.code === HTTP_STATUS.SUCCESS) {
          toast.success('Canceled order success');
          queryClient.invalidateQueries({ queryKey: ['orders'] });
          router.push('/order-management');
        } else {
          toast.error('Canceled order failed', { description: resp.message });
        }
      },
    },
  );
  const { mutate: completeOrder, isLoading: loadingCompleteOrder } =
    useCompleteOrder({
      onSuccess: (resp) => {
        if (resp.code === HTTP_STATUS.SUCCESS) {
          toast.success('Completed order success');
          queryClient.invalidateQueries({ queryKey: ['orders'] });
          router.push('/order-management');
        } else {
          toast.error('Completed order failed', { description: resp.message });
        }
      },
    });
  const { mutate: deleteOrder, isLoading: loadingDeleteOrder } = useDeleteOrder(
    {
      onSuccess: (resp) => {
        if (resp.code === HTTP_STATUS.SUCCESS) {
          toast.success('Deleted order success');
          queryClient.invalidateQueries({ queryKey: ['orders'] });
          router.push('/order-management');
        } else {
          toast.error('Deleted order failed', { description: resp.message });
        }
      },
    },
  );

  const handleCancel = useCallback(() => {
    if (order) {
      cancelOrder(order.id);
    }
  }, [order, cancelOrder]);

  const handleComplete = useCallback(() => {
    if (order) {
      completeOrder(order.id);
    }
  }, [order, completeOrder]);

  const handleDelete = useCallback(() => {
    if (order) {
      deleteOrder(order.id);
    }
  }, [order, deleteOrder]);

  return (
    order && (
      <>
        <div className=" w-full p-6">
          {/* begin: card */}
          <div className=" w-full rounded-lg border p-5">
            {/* begin: breadcrumb */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[13px] text-neutral-500">
                <p>{t('common.listOrder')}</p>
                <FaChevronRight
                  size={12}
                  className={cn({ 'rotate-180': isAr })}
                />
                <p className=" text-primary">{t('common.orderDetail')}</p>
              </div>
              <Button
                size="sm"
                onClick={() => {
                  toast.success('Data Downloaded', {
                    description: 'The data has been successfully downloaded',
                  });
                }}
              >
                <DocumentDownload size={16} />
                {t('common.downloadPdf')}
              </Button>
            </div>
            {/* end: breadcrumb */}

            <div className="mt-6 grid grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <Label>{t('common.orderId')}</Label>
                <p className=" font-medium text-neutral-500">{order.id}</p>
              </div>
              <div className="flex flex-col gap-2">
                <Label>{t('common.date')}</Label>
                <p className=" font-medium text-neutral-500">
                  {format(order.createdAt, 'dd MMM yyyy HH:mm:SS')}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <Label>{t('common.customer')}</Label>
                <p className=" font-medium text-neutral-500">
                  {createFullName(
                    order.principal.firstName,
                    order.principal.lastName,
                  )}
                </p>
              </div>
              {/* <div className="flex flex-col gap-2">
                <Label>{t('common.vendor')}</Label>
                <p className=" font-medium text-neutral-500">Vodjo</p>
              </div> */}
              <div className="col-span-2 flex flex-col gap-2">
                <Label>{t('common.address')}</Label>
                <p className=" font-medium text-neutral-500">
                  {order.address.address}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <Label>{t('common.status')}</Label>
                <Badge
                  variant={getBadgeVariant(order.status)}
                  size="lg"
                >
                  {slugToOriginal(order.status)}
                </Badge>
              </div>
              <div className="flex flex-col gap-2">
                <Label>{t('common.totalAmount')}</Label>
                <p className=" font-medium text-neutral-500">
                  SAR {currency(order.grandTotal)}
                </p>
              </div>
            </div>

            <div className=" mt-6 flex flex-col gap-6">
              <p className=" text-lg font-medium text-neutral-800">
                {t('common.productList')}
              </p>

              <div className=" overflow-hidden rounded-lg border">
                <Table className="whitespace-nowrap [&_tr:nth-child(even)]:bg-neutral-100">
                  <TableHeader>
                    <TableRow className=" bg-neutral-200 [&_th]:capitalize">
                      <TableHead>{t('common.product')}</TableHead>
                      <TableHead>{t('common.mpn')}</TableHead>
                      <TableHead>{t('common.qty')}</TableHead>
                      <TableHead>{t('common.price')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {order.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className=" relative aspect-square w-12 overflow-hidden rounded-md">
                              <Image
                                src={item.product.image.url}
                                fill
                                alt=""
                                className=" object-contain object-center"
                              />
                            </div>
                            {getLang(params, item.product.name)}
                          </div>
                        </TableCell>
                        <TableCell>{item.product.mpn}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>SAR {item.price}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
          {/* end: card */}
          {!['completed', 'canceled'].includes(order.status) && (
            <div className=" mt-6 flex justify-end gap-4">
              <Button
                variant="ghost-primary"
                disabled={loadingCancelOrder}
                onClick={handleCancel}
              >
                {loadingCancelOrder && (
                  <LuLoader2
                    className=" animate-spin text-white"
                    size={16}
                  />
                )}
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => setShowDelete((prev) => !prev)}
              >
                Delete
              </Button>
              <Button
                disabled={loadingCompleteOrder}
                onClick={handleComplete}
              >
                {loadingCompleteOrder && (
                  <LuLoader2
                    className=" animate-spin text-white"
                    size={16}
                  />
                )}
                Complete
              </Button>
            </div>
          )}
        </div>

        <DialogDelete
          open={showDelete}
          onOpenChange={setShowDelete}
          onDelete={handleDelete}
          isLoading={loadingDeleteOrder}
        />
      </>
    )
  );
}
