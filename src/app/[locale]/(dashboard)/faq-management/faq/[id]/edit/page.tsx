'use client';

import { useEditFaq, useGetFaqById, useGetFaqGroups } from '@/api/faq.api';
import BaseFormError from '@/components/common/base-form-error';
import Editor from '@/components/common/editor';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { HTTP_STATUS } from '@/constants/common.constant';
import useLangClient from '@/hooks/use-lang-client';
import { cn } from '@/lib/utils';
import { useI18n } from '@/locales/client';
import { STATUS, TDefaultParams } from '@/types/common.type';
import { slugToOriginal } from '@/utils/common.util';
import { getLang } from '@/utils/locale.util';
import { TFaqSchema, faqSchema } from '@/validations/faq.validation';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { FaChevronRight } from 'react-icons/fa6';
import { LuLoader2 } from 'react-icons/lu';
import { useQueryClient } from 'react-query';
import Select2 from 'react-select';
import { toast } from 'sonner';

type TEditFaqPageParams = {
  params: TDefaultParams & {
    id: number;
  };
};

export default function EditFaqPage({ params }: TEditFaqPageParams) {
  // hooks
  const queryClient = useQueryClient();
  const router = useRouter();
  const t = useI18n();
  const { isAr } = useLangClient();

  const form = useForm<TFaqSchema>({
    resolver: yupResolver(faqSchema),
    defaultValues: {
      question: {
        en: '',
        ar: '',
      },
      answer: {
        en: '',
        ar: '',
      },
      status: STATUS.draft,
    },
  });

  const { data: faqGroups, isLoading: loadingGets } = useGetFaqGroups();
  const { data: faq, isLoading: loadingGet } = useGetFaqById(params.id);

  const { mutate, isLoading } = useEditFaq({
    onSuccess: (resp) => {
      if (resp.code === HTTP_STATUS.SUCCESS) {
        toast.success('success to edit faq');
        queryClient.invalidateQueries({ queryKey: ['faqs'] });
        router.replace('/faq-management');
      } else {
        toast.error('failed to edit faq', { description: resp.message });
      }
    },
  });

  const actualSubmit: SubmitHandler<TFaqSchema> = useCallback(
    (values) => {
      mutate({ id: params.id, payload: values });
    },
    [mutate, params],
  );

  useEffect(() => {
    if (faq) {
      form.setValue('answer', faq.answer);
      form.setValue('question', faq.question);
      form.setValue('status', faq.status);
      form.setValue('faqGroupId', faq.faqGroupId);
    }
  }, [faq, form]);

  const optionsFaqGroups = faqGroups?.content?.map((item) => ({
    value: item.id,
    label: getLang(params, item.title),
  }));

  const statusOptions = Object.values(STATUS).map((item) => ({
    value: item,
    label: slugToOriginal(item),
  }));

  if (loadingGet || loadingGets) {
    return (
      <div className=" w-full p-6">
        <div className=" w-full rounded-lg border p-5">
          <Skeleton className=" h-5 w-40" />

          <div className=" mt-6 flex flex-col gap-6">
            <div className=" space-y-2">
              <Skeleton className=" h-6 w-24" />
              <Skeleton className=" h-10 w-full" />
            </div>
            <div className=" space-y-2">
              <Skeleton className=" h-6 w-24" />
              <Skeleton className=" h-40 w-full" />
            </div>
            <div className=" space-y-2">
              <Skeleton className=" h-6 w-24" />
            </div>
            <div className=" space-y-2">
              <Skeleton className=" h-6 w-24" />
              <Skeleton className=" h-10 w-48" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className=" w-full p-6">
      <div className=" w-full rounded-lg border p-5">
        {/* begin: breadcrumb */}
        <div className="flex items-center gap-2 text-[13px] text-neutral-500">
          <p>{t('sidebar.menu.faqManagement')}</p>
          <FaChevronRight
            size={12}
            className={cn({ 'rotate-180': isAr })}
          />
          <p className=" text-primary">{t('faq.editFaq')}</p>
        </div>
        {/* end: breadcrumb */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(actualSubmit)}>
            <div className="mt-6 flex flex-col gap-6">
              <FormField
                control={form.control}
                name="faqGroupId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('faq.faqGroupId')}</FormLabel>
                    <Select2
                      options={optionsFaqGroups}
                      value={optionsFaqGroups?.filter(
                        (item) => item.value === field.value,
                      )}
                      onChange={(value) => field.onChange(value?.value)}
                      placeholder={t('faq.faqGroupId')}
                    />
                    <BaseFormError />
                  </FormItem>
                )}
              />
              <FormField
                name="question.en"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('common.question')} en</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={`${t('common.question')} en`}
                        {...field}
                      />
                    </FormControl>
                    <BaseFormError />
                  </FormItem>
                )}
              />
              <FormField
                name="question.ar"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('common.question')} ar</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={`${t('common.question')} ar`}
                        {...field}
                        dir="rtl"
                      />
                    </FormControl>
                    <BaseFormError />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="answer.en"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('common.answer')} en</FormLabel>
                    <Editor
                      value={faq?.answer.en}
                      setValue={field.onChange}
                    />
                    <BaseFormError />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="answer.ar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('common.answer')} ar</FormLabel>
                    <Editor
                      value={faq?.answer.ar}
                      setValue={field.onChange}
                      isAr
                    />
                    <BaseFormError />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className=" text-sm">
                      {t('common.status')}
                    </FormLabel>
                    <Select2
                      options={statusOptions}
                      className=" text-sm"
                      onChange={(value) => {
                        form.setValue('status', String(value?.value));
                      }}
                      value={statusOptions?.filter(
                        (v) => v.value === field.value,
                      )}
                    />
                    <BaseFormError />
                  </FormItem>
                )}
              />
            </div>

            <div className="mt-6 flex justify-end">
              <Button
                type="submit"
                disabled={isLoading}
              >
                {isLoading && (
                  <LuLoader2
                    className=" animate-spin text-white"
                    size={16}
                  />
                )}
                {t('common.saveChanges')}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
