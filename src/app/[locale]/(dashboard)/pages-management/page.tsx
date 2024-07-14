'use client';

import {
  useAddWebPage,
  useEditWebPage,
  useGetWebPageBySlug,
} from '@/api/web-page.api';
import BaseSkeleton from '@/components/common/base-skeleton';
import Editor from '@/components/common/editor';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ABOUT_US_INDEX, HTTP_STATUS } from '@/constants/common.constant';
import { useI18n } from '@/locales/client';
import { STATUS } from '@/types/common.type';
import { TWebPageRequest } from '@/types/web-page.type';
import Link from 'next/link';
import { useCallback, useEffect, useMemo } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { LuLoader2 } from 'react-icons/lu';
import { useQueryClient } from 'react-query';
import { toast } from 'sonner';
import * as yup from 'yup';

const schema = yup.object().shape({
  title: yup.object({
    en: yup.string(),
    ar: yup.string(),
  }),
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

export default function LandingPageManagementPage() {
  // hooks
  const queryClient = useQueryClient();
  const t = useI18n();

  // fetch
  const { data, isLoading: loadingGet } = useGetWebPageBySlug('about-us');

  const isNotFound = useMemo(
    () => data?.code === HTTP_STATUS.NOT_FOUND,
    [data],
  );

  // form
  const form = useForm<TSchema>({
    defaultValues: {
      title: {
        en: '',
        ar: '',
      },
      contents: [
        {
          en: '',
          ar: '',
        },
      ],
    },
  });

  // add mutation
  const { mutate: addMutation, isLoading: loadingAdd } = useAddWebPage({
    onSuccess: (resp) => {
      console.log(resp);
      if (resp.code === HTTP_STATUS.SUCCESS) {
        toast.success('Success to add about us');
        queryClient.invalidateQueries({
          queryKey: ['web-pages', { slug: 'about-us' }],
        });
      } else {
        toast.error('Failed to add about us', {
          description: resp.message,
        });
      }
    },
  });

  // edit mutation
  const { mutate: editMutation, isLoading: loadingEdit } = useEditWebPage({
    onSuccess: (resp) => {
      console.log(resp);
      if (resp.code === HTTP_STATUS.SUCCESS) {
        toast.success('Success to edit about us');
        queryClient.invalidateQueries({
          queryKey: ['web-pages', { slug: 'about-us' }],
        });
      } else {
        toast.error('Failed to edit about us', {
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
        slug: 'about-us',
        status: STATUS.draft,
        title: {
          en: values.title.en,
          ar: values.title.ar,
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
        form.setValue('title', data.data.title);
      }
    }
  }, [form, data]);

  return (
    <div className=" h-full w-full">
      {loadingGet ? (
        <div className="flex w-full flex-col gap-6 rounded-b-lg border border-t-0 p-4 ">
          <BaseSkeleton variant="textarea" />
          <BaseSkeleton variant="textarea" />
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(actualSubmit)}>
            <div className=" flex w-full flex-col gap-6 rounded-b-lg border border-t-0 p-4">
              <FormField
                control={form.control}
                name="title.en"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('common.title')} en</FormLabel>
                    <Input
                      {...field}
                      placeholder="Title en"
                      dir="ltr"
                    />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="title.ar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('common.title')} ar</FormLabel>
                    <Input
                      {...field}
                      placeholder="Title ar"
                      dir="rtl"
                    />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`contents.${ABOUT_US_INDEX.DESCRIPTION}.en`}
                render={() => (
                  <FormItem>
                    <FormLabel>{t('common.description')} en</FormLabel>
                    <Editor
                      value={
                        data?.code === HTTP_STATUS.SUCCESS
                          ? data?.data.contents[ABOUT_US_INDEX.DESCRIPTION].en
                          : ''
                      }
                      setValue={(value) =>
                        form.setValue(
                          `contents.${ABOUT_US_INDEX.DESCRIPTION}.en`,
                          value,
                        )
                      }
                    />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`contents.${ABOUT_US_INDEX.DESCRIPTION}.ar`}
                render={() => (
                  <FormItem>
                    <FormLabel>{t('common.description')} ar</FormLabel>
                    <Editor
                      value={
                        data?.code === HTTP_STATUS.SUCCESS
                          ? data?.data.contents[ABOUT_US_INDEX.DESCRIPTION].ar
                          : ''
                      }
                      setValue={(value) =>
                        form.setValue(
                          `contents.${ABOUT_US_INDEX.DESCRIPTION}.ar`,
                          value,
                        )
                      }
                      isAr
                    />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`contents.${ABOUT_US_INDEX.VISION}.en`}
                render={() => (
                  <FormItem>
                    <FormLabel>{t('common.vision')} en</FormLabel>
                    <Editor
                      value={
                        data?.code === HTTP_STATUS.SUCCESS
                          ? data?.data.contents[ABOUT_US_INDEX.VISION].en
                          : ''
                      }
                      setValue={(value) =>
                        form.setValue(
                          `contents.${ABOUT_US_INDEX.VISION}.en`,
                          value,
                        )
                      }
                    />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`contents.${ABOUT_US_INDEX.VISION}.ar`}
                render={() => (
                  <FormItem>
                    <FormLabel>{t('common.vision')} ar</FormLabel>
                    <Editor
                      value={
                        data?.code === HTTP_STATUS.SUCCESS
                          ? data?.data.contents[ABOUT_US_INDEX.VISION].ar
                          : ''
                      }
                      setValue={(value) =>
                        form.setValue(
                          `contents.${ABOUT_US_INDEX.VISION}.ar`,
                          value,
                        )
                      }
                      isAr
                    />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`contents.${ABOUT_US_INDEX.MISION}.en`}
                render={() => (
                  <FormItem>
                    <FormLabel>{t('common.mission')} en</FormLabel>
                    <Editor
                      value={
                        data?.code === HTTP_STATUS.SUCCESS
                          ? data?.data.contents[ABOUT_US_INDEX.MISION].en
                          : ''
                      }
                      setValue={(value) =>
                        form.setValue(
                          `contents.${ABOUT_US_INDEX.MISION}.en`,
                          value,
                        )
                      }
                    />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`contents.${ABOUT_US_INDEX.MISION}.ar`}
                render={() => (
                  <FormItem>
                    <FormLabel>{t('common.mission')} ar</FormLabel>
                    <Editor
                      value={
                        data?.code === HTTP_STATUS.SUCCESS
                          ? data?.data.contents[ABOUT_US_INDEX.MISION].ar
                          : ''
                      }
                      setValue={(value) =>
                        form.setValue(
                          `contents.${ABOUT_US_INDEX.MISION}.ar`,
                          value,
                        )
                      }
                      isAr
                    />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`contents.${ABOUT_US_INDEX.OUR_TEAM}.en`}
                render={() => (
                  <FormItem>
                    <FormLabel>{t('common.ourTeam')} en</FormLabel>
                    <Editor
                      value={
                        data?.code === HTTP_STATUS.SUCCESS &&
                        data.data.contents[ABOUT_US_INDEX.OUR_TEAM]
                          ? data?.data.contents[ABOUT_US_INDEX.OUR_TEAM].en
                          : ''
                      }
                      setValue={(value) =>
                        form.setValue(
                          `contents.${ABOUT_US_INDEX.OUR_TEAM}.en`,
                          value,
                        )
                      }
                    />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`contents.${ABOUT_US_INDEX.OUR_TEAM}.ar`}
                render={() => (
                  <FormItem>
                    <FormLabel>{t('common.ourTeam')} ar</FormLabel>
                    <Editor
                      value={
                        data?.code === HTTP_STATUS.SUCCESS &&
                        data.data.contents[ABOUT_US_INDEX.OUR_TEAM]
                          ? data?.data.contents[ABOUT_US_INDEX.OUR_TEAM].ar
                          : ''
                      }
                      isAr
                      setValue={(value) =>
                        form.setValue(
                          `contents.${ABOUT_US_INDEX.OUR_TEAM}.ar`,
                          value,
                        )
                      }
                    />
                  </FormItem>
                )}
              />
            </div>
            <div className="mt-6 flex justify-end gap-4">
              <Button
                variant="ghost-primary"
                asChild
              >
                <Link
                  href="https://www.kanzway.com/en/about"
                  target="_blank"
                >
                  {t('common.preview')}
                </Link>
              </Button>
              <Button
                type="submit"
                disabled={loadingAdd || loadingEdit}
              >
                {loadingAdd ||
                  (loadingEdit && (
                    <LuLoader2
                      className=" animate-spin text-white"
                      size={16}
                    />
                  ))}
                {t('common.saveChanges')}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}
