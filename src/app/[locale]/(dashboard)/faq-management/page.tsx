'use client';

import TabFaq from '@/components/faq-management/tab-faq';
import TabFaqGroup from '@/components/faq-management/tab-faq-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import useLangClient from '@/hooks/use-lang-client';
import { useI18n } from '@/locales/client';
import { TDefaultPageParams } from '@/types/common.type';
import Link from 'next/link';

export default function FaqManagementPage({
  searchParams,
}: TDefaultPageParams) {
  const type = searchParams.type || 'faq';
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
              value="faq"
              className=" h-10 w-full max-w-[300px] rounded-none border-b-2 border-transparent px-0 text-base data-[state=active]:border-primary"
              asChild
            >
              <Link href="/faq-management?type=faq">{t('faq.faq')}</Link>
            </TabsTrigger>
            <TabsTrigger
              value="faq-group"
              className=" h-10 w-full max-w-[300px] rounded-none border-b-2 border-transparent px-0 text-base data-[state=active]:border-primary"
              asChild
            >
              <Link href="/faq-management?type=faq-group">
                {t('faq.faqGroup')}
              </Link>
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="faq"
            className=" mt-6"
          >
            <TabFaq />
          </TabsContent>
          <TabsContent
            value="faq-group"
            className=" mt-6"
          >
            <TabFaqGroup />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
