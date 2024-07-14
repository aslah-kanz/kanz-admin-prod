'use client';

import { useAddBlog } from '@/api/blog.api';
import BaseDropzone from '@/components/common/base-dropzone';
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
import { TBlogSchema, blogSchema } from '@/validations/blog.validation';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { FaChevronRight } from 'react-icons/fa6';
import { LuLoader2 } from 'react-icons/lu';
import { useQueryClient } from 'react-query';
import { toast } from 'sonner';

export default function CreateArticlePage() {
  // hooks
  const router = useRouter();
  const queryClient = useQueryClient();
  const t = useI18n();
  const { isAr } = useLangClient();

  // form
  const form = useForm<TBlogSchema>({
    resolver: yupResolver(blogSchema),
    defaultValues: {
      title: {
        en: '',
        ar: '',
      },
      slug: '',
      description: {
        en: '',
        ar: '',
      },
      metaDescription: '',
      metaKeyword: '',
    },
  });

  // add article mutation
  const { mutateAsync: addArticle, isLoading: loadingAddArticle } = useAddBlog({
    onSuccess: (resp) => {
      if (resp.code === HTTP_STATUS.SUCCESS) {
        toast.success('Success to add blog');
        queryClient.invalidateQueries({ queryKey: ['blogs'] });
        router.replace('/blog-management');
      } else {
        toast.error('Failed to add blog', { description: resp.message });
      }
    },
  });

  // actual submit
  const actualSubmit: SubmitHandler<TBlogSchema> = useCallback(
    async (values) => {
      addArticle(values);
    },
    [addArticle],
  );

  return (
    <div className=" w-full p-6">
      <div className=" w-full rounded-lg border p-5">
        {/* begin: breadcrumb */}
        <div className="flex items-center gap-2 text-[13px] text-neutral-500">
          <p>{t('sidebar.menu.blogManagement')}</p>
          <FaChevronRight
            size={12}
            className={cn({ 'rotate-180': isAr })}
          />
          <p className=" text-primary">{t('blog.createArticle')}</p>
        </div>
        {/* end: breadcrumb */}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(actualSubmit)}>
            <div className="mt-6 flex flex-col gap-6">
              <FormField
                control={form.control}
                name="imageId"
                render={() => (
                  <FormItem>
                    <FormLabel>{t('common.thumbnail')}</FormLabel>
                    <BaseDropzone
                      onImageUpload={(image) => {
                        form.setValue('imageId', image.id);
                        form.clearErrors('imageId');
                      }}
                    />
                    <BaseFormError />
                  </FormItem>
                )}
              />
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
              <FormField
                control={form.control}
                name="description.en"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('common.description')} en</FormLabel>
                    <Editor
                      value={field.value}
                      setValue={(value) => {
                        form.setValue('description.en', value);
                        if (value.replace(/(<([^>]+)>)/gi, '').length > 0) {
                          form.clearErrors('description.en');
                        } else {
                          form.setError('description.en', {
                            message: 'required',
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
                name="description.ar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('common.description')} ar</FormLabel>
                    <Editor
                      value={field.value}
                      setValue={(value) => {
                        form.setValue('description.ar', value);
                      }}
                      isAr
                    />
                  </FormItem>
                )}
              />
            </div>
            <div className="mt-6 flex justify-end">
              <Button
                disabled={loadingAddArticle}
                type="submit"
              >
                {loadingAddArticle && (
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
