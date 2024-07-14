'use client';

import { TRejectExchangePayload } from '@/types/exchange.type';
import { yupResolver } from '@hookform/resolvers/yup';
import { InfoCircle } from 'iconsax-react';
import { Dispatch, SetStateAction, useCallback, useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { LuLoader2 } from 'react-icons/lu';
import * as yup from 'yup';
import { Button } from '../ui/button';
import { Dialog, DialogClose, DialogContent } from '../ui/dialog';
import { Form, FormField, FormItem, FormMessage } from '../ui/form';
import { Textarea } from '../ui/textarea';

type TDialogApproveProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  onApprove: (payload: TRejectExchangePayload) => void;
  isLoading?: boolean;
};

const schema = yup.object().shape({
  comment: yup.string().min(1).required('required').label('comment'),
});

type TSchema = yup.InferType<typeof schema>;

export default function DialogApprove({
  open,
  setOpen,
  onApprove,
  isLoading,
}: TDialogApproveProps) {
  const form = useForm<TSchema>({
    resolver: yupResolver(schema),
    defaultValues: {
      comment: '',
    },
  });

  const actualSubmit: SubmitHandler<TSchema> = useCallback(
    (values) => {
      onApprove(values);
    },
    [onApprove],
  );

  useEffect(() => {
    form.reset();
    form.clearErrors();
  }, [form, open]);

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogContent className=" max-w-lg p-0">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(actualSubmit)}
            className=" w-full"
          >
            <div className=" w-full space-y-6 p-6">
              <div className="flex flex-col items-center justify-center gap-4">
                <InfoCircle
                  className=" text-blue-500"
                  size={60}
                  variant="Bold"
                />

                <div className=" space-y-1 text-center">
                  <p className=" font-medium text-neutral-800">
                    Approval Confirmation
                  </p>
                  <p className=" text-center text-sm text-neutral-500">
                    Are you sure you want to approve this product?
                  </p>
                </div>
              </div>

              <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                  <FormItem>
                    <Textarea
                      placeholder="Comment"
                      value={field.value}
                      onChange={field.onChange}
                      className=" w-full"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className=" flex w-full justify-end gap-4 border-t px-6 py-4">
              <DialogClose asChild>
                <Button variant="ghost-primary">Cancel</Button>
              </DialogClose>
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
                Approve
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
