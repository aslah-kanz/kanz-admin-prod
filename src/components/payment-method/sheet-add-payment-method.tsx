'use client';

import { useAddPaymentMethod } from '@/api/payment-method.api';
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
  TPaymentMethodSchema,
  paymentMethodSchema,
} from '@/validations/payment-method.validation';
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

type TSheetAddPaymentMethodProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export default function SheetAddPaymentMethod({
  open,
  setOpen,
}: TSheetAddPaymentMethodProps) {
  // hooks
  const queryClient = useQueryClient();
  const t = useI18n();

  // form
  const form = useForm<TPaymentMethodSchema>({
    resolver: yupResolver(paymentMethodSchema),
    defaultValues: {
      name: {
        en: '',
        ar: '',
      },
      instruction: {
        en: '',
        ar: '',
      },
    },
  });

  // mutation
  const { mutate, isLoading } = useAddPaymentMethod({
    onSuccess: (resp) => {
      if (resp.code === HTTP_STATUS.SUCCESS) {
        toast.success('Success to add payment method');
        form.reset();
        queryClient.invalidateQueries({ queryKey: ['payment-methods'] });
        setOpen((prev) => !prev);
      } else {
        toast.error('Failed to add payment method', {
          description: resp.message,
        });
        setOpen((prev) => !prev);
      }
    },
  });

  // actual submit
  const actualSubmit: SubmitHandler<TPaymentMethodSchema> = useCallback(
    (values) => {
      mutate(values);
    },
    [mutate],
  );

  useEffect(() => {
    form.reset();
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
                control={form.control}
                name="instruction.en"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className=" text-sm">
                      <FormLabel className=" text-sm">
                        {t('common.instruction')} en
                      </FormLabel>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={`${t('common.description')} en`}
                        {...field}
                      />
                    </FormControl>
                    <BaseFormError />
                  </FormItem>
                )}
              />
              <FormField
                name="instruction.ar"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className=" text-sm">
                      {t('common.instruction')} ar
                    </FormLabel>
                    <Input
                      dir="rtl"
                      placeholder={`${t('common.description')} ar`}
                      {...field}
                    />
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
                {isLoading ? (
                  <LuLoader2
                    className=" animate-spin text-white"
                    size={16}
                  />
                ) : (
                  <>
                    <FaPlus />
                    {t('common.create')}
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
        {/* begin: main drawer */}
      </SheetContent>
    </Sheet>
  );
}
