'use client';

import { useDeleteBrand, useGetBrands } from '@/api/brand.api';
import SheetAddBrand from '@/components/brand-management/sheet-add-brand';
import SheetDetailBrand from '@/components/brand-management/sheet-detail-brand';
import SheetEditBrand from '@/components/brand-management/sheet-edit-brand';
import BasePagination from '@/components/common/base-pagination';
import BaseSearch from '@/components/common/base-search';
import BaseTableSkeleton from '@/components/common/base-table-skeleton';
import EmptyState from '@/components/common/empty-state';
import Header from '@/components/common/header/header';
import DialogDelete from '@/components/dialog/dialog-delete';
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
import { TBrand } from '@/types/brand.type';
import { TDefaultPageParams } from '@/types/common.type';
import { textTruncate } from '@/utils/common.util';
import { getLang } from '@/utils/locale.util';
import { AddSquare, Eye, Trash } from 'iconsax-react';
import Image from 'next/image';
import { useCallback, useState } from 'react';
import { useQueryClient } from 'react-query';
import { toast } from 'sonner';

export default function BrandManagementPage({
  params,
  searchParams,
}: TDefaultPageParams) {
  // hooks
  const queryClient = useQueryClient();
  const t = useI18n();
  const { isAr } = useLangClient();

  const [showAddBrand, setShowAddBrand] = useState<boolean>(false);
  const [showEditBrand, setShowEditBrand] = useState<boolean>(false);
  const [showDeleteBrand, setShowDeleteBrand] = useState<boolean>(false);
  const [showDetailBrand, setShowDetailBrand] = useState<boolean>(false);
  const [selectedBrand, setSelectedBrand] = useState<TBrand | undefined>(
    undefined,
  );

  const { data: brands, isLoading: loadingGets } = useGetBrands({
    page: (Number(searchParams.page || 1) - 1).toString(),
    search: searchParams.search,
    size: searchParams.size,
    order: 'desc',
    sort: 'createdAt',
  });

  // mutation
  const { mutate, isLoading: loadingDelete } = useDeleteBrand({
    onSuccess: (resp) => {
      if (resp.code === HTTP_STATUS.SUCCESS) {
        toast.success('success to delete brand');
        queryClient.invalidateQueries({ queryKey: ['brands'] });
        setShowDeleteBrand((prev) => !prev);
        setSelectedBrand(undefined);
      } else {
        toast.error('failed to delete brand', {
          description: resp.message,
        });
        setShowDeleteBrand((prev) => !prev);
      }
    },
  });

  // handle delete
  const handleDelete = useCallback(() => {
    if (selectedBrand) {
      mutate(selectedBrand.id);
    } else {
      toast.error('no selected brand');
    }
  }, [selectedBrand, mutate]);

  return (
    <>
      <div className=" flex h-full w-full flex-col">
        <Header title={t('brand.brandManagement')} />

        <div className=" h-full w-full p-4 lg:p-6">
          <div className=" flex w-full flex-col rounded-lg border p-5">
            {/* begin: filter, search and action */}
            <div className="flex items-center justify-between rounded-lg border bg-neutral-100 p-1.5">
              <div className="flex items-center">
                <Button
                  className=" text-xs"
                  variant="transparent"
                  onClick={() => setShowAddBrand((prev) => !prev)}
                >
                  <AddSquare size={16} />
                  {t('common.create')}
                </Button>
                {/* <div className=" h-8 w-px border-r"></div>
                <Button
                  className=" text-xs"
                  variant="transparent"
                  // onClick={() => setShowFilter((prev) => !prev)}
                >
                  <Filter size={16} />
                  Filter
                </Button> */}
              </div>
              <BaseSearch className=" hidden lg:block" />
            </div>
            <BaseSearch className=" mt-2 block lg:hidden" />
            {/* end: filter, search and action */}

            {loadingGets ? (
              <BaseTableSkeleton
                col={3}
                row={10}
              />
            ) : brands && brands.totalCount > 0 ? (
              <>
                <div className=" mt-4 overflow-hidden rounded-lg border">
                  <Table className="whitespace-nowrap [&_tr:nth-child(even)]:bg-neutral-100">
                    <TableHeader>
                      <TableRow
                        className={cn(' bg-neutral-200 capitalize ', {
                          '[&_th]:text-right': isAr,
                        })}
                      >
                        <TableHead>{t('common.image')}</TableHead>
                        <TableHead>{t('common.name')}</TableHead>
                        <TableHead>{t('common.action')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {brands.content.map((brand) => (
                        <TableRow key={brand.id}>
                          <TableCell>
                            <div className=" relative aspect-square w-20 overflow-hidden rounded-full">
                              <Image
                                src={brand.image.url}
                                alt=""
                                fill
                                className=" object-contain object-center"
                              />
                            </div>
                          </TableCell>
                          <TableCell>
                            {textTruncate(getLang(params, brand.name))}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="info"
                                size="icon-sm"
                                onClick={() => {
                                  setSelectedBrand(brand);
                                  setShowDetailBrand((prev) => !prev);
                                }}
                              >
                                <Eye size={16} />
                              </Button>
                              <Button
                                variant="info"
                                size="icon-sm"
                                onClick={() => {
                                  setSelectedBrand(brand);
                                  setShowEditBrand((prev) => !prev);
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
                                  setSelectedBrand(brand);
                                  setShowDeleteBrand((prev) => !prev);
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

                <BasePagination totalCount={brands.totalCount} />
              </>
            ) : (
              <EmptyState />
            )}
          </div>
        </div>
      </div>

      <SheetAddBrand
        open={showAddBrand}
        setOpen={setShowAddBrand}
      />

      <SheetDetailBrand
        open={showDetailBrand}
        setOpen={setShowDetailBrand}
        brandId={selectedBrand?.id}
      />

      <DialogDelete
        open={showDeleteBrand}
        onOpenChange={setShowDeleteBrand}
        onDelete={handleDelete}
        isLoading={loadingDelete}
      />

      <SheetEditBrand
        open={showEditBrand}
        setOpen={setShowEditBrand}
        brandId={selectedBrand?.id}
      />
    </>
  );
}
