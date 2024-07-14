'use client';

import { useEditJobField } from '@/api/job.api';
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
import { HTTP_STATUS } from '@/constants/common.constant';
import { useI18n } from '@/locales/client';
import { TJobField } from '@/types/job.type';
import { TJobFieldSchema, jobFieldSchema } from '@/validations/job.validation';
import { yupResolver } from '@hookform/resolvers/yup';
import { Briefcase } from 'iconsax-react';
import { Dispatch, SetStateAction, useCallback, useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { FiX } from 'react-icons/fi';
import { LuLoader2 } from 'react-icons/lu';
import { useQueryClient } from 'react-query';
import { toast } from 'sonner';
import BaseFormError from '../common/base-form-error';

type TSheetEditJobFieldProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  jobField: TJobField | undefined;
};

export default function SheetEditJobField({
  open,
  setOpen,
  jobField,
}: TSheetEditJobFieldProps) {
  // hooks
  const queryClient = useQueryClient();
  const t = useI18n();

  // edit form
  const form = useForm<TJobFieldSchema>({
    resolver: yupResolver(jobFieldSchema),
    defaultValues: {
      name: {
        en: '',
        ar: '',
      },
    },
  });

  // add job field
  const { mutate: editJobField, isLoading: loadingAddJobField } =
    useEditJobField({
      onSuccess: (resp) => {
        if (resp.code === HTTP_STATUS.SUCCESS) {
          toast.success('Success to edit job field');
          queryClient.invalidateQueries({ queryKey: ['job-fields'] });
          setOpen((prev) => !prev);
        } else {
          toast.error('Failed to edit job field', {
            description: resp.message,
          });
        }
      },
    });

  // actual submit add job field
  const actualSubmit: SubmitHandler<TJobFieldSchema> = useCallback(
    (value) => {
      if (
        value.name.en === jobField?.name.en &&
        value.name.ar === jobField.name.ar
      ) {
        setOpen((prev) => !prev);
        return;
      }
      const payload = {
        name: {
          en: value.name.en,
          ar: value.name.ar ?? '',
        },
      };

      editJobField({
        id: jobField?.id ?? 0,
        payload,
      });
    },
    [editJobField, jobField, setOpen],
  );

  useEffect(() => {
    if (jobField) {
      form.setValue('name', jobField?.name);
    }
  }, [form, jobField, open]);

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
                <Briefcase size={24} />
                Edit Job Field
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
            </div>
            <div className=" sticky bottom-0 mt-4 flex flex-col space-y-2 bg-white py-4 pt-2">
              <Button
                type="submit"
                disabled={loadingAddJobField}
              >
                {loadingAddJobField && (
                  <LuLoader2
                    className=" animate-spin text-white"
                    size={16}
                  />
                )}
                {t('common.saveChanges')}
              </Button>
            </div>
          </form>
        </Form>
        {/* begin: main form */}

        {/* end: main form */}
      </SheetContent>
    </Sheet>
  );
}
