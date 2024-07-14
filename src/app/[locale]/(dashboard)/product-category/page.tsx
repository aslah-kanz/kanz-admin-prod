'use client';

import { useDeleteCategory, useGetCategories } from '@/api/category.api';
import BaseFilterTable from '@/components/common/base-filter-table';
import BasePagination from '@/components/common/base-pagination';
import BaseSearch from '@/components/common/base-search';
import BaseTableSkeleton from '@/components/common/base-table-skeleton';
import EmptyState from '@/components/common/empty-state';
import Header from '@/components/common/header/header';
import DialogDelete from '@/components/dialog/dialog-delete';
import SheetAddCategory from '@/components/product-category/sheet-add-category';
import SheetDetailCategory from '@/components/product-category/sheet-detail-category';
import SheetEditCategory from '@/components/product-category/sheet-edit-category';
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
import { TCategory } from '@/types/category.type';
import { TDefaultPageParams, TListColumnOptions } from '@/types/common.type';
import { getLang } from '@/utils/locale.util';
import { Additem, Eye, Trash } from 'iconsax-react';
import { useCallback, useState } from 'react';
import { useQueryClient } from 'react-query';
import { toast } from 'sonner';

export default function ProductCategoryPage({
  params,
  searchParams,
}: TDefaultPageParams) {
  // hooks
  const queryClient = useQueryClient();
  const t = useI18n();
  const { isAr } = useLangClient();

  // state
  const [showDetailCategory, setShowDetailCategory] = useState<boolean>(false);
  const [showAddProductCategory, setShowAddProductCategory] =
    useState<boolean>(false);
  const [showEditProductCategory, setShowEditProductCategory] =
    useState<boolean>(false);
  const [showDeleteProductCategory, setShowDeleteProductCategory] =
    useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<
    TCategory | undefined
  >(undefined);

  const page = Number(searchParams.page) || 1;
  const size = Number(searchParams.size) || 10;

  // fetch
  const { data: categories, isLoading: loadingGets } = useGetCategories({
    search: searchParams.search,
  });

  // mutation
  const { mutate, isLoading: loadingDelete } = useDeleteCategory({
    onSuccess: (resp) => {
      console.log(resp);
      if (resp.code === HTTP_STATUS.SUCCESS) {
        toast.success('success to delete category');
        queryClient.invalidateQueries({ queryKey: ['categories'] });
        setShowDeleteProductCategory((prev) => !prev);
        setSelectedCategory(undefined);
      } else {
        toast.error('failed to delete category', {
          description: resp.message,
        });
        setShowDeleteProductCategory((prev) => !prev);
      }
    },
  });

  // handle delete
  const handleDelete = useCallback(() => {
    if (selectedCategory) {
      mutate(selectedCategory.id);
    }
  }, [selectedCategory, mutate]);

  const listColumn: TListColumnOptions[] = [
    {
      id: 1,
      slug: 'name',
      label: 'Name',
    },
    {
      slug: 'slug',
      id: 2,
      label: 'Slug',
    },
    {
      slug: 'description',
      id: 3,
      label: 'Description',
    },
    {
      slug: 'parent-category',
      id: 4,
      label: 'Parent Category',
    },
    {
      slug: 'action',
      id: 5,
      label: 'Action',
    },
  ];

  return (
    <>
      <div className=" flex h-full w-full flex-col">
        <Header title={t('category.productCategory')} />

        <div className=" h-full w-full p-4 lg:p-6">
          <div className=" flex w-full flex-col rounded-lg border p-5">
            {/* begin: filter, search and action */}
            <div className="flex flex-col items-start justify-between rounded-lg border bg-neutral-100 p-1.5 lg:flex-row lg:items-center">
              <div className="flex items-center">
                <Button
                  className=" text-xs"
                  variant="transparent"
                  onClick={() => setShowAddProductCategory((prev) => !prev)}
                >
                  <Additem size={16} />
                  {t('common.create')}
                </Button>
                {/* <div className=" h-8 w-px border-r"></div>
                <Button 
                  className=" fill-primary text-xs hover:fill-white"
                  variant="transparent"
                  // onClick={() => setShowFilter((prev) => !prev)}
                >
                  <Filter size={16} />
                  Filter
                </Button> */}
                {/* <div className=" h-8 w-px border-r"></div>
                <Button
                  className=" text-xs"
                  variant="transparent"
                  // onClick={() => setShowFilter((prev) => !prev)}
                >
                  <TaskSquare size={16} />
                  Data Tables
                </Button> */}
                <BaseFilterTable listColumn={listColumn} />
              </div>
              <BaseSearch className=" hidden lg:block" />
            </div>
            <BaseSearch className=" mt-2 block lg:hidden" />
            {/* end: filter, search and action */}

            {loadingGets ? (
              <BaseTableSkeleton
                row={10}
                col={5}
              />
            ) : categories && categories.length > 0 ? (
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
                        <TableHead>{t('common.slug')}</TableHead>
                        <TableHead>{t('common.description')}</TableHead>
                        <TableHead>{t('category.parentCategory')}</TableHead>
                        <TableHead>{t('common.action')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {categories
                        .slice((page - 1) * size, page * size)
                        .map((category) => (
                          <TableRow key={category.id}>
                            <TableCell>
                              {getLang(params, category.name)}
                            </TableCell>
                            <TableCell>{category.slug}</TableCell>
                            <TableCell>
                              {category.description
                                ? getLang(params, category.description)
                                : '-'}
                            </TableCell>
                            <TableCell>{category.parentId}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="info"
                                  size="icon-sm"
                                  onClick={() => {
                                    setSelectedCategory(category);
                                    setShowDetailCategory((prev) => !prev);
                                  }}
                                >
                                  <Eye size={16} />
                                </Button>
                                <Button
                                  variant="secondary"
                                  size="icon"
                                  className=" h-8 w-8 bg-blue-50 fill-blue-500"
                                  onClick={() => {
                                    setSelectedCategory(category);
                                    setShowEditProductCategory((prev) => !prev);
                                  }}
                                >
                                  <Pencxil
                                    width={16}
                                    height={16}
                                  />
                                </Button>
                                <Button
                                  variant="secondary"
                                  size="icon"
                                  className=" h-8 w-8 bg-red-50"
                                  onClick={() => {
                                    setSelectedCategory(category);
                                    setShowDeleteProductCategory(
                                      (prev) => !prev,
                                    );
                                  }}
                                >
                                  <Trash
                                    size={16}
                                    className=" text-red-500"
                                  />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>

                <BasePagination totalCount={categories.length} />
              </>
            ) : (
              <EmptyState />
            )}
          </div>
        </div>
      </div>

      <SheetAddCategory
        open={showAddProductCategory}
        setOpen={setShowAddProductCategory}
      />

      <SheetEditCategory
        open={showEditProductCategory}
        setOpen={setShowEditProductCategory}
        categoryId={selectedCategory?.id}
      />

      <SheetDetailCategory
        open={showDetailCategory}
        setOpen={setShowDetailCategory}
        categoryId={selectedCategory?.id}
      />

      <DialogDelete
        open={showDeleteProductCategory}
        onOpenChange={setShowDeleteProductCategory}
        onDelete={handleDelete}
        isLoading={loadingDelete}
      />
    </>
  );
}
