'use client';

import { useEditCountry } from '@/api/country.api';
import Pencxil from '@/components/svg/Pencxil';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { HTTP_STATUS } from '@/constants/common.constant';
import { TCountry, TCountryRequest } from '@/types/country.type';
import { onlyNumber } from '@/utils/input.util';
import { TCountrySchema } from '@/validations/country.validation';
import { Dispatch, SetStateAction, useCallback, useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { FiX } from 'react-icons/fi';
import { LuLoader2 } from 'react-icons/lu';
import { useQueryClient } from 'react-query';
import { toast } from 'sonner';
import BaseDropzone from '../common/base-dropzone';
import BaseFormError from '../common/base-form-error';
import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form';
import { Input } from '../ui/input';

type TSheetEditCountryProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  country: TCountry | undefined;
};

export default function SheetEditCountry({
  open: openSheet,
  setOpen,
  country,
}: TSheetEditCountryProps) {
  // hooks
  const queryClient = useQueryClient();

  // form
  const form = useForm<TCountrySchema>({
    defaultValues: {
      code: '',
      name: {
        en: '',
        ar: '',
      },
      phoneCode: undefined,
      phoneMinLength: undefined,
      phoneStartNumber: undefined,
      phoneMaxLength: undefined,
    },
  });

  // mutation
  const { mutate: editCountry, isLoading: loadingEditCountry } = useEditCountry(
    {
      onSuccess: (resp) => {
        if (resp.code === HTTP_STATUS.SUCCESS) {
          toast.success('Success to edit country');
          queryClient.invalidateQueries({ queryKey: ['countries'] });
          setOpen((prev) => !prev);
        } else {
          toast.success('Failed to edit country', {
            description: resp.message,
          });
        }
      },
    },
  );

  // actual submit
  const actualSubmit: SubmitHandler<TCountrySchema> = useCallback(
    async (values) => {
      if (country) {
        const payload: TCountryRequest = values;
        editCountry({ id: country.id, payload });
      }
    },
    [country, editCountry],
  );

  useEffect(() => {
    if (country) {
      form.setValue('name', country.name);
      form.setValue('phoneCode', country.phoneCode);
      form.setValue('phoneMaxLength', country.phoneMaxLength);
      form.setValue('phoneMinLength', country.phoneMinLength);
      form.setValue('phoneStartNumber', country.phoneStartNumber);
      form.setValue('code', country.code);
      form.setValue('imageId', country.image.id);
    }
  }, [form, country, openSheet]);

  useEffect(() => {
    form.clearErrors();
  }, [form, openSheet]);

  return (
    <Sheet
      open={openSheet}
      onOpenChange={setOpen}
    >
      <SheetContent className=" flex flex-col gap-4 overflow-y-auto bg-white p-4 py-0">
        <SheetHeader className=" sticky top-0 z-[2] gap-2 bg-white pt-4">
          <div className="flex items-center justify-between">
            <SheetTitle>
              <div className="flex items-center gap-2">
                <Pencxil
                  width={20}
                  height={20}
                />
                Edit Country
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
            <div className=" flex flex-col gap-4">
              {/* begin: main form */}
              <FormField
                control={form.control}
                name="imageId"
                render={() => (
                  <FormItem>
                    <FormLabel className=" text-sm">Flag</FormLabel>
                    <BaseDropzone
                      image={country?.image}
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
            <div className=" sticky bottom-0 mt-4 flex flex-col space-y-2 bg-white py-4 pt-2">
              <Button
                type="submit"
                disabled={loadingEditCountry}
              >
                {loadingEditCountry ? (
                  <LuLoader2
                    className=" animate-spin text-white"
                    size={16}
                  />
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
