'use client';

import { useEditShippingMethod } from '@/api/shipping-method.api';
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
import { TShippingMethod } from '@/types/shipping-method.type';
import {
  TShippingMethodSchema,
  shippingMethodSchema,
} from '@/validations/shipping-method.validation';
import { yupResolver } from '@hookform/resolvers/yup';
import { Dispatch, SetStateAction, useCallback, useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { FiX } from 'react-icons/fi';
import { LuLoader2 } from 'react-icons/lu';
import { useQueryClient } from 'react-query';
import { toast } from 'sonner';
import BaseFormError from '../common/base-form-error';
import Pencxil from '../svg/Pencxil';
import { Form, FormField, FormItem, FormLabel } from '../ui/form';
import { Input } from '../ui/input';

type TSheetEditShippingMethodProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  shippingMethod: TShippingMethod | undefined;
};

export default function SheetEditShippingMethod({
  open,
  setOpen,
  shippingMethod,
}: TSheetEditShippingMethodProps) {
  // hooks
  const queryClient = useQueryClient();
  const t = useI18n();

  // form
  const form = useForm<TShippingMethodSchema>({
    resolver: yupResolver(shippingMethodSchema),
    defaultValues: {
      deliveryCompanyName: '',
      deliveryEstimateTime: '',
      providerName: '',
    },
  });

  // mutation
  const { mutate, isLoading } = useEditShippingMethod({
    onSuccess: (resp) => {
      if (resp.code === HTTP_STATUS.SUCCESS) {
        toast.success('Success to edit shipping method');
        queryClient.invalidateQueries({ queryKey: ['shipping-methods'] });
        setOpen((prev) => !prev);
        form.reset();
      } else {
        toast.error('Failed to edit shipping method', {
          description: resp.message,
        });
        setOpen((prev) => !prev);
      }
    },
  });

  // actual submit
  const actualSubmit: SubmitHandler<TShippingMethodSchema> = useCallback(
    (values) => {
      if (shippingMethod) {
        mutate({ id: shippingMethod.id, payload: values });
      }
    },
    [mutate, shippingMethod],
  );

  // populate
  useEffect(() => {
    if (shippingMethod) {
      form.setValue('providerName', shippingMethod.providerName);
      form.setValue('deliveryCompanyName', shippingMethod.deliveryCompanyName);
      form.setValue(
        'deliveryEstimateTime',
        shippingMethod.deliveryEstimateTime,
      );
    }
  }, [form, shippingMethod, open]);

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
                name="providerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('shippingMethod.providerName')}</FormLabel>
                    <Input
                      {...field}
                      placeholder={t('shippingMethod.providerName')}
                    />
                    <BaseFormError />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="deliveryCompanyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('shippingMethod.deliveryCompanyName')}
                    </FormLabel>
                    <Input
                      {...field}
                      placeholder={t('shippingMethod.deliveryCompanyName')}
                    />
                    <BaseFormError />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="deliveryEstimateTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('shippingMethod.deliveryEstimateTime')}
                    </FormLabel>
                    <Input
                      {...field}
                      placeholder={t('shippingMethod.deliveryEstimateTime')}
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
