'use client';

import {
  useDeletePaymentMethod,
  useGetPaymentMethods,
} from '@/api/payment-method.api';
import BaseSearch from '@/components/common/base-search';
import BaseTableSkeleton from '@/components/common/base-table-skeleton';
import EmptyState from '@/components/common/empty-state';
import Header from '@/components/common/header/header';
import DialogDelete from '@/components/dialog/dialog-delete';
import SheetAddPaymentMethod from '@/components/payment-method/sheet-add-payment-method';
import SheetDetailPaymentMethod from '@/components/payment-method/sheet-detail-payment-method';
import SheetEditPaymentMethod from '@/components/payment-method/sheet-edit-payment-method';
import Pencxil from '@/components/svg/Pencxil';
import { Button } from '@/components/ui/button';
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
import { TDefaultPageParams } from '@/types/common.type';
import { TPaymentMethod } from '@/types/payment-method.type';
import { textTruncate } from '@/utils/common.util';
import { getLang } from '@/utils/locale.util';
import { Eye, Trash, WalletAdd } from 'iconsax-react';
import { useCallback, useState } from 'react';
import { useQueryClient } from 'react-query';
import { toast } from 'sonner';

export default function PaymentMethodManagementPage({
  params,
  searchParams,
}: TDefaultPageParams) {
  // hooks
  const queryClient = useQueryClient();
  const t = useI18n();
  const { isAr } = useLangClient();

  // state
  const [showAddPaymentMethod, setShowAddPaymentMethod] =
    useState<boolean>(false);
  const [showEditPaymentMethod, setShowEditPaymentMethod] =
    useState<boolean>(false);
  const [showDeletePaymentMethod, setShowDeletePaymentMethod] =
    useState<boolean>(false);
  const [showDetailPaymentMethod, setShowDetailPaymentMethod] =
    useState<boolean>(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    TPaymentMethod | undefined
  >(undefined);

  // fetch
  const { data: paymentMethods, isLoading: loadingGetPaymentMethods } =
    useGetPaymentMethods({
      page: (Number(searchParams.page || 1) - 1).toString(),
      search: searchParams.search,
      size: searchParams.size,
      order: 'desc',
      sort: 'createdAt',
    });

  // delete mutation
  const { mutate: deletePaymentMethod, isLoading: loadingDeletePaymentMethod } =
    useDeletePaymentMethod({
      onSuccess: (resp) => {
        if (resp.code === HTTP_STATUS.SUCCESS) {
          toast.success('Success to delete payment method');
          queryClient.invalidateQueries({ queryKey: ['payment-methods'] });
          setShowDeletePaymentMethod((prev) => !prev);
          setSelectedPaymentMethod(undefined);
        } else {
          toast.error('Failed to delete payment method', {
            description: resp.message,
          });
          setShowDeletePaymentMethod((prev) => !prev);
        }
      },
    });

  // handle delete
  const handleDelete = useCallback(() => {
    if (selectedPaymentMethod) {
      deletePaymentMethod(selectedPaymentMethod.id);
    }
  }, [deletePaymentMethod, selectedPaymentMethod]);

  return (
    <>
      <div className=" flex h-full w-full flex-col">
        <Header title={t('sidebar.menu.paymentMethod')} />
        <div className=" h-full w-full p-4 lg:p-6">
          <div className=" flex w-full flex-col rounded-lg border p-5">
            {/* begin: filter, search and action */}
            <div className="flex items-center justify-between rounded-lg border bg-neutral-100 p-1.5">
              <div className="flex items-center">
                <Button
                  className=" text-xs"
                  variant="transparent"
                  onClick={() => setShowAddPaymentMethod((prev) => !prev)}
                >
                  <WalletAdd size={16} />
                  {t('common.create')}
                </Button>
              </div>
              <BaseSearch className=" hidden lg:block" />
            </div>
            <BaseSearch className=" mt-2 block lg:hidden" />
            {/* end: filter, search and action */}

            {loadingGetPaymentMethods ? (
              <BaseTableSkeleton col={3} />
            ) : paymentMethods && paymentMethods.length > 0 ? (
              <>
                <div className=" mt-4 overflow-hidden rounded-lg border">
                  <Table className="whitespace-nowrap [&_tr:nth-child(even)]:bg-neutral-100">
                    <TableHeader>
                      <TableRow
                        className={cn(' bg-neutral-200 capitalize ', {
                          '[&_th]:text-right': isAr,
                        })}
                      >
                        <TableHead>{t('common.name')}</TableHead>
                        <TableHead>{t('common.instruction')}</TableHead>
                        <TableHead>{t('common.action')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paymentMethods &&
                        paymentMethods.map((paymentMethod) => (
                          <TableRow key={paymentMethod.id}>
                            <TableCell>
                              {textTruncate(
                                getLang(params, paymentMethod.name),
                                50,
                              )}
                            </TableCell>
                            <TableCell>
                              {textTruncate(
                                getLang(params, paymentMethod.instruction),
                                50,
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="info"
                                  size="icon-sm"
                                  onClick={() => {
                                    setSelectedPaymentMethod(paymentMethod);
                                    setShowDetailPaymentMethod((prev) => !prev);
                                  }}
                                >
                                  <Eye size={16} />
                                </Button>
                                <Button
                                  variant="info"
                                  size="icon-sm"
                                  onClick={() => {
                                    setSelectedPaymentMethod(paymentMethod);
                                    setShowEditPaymentMethod((prev) => !prev);
                                  }}
                                >
                                  <Pencxil
                                    width={16}
                                    height={16}
                                  />
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="icon-sm"
                                  onClick={() => {
                                    setSelectedPaymentMethod(paymentMethod);
                                    setShowDeletePaymentMethod((prev) => !prev);
                                  }}
                                >
                                  <Trash size={16} />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
                {/* <BasePagination totalCount={paymentMethods.length} /> */}
              </>
            ) : (
              <EmptyState />
            )}
          </div>
        </div>
      </div>

      <SheetAddPaymentMethod
        open={showAddPaymentMethod}
        setOpen={setShowAddPaymentMethod}
      />

      <SheetEditPaymentMethod
        open={showEditPaymentMethod}
        setOpen={setShowEditPaymentMethod}
        paymentMethod={selectedPaymentMethod}
      />

      <SheetDetailPaymentMethod
        open={showDetailPaymentMethod}
        setOpen={setShowDetailPaymentMethod}
        paymentMethod={selectedPaymentMethod}
      />

      <DialogDelete
        open={showDeletePaymentMethod}
        onOpenChange={setShowDeletePaymentMethod}
        onDelete={handleDelete}
        isLoading={loadingDeletePaymentMethod}
      />
    </>
  );
}
