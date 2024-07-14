'use client';

import { useAddCountry } from '@/api/country.api';
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
import { onlyNumber } from '@/utils/input.util';
import {
  TCountrySchema,
  countrySchema,
} from '@/validations/country.validation';
import { yupResolver } from '@hookform/resolvers/yup';
import { Dispatch, SetStateAction, useCallback, useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { FiX } from 'react-icons/fi';
import { LuLoader2 } from 'react-icons/lu';
import { useQueryClient } from 'react-query';
import { toast } from 'sonner';
import BaseDropzone from '../common/base-dropzone';
import BaseFormError from '../common/base-form-error';
import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form';

type TSheetAddCountryProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export default function SheetAddCountry({
  open: openSheet,
  setOpen,
}: TSheetAddCountryProps) {
  // hooks
  const queryClient = useQueryClient();

  const form = useForm<TCountrySchema>({
    resolver: yupResolver(countrySchema),
    defaultValues: {
      code: '',
      name: {
        en: '',
        ar: '',
      },
    },
  });

  // mutation
  const { mutateAsync: addCountry, isLoading: loadingAddCountry } =
    useAddCountry({
      onSuccess: (resp) => {
        if (resp.code === HTTP_STATUS.SUCCESS) {
          toast.success('Success to add country');
          queryClient.invalidateQueries({ queryKey: ['countries'] });
          setOpen((prev) => !prev);
        } else {
          toast.success('Failed to add country', { description: resp.message });
        }
      },
    });

  const actualSubmit: SubmitHandler<TCountrySchema> = useCallback(
    async (values) => {
      addCountry(values);
    },
    [addCountry],
  );

  useEffect(() => {
    form.reset();
  }, [form, openSheet]);

  return (
    <Sheet
      open={openSheet}
      onOpenChange={setOpen}
    >
      <SheetContent className=" flex flex-col gap-4 overflow-y-auto bg-white p-4 py-0">
        <SheetHeader className=" sticky top-0 z-[2] gap-2 bg-white pt-4">
          <div className="flex items-center justify-between">
            <SheetTitle>Add Country</SheetTitle>
            <SheetClose>
              <FiX />
            </SheetClose>
          </div>
          <hr />
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(actualSubmit)}>
            <div className=" flex flex-col gap-4">
              {/* begin: main form */}
              <FormField
                control={form.control}
                name="imageId"
                render={() => (
                  <FormItem>
                    <FormLabel className=" text-sm">Flag</FormLabel>
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
                name="code"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className=" text-sm">Code</FormLabel>
                    <Input
                      placeholder="Input Code"
                      {...field}
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
                    <FormLabel className=" text-sm">Name en</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Input Name"
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
                    <FormLabel className=" text-sm">Name ar</FormLabel>
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
                name="phoneCode"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className=" text-sm">Phone Code</FormLabel>
                    <Input
                      placeholder="Input Phone Code"
                      {...field}
                      {...onlyNumber(field)}
                    />
                    <BaseFormError />
                  </FormItem>
                )}
              />
              <FormField
                name="phoneStartNumber"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className=" text-sm">
                      Phone Start Number
                    </FormLabel>
                    <Input
                      placeholder="Input Phone Start Number"
                      {...field}
                      {...onlyNumber(field)}
                    />
                    <BaseFormError />
                  </FormItem>
                )}
              />
              <FormField
                name="phoneMinLength"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className=" text-sm">Phone Min Length</FormLabel>
                    <Input
                      placeholder="Input Phone Min Length"
                      {...field}
                      {...onlyNumber(field)}
                    />
                    <BaseFormError />
                  </FormItem>
                )}
              />
              <FormField
                name="phoneMaxLength"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className=" text-sm">Phone Max Length</FormLabel>
                    <Input
                      placeholder="Input Phone Max Length"
                      {...field}
                      {...onlyNumber(field)}
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
                disabled={loadingAddCountry}
              >
                {loadingAddCountry ? (
                  <LuLoader2
                    className=" animate-spin text-white"
                    size={16}
                  />
                ) : (
                  'Add Country'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
