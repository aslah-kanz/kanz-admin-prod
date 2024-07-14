'use client';

import { useAddFaqGroup } from '@/api/faq.api';
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
import { Switch } from '@/components/ui/switch';
import { HTTP_STATUS } from '@/constants/common.constant';
import useLangClient from '@/hooks/use-lang-client';
import { cn } from '@/lib/utils';
import { useI18n } from '@/locales/client';
import { STATUS } from '@/types/common.type';
import { TFaqGroupSchema, faqGroupSchema } from '@/validations/faq.validation';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { FaChevronRight } from 'react-icons/fa6';
import { LuLoader2 } from 'react-icons/lu';
import { useQueryClient } from 'react-query';
import { toast } from 'sonner';

export default function CreateFaqGroupPage() {
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

  const { mutate, isLoading } = useAddFaqGroup({
    onSuccess: (resp) => {
      if (resp.code === HTTP_STATUS.SUCCESS) {
        toast.success('Success to add faq group');
        queryClient.invalidateQueries({ queryKey: ['faq-groups'] });
        router.replace('/faq-management?type=faq-group');
      } else {
        toast.error('Failed to add faq group', { description: resp.message });
      }
    },
  });

  const actualSubmit: SubmitHandler<TFaqGroupSchema> = useCallback(
    (values) => {
      mutate(values);
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
          <p className=" text-primary">{t('faq.createFaqGroup')}</p>
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
                        placeholder={`${t('common.title')} en`}
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
                render={() => (
                  <FormItem>
                    <FormLabel>{t('common.description')} en</FormLabel>
                    <Editor
                      setValue={(value) =>
                        form.setValue('description.en', value)
                      }
                    />
                    <BaseFormError />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description.ar"
                render={() => (
                  <FormItem>
                    <FormLabel>{t('common.description')} ar</FormLabel>
                    <Editor
                      setValue={(value) =>
                        form.setValue('description.ar', value)
                      }
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
