'use client';

import { useDeleteFaqGroup, useGetFaqGroups } from '@/api/faq.api';
import { HTTP_STATUS } from '@/constants/common.constant';
import { useI18n } from '@/locales/client';
import { TFaqGroup } from '@/types/faq.type';
import {
  getBadgeVariant,
  slugToOriginal,
  textTruncate,
} from '@/utils/common.util';
import { getLang } from '@/utils/locale.util';
import { Information, Trash } from 'iconsax-react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useQueryClient } from 'react-query';
import { toast } from 'sonner';
import BasePagination from '../common/base-pagination';
import BaseSearch from '../common/base-search';
import BaseTableSkeleton from '../common/base-table-skeleton';
import EmptyState from '../common/empty-state';
import DialogDelete from '../dialog/dialog-delete';
import Pencxil from '../svg/Pencxil';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';

export default function TabFaqGroup() {
  // hooks
  const queryClient = useQueryClient();
  const params = useParams();
  const t = useI18n();

  // search params
  const searchParams = useSearchParams();
  const search = searchParams.get('search') as string;
  const page = Number(searchParams.get('page')) || 1;
  const size = Number(searchParams.get('size')) || 10;

  // state
  const [showDelete, setShowDelete] = useState<boolean>(false);
  const [selectedFaqGroup, setSelectedFaqGroup] = useState<
    TFaqGroup | undefined
  >(undefined);

  // fetch
  const { data: faqGroups, isLoading: loadingGets } = useGetFaqGroups({
    search,
    page: (page - 1).toString(),
    size: size.toString(),
  });

  // delete faq group
  const { mutate: deleteFaqGroup, isLoading: loadingDelete } =
    useDeleteFaqGroup({
      onSuccess: (resp) => {
        if (resp.code === HTTP_STATUS.SUCCESS) {
          toast.success('success to delete faq group');
          queryClient.invalidateQueries({ queryKey: ['faq-groups'] });
          setShowDelete((prev) => !prev);
        } else {
          toast.error('failed to delete faq group', {
            description: resp.message,
          });
        }
      },
    });

  // handle delete
  const handleDelete = () => {
    if (selectedFaqGroup) {
      deleteFaqGroup(selectedFaqGroup.id);
    }
  };

  return (
    <>
      {/* begin: filter, search and action */}
      <div className=" flex w-full justify-between rounded-lg bg-neutral-100 p-2">
        <Button
          variant="transparent"
          className=" text-xs"
          asChild
        >
          <Link href="/faq-management/faq-group/create">
            <Information size={16} />
            {t('faq.createFaqGroup')}
          </Link>
        </Button>
        <BaseSearch className=" hidden lg:block" />
      </div>
      <BaseSearch className=" mt-2 block lg:hidden" />
      {/* begin: filter, search and action */}

      {/* begin: list job */}
      {loadingGets ? (
        <BaseTableSkeleton
          row={4}
          col={2}
        />
      ) : faqGroups && faqGroups.totalCount > 0 ? (
        <>
          <div className=" mt-4 overflow-hidden rounded-lg border">
            <Table className=" [&_tr:nth-child(even)]:bg-neutral-100">
              <TableHeader>
                <TableRow className=" whitespace-nowrap bg-neutral-200">
                  <TableHead>{t('common.title')}</TableHead>
                  <TableHead>{t('common.showAtHomePage')}</TableHead>
                  <TableHead>{t('common.status')}</TableHead>
                  <TableHead>{t('common.action')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {faqGroups.content.map((faqGroup) => (
                  <TableRow key={faqGroup.id}>
                    <TableCell>
                      {textTruncate(getLang(params, faqGroup.title), 80)}
                    </TableCell>
                    <TableCell>{faqGroup.showAtHomePage.toString()}</TableCell>
                    <TableCell>
                      <Badge variant={getBadgeVariant(faqGroup.status)}>
                        {slugToOriginal(faqGroup.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="info"
                          size="icon-sm"
                          asChild
                        >
                          <Link
                            href={`/faq-management/faq-group/${faqGroup.id}/edit`}
                          >
                            <Pencxil />
                          </Link>
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon-sm"
                          onClick={() => {
                            setSelectedFaqGroup(faqGroup);
                            setShowDelete((prev) => !prev);
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
          <BasePagination totalCount={faqGroups.totalCount} />
        </>
      ) : (
        <EmptyState />
      )}
      {/* end: list job */}

      <DialogDelete
        open={showDelete}
        onOpenChange={setShowDelete}
        onDelete={handleDelete}
        isLoading={loadingDelete}
      />
    </>
  );
}
