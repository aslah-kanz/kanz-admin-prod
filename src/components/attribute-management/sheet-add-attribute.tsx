'use client';

import { useAddAttribute } from '@/api/attribute.api';
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
import {
  TAttributeSchema,
  attributeSchema,
} from '@/validations/attribute.validation';
import { yupResolver } from '@hookform/resolvers/yup';
import { WalletAdd } from 'iconsax-react';
import { Dispatch, SetStateAction, useCallback, useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { FaPlus } from 'react-icons/fa6';
import { FiX } from 'react-icons/fi';
import { LuLoader2 } from 'react-icons/lu';
import { useQueryClient } from 'react-query';
import { toast } from 'sonner';
import BaseFormError from '../common/base-form-error';
import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form';

type TSheetAddAttributeProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export default function SheetAddAttribute({
  open,
  setOpen,
}: TSheetAddAttributeProps) {
  // hooks
  const queryClient = useQueryClient();
  const t = useI18n();

  // form
  const form = useForm<TAttributeSchema>({
    resolver: yupResolver(attributeSchema),
    defaultValues: {
      name: {
        en: '',
        ar: '',
      },
      group: {
        en: '',
        ar: '',
      },
      unit1: {
        en: '',
        ar: '',
      },
      unit2: {
        en: '',
        ar: '',
      },
      unit3: {
        en: '',
        ar: '',
      },
    },
  });

  // mutation
  const { mutate, isLoading } = useAddAttribute({
    onSuccess: (resp) => {
      if (resp.code.toString() === HTTP_STATUS.SUCCESS) {
        toast.success('Success to add attribute');
        form.reset();
        queryClient.invalidateQueries({ queryKey: ['attributes'] });
        setOpen((prev) => !prev);
      } else {
        toast.error('Failed to add attribute', {
          description: resp.message,
        });
        setOpen((prev) => !prev);
      }
    },
  });

  // actual submit
  const actualSubmit: SubmitHandler<TAttributeSchema> = useCallback(
    (values) => {
      mutate(values);
    },
    [mutate],
  );

  useEffect(() => {
    form.reset();
  }, [form]);

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
                <WalletAdd size={24} />
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
            <div className=" mb-4 flex flex-col gap-4">
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
                        placeholder={`${t('common.name')} en`}
                        {...field}
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
                        placeholder={`${t('common.name')} ar`}
                        {...field}
                      />
                    </FormControl>
                    <BaseFormError />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="group.en"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className=" text-sm">
                      {t('common.group')} en
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={`${t('common.group')} en`}
                        {...field}
                      />
                    </FormControl>
                    <BaseFormError />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="group.ar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className=" text-sm">
                      {t('common.group')} ar
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={`${t('common.group')} ar`}
                        {...field}
                      />
                    </FormControl>
                    <BaseFormError />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="unit1.en"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className=" text-sm">
                      {t('common.unit1')} en
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={`${t('common.unit1')} en`}
                        {...field}
                      />
                    </FormControl>
                    <BaseFormError />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="unit1.ar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className=" text-sm">
                      {t('common.unit1')} ar
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={`${t('common.unit1')} ar`}
                        {...field}
                      />
                    </FormControl>
                    <BaseFormError />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="unit2.en"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className=" text-sm">
                      {t('common.unit2')} en
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={`${t('common.unit2')} en`}
                        {...field}
                      />
                    </FormControl>
                    <BaseFormError />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="unit2.ar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className=" text-sm">
                      {t('common.unit2')} ar
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={`${t('common.unit2')} ar`}
                        {...field}
                      />
                    </FormControl>
                    <BaseFormError />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="unit3.en"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className=" text-sm">
                      {t('common.unit3')} en
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={`${t('common.unit3')} en`}
                        {...field}
                      />
                    </FormControl>
                    <BaseFormError />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="unit3.ar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className=" text-sm">
                      {t('common.unit3')} ar
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={`${t('common.unit3')} ar`}
                        {...field}
                      />
                    </FormControl>
                    <BaseFormError />
                  </FormItem>
                )}
              />
            </div>
            {/* end: main drawer */}
            <div className=" sticky bottom-0 flex flex-col space-y-2 bg-white py-4 pt-2">
              <Button
                type="submit"
                disabled={isLoading}
              >
                {isLoading && (
                  <LuLoader2
                    className=" animate-spin text-white"
                    size={16}
                  />
                )}
                <FaPlus />
                {t('common.create')}
              </Button>
            </div>
          </form>
        </Form>
        {/* begin: main drawer */}
      </SheetContent>
    </Sheet>
  );
}
