'use client';

import { useEditJob, useGetJobById, useGetJobFields } from '@/api/job.api';
import BaseFormError from '@/components/common/base-form-error';
import BaseSkeleton from '@/components/common/base-skeleton';
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
import { TDefaultParams } from '@/types/common.type';
import { TJobSchema, jobSchema } from '@/validations/job.validation';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { FaChevronRight } from 'react-icons/fa6';
import { LuLoader2 } from 'react-icons/lu';
import { useQueryClient } from 'react-query';
import Select2 from 'react-select';
import { toast } from 'sonner';

type TEditJobPageParams = {
  params: TDefaultParams & {
    job_id: number;
  };
};

export default function EditJobPage({ params }: TEditJobPageParams) {
  // hooks
  const queryClient = useQueryClient();
  const router = useRouter();

  // fetch job fields
  const { data: jobFields } = useGetJobFields();
  const { data: job, isLoading: loadingGetJob } = useGetJobById(params.job_id);

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
      status: '',
    },
  });

  const { mutate, isLoading: loadingEditJob } = useEditJob({
    onSuccess: (resp) => {
      if (resp.code === HTTP_STATUS.SUCCESS) {
        toast.success('success to edit job');
        queryClient.invalidateQueries({ queryKey: ['jobs'] });
        router.replace('/job-management');
      }
    },
  });

  const actualSubmit: SubmitHandler<TJobSchema> = useCallback(
    (values) => {
      mutate({ id: params.job_id, payload: values });
    },
    [mutate, params],
  );

  useEffect(() => {
    form.setValue('jobFieldId', job?.jobField.id ?? 0);
  }, [form, job]);

  const optionsJobFields = jobFields?.map((jobField) => ({
    value: jobField.id,
    label: jobField.name.en,
  }));

  useEffect(() => {
    if (job) {
      form.setValue('title', job.title);
      form.setValue('responsibility', job.responsibility);
      form.setValue('jobType', job.jobType);
      form.setValue('jobLocation', job.jobLocation);
      form.setValue('experience', job.experience);
      form.setValue('slug', job.slug);
      form.setValue('requirement', job.requirement);
      form.setValue('jobFieldId', job.jobField.id);
      form.setValue('metaDescription', job.metaDescription);
      form.setValue('metaKeyword', job.metaKeyword);
      form.setValue('status', job.status);
    }
  }, [job, form]);

  return (
    <div className=" w-full p-6">
      <div className=" w-full rounded-lg border p-5 ">
        {/* begin: breadcrumb */}
        <div className="flex items-center gap-2 text-[13px] text-neutral-500">
          <p>Job Management</p>
          <FaChevronRight size={12} />
          <p className=" text-primary">Edit Job</p>
        </div>
        {/* end: breadcrumb */}

        {loadingGetJob ? (
          <div className=" mt-6 flex flex-col gap-6">
            <BaseSkeleton />
            <BaseSkeleton />
            <BaseSkeleton />
            <BaseSkeleton variant="editor" />
            <BaseSkeleton variant="editor" />
            <BaseSkeleton variant="editor" />
            <BaseSkeleton variant="editor" />
            <BaseSkeleton />
            <BaseSkeleton />
            <BaseSkeleton />
            <BaseSkeleton />
            <BaseSkeleton />
            <BaseSkeleton />
            <BaseSkeleton />
            <BaseSkeleton variant="textarea" />
            <BaseSkeleton />
          </div>
        ) : (
          job &&
          jobFields && (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(actualSubmit)}>
                <div className="mt-6 flex flex-col gap-6">
                  <FormField
                    name="title.en"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title en</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Input Name"
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
                        <FormLabel>Title ar</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Input Title ar"
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
                        <FormLabel>Slug</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Input Slug"
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
                        <FormLabel>Responsibility en</FormLabel>
                        <Editor
                          value={job?.responsibility.en}
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
                        <FormLabel>Responsibility ar</FormLabel>
                        <Editor
                          value={job?.responsibility.ar}
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
                        <FormLabel>Requirement</FormLabel>
                        <Editor
                          value={job?.requirement}
                          setValue={(value) =>
                            form.setValue('requirement', value)
                          }
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
                        <FormLabel>Job Type en</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Input Job Type"
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
                        <FormLabel>Job Type ar</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Input Job Type ar"
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
                        <FormLabel>Experience en</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Input Experience"
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
                        <FormLabel>Experience ar</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Input Experience ar"
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
                        <FormLabel>Job Location en</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Input Job Location"
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
                        <FormLabel>Job Location ar</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Input Job Location ar"
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
                        <FormLabel>Job Field</FormLabel>
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
                        <FormLabel>Meta Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Input Meta Description"
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
                        <FormLabel>Meta Keyword</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Input Meta Keyword"
                            {...field}
                          />
                        </FormControl>
                        <BaseFormError />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="mt-6 flex justify-end">
                  <Button type="submit">
                    {' '}
                    {loadingEditJob ? (
                      <LuLoader2
                        className=" animate-spin text-white"
                        size={16}
                      />
                    ) : (
                      'Save Change'
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          )
        )}
      </div>
    </div>
  );
}
