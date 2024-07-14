'use client';

import { useEditBlog, useGetBlogById } from '@/api/blog.api';
import BaseDropzone from '@/components/common/base-dropzone';
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
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { HTTP_STATUS } from '@/constants/common.constant';
import useLangClient from '@/hooks/use-lang-client';
import { cn } from '@/lib/utils';
import { useI18n } from '@/locales/client';
import { TDefaultParams } from '@/types/common.type';
import { TBlogSchema } from '@/validations/blog.validation';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { FaChevronRight } from 'react-icons/fa6';
import { LuLoader2 } from 'react-icons/lu';
import { useQueryClient } from 'react-query';
import { toast } from 'sonner';

type TEditArticlePageParams = {
  params: TDefaultParams & {
    article_id: number;
  };
};

export default function EditArticlePage({ params }: TEditArticlePageParams) {
  // hooks
  const router = useRouter();
  const queryClient = useQueryClient();
  const t = useI18n();
  const { isAr } = useLangClient();

  // fetch
  const { data: blog, isLoading: loadingGetBlog } = useGetBlogById(
    params.article_id,
  );

  // form
  const form = useForm<TBlogSchema>({
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
      // metaDescription: blog,
      // metaKeyword: '',
    },
  });

  // add article mutation
  const { mutateAsync: editArticle, isLoading: loadingEditArticle } =
    useEditBlog({
      onSuccess: (resp) => {
        if (resp.code === HTTP_STATUS.SUCCESS) {
          toast.success('Success to update blog');
          queryClient.invalidateQueries({ queryKey: ['blogs'] });
          queryClient.invalidateQueries({
            queryKey: ['blog', { id: params.article_id }],
          });
          router.replace('/blog-management');
        }
      },
    });

  // actual submit
  const actualSubmit: SubmitHandler<TBlogSchema> = useCallback(
    async (values) => {
      await editArticle({ id: params.article_id, payload: values });
    },
    [editArticle, params],
  );

  useEffect(() => {
    if (blog) {
      form.setValue('title', blog.title);
      form.setValue('slug', blog.slug);
      form.setValue('description', blog.description);
      form.setValue('imageId', blog.image.id);
      form.setValue('code', blog.code);
      form.setValue('metaDescription', blog.metaDescription);
      form.setValue('metaKeyword', blog.metaKeyword);
    }
  }, [form, blog]);

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
          <p className=" text-primary">{t('blog.editArticle')}</p>
        </div>
        {/* end: breadcrumb */}

        {loadingGetBlog ? (
          <div className=" mt-6 flex flex-col gap-6">
            <BaseSkeleton variant="image" />
            <BaseSkeleton />
            <BaseSkeleton />
            <BaseSkeleton />
            <BaseSkeleton />
            <BaseSkeleton variant="editor" />
            <BaseSkeleton variant="editor" />
          </div>
        ) : (
          blog && (
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
                          image={blog.image}
                          onImageUpload={(image) =>
                            form.setValue('imageId', image.id)
                          }
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
                            placeholder="Input Title"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
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
                            placeholder="Input Title ar"
                            {...field}
                            dir="rtl"
                          />
                        </FormControl>
                        <FormMessage />
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
                            placeholder="Input Slug"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
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
                          <Input
                            placeholder="Input Meta Description"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
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
                            placeholder="Input Meta Keyword"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
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
                          value={blog.description.en}
                          setValue={(value) => {
                            form.setValue('description.en', value);
                          }}
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
                          value={blog.description.ar}
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
                    disabled={loadingEditArticle}
                    type="submit"
                  >
                    {loadingEditArticle && (
                      <LuLoader2
                        className=" animate-spin text-white"
                        size={16}
                      />
                    )}
                    {t('common.saveChanges')}
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
