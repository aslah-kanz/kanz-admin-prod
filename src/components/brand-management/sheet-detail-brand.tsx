'use client';

import { useGetBrandById } from '@/api/brand.api';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useI18n } from '@/locales/client';
import { getBadgeVariant, slugToOriginal } from '@/utils/common.util';
import Image from 'next/image';
import { Dispatch, SetStateAction } from 'react';
import { FiX } from 'react-icons/fi';
import BaseSkeleton from '../common/base-skeleton';
import { Skeleton } from '../ui/skeleton';

type TSheetDetailBrandProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  brandId: number | undefined;
};

export default function SheetDetailBrand({
  open,
  setOpen,
  brandId,
}: TSheetDetailBrandProps) {
  // hooks
  const t = useI18n();

  // fetch
  const { data: brand, isLoading } = useGetBrandById(brandId ?? 0, {
    enabled: !!brandId,
  });

  return (
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

        {isLoading ? (
          <div className="mb-4 flex flex-col gap-4">
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                className=" space-y-2"
              >
                <Skeleton className=" h-5 w-24" />
                <Skeleton className=" h-5 w-full" />
              </div>
            ))}
            <BaseSkeleton variant="image" />
            <BaseSkeleton variant="image" />
          </div>
        ) : (
          brand && (
            <div className=" mb-4 flex flex-col gap-4">
              {/* begin: main form */}
              <div className=" flex flex-col gap-2">
                <Label className=" text-sm">{t('common.name')} en</Label>
                <p className=" text-sm font-medium text-neutral-500">
                  {brand.name.en}
                </p>
              </div>
              <div className=" flex flex-col gap-2">
                <Label className=" text-sm">{t('common.name')} ar</Label>
                <p className=" text-sm font-medium text-neutral-500">
                  {brand.name.ar}
                </p>
              </div>
              <div className=" flex flex-col gap-2">
                <Label className=" text-sm">{t('common.slug')}</Label>
                <p className=" text-sm font-medium text-neutral-500">
                  {brand.slug}
                </p>
              </div>
              <div className=" flex flex-col gap-2">
                <Label className=" text-sm">{t('common.description')} en</Label>
                <p className=" text-sm font-medium text-neutral-500">
                  {brand.description.en}
                </p>
              </div>
              <div className=" flex flex-col gap-2">
                <Label className=" text-sm">{t('common.description')} ar</Label>
                <p className=" text-sm font-medium text-neutral-500">
                  {brand.description.ar}
                </p>
              </div>
              <div className=" flex flex-col gap-2">
                <Label className=" text-sm">{t('common.metaKeyword')}</Label>
                <p className=" text-sm font-medium text-neutral-500">
                  {brand.metaKeyword}
                </p>
              </div>
              <div className=" flex flex-col gap-2">
                <Label className=" text-sm">
                  {t('common.metaDescription')}
                </Label>
                <p className=" text-sm font-medium text-neutral-500">
                  {brand.metaDescription}
                </p>
              </div>
              <div className=" flex flex-col gap-2">
                <Label className=" text-sm">{t('common.showAtHomePage')}</Label>
                <p className=" text-sm font-medium text-neutral-500">
                  {String(brand.showAtHomePage)}
                </p>
              </div>
              <div className=" flex flex-col gap-2">
                <Label className=" text-sm">{t('common.status')}</Label>
                <Badge variant={getBadgeVariant(brand?.status ?? '')}>
                  {slugToOriginal(brand.status)}
                </Badge>
              </div>
              <div className=" flex flex-col gap-2">
                <Label className=" text-sm">{t('common.image')}</Label>
                <div className=" relative aspect-square w-20 overflow-hidden rounded-lg">
                  <Image
                    src={brand?.image.url}
                    fill
                    alt=""
                    className=" object-contain object-center"
                  />
                </div>
              </div>
              {brand.bwImage && (
                <div className=" flex flex-col gap-2">
                  <Label className=" text-sm">
                    {t('common.image')} ({t('common.grayscale')})
                  </Label>
                  <div className=" relative aspect-square w-20 overflow-hidden rounded-lg">
                    <Image
                      src={brand.bwImage?.url}
                      fill
                      alt=""
                      className=" object-contain object-center"
                    />
                  </div>
                </div>
              )}
              {/* end: main form */}
            </div>
          )
        )}
      </SheetContent>
    </Sheet>
  );
}
