'use client';

import { useDeleteFaq, useGetFaqs } from '@/api/faq.api';
import { HTTP_STATUS } from '@/constants/common.constant';
import { useI18n } from '@/locales/client';
import { TFaq } from '@/types/faq.type';
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
import { Button } from '../ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';

export default function TabFaq() {
  // hooks
  const queryClient = useQueryClient();
  const params = useParams();
  const t = useI18n();

  // search params
  const searchParams = useSearchParams();
  const search = searchParams.get('search') as string;
  const page = Number(searchParams.get('page')) || 1;
  const size = Number(searchParams.get('size')) || 10;

  // hooks
  const [showDelete, setShowDelete] = useState<boolean>(false);
  const [selectedFaq, setSelectedFaq] = useState<TFaq | undefined>(undefined);

  // fetch
  const { data: faqs, isLoading: loadingGets } = useGetFaqs({
    search,
    page: (page - 1).toString(),
    size: size.toString(),
  });

  // delete faq group
  const { mutate: deleteFaq, isLoading: loadingDelete } = useDeleteFaq({
    onSuccess: (resp) => {
      if (resp.code === HTTP_STATUS.SUCCESS) {
        toast.success('success to delete faq');
        queryClient.invalidateQueries({ queryKey: ['faqs'] });
        setShowDelete((prev) => !prev);
      } else {
        toast.error('failed to delete faq', {
          description: resp.message,
        });
      }
    },
  });

  // handle delete
  const handleDelete = () => {
    if (selectedFaq) {
      deleteFaq(selectedFaq.id);
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
          <Link href="/faq-management/faq/create">
            <Information size={16} />
            {t('faq.createFaq')}
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
      ) : faqs && faqs.totalCount > 0 ? (
        <>
          <div className=" mt-4 overflow-hidden rounded-lg border">
            <Table className=" [&_tr:nth-child(even)]:bg-neutral-100">
              <TableHeader>
                <TableRow className=" whitespace-nowrap bg-neutral-200">
                  <TableHead>{t('common.question')}</TableHead>
                  <TableHead>{t('common.answer')}</TableHead>
                  <TableHead>{t('common.action')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {faqs.content.map((faq) => (
                  <TableRow key={faq.id}>
                    <TableCell>{getLang(params, faq.question)}</TableCell>
                    <TableCell>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: getLang(params, faq.answer),
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="info"
                          size="icon-sm"
                          asChild
                        >
                          <Link href={`/faq-management/faq/${faq.id}/edit`}>
                            <Pencxil />
                          </Link>
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon-sm"
                          onClick={() => {
                            setSelectedFaq(faq);
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
          <BasePagination totalCount={faqs.totalCount} />
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
