'use client';

import { useAddShippingMethod } from '@/api/shipping-method.api';
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
  TShippingMethodSchema,
  shippingMethodSchema,
} from '@/validations/shipping-method.validation';
import { yupResolver } from '@hookform/resolvers/yup';
import { TruckTick } from 'iconsax-react';
import { Dispatch, SetStateAction, useCallback, useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { FaPlus } from 'react-icons/fa6';
import { FiX } from 'react-icons/fi';
import { LuLoader2 } from 'react-icons/lu';
import { useQueryClient } from 'react-query';
import { toast } from 'sonner';
import BaseFormError from '../common/base-form-error';
import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form';

type TSheetAddShippingMethodProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export default function SheetAddShippingMethod({
  open,
  setOpen,
}: TSheetAddShippingMethodProps) {
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
  const { mutate, isLoading } = useAddShippingMethod({
    onSuccess: (resp) => {
      if (resp.code === HTTP_STATUS.SUCCESS) {
        toast.success('Success to add shipping method');
        form.reset();
        queryClient.invalidateQueries({ queryKey: ['shipping-methods'] });
        setOpen((prev) => !prev);
      } else {
        toast.error('Failed to add shipping method', {
          description: resp.message,
        });
        setOpen((prev) => !prev);
      }
    },
  });

  // actual submit
  const actualSubmit: SubmitHandler<TShippingMethodSchema> = useCallback(
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
                <TruckTick size={24} />
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
                name="providerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className=" text-sm">
                      {t('shippingMethod.providerName')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('shippingMethod.providerName')}
                        {...field}
                      />
                    </FormControl>
                    <BaseFormError />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="deliveryCompanyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className=" text-sm">
                      {t('shippingMethod.deliveryCompanyName')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('shippingMethod.deliveryCompanyName')}
                        {...field}
                      />
                    </FormControl>
                    <BaseFormError />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="deliveryEstimateTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className=" text-sm">
                      {t('shippingMethod.deliveryEstimateTime')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('shippingMethod.deliveryEstimateTime')}
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
