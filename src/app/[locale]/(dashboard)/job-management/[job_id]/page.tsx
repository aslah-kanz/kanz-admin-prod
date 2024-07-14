'use client';

import { useGetApplicantsByJobId, useGetJobById } from '@/api/job.api';
import BaseSkeleton from '@/components/common/base-skeleton';
import Candidates from '@/components/job-management/candidates';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import useLangClient from '@/hooks/use-lang-client';
import { cn } from '@/lib/utils';
import { useI18n } from '@/locales/client';
import { TDefaultPageParams, TDefaultParams } from '@/types/common.type';
import { getLang } from '@/utils/locale.util';
import Link from 'next/link';
import { FaChevronRight } from 'react-icons/fa6';

type TJobDetailPageParams = TDefaultPageParams & {
  params: TDefaultParams & {
    job_id: number;
  };
};

export default function JobDetailPage({ params }: TJobDetailPageParams) {
  // hooks
  const t = useI18n();
  const { isAr } = useLangClient();

  // fetch
  const { data: job, isLoading } = useGetJobById(params.job_id);
  const { data: applicants, isLoading: loadingGetApplicants } =
    useGetApplicantsByJobId(params.job_id);

  return (
    <div className=" w-full p-6">
      {/* begin: card */}
      <div className=" w-full rounded-lg border p-5">
        {/* begin: breadcrumb */}
        <div className="flex items-center gap-2 text-[13px] text-neutral-500">
          <p>{t('sidebar.menu.jobManagement')}</p>
          <FaChevronRight
            size={12}
            className={cn({ 'rotate-180': isAr })}
          />
          <p className=" text-primary">{t('common.viewDetail')}</p>
        </div>
        {/* end: breadcrumb */}

        {isLoading ? (
          <div className=" mt-6 flex flex-col gap-6">
            <BaseSkeleton />
            <BaseSkeleton />
            <BaseSkeleton />
            <BaseSkeleton />
          </div>
        ) : (
          job && (
            <div className="mt-6 flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <Label>{t('common.title')}</Label>
                <p className=" font-medium text-neutral-500">
                  {getLang(params, job.title)}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <Label>{t('job.responsibility')}</Label>
                <div
                  className="font-medium text-neutral-500"
                  dangerouslySetInnerHTML={{
                    __html: getLang(params, job.responsibility),
                  }}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>{t('job.experience')}</Label>
                <p className=" font-medium text-neutral-500">
                  {getLang(params, job.experience)}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <Label>{t('job.requirement')}</Label>
                <p className=" font-medium text-neutral-500">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: job.requirement,
                    }}
                  />
                </p>
              </div>
            </div>
          )
        )}

        <hr className=" my-6" />

        <Candidates
          applicants={applicants}
          isLoading={loadingGetApplicants}
        />
      </div>
      {/* end: card */}
      <div className=" mt-6 flex gap-4">
        <Button
          variant="ghost-primary"
          asChild
        >
          <Link href="/job-management">{t('common.back')}</Link>
        </Button>
      </div>
    </div>
  );
}
