'use client';

import {
  useEditCategory,
  useGetCategories,
  useGetCategoryById,
} from '@/api/category.api';
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
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import { HTTP_STATUS } from '@/constants/common.constant';
import { useI18n } from '@/locales/client';
import { TCategoryRequest } from '@/types/category.type';
import { slugToOriginal } from '@/utils/common.util';
import {
  CATEGORY_STATUS,
  TCategorySchema,
} from '@/validations/category.validation';
import { Dispatch, SetStateAction, useCallback, useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { FiX } from 'react-icons/fi';
import { LuLoader2 } from 'react-icons/lu';
import { useQueryClient } from 'react-query';
import Select2 from 'react-select';
import { toast } from 'sonner';
import BaseSkeleton from '../common/base-skeleton';
import Pencxil from '../svg/Pencxil';
import { Textarea } from '../ui/textarea';

type TSheetEditCategoryProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  categoryId: number | undefined;
};

export default function SheetEditCategory({
  open,
  setOpen,
  categoryId,
}: TSheetEditCategoryProps) {
  // hooks
  const queryClient = useQueryClient();
  const t = useI18n();

  const { data: category, isLoading: loadingGet } = useGetCategoryById(
    categoryId ?? 0,
    { enabled: !!categoryId && !!open },
  );
  const { data: categories, isLoading: loadingGets } = useGetCategories();

  // form
  const form = useForm<TCategorySchema>({
    defaultValues: {
      code: '',
      description: {
        ar: '',
        en: '',
      },
      imageId: 0,
      metaDescription: '',
      metaKeyword: '',
      name: {
        ar: '',
        en: '',
      },
      parentId: 0,
      showAtHomePage: false,
      slug: '',
      status: CATEGORY_STATUS.draft,
    },
  });

  // mutation
  const { mutate, isLoading } = useEditCategory({
    onSuccess: (resp) => {
      if (resp.code === HTTP_STATUS.SUCCESS) {
        toast.success('success to edit category');
        form.reset();
        queryClient.invalidateQueries({ queryKey: ['categories'] });
        setOpen((prev) => !prev);
      } else {
        toast.error('failed to edit category', {
          description: resp.message,
        });
        setOpen((prev) => !prev);
      }
    },
  });

  // actual submit
  const actualSubmit: SubmitHandler<TCategorySchema> = useCallback(
    (values) => {
      if (category) {
        const payload: TCategoryRequest = {
          ...values,
          imageId: null,
          status: values.status,
        };
        mutate({ id: category.id, payload });
      }
    },
    [mutate, category],
  );

  // build options
  const categoriesOptions = categories
    ?.filter((category) => category.id !== categoryId)
    .map((category) => ({
      value: category.id,
      label: category.name.en,
    }));

  const statusOptions = Object.values(CATEGORY_STATUS).map((item) => ({
    value: item,
    label: slugToOriginal(item),
  }));

  // populate
  useEffect(() => {
    if (category) {
      form.setValue('name', category.name);
      form.setValue('code', category.code);
      if (category.description && category.description.en) {
        form.setValue('description.en', category.description.en);
      }
      if (category.description && category.description.ar) {
        form.setValue('description.ar', category.description.ar);
      }
      form.setValue('parentId', Number(category.parentId));
      form.setValue('slug', category.slug);
      form.setValue('metaDescription', category.metaDescription);
      form.setValue('metaKeyword', category.metaKeyword);
      form.setValue('status', category.status);
      form.setValue('showAtHomePage', category.showAtHomePage);
    }
  }, [form, category, open]);

  useEffect(() => {
    form.clearErrors();
  }, [form, open]);

  return (
    <Sheet
      open={open}
      onOpenChange={setOpen}
    >
      <SheetContent className=" flex flex-col gap-4 overflow-y-auto bg-white p-4 py-0">
        <SheetHeader className=" sticky top-0 gap-2 bg-white pt-4">
          <div className="flex items-center justify-between">
            <SheetTitle>
              <div className="flex items-center gap-2">
                <Pencxil
                  width={20}
                  height={20}
                />
                {t('common.edit')}
              </div>
            </SheetTitle>
            <SheetClose>
              <FiX />
            </SheetClose>
          </div>
          <hr />
        </SheetHeader>
        {loadingGets || loadingGet ? (
          <>
            <BaseSkeleton />
            <BaseSkeleton />
            <BaseSkeleton />
            <BaseSkeleton />
            <BaseSkeleton />
            <BaseSkeleton variant="textarea" />
            <BaseSkeleton variant="textarea" />
            <BaseSkeleton variant="textarea" />
            <BaseSkeleton />
            <BaseSkeleton />
            <BaseSkeleton />
          </>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(actualSubmit)}>
              <div className="mb-4 flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="parentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className=" w-full text-sm">
                        {t('common.parentId')}
                      </FormLabel>
                      <Select2
                        options={categoriesOptions}
                        className=" text-sm"
                        onChange={(value) => {
                          if (value) {
                            form.setValue('parentId', value?.value);
                          }
                        }}
                        value={categoriesOptions?.filter(
                          (v) => v.value === field.value,
                        )}
                        isClearable
                      />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className=" text-sm">
                        {t('common.code')}
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Input Code"
                          dir="ltr"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name.en"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className=" text-sm">
                        {t('common.name')} en
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Input Name"
                          dir="ltr"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name.ar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className=" text-sm">
                        {t('common.name')} ar
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Input Name"
                          dir="rtl"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className=" text-sm">
                        {t('common.slug')}
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Input Slug"
                          dir="ltr"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description.en"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className=" text-sm">
                        {t('common.description')} en
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Input Description"
                          dir="ltr"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description.ar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className=" text-sm">
                        {t('common.description')} ar
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Input Description"
                          dir="rtl"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="metaDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className=" text-sm">
                        {t('common.metaDescription')}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Input Meta Description"
                          dir="ltr"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="metaKeyword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className=" text-sm">
                        {t('common.metaKeyword')}
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Input Meta Keyword"
                          dir="ltr"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="showAtHomePage"
                  render={({ field }) => (
                    <div className=" flex flex-col gap-2">
                      <FormLabel className=" w-full text-sm">
                        {t('common.showAtHomePage')}
                      </FormLabel>
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
                      <FormLabel className=" text-sm">
                        {t('common.status')}
                      </FormLabel>
                      <Select2
                        options={statusOptions}
                        className=" text-sm"
                        onChange={(value) => {
                          form.setValue('status', String(value?.value));
                        }}
                        value={statusOptions?.filter(
                          (v) => v.value === field.value,
                        )}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className=" text-sm">
                        {t('common.status')}
                      </FormLabel>
                      <Select2
                        options={statusOptions}
                        className=" text-sm"
                        onChange={(value) => {
                          form.setValue('status', String(value?.value));
                        }}
                        value={statusOptions?.filter(
                          (v) => v.value === field.value,
                        )}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}
              </div>
              <div className=" sticky bottom-0 flex flex-col space-y-2 bg-white py-4 pt-2">
                <Button
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
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
      </SheetContent>
    </Sheet>
  );
}
