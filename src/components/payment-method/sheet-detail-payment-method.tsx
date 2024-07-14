'use client';

import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useI18n } from '@/locales/client';
import { TPaymentMethod } from '@/types/payment-method.type';
import { Dispatch, SetStateAction } from 'react';
import { FiX } from 'react-icons/fi';

type TSheetDetailPaymentMethodProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  paymentMethod: TPaymentMethod | undefined;
};

export default function SheetDetailPaymentMethod({
  open,
  setOpen,
  paymentMethod,
}: TSheetDetailPaymentMethodProps) {
  // hooks
  const t = useI18n();

  return (
    paymentMethod && (
      <Sheet
        // open
        open={open}
        onOpenChange={setOpen}
      >
        <SheetContent className=" flex flex-col gap-4 overflow-y-auto bg-white p-4 py-0">
          <SheetHeader className=" sticky top-0 gap-2 bg-white pt-4">
            <div className="flex items-center justify-between">
              <SheetTitle>{t('common.viewDetails')}</SheetTitle>
              <SheetClose>
                <FiX />
              </SheetClose>
            </div>
            <hr />
          </SheetHeader>

          <div className=" flex flex-col gap-4">
            {/* begin: main form */}
            <div className=" flex flex-col gap-2">
              <Label className=" text-sm">{t('common.name')} en</Label>
              <p className=" text-sm font-medium text-neutral-500">
                {paymentMethod.name.en}
              </p>
            </div>
            <div className=" flex flex-col gap-2">
              <Label className=" text-sm">{t('common.name')} ar</Label>
              <p className=" text-sm font-medium text-neutral-500">
                {paymentMethod.name.ar}
              </p>
            </div>
            <div className=" flex flex-col gap-2">
              <Label className=" text-sm">{t('common.instruction')} en</Label>
              <p className=" text-sm font-medium text-neutral-500">
                {paymentMethod.instruction.en}
              </p>
            </div>
            <div className=" flex flex-col gap-2">
              <Label className=" text-sm">{t('common.instruction')} ar</Label>
              <p className=" text-sm font-medium text-neutral-500">
                {paymentMethod.instruction.ar}
              </p>
            </div>
            {/* end: main form */}
          </div>
        </SheetContent>
      </Sheet>
    )
  );
}
