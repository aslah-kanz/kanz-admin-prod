'use client';

import {
  useAddWebPage,
  useEditWebPage,
  useGetWebPageBySlug,
} from '@/api/web-page.api';
import BaseDropzone from '@/components/common/base-dropzone';
import BaseFormError from '@/components/common/base-form-error';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import {
  HTTP_STATUS,
  WEBSITE_PROFILE_INDEX,
} from '@/constants/common.constant';
import { useI18n } from '@/locales/client';
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
        en: yup.string().required('required'),
        ar: yup.string(),
      }),
    )
    .required('required')
    .min(1),
  imageId: yup.number(),
  faviconImageId: yup.number(),
});

type TSchema = yup.InferType<typeof schema>;

export default function WebsiteProfilePage() {
  // hooks
  const queryClient = useQueryClient();
  const t = useI18n();

  const form = useForm<TSchema>({
    defaultValues: {
      contents: [
        {
          en: '',
          ar: '',
        },
      ],
    },
  });

  const { data, isLoading: loadingGet } =
    useGetWebPageBySlug('website-profile');

  const isNotFound = useMemo(
    () => data?.code === HTTP_STATUS.NOT_FOUND,
    [data],
  );

  const { data: favicon, isLoading: loadingGetFavicon } =
    useGetWebPageBySlug('favicon');

  const isNotFoundFavicon = useMemo(
    () => favicon?.code === HTTP_STATUS.NOT_FOUND,
    [favicon],
  );

  // add mutation
  const { mutate: addMutation, isLoading: loadingAdd } = useAddWebPage({
    onSuccess: (resp) => {
      if (resp.code === HTTP_STATUS.SUCCESS) {
        toast.success('Success to add website profile');
        queryClient.invalidateQueries({
          queryKey: ['web-pages', { slug: 'website-profile' }],
        });
      } else {
        toast.error('Failed to add website profile', {
          description: resp.message,
        });
      }
    },
  });

  // edit mutation
  const { mutate: editMutation, isLoading: loadingEdit } = useEditWebPage({
    onSuccess: (resp) => {
      if (resp.code === HTTP_STATUS.SUCCESS) {
        toast.success('Success to edit website profile');
        queryClient.invalidateQueries({
          queryKey: ['web-pages', { slug: 'website-profile' }],
        });
      } else {
        toast.error('Failed to edit website profile', {
          description: resp.message,
        });
      }
    },
  });

  // add mutation
  const { mutate: addMutationFavicon, isLoading: loadingAddFavicon } =
    useAddWebPage({
      onSuccess: (resp) => {
        if (resp.code === HTTP_STATUS.SUCCESS) {
          toast.success('Success to add favicon');
          queryClient.invalidateQueries({
            queryKey: ['web-pages', { slug: 'favicon' }],
          });
        } else {
          toast.error('Failed to add favicon', {
            description: resp.message,
          });
        }
      },
    });

  // edit mutation
  const { mutate: editMutationFavicon, isLoading: loadingEditFavicon } =
    useEditWebPage({
      onSuccess: (resp) => {
        if (resp.code === HTTP_STATUS.SUCCESS) {
          toast.success('Success to edit favicon');
          queryClient.invalidateQueries({
            queryKey: ['web-pages', { slug: 'favicon' }],
          });
        } else {
          toast.error('Failed to edit favicon', {
            description: resp.message,
          });
        }
      },
    });

  // actual submit add
  const actualSubmit: SubmitHandler<TSchema> = useCallback(
    (values) => {
      const payload: TWebPageRequest = {
        imageId: values.imageId || null,
        contents: values.contents,
        metaDescription: '',
        metaKeyword: '',
        showAtHomePage: false,
        slug: 'website-profile',
        status: STATUS.draft,
        title: {
          en: 'Website Profile',
          ar: 'Website Profile',
        },
      };
      const payloadFavicon: TWebPageRequest = {
        imageId: values.faviconImageId || null,
        contents: [
          {
            en: '',
            ar: '',
          },
        ],
        metaDescription: '',
        metaKeyword: '',
        showAtHomePage: false,
        slug: 'favicon',
        status: STATUS.draft,
        title: {
          en: 'Website Profile Favicon',
          ar: 'Website Profile Favicon',
        },
      };

      if (isNotFoundFavicon) {
        if (values.faviconImageId) {
          addMutationFavicon(payloadFavicon);
        }
      } else if (favicon) {
        if (favicon.data.image.id !== values.faviconImageId) {
          editMutationFavicon({
            id: favicon.data.id,
            payload: payloadFavicon,
          });
        }
      }
      if (isNotFound) {
        addMutation(payload);
      } else if (data) {
        if (
          values.contents[WEBSITE_PROFILE_INDEX.SITENAME].en !==
            data.data.contents[WEBSITE_PROFILE_INDEX.SITENAME].en ||
          values.contents[WEBSITE_PROFILE_INDEX.META_DESCRIPTION].en !==
            data.data.contents[WEBSITE_PROFILE_INDEX.META_DESCRIPTION].en ||
          values.contents[WEBSITE_PROFILE_INDEX.META_KEYWORD].en !==
            data.data.contents[WEBSITE_PROFILE_INDEX.META_KEYWORD].en ||
          values.imageId !== data.data.image.id
        ) {
          editMutation({ id: data.data.id, payload });
        }
      }
    },
    [
      addMutation,
      isNotFound,
      data,
      editMutation,
      favicon,
      isNotFoundFavicon,
      addMutationFavicon,
      editMutationFavicon,
    ],
  );

  useEffect(() => {
    if (data) {
      if (data.code === HTTP_STATUS.SUCCESS) {
        form.setValue('contents', data.data.contents);
        form.setValue('imageId', data.data.image.id);
      }
    }
    if (favicon) {
      if (favicon.code === HTTP_STATUS.SUCCESS) {
        form.setValue('faviconImageId', favicon.data.image.id);
      }
    }
  }, [form, data, favicon]);

  return (
    <div className=" h-full w-full">
      {loadingGet || loadingGetFavicon ? (
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
          </div>
          <div className=" col-span-2 space-y-3">
            <Skeleton className=" h-5 w-24" />
            <Skeleton className=" h-10 w-full" />
          </div>
        </div>
      ) : (
        <div className=" w-full rounded-b-lg border border-t-0 p-4">
          {/* begin: section banner */}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(actualSubmit)}>
              <div className="flex flex-col gap-6">
                <div className=" grid grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="imageId"
                    render={() => (
                      <FormItem>
                        <FormLabel>{t('common.logo')}</FormLabel>
                        <BaseDropzone
                          imageSize="contain"
                          image={data?.data.image}
                          onImageUpload={(image) =>
                            form.setValue('imageId', image.id)
                          }
                        />
                        <BaseFormError />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="faviconImageId"
                    render={() => (
                      <FormItem>
                        <FormLabel>{t('common.favicon')}</FormLabel>
                        <BaseDropzone
                          image={favicon?.data.image}
                          onImageUpload={(image) =>
                            form.setValue('faviconImageId', image.id)
                          }
                          imageSize="contain"
                        />
                        <BaseFormError />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              {/* end: section banner */}

              {/* begin: section banner text */}
              <div className="mt-6 flex flex-col gap-6">
                <FormField
                  control={form.control}
                  name={`contents.${WEBSITE_PROFILE_INDEX.SITENAME}.en`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('common.sitename')}</FormLabel>
                      <Input
                        {...field}
                        placeholder="Sitename"
                      />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`contents.${WEBSITE_PROFILE_INDEX.META_DESCRIPTION}.en`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('common.metaDescription')}</FormLabel>
                      <Textarea
                        {...field}
                        placeholder="Meta Description"
                      />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`contents.${WEBSITE_PROFILE_INDEX.META_KEYWORD}.en`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('common.metaKeyword')}</FormLabel>
                      <Input
                        {...field}
                        placeholder="Meta Keyword"
                      />
                    </FormItem>
                  )}
                />
              </div>
              {/* end: section banner text */}
              <div className="mt-6 flex justify-end gap-4">
                <Button
                  type="submit"
                  disabled={
                    loadingAdd ||
                    loadingEdit ||
                    loadingAddFavicon ||
                    loadingEditFavicon
                  }
                >
                  {loadingAdd ||
                  loadingEdit ||
                  loadingAddFavicon ||
                  loadingEditFavicon ? (
                    <LuLoader2
                      className=" animate-spin text-white"
                      size={16}
                    />
                  ) : null}
                  {t('common.saveChanges')}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      )}
    </div>
  );
}
