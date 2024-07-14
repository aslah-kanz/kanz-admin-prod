'use client';

import { useAddBrand } from '@/api/brand.api';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Switch } from '../ui/switch';
import { Textarea } from '../ui/textarea';

type TSheetAddBrandProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export default function SheetAddBrand({
  open: openSheet,
  setOpen,
}: TSheetAddBrandProps) {
  // hooks
  const queryClient = useQueryClient();
  const t = useI18n();

  // form
  const form = useForm<TBrandSchema>({
    resolver: yupResolver(brandSchema),
    defaultValues: {
      code: '',
      name: {
        en: '',
        ar: '',
      },
      imageId: undefined,
      bwImageId: undefined,
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
  const { mutateAsync: addBrand, isLoading: loadingAddBrand } = useAddBrand({
    onSuccess: (resp) => {
      if (resp.code === HTTP_STATUS.SUCCESS) {
        queryClient.invalidateQueries({ queryKey: ['brands'] });
        toast.success('Success to add brand');
        setOpen((prev) => !prev);
        form.reset();
      } else {
        toast.error('Failed to add brand', { description: resp.message });
        setOpen((prev) => !prev);
      }
    },
  });

  const actualSubmit: SubmitHandler<TBrandSchema> = useCallback(
    async (values) => {
      await addBrand(values);
    },
    [addBrand],
  );

  const { data: categories, isLoading: loadingGets } = useGetCategories();

  const buildOptions = categories?.map((category) => ({
    value: category.id,
    label: category.name.en,
  }));

  useEffect(() => {
    form.reset();
  }, [form]);

  return (
    <Sheet
      open={openSheet}
      onOpenChange={() => {
        setOpen((prev) => !prev);
        form.reset();
      }}
    >
      <SheetContent className=" flex flex-col gap-4 overflow-y-auto bg-white p-4 py-0">
        <SheetHeader className=" sticky top-0 z-[2] gap-2 bg-white pt-4">
          <div className="flex items-center justify-between">
            <SheetTitle>{t('brand.addBrand')}</SheetTitle>
            <SheetClose>
              <FiX />
            </SheetClose>
          </div>
          <hr />
        </SheetHeader>

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
                      placeholder={t('common.code')}
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
                        placeholder={`${t('common.name')} en`}
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
                      placeholder={`${t('common.name')} ar`}
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
                      placeholder={t('common.slug')}
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
                        placeholder={`${t('common.description')} en`}
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
                        dir="rtl"
                        placeholder={`${t('common.description')} ar`}
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
                        placeholder={t('common.metaDescription')}
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
                        placeholder={t('common.metaKeyword')}
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
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(CATEGORY_STATUS).map((status) => (
                          <SelectItem
                            value={status}
                            key={status}
                          >
                            {slugToOriginal(status)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <BaseFormError />
                  </FormItem>
                )}
              />
              {loadingGets ? (
                <BaseSkeleton />
              ) : (
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
                        isMulti
                        placeholder={t('common.categoryIds')}
                      />
                      <BaseFormError />
                    </FormItem>
                  )}
                />
              )}
              {/* end: main form */}
            </div>
            <div className=" sticky bottom-0 flex flex-col space-y-2 bg-white py-4 pt-2">
              <Button
                type="submit"
                disabled={loadingAddBrand}
              >
                {loadingAddBrand ? (
                  <LuLoader2
                    className=" animate-spin text-white"
                    size={16}
                  />
                ) : (
                  t('brand.addBrand')
                )}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
