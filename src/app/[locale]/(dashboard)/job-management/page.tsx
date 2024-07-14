'use client';

import TabJob from '@/components/job-management/tab-job';
import TabJobField from '@/components/job-management/tab-job-field';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import useLangClient from '@/hooks/use-lang-client';
import { useI18n } from '@/locales/client';
import { TDefaultPageParams } from '@/types/common.type';
import Link from 'next/link';

export default function JobManagementPage({
  searchParams,
}: TDefaultPageParams) {
  const type = searchParams.type || 'job';
  const t = useI18n();
  const { isAr } = useLangClient();
  return (
    <div className=" w-full p-6">
      <div className=" w-full rounded-lg border p-5">
        <Tabs
          defaultValue={type}
          className=""
          dir={isAr ? 'rtl' : 'ltr'}
        >
          <TabsList className=" gap-8 bg-transparent">
            <TabsTrigger
              value="job"
              className=" h-10 w-full max-w-[300px] rounded-none border-b-2 border-transparent px-0 text-base data-[state=active]:border-primary"
              asChild
            >
              <Link href="/job-management?type=job">{t('job.job')}</Link>
            </TabsTrigger>
            <TabsTrigger
              value="job-field"
              className=" h-10 w-full max-w-[300px] rounded-none border-b-2 border-transparent px-0 text-base data-[state=active]:border-primary"
              asChild
            >
              <Link href="/job-management?type=job-field">
                {t('job.jobField')}
              </Link>
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="job"
            className=" mt-6"
          >
            <TabJob />
          </TabsContent>
          <TabsContent
            value="job-field"
            className=" mt-6"
          >
            <TabJobField />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
