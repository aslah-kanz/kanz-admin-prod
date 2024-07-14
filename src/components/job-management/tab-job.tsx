'use client';

'use client';

import { useDeleteJob, useGetJobs } from '@/api/job.api';
import BasePagination from '@/components/common/base-pagination';
import BaseSearch from '@/components/common/base-search';
import EmptyState from '@/components/common/empty-state';
import JobItem from '@/components/job-management/job-item';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { HTTP_STATUS } from '@/constants/common.constant';
import { useI18n } from '@/locales/client';
import useDialogDeleteJobStore from '@/store/job-management/dialog-delete-job.store';
import { Briefcase } from 'iconsax-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useQueryClient } from 'react-query';
import { toast } from 'sonner';
import DialogDelete from '../dialog/dialog-delete';

export default function JobManagementPage() {
  // hooks
  const queryClient = useQueryClient();
  const t = useI18n();

  // search params
  const searchParams = useSearchParams();
  const search = searchParams.get('search') as string;
  const page = Number(searchParams.get('page')) || 1;
  const size = Number(searchParams.get('size')) || 10;

  // fetch
  const { data: jobs, isLoading: loadingJobs } = useGetJobs({
    search,
    page: (page - 1).toString(),
    size: size.toString(),
    order: 'desc',
    sort: 'createdAt',
  });

  // store
  const { jobId, isOpen, toggle, setJobId } = useDialogDeleteJobStore();

  // delete mutation
  const { mutate: deleteJob, isLoading: loadingDelete } = useDeleteJob({
    onSuccess: (resp) => {
      if (resp.code === HTTP_STATUS.SUCCESS) {
        toast.success('Success to delete job');
        queryClient.invalidateQueries({ queryKey: ['jobs'] });
        toggle();
        setJobId(undefined);
      } else {
        toast.error('Failed to delete job', {
          description: resp.message,
        });
        toggle();
      }
    },
  });

  const handleDelete = () => {
    if (jobId) {
      deleteJob(jobId);
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
          <Link href="/job-management/create-job">
            <Briefcase size={16} />
            {t('job.createJob')}
          </Link>
        </Button>
        <BaseSearch className=" hidden lg:block" />
      </div>
      <BaseSearch className=" mt-2 block lg:hidden" />
      {/* begin: filter, search and action */}

      {/* begin: list job */}
      <div className="mt-6 flex flex-col gap-6">
        {loadingJobs ? (
          [...Array(2)].map((_, i) => (
            <div
              key={i}
              className=" flex w-full items-center justify-between rounded-lg border px-4 py-6"
            >
              <div className="flex flex-col gap-6">
                <Skeleton className=" h-6 w-36" />
                <Skeleton className=" h-5 w-48" />
                <Skeleton className=" h-8 w-20" />
              </div>
              <div className="flex items-center gap-10">
                {[...Array(3)].map((_, j) => (
                  <div
                    key={j}
                    className="flex flex-col items-center gap-2"
                  >
                    <Skeleton className=" h-12 w-24" />
                    <Skeleton className=" h-5 w-16" />
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-2">
                <Skeleton className=" h-10 w-28" />
                <Skeleton className=" h-10 w-28" />
              </div>
            </div>
          ))
        ) : jobs && jobs.totalCount > 0 ? (
          <>
            {jobs.content.map((job) => (
              <JobItem
                key={job.id}
                job={job}
              />
            ))}
            <BasePagination totalCount={jobs.totalCount} />
          </>
        ) : (
          <EmptyState />
        )}
      </div>
      {/* end: list job */}

      <DialogDelete
        open={isOpen}
        onOpenChange={toggle}
        onDelete={handleDelete}
        isLoading={loadingDelete}
      />
    </>
  );
}
