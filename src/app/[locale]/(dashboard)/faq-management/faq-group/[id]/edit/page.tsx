'use client';

import { useEditFaqGroup, useGetFaqGroupById } from '@/api/faq.api';
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
import { Switch } from '@/components/ui/switch';
import { HTTP_STATUS } from '@/constants/common.constant';
import useLangClient from '@/hooks/use-lang-client';
import { cn } from '@/lib/utils';
import { useI18n } from '@/locales/client';
import { STATUS, TDefaultParams } from '@/types/common.type';
import { TFaqGroupSchema, faqGroupSchema } from '@/validations/faq.validation';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { FaChevronRight } from 'react-icons/fa6';
import { LuLoader2 } from 'react-icons/lu';
import { useQueryClient } from 'react-query';
import Select2 from 'react-select';
import { toast } from 'sonner';

type TEditFaqGroupPageParams = {
  params: TDefaultParams & {
    id: number;
  };
};

export default function EditFaqGroupPage({ params }: TEditFaqGroupPageParams) {
  // hooks
  const queryClient = useQueryClient();
  const router = useRouter();
  const t = useI18n();
  const { isAr } = useLangClient();

  const form = useForm<TFaqGroupSchema>({
    resolver: yupResolver(faqGroupSchema),
    defaultValues: {
      title: {
        en: '',
        ar: '',
      },
      description: {
        en: '',
        ar: '',
      },
      status: STATUS.draft,
      showAtHomePage: false,
    },
  });

  const { data: faqGroup, isLoading: loadingGet } = useGetFaqGroupById(
    params.id,
  );

  const { mutate, isLoading } = useEditFaqGroup({
    onSuccess: (resp) => {
      if (resp.code === HTTP_STATUS.SUCCESS) {
        toast.success('success to edit faq group');
        queryClient.invalidateQueries({ queryKey: ['faq-groups'] });
        router.replace('/faq-management?type=faq-group');
      } else {
        toast.error('failed to edit faq group', { description: resp.message });
      }
    },
  });

  const actualSubmit: SubmitHandler<TFaqGroupSchema> = useCallback(
    (values) => {
      mutate({ id: params.id, payload: values });
    },
    [mutate, params],
  );

  useEffect(() => {
    if (faqGroup) {
      form.setValue('title', faqGroup.title);
      form.setValue('description', faqGroup.description);
      form.setValue('showAtHomePage', faqGroup.showAtHomePage);
      form.setValue('status', faqGroup.status);
    }
  }, [faqGroup, form]);

  const statusOptions = [
    {
      value: 'draft',
      label: 'Draft',
    },
    {
      value: 'published',
      label: 'Published',
    },
  ];

  if (loadingGet) {
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
          <p className=" text-primary">{t('faq.editFaqGroup')}</p>
        </div>
        {/* end: breadcrumb */}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(actualSubmit)}>
            <div className="mt-6 flex flex-col gap-6">
              <FormField
                name="title.en"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('common.title')} en</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={`${t('common.title')} en`}
                        {...field}
                      />
                    </FormControl>
                    <BaseFormError />
                  </FormItem>
                )}
              />
              <FormField
                name="title.ar"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('common.title')} ar</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={`${t('common.title')} ar`}
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
                name="description.en"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('common.description')} en</FormLabel>
                    <Editor
                      value={faqGroup?.description.en}
                      setValue={field.onChange}
                    />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description.ar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('common.description')} ar</FormLabel>
                    <Editor
                      value={faqGroup?.description.ar}
                      setValue={field.onChange}
                      isAr
                    />
                    <BaseFormError />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="showAtHomePage"
                render={({ field }) => (
                  <div className="flex items-center gap-2">
                    <FormLabel>{t('common.showAtHomePage')}</FormLabel>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </div>
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
