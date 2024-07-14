'use client';

import {
  useAddWebPage,
  useEditWebPage,
  useGetWebPageBySlug,
} from '@/api/web-page.api';
import BaseSkeleton from '@/components/common/base-skeleton';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { CONTACT_US_INDEX, HTTP_STATUS } from '@/constants/common.constant';
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

export default function ContactUsPage() {
  // hooks
  const queryClient = useQueryClient();
  const t = useI18n();

  // fetch
  const { data, isLoading: loadingGet } = useGetWebPageBySlug('contact-us');

  const isNotFound = useMemo(
    () => data?.code === HTTP_STATUS.NOT_FOUND,
    [data],
  );

  // form
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

  // add mutation
  const { mutate: addMutation, isLoading: loadingAdd } = useAddWebPage({
    onSuccess: (resp) => {
      if (resp.code === HTTP_STATUS.SUCCESS) {
        toast.success('success to add contact');
        queryClient.invalidateQueries({
          queryKey: ['web-pages', { slug: 'contact-us' }],
        });
      } else {
        toast.error('failed to add contact us', {
          description: resp.message,
        });
      }
    },
  });

  // edit mutation
  const { mutate: editMutation, isLoading: loadingEdit } = useEditWebPage({
    onSuccess: (resp) => {
      if (resp.code === HTTP_STATUS.SUCCESS) {
        toast.success('success to edit contact us');
        queryClient.invalidateQueries({
          queryKey: ['web-pages', { slug: 'contact-us' }],
        });
      } else {
        toast.error('failed to edit contact us', {
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
        slug: 'contact-us',
        status: STATUS.draft,
        title: {
          en: 'Contact US',
          ar: 'Contact US',
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
            <BaseSkeleton />
            <BaseSkeleton />
          </div>
          <BaseSkeleton />
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(actualSubmit)}>
            <div className=" w-full rounded-b-lg border border-t-0 p-4">
              <div className="grid grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name={`contents.${CONTACT_US_INDEX.EMAIL}.en`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('common.email')}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Input Email"
                          dir="ltr"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`contents.${CONTACT_US_INDEX.PHONE_NUMBER}.en`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('common.phoneNumber')}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Input Phone Number"
                          dir="ltr"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="col-span-2">
                  <FormField
                    control={form.control}
                    name={`contents.${CONTACT_US_INDEX.ADDRESS}.en`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('common.address')}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Input Address"
                            dir="ltr"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-4">
              <Button
                variant="ghost-primary"
                asChild
              >
                <Link
                  href="https://www.kanzway.com/en/contact-us"
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
