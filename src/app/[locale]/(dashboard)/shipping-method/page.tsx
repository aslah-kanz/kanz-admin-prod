'use client';

import {
  useDeleteShippingMethod,
  useGetShippingMethods,
} from '@/api/shipping-method.api';
import BasePagination from '@/components/common/base-pagination';
import BaseSearch from '@/components/common/base-search';
import BaseTableSkeleton from '@/components/common/base-table-skeleton';
import EmptyState from '@/components/common/empty-state';
import Header from '@/components/common/header/header';
import DialogDelete from '@/components/dialog/dialog-delete';
import SheetAddShippingMethod from '@/components/shipping-method/sheet-add-shipping-method';
import SheetDetailShippingMethod from '@/components/shipping-method/sheet-detail-shipping-method';
import SheetEditShippingMethod from '@/components/shipping-method/sheet-edit-shipping-method';
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
import { useI18n } from '@/locales/client';
import { TDefaultPageParams } from '@/types/common.type';
import { TShippingMethod } from '@/types/shipping-method.type';
import { textTruncate } from '@/utils/common.util';
import { Eye, Trash, TruckTick } from 'iconsax-react';
import { useCallback, useState } from 'react';
import { useQueryClient } from 'react-query';
import { toast } from 'sonner';

export default function ShippingMethodManagementPage({
  searchParams,
}: TDefaultPageParams) {
  // hooks
  const queryClient = useQueryClient();
  const t = useI18n();

  // state
  const [showAddShippingMethod, setShowAddShippingMethod] =
    useState<boolean>(false);
  const [showEditShippingMethod, setShowEditShippingMethod] =
    useState<boolean>(false);
  const [showDeleteShippingMethod, setShowDeleteShippingMethod] =
    useState<boolean>(false);
  const [showDetailShippingMethod, setShowDetailShippingMethod] =
    useState<boolean>(false);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState<
    TShippingMethod | undefined
  >(undefined);

  // fetch
  const { data: shippingMethods, isLoading: loadingGetShippingMethods } =
    useGetShippingMethods({
      page: (Number(searchParams.page || 1) - 1).toString(),
      search: searchParams.search,
      size: searchParams.size,
      order: 'desc',
      sort: 'createdAt',
    });

  // delete mutation
  const {
    mutate: deleteShippingMethod,
    isLoading: loadingDeleteShippingMethod,
  } = useDeleteShippingMethod({
    onSuccess: (resp) => {
      if (resp.code === HTTP_STATUS.SUCCESS) {
        toast.success('Success to delete shipping method');
        queryClient.invalidateQueries({ queryKey: ['shipping-methods'] });
        setShowDeleteShippingMethod((prev) => !prev);
        setSelectedShippingMethod(undefined);
      } else {
        toast.error('Failed to delete shipping method', {
          description: resp.message,
        });
        setShowDeleteShippingMethod((prev) => !prev);
      }
    },
  });

  // handle delete
  const handleDelete = useCallback(() => {
    if (selectedShippingMethod) {
      deleteShippingMethod(selectedShippingMethod.id);
    }
  }, [deleteShippingMethod, selectedShippingMethod]);

  return (
    <>
      <div className=" flex h-full w-full flex-col">
        <Header title={t('sidebar.menu.shippingMethod')} />

        <div className=" h-full w-full p-4 lg:p-6">
          <div className=" flex w-full flex-col rounded-lg border p-5">
            {/* begin: filter, search and action */}
            <div className="flex items-center justify-between rounded-lg border bg-neutral-100 p-1.5">
              <div className="flex items-center">
                <Button
                  className=" text-xs"
                  variant="transparent"
                  onClick={() => setShowAddShippingMethod((prev) => !prev)}
                >
                  <TruckTick size={16} />
                  {t('common.create')}
                </Button>
              </div>
              <BaseSearch className=" hidden lg:block" />
            </div>
            <BaseSearch className=" mt-2 block lg:hidden" />
            {/* end: filter, search and action */}
            {loadingGetShippingMethods ? (
              <BaseTableSkeleton />
            ) : (
              <div className=" mt-4">
                {shippingMethods && shippingMethods.length > 0 ? (
                  <>
                    <div className=" overflow-hidden rounded-lg border">
                      <Table className="whitespace-nowrap [&_tr:nth-child(even)]:bg-neutral-100">
                        <TableHeader>
                          <TableRow className=" bg-neutral-200 ">
                            <TableHead>
                              {t('shippingMethod.providerName')}
                            </TableHead>
                            <TableHead>
                              {t('shippingMethod.deliveryCompanyName')}
                            </TableHead>
                            <TableHead>
                              {t('shippingMethod.deliveryEstimateTime')}
                            </TableHead>
                            <TableHead>{t('common.action')}</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {shippingMethods &&
                            shippingMethods.map((shippingMethod) => (
                              <TableRow key={shippingMethod.id}>
                                <TableCell>
                                  {textTruncate(
                                    shippingMethod.providerName,
                                    25,
                                  )}
                                </TableCell>
                                <TableCell>
                                  {textTruncate(
                                    shippingMethod.deliveryCompanyName,
                                    25,
                                  )}
                                </TableCell>
                                <TableCell>
                                  {textTruncate(
                                    shippingMethod.deliveryEstimateTime,
                                    25,
                                  )}
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Button
                                      variant="info"
                                      size="icon-sm"
                                      onClick={() => {
                                        setSelectedShippingMethod(
                                          shippingMethod,
                                        );
                                        setShowDetailShippingMethod(
                                          (prev) => !prev,
                                        );
                                      }}
                                    >
                                      <Eye size={16} />
                                    </Button>
                                    <Button
                                      variant="info"
                                      size="icon-sm"
                                      onClick={() => {
                                        setSelectedShippingMethod(
                                          shippingMethod,
                                        );
                                        setShowEditShippingMethod(
                                          (prev) => !prev,
                                        );
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
                                        setSelectedShippingMethod(
                                          shippingMethod,
                                        );
                                        setShowDeleteShippingMethod(
                                          (prev) => !prev,
                                        );
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
                    <BasePagination totalCount={shippingMethods.length} />
                  </>
                ) : (
                  <EmptyState />
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <SheetAddShippingMethod
        open={showAddShippingMethod}
        setOpen={setShowAddShippingMethod}
      />

      <SheetEditShippingMethod
        open={showEditShippingMethod}
        setOpen={setShowEditShippingMethod}
        shippingMethod={selectedShippingMethod}
      />

      <SheetDetailShippingMethod
        open={showDetailShippingMethod}
        setOpen={setShowDetailShippingMethod}
        shippingMethod={selectedShippingMethod}
      />

      <DialogDelete
        open={showDeleteShippingMethod}
        onOpenChange={setShowDeleteShippingMethod}
        onDelete={handleDelete}
        isLoading={loadingDeleteShippingMethod}
      />
    </>
  );
}
