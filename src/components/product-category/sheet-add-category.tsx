'use client';

import { useAddCategory, useGetCategories } from '@/api/category.api';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
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
  categorySchema,
} from '@/validations/category.validation';
import { yupResolver } from '@hookform/resolvers/yup';
import { AddSquare } from 'iconsax-react';
import { Dispatch, SetStateAction, useCallback, useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { FiX } from 'react-icons/fi';
import { LuLoader2 } from 'react-icons/lu';
import { useQueryClient } from 'react-query';
import Select2 from 'react-select';
import { toast } from 'sonner';
import BaseFormError from '../common/base-form-error';
import BaseSkeleton from '../common/base-skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Textarea } from '../ui/textarea';

type TSheetAddCategoryProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export default function SheetAddCategory({
  open,
  setOpen,
}: TSheetAddCategoryProps) {
  // hooks
  const queryClient = useQueryClient();
  const t = useI18n();

  // state

  const { data: categories, isLoading: loadingGets } = useGetCategories();

  // form
  const form = useForm<TCategorySchema>({
    resolver: yupResolver(categorySchema),
    defaultValues: {
      code: '',
      description: {
        ar: '',
        en: '',
      },
      metaDescription: '',
      metaKeyword: '',
      name: {
        ar: '',
        en: '',
      },
      showAtHomePage: false,
      slug: '',
      status: CATEGORY_STATUS.draft,
      parentId: undefined,
    },
  });

  // mutation
  const { mutate, isLoading } = useAddCategory({
    onSuccess: (resp) => {
      if (resp.code === HTTP_STATUS.SUCCESS) {
        toast.success('success to add category');
        form.reset();
        queryClient.invalidateQueries({ queryKey: ['categories'] });
        setOpen((prev) => !prev);
      } else {
        toast.error('failed to add category', {
          description: resp.message,
        });
        setOpen((prev) => !prev);
      }
    },
  });

  // actual submit
  const actualSubmit: SubmitHandler<TCategorySchema> = useCallback(
    (values) => {
      const payload: TCategoryRequest = {
        ...values,
        imageId: null,
      };
      mutate(payload);
    },
    [mutate],
  );

  const buildOptions = categories
    ?.sort((a, b) => {
      if (a.name.en.toLowerCase() < b.name.en.toLowerCase()) {
        return -1;
      }
      if (a.name.en.toLowerCase() > b.name.en.toLowerCase()) {
        return 1;
      }

      return 0;
    })
    .map((category) => ({
      value: category.id,
      label: category.name.en,
    }));

  useEffect(() => {
    form.reset();
  }, [form]);

  return (
    <Sheet
      open={open}
      onOpenChange={setOpen}
    >
      <SheetContent className=" flex flex-col gap-4 overflow-y-auto bg-white p-4 py-0">
        <SheetHeader className=" sticky top-0 z-[2] gap-2 bg-white pt-4">
          <div className="flex items-center justify-between">
            <SheetTitle>
              <div className="flex items-center gap-2">
                <AddSquare size={24} />
                {t('common.create')}
              </div>
            </SheetTitle>
            <SheetClose>
              <FiX />
            </SheetClose>
          </div>
          <hr />
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(actualSubmit)}>
            <div className="mb-4 flex flex-col gap-4">
              {loadingGets ? (
                <BaseSkeleton />
              ) : (
                <FormField
                  control={form.control}
                  name="parentId"
                  render={() => (
                    <FormItem>
                      <FormLabel className=" w-full text-sm">
                        {t('common.parentId')}
                      </FormLabel>
                      <Select2
                        options={buildOptions}
                        className=" z-[1] text-sm"
                        onChange={(value) => {
                          if (value) {
                            form.setValue('parentId', value.value);
                          }
                        }}
                        placeholder={t('common.parentId')}
                      />
                      <BaseFormError />
                    </FormItem>
                  )}
                />
              )}
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
                        placeholder={t('common.code')}
                        dir="ltr"
                      />
                    </FormControl>
                    <BaseFormError />
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
                        placeholder={`${t('common.name')} en`}
                        dir="ltr"
                      />
                    </FormControl>
                    <BaseFormError />
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
                        placeholder={`${t('common.name')} ar`}
                        dir="rtl"
                      />
                    </FormControl>
                    <BaseFormError />
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
                        placeholder={t('common.slug')}
                        dir="ltr"
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
                    <FormLabel className=" text-sm">
                      {t('common.description')} en
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={`${t('common.description')} ar`}
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
                      <Input
                        {...field}
                        placeholder={`${t('common.description')} ar`}
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
                  t('common.create')
                )}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
