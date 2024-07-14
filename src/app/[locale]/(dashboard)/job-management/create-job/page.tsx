'use client';

import { useAddJob, useGetJobFields } from '@/api/job.api';
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
import { Textarea } from '@/components/ui/textarea';
import { HTTP_STATUS } from '@/constants/common.constant';
import useLangClient from '@/hooks/use-lang-client';
import { cn } from '@/lib/utils';
import { useI18n } from '@/locales/client';
import { TJobSchema, jobSchema } from '@/validations/job.validation';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { FaChevronRight } from 'react-icons/fa6';
import { LuLoader2 } from 'react-icons/lu';
import { useQueryClient } from 'react-query';
import Select2 from 'react-select';
import { toast } from 'sonner';

export default function CreateJobPage() {
  // hooks
  const queryClient = useQueryClient();
  const router = useRouter();
  const t = useI18n();
  const { isAr } = useLangClient();

  // fetch job fields
  const { data: jobFields } = useGetJobFields();

  const form = useForm<TJobSchema>({
    resolver: yupResolver(jobSchema),
    defaultValues: {
      title: {
        en: '',
        ar: '',
      },
      responsibility: {
        en: '',
        ar: '',
      },
      jobType: {
        en: '',
        ar: '',
      },
      jobLocation: {
        en: '',
        ar: '',
      },
      experience: {
        en: '',
        ar: '',
      },
      slug: '',
      requirement: '',
      metaDescription: '',
      metaKeyword: '',
      status: 'draft',
      jobFieldId: undefined,
    },
  });

  const { mutate, isLoading } = useAddJob({
    onSuccess: (resp) => {
      if (resp.code === HTTP_STATUS.SUCCESS) {
        toast.success('Success to add job');
        queryClient.invalidateQueries({ queryKey: ['jobs'] });
        router.replace('/job-management');
      } else {
        toast.error('Failed to add job', { description: resp.message });
      }
    },
  });

  const actualSubmit: SubmitHandler<TJobSchema> = useCallback(
    (values) => {
      mutate({ ...values, status: 'draft' });
    },
    [mutate],
  );

  const optionsJobFields = jobFields?.map((jobField) => ({
    value: jobField.id,
    label: jobField.name.en,
  }));

  return (
    <div className=" w-full p-6">
      <div className=" w-full rounded-lg border p-5">
        {/* begin: breadcrumb */}
        <div className="flex items-center gap-2 text-[13px] text-neutral-500">
          <p>{t('sidebar.menu.jobManagement')}</p>
          <FaChevronRight
            size={12}
            className={cn({ 'rotate-180': isAr })}
          />
          <p className=" text-primary">{t('job.createJob')}</p>
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
                name="slug"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('common.slug')}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('common.slug')}
                        {...field}
                      />
                    </FormControl>
                    <BaseFormError />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="responsibility.en"
                render={() => (
                  <FormItem>
                    <FormLabel>{t('job.responsibility')} en</FormLabel>
                    <Editor
                      setValue={(value) =>
                        form.setValue('responsibility.en', value)
                      }
                    />
                    <BaseFormError />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="responsibility.ar"
                render={() => (
                  <FormItem>
                    <FormLabel>{t('job.responsibility')} ar</FormLabel>
                    <Editor
                      setValue={(value) =>
                        form.setValue('responsibility.ar', value)
                      }
                      isAr
                    />
                    <BaseFormError />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="requirement"
                render={() => (
                  <FormItem>
                    <FormLabel>{t('job.requirement')}</FormLabel>
                    <Editor
                      setValue={(value) => form.setValue('requirement', value)}
                    />
                    <BaseFormError />
                  </FormItem>
                )}
              />
              <FormField
                name="jobType.en"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('job.jobType')} en</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={`${t('job.jobType')} en`}
                        {...field}
                      />
                    </FormControl>
                    <BaseFormError />
                  </FormItem>
                )}
              />
              <FormField
                name="jobType.ar"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('job.jobType')} ar</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={`${t('job.jobType')} ar`}
                        {...field}
                        dir="rtl"
                      />
                    </FormControl>
                    <BaseFormError />
                  </FormItem>
                )}
              />
              <FormField
                name="experience.en"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('job.experience')} en</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={`${t('job.experience')} en`}
                        {...field}
                      />
                    </FormControl>
                    <BaseFormError />
                  </FormItem>
                )}
              />
              <FormField
                name="experience.ar"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('job.experience')} ar</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={`${t('job.experience')} ar`}
                        {...field}
                        dir="rtl"
                      />
                    </FormControl>
                    <BaseFormError />
                  </FormItem>
                )}
              />
              <FormField
                name="jobLocation.en"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('job.jobLocation')} en</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={`${t('job.jobLocation')} en`}
                        {...field}
                      />
                    </FormControl>
                    <BaseFormError />
                  </FormItem>
                )}
              />
              <FormField
                name="jobLocation.ar"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('job.jobLocation')} ar</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={`${t('job.jobLocation')} ar`}
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
                name="jobFieldId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Field {field.value}</FormLabel>
                    <Select2
                      options={optionsJobFields}
                      value={optionsJobFields?.filter(
                        (item) => item.value === field.value,
                      )}
                      onChange={(value) => field.onChange(value?.value)}
                    />
                    <BaseFormError />
                  </FormItem>
                )}
              />
              <FormField
                name="metaDescription"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('common.metaDescription')}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t('common.metaDescription')}
                        {...field}
                      />
                    </FormControl>
                    <BaseFormError />
                  </FormItem>
                )}
              />
              <FormField
                name="metaKeyword"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('common.metaKeyword')}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('common.metaKeyword')}
                        {...field}
                      />
                    </FormControl>
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
                {' '}
                {isLoading ? (
                  <>
                    <LuLoader2
                      className=" animate-spin text-white"
                      size={16}
                    />
                    Please wait
                  </>
                ) : (
                  'Create Job'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
