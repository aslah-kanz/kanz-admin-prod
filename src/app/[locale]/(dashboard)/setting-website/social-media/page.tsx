'use client';

import {
  useAddWebPage,
  useEditWebPage,
  useGetWebPageBySlug,
} from '@/api/web-page.api';
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
import { HTTP_STATUS, SOCIAL_MEDIA_INDEX } from '@/constants/common.constant';
import { STATUS } from '@/types/common.type';
import { TWebPageRequest } from '@/types/web-page.type';
import { useCallback, useEffect, useMemo } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { LuLoader2 } from 'react-icons/lu';
import { useQueryClient } from 'react-query';
import { toast } from 'sonner';
import * as yup from 'yup';

const schema = yup.object().shape({
  contents: yup
    .array()
    .of(
      yup.object().shape({
        en: yup.string().required(),
        ar: yup.string(),
      }),
    )
    .required()
    .min(1),
});

type TSchema = yup.InferType<typeof schema>;

export default function WebsiteProfilePage() {
  // hooks
  const queryClient = useQueryClient();

  // fetch
  const { data, isLoading: loadingGet } = useGetWebPageBySlug('social-media');

  const isNotFound = useMemo(
    () => data?.code === HTTP_STATUS.NOT_FOUND,
    [data],
  );

  // form
  const form = useForm<TSchema>({
    defaultValues: {
      contents: Object.keys(SOCIAL_MEDIA_INDEX).map((_) => ({
        en: '',
        ar: '',
      })),
    },
  });

  // add mutation
  const { mutate: addMutation, isLoading: loadingAdd } = useAddWebPage({
    onSuccess: (resp) => {
      if (resp.code === HTTP_STATUS.SUCCESS) {
        toast.success('success to add social media');
        queryClient.invalidateQueries({
          queryKey: ['web-pages', { slug: 'social-media' }],
        });
      } else {
        toast.error('failed to add social media', {
          description: resp.message,
        });
      }
    },
  });

  // edit mutation
  const { mutate: editMutation, isLoading: loadingEdit } = useEditWebPage({
    onSuccess: (resp) => {
      if (resp.code === HTTP_STATUS.SUCCESS) {
        toast.success('success to edit social media');
        queryClient.invalidateQueries({
          queryKey: ['web-pages', { slug: 'social-media' }],
        });
      } else {
        toast.error('failed to edit social media', {
          description: resp.message,
        });
      }
    },
  });

  // actual submit add
  const actualSubmit: SubmitHandler<TSchema> = useCallback(
    (values) => {
      const payload: TWebPageRequest = {
        imageId: null,
        contents: values.contents,
        metaDescription: '',
        metaKeyword: '',
        showAtHomePage: false,
        slug: 'social-media',
        status: STATUS.draft,
        title: {
          en: 'Social Media',
          ar: 'Social Media',
        },
      };
      if (isNotFound) {
        addMutation(payload);
      } else if (data) editMutation({ id: data.data.id, payload });
    },
    [addMutation, isNotFound, data, editMutation],
  );

  useEffect(() => {
    if (data) {
      if (data.code === HTTP_STATUS.SUCCESS) {
        form.setValue('contents', data.data.contents);
      }
    }
  }, [form, data]);
  return (
    <div className=" h-full w-full">
      {loadingGet ? (
        <div className="flex w-full flex-col gap-6 rounded-b-lg border border-t-0 p-4 ">
          <div className=" grid grid-cols-2 gap-6">
            <div className=" space-y-3">
              <Skeleton className=" h-5 w-24" />
              <Skeleton className=" h-10 w-full" />
            </div>
            <div className=" space-y-3">
              <Skeleton className=" h-5 w-24" />
              <Skeleton className=" h-10 w-full" />
            </div>
            <div className=" space-y-3">
              <Skeleton className=" h-5 w-24" />
              <Skeleton className=" h-10 w-full" />
            </div>
            <div className=" space-y-3">
              <Skeleton className=" h-5 w-24" />
              <Skeleton className=" h-10 w-full" />
            </div>
          </div>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(actualSubmit)}>
            <div className=" w-full rounded-b-lg border border-t-0 p-4">
              <div className="grid grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name={`contents.${SOCIAL_MEDIA_INDEX.INSTAGRAM}.en`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instagram</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Input Instagram"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`contents.${SOCIAL_MEDIA_INDEX.FACEBOOK}.en`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Facebook</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Input Facebook"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`contents.${SOCIAL_MEDIA_INDEX.TWITTER}.en`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Twitter</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Input Twitter"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`contents.${SOCIAL_MEDIA_INDEX.LINKEDIN}.en`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>LinkedIn</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Input LinkedIn"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-4">
              <Button variant="ghost-primary">Preview</Button>
              <Button
                type="submit"
                disabled={loadingAdd || loadingEdit}
              >
                {loadingAdd || loadingEdit ? (
                  <LuLoader2
                    className=" animate-spin text-white"
                    size={16}
                  />
                ) : (
                  'Save change'
                )}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}
