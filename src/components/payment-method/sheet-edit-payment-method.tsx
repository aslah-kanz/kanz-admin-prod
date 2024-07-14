'use client';

import { useEditPaymentMethod } from '@/api/payment-method.api';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { HTTP_STATUS } from '@/constants/common.constant';
import { useI18n } from '@/locales/client';
import { TPaymentMethod } from '@/types/payment-method.type';
import {
  TPaymentMethodSchema,
  paymentMethodSchema,
} from '@/validations/payment-method.validation';
import { yupResolver } from '@hookform/resolvers/yup';
import { Dispatch, SetStateAction, useCallback, useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { FiX } from 'react-icons/fi';
import { LuLoader2 } from 'react-icons/lu';
import { useQueryClient } from 'react-query';
import { toast } from 'sonner';
import Pencxil from '../svg/Pencxil';
import { Form, FormField, FormItem, FormLabel } from '../ui/form';
import { Input } from '../ui/input';
import BaseFormError from '../common/base-form-error';

type TSheetEditPaymentMethodProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  paymentMethod: TPaymentMethod | undefined;
};

export default function SheetEditPaymentMethod({
  open,
  setOpen,
  paymentMethod,
}: TSheetEditPaymentMethodProps) {
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
  const { mutate, isLoading } = useEditPaymentMethod({
    onSuccess: (resp) => {
      if (resp.code === HTTP_STATUS.SUCCESS) {
        toast.success('success to edit payment method');
        queryClient.invalidateQueries({ queryKey: ['payment-methods'] });
        setOpen((prev) => !prev);
      } else {
        toast.error('failed to edit payment method', {
          description: resp.message,
        });
        setOpen((prev) => !prev);
      }
    },
  });

  // actual submit
  const actualSubmit: SubmitHandler<TPaymentMethodSchema> = useCallback(
    (values) => {
      if (paymentMethod) {
        mutate({ id: paymentMethod.id, payload: values });
      }
    },
    [mutate, paymentMethod],
  );

  // populate
  useEffect(() => {
    if (paymentMethod) {
      form.setValue('name', paymentMethod.name);
      form.setValue('instruction', paymentMethod.instruction);
    }
  }, [form, paymentMethod, open]);

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

        <Form {...form}>
          <form onSubmit={form.handleSubmit(actualSubmit)}>
            {/* begin: main drawer */}
            <div className=" mb-4 flex flex-col gap-4">
              <FormField
                control={form.control}
                name="name.en"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('common.name')} en</FormLabel>
                    <Input
                      {...field}
                      placeholder={`${t('common.name')} en`}
                    />
                    <BaseFormError />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name.ar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('common.name')} ar</FormLabel>
                    <Input
                      {...field}
                      placeholder={`${t('common.name')} ar`}
                      dir="rtl"
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
                    <FormLabel>{t('common.instruction')} en</FormLabel>
                    <Input
                      {...field}
                      placeholder={`${t('common.instruction')} en`}
                    />
                    <BaseFormError />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="instruction.ar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('common.instruction')} ar</FormLabel>
                    <Input
                      {...field}
                      placeholder={`${t('common.instruction')} ar`}
                      dir="rtl"
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
                  t('common.saveChanges')
                )}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
