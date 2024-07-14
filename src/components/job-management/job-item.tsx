'use client';

import { useGetApplicantsByJobId } from '@/api/job.api';
import { useI18n } from '@/locales/client';
import useDialogDeleteJobStore from '@/store/job-management/dialog-delete-job.store';
import { TJob } from '@/types/job.type';
import { textTruncate } from '@/utils/common.util';
import { getLang } from '@/utils/locale.util';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';

type TJobItemProps = {
  job: TJob;
};

export default function JobItem({ job }: TJobItemProps) {
  // hooks
  const params = useParams();
  const t = useI18n();

  // store
  const { toggle, setJobId } = useDialogDeleteJobStore();

  const { data: jobDetail, isLoading } = useGetApplicantsByJobId(job.id);

  return (
    <div className=" flex w-full flex-col items-start justify-between gap-6 rounded-lg border px-4 py-6 lg:flex-row lg:items-center">
      <div className="flex flex-col items-start gap-4">
        <h1 className=" text-2xl font-medium text-neutral-800">
          {textTruncate(getLang(params, job.title), 25)}
        </h1>
        <p className=" text-neutral-500">
          {textTruncate(getLang(params, job.jobLocation), 25)}
        </p>
        <Badge variant="blue">{getLang(params, job.jobType)}</Badge>
      </div>

      <div className="flex w-full flex-col items-center gap-6 lg:w-fit lg:flex-row lg:gap-40">
        <div className="flex flex-col items-center gap-10 self-center md:flex-row">
          {isLoading ? (
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
          ) : (
            jobDetail && (
              <>
                <div className="flex flex-col items-center gap-2">
                  <div className=" flex h-12 w-24 items-center justify-center rounded-lg bg-blue-400">
                    <h1 className=" text-2xl font-medium text-white">
                      {
                        jobDetail.filter(
                          (applicant) =>
                            !['approved', 'rejected'].includes(
                              applicant.status,
                            ),
                        ).length
                      }
                    </h1>
                  </div>
                  <p className=" text-neutral-500">{t('common.processed')}</p>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className=" flex h-12 w-24 items-center justify-center rounded-lg bg-yellow-500">
                    <h1 className=" text-2xl font-medium text-white">
                      {
                        jobDetail.filter(
                          (applicant) => applicant.status === 'rejected',
                        ).length
                      }
                    </h1>
                  </div>
                  <p className=" text-neutral-500">{t('common.rejected')}</p>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className=" flex h-12 w-24 items-center justify-center rounded-lg bg-green-400">
                    <h1 className=" text-2xl font-medium text-white">
                      {
                        jobDetail.filter(
                          (applicant) => applicant.status === 'approved',
                        ).length
                      }
                    </h1>
                  </div>
                  <p className=" text-neutral-500">{t('common.approved')}</p>
                </div>
              </>
            )
          )}
        </div>

        <div className="flex flex-row-reverse items-stretch justify-end gap-2 self-end lg:flex-col">
          <Button
            variant="destructive"
            asChild
          >
            <Link href={`/job-management/${job.id}`}>
              {t('common.viewDetail')}
            </Link>
          </Button>
          <Button
            variant="ghost-primary"
            asChild
          >
            <Link href={`/job-management/${job.id}/edit-job`}>
              {t('common.edit')}
            </Link>
          </Button>
          <Button
            variant="ghost-primary"
            onClick={() => {
              setJobId(job.id);
              toggle();
            }}
          >
            {t('common.delete')}
          </Button>
        </div>
      </div>
    </div>
  );
}
