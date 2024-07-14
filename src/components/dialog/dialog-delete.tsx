'use client';

import React from 'react';
import Image from 'next/image';
import { LuLoader2 } from 'react-icons/lu';
import { useI18n } from '@/locales/client';
import { Button } from '../ui/button';
import { Dialog, DialogClose, DialogContent } from '../ui/dialog';

type TDialogDeleteProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete?: () => void;
  onCancel?: () => void;
  isLoading?: boolean;
};

export default function DialogDelete({
  open,
  onOpenChange,
  onDelete,
  onCancel,
  isLoading = false,
}: TDialogDeleteProps) {
  const t = useI18n();

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className=" max-w-xl p-0">
        <div className=" flex flex-col items-center gap-2 p-16 text-center">
          <div className=" relative aspect-square w-20">
            <Image
              src="/images/recycle-bin.png"
              fill
              alt=""
              className=" object-contain object-center"
            />
          </div>
          <h1 className=" text-lg font-medium text-neutral-800">
            {t('common.deleteData')}
          </h1>
          <p className=" text-sm text-neutral-500">{t('common.deleteDesc')}</p>
        </div>
        <div className=" flex justify-end gap-4 border-t px-6 py-4">
          <DialogClose asChild>
            <Button
              className=" text-primary"
              variant="ghost"
              onClick={onCancel}
              disabled={isLoading}
            >
              {t('common.cancel')}
            </Button>
          </DialogClose>
          <Button
            onClick={onDelete}
            disabled={isLoading}
          >
            {isLoading && (
              <LuLoader2
                className=" animate-spin text-white"
                size={16}
              />
            )}
            {t('common.delete')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
