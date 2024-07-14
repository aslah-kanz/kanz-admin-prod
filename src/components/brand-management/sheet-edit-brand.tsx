'use client';

import { useEditBrand, useGetBrandById } from '@/api/brand.api';
import { useGetCategories } from '@/api/category.api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { HTTP_STATUS } from '@/constants/common.constant';
import { useI18n } from '@/locales/client';
import { STATUS } from '@/types/common.type';
import { slugToOriginal } from '@/utils/common.util';
import { TBrandSchema, brandSchema } from '@/validations/brand.validation';
import { CATEGORY_STATUS } from '@/validations/category.validation';
import { yupResolver } from '@hookform/resolvers/yup';
import { Dispatch, SetStateAction, useCallback, useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { FiX } from 'react-icons/fi';
import { LuLoader2 } from 'react-icons/lu';
import { useQueryClient } from 'react-query';
import Select2 from 'react-select';
import { toast } from 'sonner';
import BaseDropzone from '../common/base-dropzone';
import BaseFormError from '../common/base-form-error';
import BaseSkeleton from '../common/base-skeleton';
import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form';
import { Switch } from '../ui/switch';
import { Textarea } from '../ui/textarea';

type TSheetEditBrandProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  brandId: number | undefined;
};

export default function SheetEditBrand({
  open: openSheet,
  setOpen,
  brandId,
}: TSheetEditBrandProps) {
  // hooks
  const queryClient = useQueryClient();
  const t = useI18n();

  const { data: brand, isLoading: loadingGetBrand } = useGetBrandById(
    brandId ?? 0,
    { enabled: !!brandId && !!openSheet },
  );

  // form
  const form = useForm<TBrandSchema>({
    resolver: yupResolver(brandSchema),
    defaultValues: {
      code: '',
      name: {
        en: '',
        ar: '',
      },
      categoryIds: [],
      description: {
        ar: '',
        en: '',
      },
      metaDescription: '',
      metaKeyword: '',
      showAtHomePage: false,
      slug: '',
      status: STATUS.draft,
    },
  });

  // mutation
  const { mutateAsync: editBrand, isLoading: loadingEditBrand } = useEditBrand({
    onSuccess: (resp) => {
      if (resp.code === HTTP_STATUS.SUCCESS) {
        queryClient.invalidateQueries({ queryKey: ['brands'] });
        toast.success('Success to edit brand');
        setOpen((prev) => !prev);
      } else {
        toast.error('Failed to edit brand', { description: resp.message });
        setOpen((prev) => !prev);
      }
    },
  });

  const actualSubmit: SubmitHandler<TBrandSchema> = useCallback(
    async (values) => {
      if (brand) {
        editBrand({ id: brand.id, payload: values });
      }
    },
    [brand, editBrand],
  );

  const { data: categories, isLoading: _loadingGets } = useGetCategories();

  const buildOptions = categories?.map((category) => ({
    value: category.id,
    label: category.name.en,
  }));

  useEffect(() => {
    if (brand) {
      form.reset();
      form.setValue('code', brand.code);
      form.setValue('name.en', brand.name.en);
      form.setValue('name.ar', brand.name.ar);
      form.setValue('slug', brand.slug);
      form.setValue('description.en', brand.description.en);
      form.setValue('description.ar', brand.description.ar);
      form.setValue('metaDescription', brand.metaDescription);
      form.setValue('metaKeyword', brand.metaKeyword);
      form.setValue('status', brand.status);
      form.setValue('categoryIds', brand.categoryIds);
      form.setValue('showAtHomePage', brand.showAtHomePage);
      form.setValue('imageId', brand.image.id);
      form.setValue('bwImageId', brand.bwImage ? brand.bwImage.id : undefined);
    }
  }, [form, brand, openSheet]);

  useEffect(() => {
    form.clearErrors();
  }, [form, openSheet]);

  const statusOptions = Object.values(CATEGORY_STATUS).map((item) => ({
    value: item,
    label: slugToOriginal(item),
  }));

  return (
    <Sheet
      open={openSheet}
      onOpenChange={(open) => {
        if (!open) {
          form.clearErrors();
        }
        setOpen((prev) => !prev);
      }}
    >
      <SheetContent className=" flex flex-col gap-4 overflow-y-auto bg-white p-4 py-0">
        <SheetHeader className=" sticky top-0 z-[11] gap-2 bg-white pt-4">
          <div className="flex items-center justify-between">
            <SheetTitle>{t('brand.editBrand')}</SheetTitle>
            <SheetClose>
              <FiX />
            </SheetClose>
          </div>
          <hr />
        </SheetHeader>

        {loadingGetBrand ? (
          <div className="flex flex-col gap-4">
            <BaseSkeleton variant="image" />
            <BaseSkeleton variant="image" />
            {[...Array(7)].map((_, i) => (
              <BaseSkeleton key={i} />
            ))}
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(actualSubmit)}>
              <div className=" mb-4 flex flex-col gap-4">
                {/* begin: main form */}
                <FormField
                  control={form.control}
                  name="imageId"
                  render={() => (
                    <FormItem>
                      <FormLabel className=" text-sm">
                        {t('common.image')}
                      </FormLabel>
                      <BaseDropzone
                        imageSize="contain"
                        image={brand?.image}
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
                  name="bwImageId"
                  render={() => (
                    <FormItem>
                      <FormLabel className=" text-sm">
                        {t('common.image')} ({t('common.grayscale')})
                      </FormLabel>
                      <BaseDropzone
                        imageSize="contain"
                        image={brand?.bwImage}
                        onImageUpload={(image) =>
                          form.setValue('bwImageId', image.id)
                        }
                      />
                      <BaseFormError />
                    </FormItem>
                  )}
                />
                <FormField
                  name="code"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className=" text-sm">
                        {t('common.code')}
                      </FormLabel>
                      <Input
                        placeholder="Input Code"
                        {...field}
                        dir="ltr"
                      />
                      <BaseFormError />
                    </FormItem>
                  )}
                />
                <FormField
                  name="name.en"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className=" text-sm">
                        {t('common.name')} en
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Input Name"
                          {...field}
                          dir="ltr"
                        />
                      </FormControl>
                      <BaseFormError />
                    </FormItem>
                  )}
                />
                <FormField
                  name="name.ar"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className=" text-sm">
                        {t('common.name')} ar
                      </FormLabel>
                      <Input
                        dir="rtl"
                        placeholder="اسم الإدخال"
                        {...field}
                      />
                      <BaseFormError />
                    </FormItem>
                  )}
                />
                <FormField
                  name="slug"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className=" text-sm">
                        {t('common.slug')}
                      </FormLabel>
                      <Input
                        placeholder="Input Slug"
                        {...field}
                        dir="ltr"
                      />
                      <BaseFormError />
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
                      <BaseFormError />
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
                      <BaseFormError />
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
                      <BaseFormError />
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
                      <BaseFormError />
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
                      <BaseFormError />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="categoryIds"
                  render={() => (
                    <FormItem>
                      <FormLabel className=" w-full text-sm">
                        {t('common.categoryIds')}
                      </FormLabel>
                      <Select2
                        options={buildOptions}
                        className=" text-sm"
                        onChange={(value) => {
                          form.setValue(
                            'categoryIds',
                            value.map((v) => Number(v.value)),
                          );
                        }}
                        value={buildOptions?.filter((v) =>
                          form.getValues('categoryIds').includes(v.value),
                        )}
                        isMulti
                      />
                      <BaseFormError />
                    </FormItem>
                  )}
                />
                {/* end: main form */}
              </div>
              <div className=" sticky bottom-0 flex flex-col space-y-2 bg-white py-4 pt-2">
                <Button
                  type="submit"
                  disabled={loadingEditBrand}
                >
                  {loadingEditBrand ? (
                    <LuLoader2
                      className=" animate-spin text-white"
                      size={16}
                    />
                  ) : (
                    t('common.saveChanges')
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
