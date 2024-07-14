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
import { TShippingMethod } from '@/types/shipping-method.type';
import { Dispatch, SetStateAction } from 'react';
import { FiX } from 'react-icons/fi';

type TSheetDetailShippingMethodProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  shippingMethod: TShippingMethod | undefined;
};

export default function SheetDetailShippingMethod({
  open,
  setOpen,
  shippingMethod,
}: TSheetDetailShippingMethodProps) {
  const t = useI18n();
  return (
    shippingMethod && (
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
              <Label className=" text-sm">
                {t('shippingMethod.providerName')}
              </Label>
              <p className=" text-sm font-medium text-neutral-500">
                {shippingMethod.providerName}
              </p>
            </div>
            <div className=" flex flex-col gap-2">
              <Label className=" text-sm">
                {t('shippingMethod.deliveryCompanyName')}
              </Label>
              <p className=" text-sm font-medium text-neutral-500">
                {shippingMethod.deliveryCompanyName}
              </p>
            </div>
            <div className=" flex flex-col gap-2">
              <Label className=" text-sm">
                {t('shippingMethod.deliveryEstimateTime')}
              </Label>
              <p className=" text-sm font-medium text-neutral-500">
                {shippingMethod.deliveryEstimateTime}
              </p>
            </div>
            {/* end: main form */}
          </div>
        </SheetContent>
      </Sheet>
    )
  );
}
