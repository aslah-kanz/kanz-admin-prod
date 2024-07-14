'use client';

import { useAddFaq, useGetFaqGroups } from '@/api/faq.api';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { HTTP_STATUS } from '@/constants/common.constant';
import useLangClient from '@/hooks/use-lang-client';
import { cn } from '@/lib/utils';
import { useI18n } from '@/locales/client';
import { STATUS } from '@/types/common.type';
import { getLang } from '@/utils/locale.util';
import { TFaqSchema, faqSchema } from '@/validations/faq.validation';
import { yupResolver } from '@hookform/resolvers/yup';
import { useParams, useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { FaChevronRight } from 'react-icons/fa6';
import { LuLoader2 } from 'react-icons/lu';
import { useQueryClient } from 'react-query';
import { toast } from 'sonner';

export default function CreateFaqPage() {
  // hooks
  const params = useParams();
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

  const { data: faqGroups, isLoading: _loadingGets } = useGetFaqGroups();

  const { mutate, isLoading } = useAddFaq({
    onSuccess: (resp) => {
      if (resp.code === HTTP_STATUS.SUCCESS) {
        toast.success('success to add faq');
        queryClient.invalidateQueries({ queryKey: ['faqs'] });
        router.replace('/faq-management');
      } else {
        toast.error('failed to add faq', { description: resp.message });
      }
    },
  });

  const actualSubmit: SubmitHandler<TFaqSchema> = useCallback(
    (values) => {
      mutate({
        ...values,
        status: values.status as STATUS,
      });
    },
    [mutate],
  );

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
          <p className=" text-primary">{t('faq.createFaq')}</p>
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
                    <Select
                      // value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder={t('faq.faqGroupId')} />
                      </SelectTrigger>
                      <SelectContent>
                        {faqGroups &&
                          faqGroups.content.map((item) => (
                            <SelectItem
                              key={item.id}
                              value={item.id.toString()}
                            >
                              {getLang(params, item.title)}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
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
                render={() => (
                  <FormItem>
                    <FormLabel>{t('common.answer')} en</FormLabel>
                    <Editor
                      setValue={(value) => {
                        form.setValue('answer.en', value);
                        if (value.replace(/(<([^>]+)>)/gi, '').length > 0) {
                          form.clearErrors('answer.en');
                        } else {
                          form.setError('answer.en', {
                            message: 'min2',
                          });
                        }
                      }}
                    />
                    <BaseFormError />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="answer.ar"
                render={() => (
                  <FormItem>
                    <FormLabel>{t('common.answer')} ar</FormLabel>
                    <Editor
                      setValue={(value) => form.setValue('answer.ar', value)}
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
                    <FormLabel>{t('common.status')}</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                      </SelectContent>
                    </Select>
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
                {t('common.create')}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
