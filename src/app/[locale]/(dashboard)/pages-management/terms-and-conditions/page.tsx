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
import { HTTP_STATUS } from '@/constants/common.constant';
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
  contents: yup.object().shape({
    en: yup.string().required(),
    ar: yup.string(),
  }),
});

type TSchema = yup.InferType<typeof schema>;

export default function TermAndConditionsPage() {
  // hooks
  const queryClient = useQueryClient();
  const t = useI18n();

  // fetch
  const { data, isLoading: loadingGet } = useGetWebPageBySlug(
    'term-and-conditions',
  );

  const isNotFound = useMemo(
    () => data?.code === HTTP_STATUS.NOT_FOUND,
    [data],
  );

  // form
  const form = useForm<TSchema>({
    defaultValues: {
      contents: {
        en: '',
        ar: '',
      },
    },
  });

  // add mutation
  const { mutate: addMutation, isLoading: loadingAdd } = useAddWebPage({
    onSuccess: (resp) => {
      if (resp.code === HTTP_STATUS.SUCCESS) {
        toast.success('Success to add terms and conditions');
        queryClient.invalidateQueries({
          queryKey: ['web-pages', { slug: 'term-and-conditions' }],
        });
      } else {
        toast.error('failed to add terms and conditions', {
          description: resp.message,
        });
      }
    },
  });

  // edit mutation
  const { mutate: editMutation, isLoading: loadingEdit } = useEditWebPage({
    onSuccess: (resp) => {
      if (resp.code === HTTP_STATUS.SUCCESS) {
        toast.success('Success to edit terms and conditions');
        queryClient.invalidateQueries({
          queryKey: ['web-pages', { slug: 'term-and-conditions' }],
        });
      } else {
        toast.error('failed to edit terms and conditions', {
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
        contents: [{ en: values.contents.en, ar: values.contents.ar ?? '' }],
        metaDescription: '',
        metaKeyword: '',
        showAtHomePage: false,
        slug: 'term-and-conditions',
        status: STATUS.draft,
        title: {
          en: 'Terms and Conditions',
          ar: 'Terms and Conditions',
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
        form.setValue('contents.en', data.data.contents[0].en);
        form.setValue('contents.ar', data.data.contents[0].ar);
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
                name="contents.en"
                render={() => (
                  <FormItem>
                    <FormLabel>{t('common.content')} en</FormLabel>
                    <Editor
                      value={
                        data?.code === HTTP_STATUS.SUCCESS
                          ? data?.data.contents[0].en
                          : ''
                      }
                      setValue={(value) => {
                        form.setValue('contents.en', value);
                      }}
                    />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contents.ar"
                render={() => (
                  <FormItem>
                    <FormLabel>{t('common.content')} ar</FormLabel>
                    <Editor
                      value={
                        data?.code === HTTP_STATUS.SUCCESS
                          ? data?.data.contents[0].ar
                          : ''
                      }
                      setValue={(value) => {
                        form.setValue('contents.ar', value);
                      }}
                      isAr
                    />
                  </FormItem>
                )}
              />
            </div>
            <div className="mt-6 flex justify-end gap-4">
              <Button variant="ghost-primary">{t('common.preview')}</Button>
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
