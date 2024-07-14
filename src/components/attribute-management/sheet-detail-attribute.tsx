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
import { TAttribute } from '@/types/attribute.type';
import { Dispatch, SetStateAction } from 'react';
import { FiX } from 'react-icons/fi';

type TSheetDetailAttributeProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  attribute: TAttribute | undefined;
};

export default function SheetDetailAttribute({
  open,
  setOpen,
  attribute,
}: TSheetDetailAttributeProps) {
  const t = useI18n();
  return (
    attribute && (
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
                {attribute.name.en}
              </p>
            </div>
            <div className=" flex flex-col gap-2">
              <Label className=" text-sm">{t('common.name')} ar</Label>
              <p className=" text-sm font-medium text-neutral-500">
                {attribute.name.ar}
              </p>
            </div>
            <div className=" flex flex-col gap-2">
              <Label className=" text-sm">{t('common.group')} en</Label>
              <p className=" text-sm font-medium text-neutral-500">
                {attribute.group.en}
              </p>
            </div>
            <div className=" flex flex-col gap-2">
              <Label className=" text-sm">{t('common.group')} ar</Label>
              <p className=" text-sm font-medium text-neutral-500">
                {attribute.group.ar}
              </p>
            </div>
            <div className=" flex flex-col gap-2">
              <Label className=" text-sm">{t('common.unit1')} en</Label>
              <p className=" text-sm font-medium text-neutral-500">
                {attribute.unit1.en}
              </p>
            </div>
            <div className=" flex flex-col gap-2">
              <Label className=" text-sm">{t('common.unit1')} ar</Label>
              <p className=" text-sm font-medium text-neutral-500">
                {attribute.unit1.ar}
              </p>
            </div>
            <div className=" flex flex-col gap-2">
              <Label className=" text-sm">{t('common.unit2')} en</Label>
              <p className=" text-sm font-medium text-neutral-500">
                {attribute.unit2.en}
              </p>
            </div>
            <div className=" flex flex-col gap-2">
              <Label className=" text-sm">{t('common.unit2')} ar</Label>
              <p className=" text-sm font-medium text-neutral-500">
                {attribute.unit2.ar}
              </p>
            </div>
            <div className=" flex flex-col gap-2">
              <Label className=" text-sm">{t('common.unit3')} en</Label>
              <p className=" text-sm font-medium text-neutral-500">
                {attribute.unit3.en}
              </p>
            </div>
            <div className=" flex flex-col gap-2">
              <Label className=" text-sm">{t('common.unit3')} ar</Label>
              <p className=" text-sm font-medium text-neutral-500">
                {attribute.unit3.ar}
              </p>
            </div>
            {/* end: main form */}
          </div>
        </SheetContent>
      </Sheet>
    )
  );
}
