'use client';

import { useDeleteAttribute, useGetAttributes } from '@/api/attribute.api';
import SheetAddAttribute from '@/components/attribute-management/sheet-add-attribute';
import SheetDetailAttribute from '@/components/attribute-management/sheet-detail-attribute';
import SheetEditAttribute from '@/components/attribute-management/sheet-edit-attribute';
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
import { useI18n } from '@/locales/client';
import { TAttribute } from '@/types/attribute.type';
import { getLang } from '@/utils/locale.util';
import { Eye, Filter, Trash, UserAdd } from 'iconsax-react';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { useQueryClient } from 'react-query';
import { toast } from 'sonner';

export default function AttributeManagementPage() {
  const t = useI18n();

  const [showAddAttribute, setShowAddAttribute] = useState<boolean>(false);
  const [showEditAttribute, setShowEditAttribute] = useState<boolean>(false);
  const [showDeleteAttribute, setShowDeleteAttribute] =
    useState<boolean>(false);
  const [showDetailAttribute, setShowDetailAttribute] =
    useState<boolean>(false);

  const [selectedAttribute, setSelectedAttribute] = useState<
    TAttribute | undefined
  >(undefined);

  const { data: attributes, isLoading: loadingGet } = useGetAttributes();
  const params = useParams();
  const queryClient = useQueryClient();

  // delete blog mutation
  const { mutate: deleteAttribute, isLoading: loadingDeleteAttribute } =
    useDeleteAttribute({
      onSuccess: (resp) => {
        if (resp.code.toString() === HTTP_STATUS.SUCCESS) {
          toast.success('success to delete attribute');
          queryClient.invalidateQueries({ queryKey: ['attributes'] });
          setShowDeleteAttribute((prev) => !prev);
        }
      },
    });

  const handleDelete = () => {
    if (selectedAttribute) {
      deleteAttribute(selectedAttribute.id);
    }
  };

  return (
    <>
      <div className=" flex h-full w-full flex-col">
        <Header title={t('sidebar.menu.attributeManagement')} />

        <div className=" h-full w-full p-4 lg:p-6">
          <div className=" flex w-full flex-col rounded-lg border p-5">
            {/* begin: filter, search and action */}
            <div className="flex items-center justify-between rounded-lg border bg-neutral-100 p-1.5">
              <div className="flex items-center">
                <Button
                  className=" text-xs"
                  variant="transparent"
                  onClick={() => setShowAddAttribute((prev) => !prev)}
                >
                  <UserAdd size={16} />
                  {t('common.create')}
                </Button>
                <div className=" h-8 w-px border-r"></div>
                <Button
                  className=" text-xs"
                  variant="transparent"
                  // onClick={() => setShowFilter((prev) => !prev)}
                >
                  <Filter size={16} />
                  {t('common.filter')}
                </Button>
              </div>
              <BaseSearch className=" hidden lg:block" />
            </div>
            <BaseSearch className=" mt-2 block lg:hidden" />
            {/* end: filter, search and action */}

            {/* begin: empty state */}
            {/* <EmptyState description="We couldn't find any data matching your search. Please double-check your keywords or try different search terms" /> */}
            {/* end: empty state */}

            {loadingGet ? (
              <BaseTableSkeleton />
            ) : attributes && attributes.totalCount > 0 ? (
              <>
                <div className=" mt-4 overflow-hidden rounded-lg border">
                  <Table className="whitespace-nowrap [&_tr:nth-child(even)]:bg-neutral-100">
                    <TableHeader>
                      <TableRow className=" bg-neutral-200 ">
                        <TableHead>{t('common.group')}</TableHead>
                        <TableHead>{t('common.name')}</TableHead>
                        <TableHead>{t('common.action')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {attributes &&
                        attributes.content.map((attribute) => (
                          <TableRow key={attribute.id}>
                            <TableCell>
                              {getLang(params, attribute.group)}
                            </TableCell>
                            <TableCell>
                              {getLang(params, attribute.name)}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="info"
                                  size="icon-sm"
                                  onClick={() => {
                                    setSelectedAttribute(attribute);
                                    setShowDetailAttribute((prev) => !prev);
                                  }}
                                >
                                  <Eye size={16} />
                                </Button>
                                <Button
                                  variant="info"
                                  size="icon-sm"
                                  onClick={() => {
                                    setSelectedAttribute(attribute);
                                    setShowEditAttribute((prev) => !prev);
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
                                    setSelectedAttribute(attribute);
                                    setShowDeleteAttribute((prev) => !prev);
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

                <BasePagination totalCount={25} />
              </>
            ) : (
              <EmptyState />
            )}
          </div>
        </div>
      </div>

      <SheetAddAttribute
        open={showAddAttribute}
        setOpen={setShowAddAttribute}
      />

      <SheetDetailAttribute
        open={showDetailAttribute}
        setOpen={setShowDetailAttribute}
        attribute={selectedAttribute}
      />

      <SheetEditAttribute
        open={showEditAttribute}
        setOpen={setShowEditAttribute}
        attribute={selectedAttribute}
      />

      <DialogDelete
        open={showDeleteAttribute}
        onOpenChange={setShowDeleteAttribute}
        onDelete={handleDelete}
        isLoading={loadingDeleteAttribute}
      />
    </>
  );
}
