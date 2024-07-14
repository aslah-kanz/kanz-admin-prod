'use client';

import { useDeleteJobField, useGetJobFields } from '@/api/job.api';
import BaseSearch from '@/components/common/base-search';
import BaseTableSkeleton from '@/components/common/base-table-skeleton';
import EmptyState from '@/components/common/empty-state';
import DialogDelete from '@/components/dialog/dialog-delete';
import SheetAddJobField from '@/components/job-management/sheet-add-job-field';
import SheetEditJobField from '@/components/job-management/sheet-edit-job-field';
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
import { TJobField } from '@/types/job.type';
import { textTruncate } from '@/utils/common.util';
import { getLang } from '@/utils/locale.util';
import { Briefcase, Trash } from 'iconsax-react';
import { useParams, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useQueryClient } from 'react-query';
import { toast } from 'sonner';

export default function TabJobField() {
  // search params
  const searchParams = useSearchParams();
  const search = searchParams.get('search') || '';

  // hooks
  const queryClient = useQueryClient();
  const params = useParams();
  const t = useI18n();

  // state
  const [showAddJobField, setShowAddJobField] = useState<boolean>(false);
  const [showEditJobField, setShowEditJobField] = useState<boolean>(false);
  const [showDeleteJobField, setShowDeleteJobField] = useState<boolean>(false);
  const [selectedJobField, setSelectedJobField] = useState<
    TJobField | undefined
  >(undefined);

  // fetch data
  const { data: jobFields, isLoading: loadingJobFields } = useGetJobFields({
    search,
    order: 'desc',
    sort: 'createdAt',
  });

  // delete job field
  const { mutate: deleteJobField, isLoading: loadingDeleteJobField } =
    useDeleteJobField({
      onSuccess: (resp) => {
        if (resp.code === HTTP_STATUS.SUCCESS) {
          toast.success('success to delete job field');
          queryClient.invalidateQueries({ queryKey: ['job-fields'] });
          setShowDeleteJobField((prev) => !prev);
          setSelectedJobField(undefined);
        } else {
          toast.error('failed to delete job field', {
            description: resp.message,
          });
        }
      },
    });

  // handle delete
  const handleDelete = () => {
    if (selectedJobField) {
      deleteJobField(selectedJobField.id);
    }
  };

  return (
    <>
      {/* begin: filter, search and action */}
      <div className=" flex w-full justify-between rounded-lg bg-neutral-100 p-2">
        <Button
          variant="transparent"
          className=" text-xs"
          onClick={() => setShowAddJobField((prev) => !prev)}
        >
          <Briefcase size={16} />
          {t('job.createJobField')}
        </Button>
        <BaseSearch className=" hidden lg:block" />
      </div>
      <BaseSearch className=" mt-2 block lg:hidden" />
      {/* begin: filter, search and action */}

      {/* begin: job fields list */}
      {loadingJobFields ? (
        <BaseTableSkeleton
          row={4}
          col={2}
        />
      ) : jobFields && jobFields.length > 0 ? (
        <div className=" mt-4 overflow-hidden rounded-lg border">
          <Table className=" [&_tr:nth-child(even)]:bg-neutral-100">
            <TableHeader>
              <TableRow className=" bg-neutral-200">
                <TableHead>{t('common.name')}</TableHead>
                <TableHead>{t('common.action')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobFields.map((jobField) => (
                <TableRow key={jobField.id}>
                  <TableCell>
                    {textTruncate(getLang(params, jobField.name))}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="info"
                        size="icon-sm"
                        onClick={() => {
                          setSelectedJobField(jobField);
                          setShowEditJobField((prev) => !prev);
                        }}
                      >
                        <Pencxil />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon-sm"
                        onClick={() => {
                          setSelectedJobField(jobField);
                          setShowDeleteJobField((prev) => !prev);
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
      ) : (
        <EmptyState />
      )}
      {/* end: job fields list */}

      <SheetAddJobField
        open={showAddJobField}
        setOpen={setShowAddJobField}
      />

      <SheetEditJobField
        open={showEditJobField}
        setOpen={setShowEditJobField}
        jobField={selectedJobField}
      />

      <DialogDelete
        open={showDeleteJobField}
        onOpenChange={setShowDeleteJobField}
        onDelete={handleDelete}
        isLoading={loadingDeleteJobField}
      />
    </>
  );
}
