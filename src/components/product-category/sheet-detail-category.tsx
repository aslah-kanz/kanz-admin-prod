'use client';

import { useGetCategoryById } from '@/api/category.api';
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
import { Dispatch, SetStateAction } from 'react';
import { FiX } from 'react-icons/fi';
import { Skeleton } from '../ui/skeleton';

type TSheetDetailCategoryProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  categoryId: number | undefined;
};

export default function SheetDetailCategory({
  open,
  setOpen,
  categoryId,
}: TSheetDetailCategoryProps) {
  // hooks
  const t = useI18n();

  // fetch
  const { data: category, isLoading } = useGetCategoryById(categoryId ?? 0, {
    enabled: !!categoryId && !!open,
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
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className=" space-y-2"
              >
                <Skeleton className=" h-5 w-24" />
                <Skeleton className=" h-5 w-full" />
              </div>
            ))}
          </div>
        ) : (
          category && (
            <div className=" mb-4 flex flex-col gap-4">
              {/* begin: main form */}
              <div className=" flex flex-col gap-2">
                <Label className=" text-sm">{t('common.name')} en</Label>
                <p className=" text-sm font-medium text-neutral-500">
                  {category.name?.en}
                </p>
              </div>
              <div className=" flex flex-col gap-2">
                <Label className=" text-sm">{t('common.name')} ar</Label>
                <p className=" text-sm font-medium text-neutral-500">
                  {category.name?.ar}
                </p>
              </div>
              <div className=" flex flex-col gap-2">
                <Label className=" text-sm">{t('common.slug')}</Label>
                <p className=" text-sm font-medium text-neutral-500">
                  {category.slug}
                </p>
              </div>
              <div className=" flex flex-col gap-2">
                <Label className=" text-sm">{t('common.description')} en</Label>
                <p className=" text-sm font-medium text-neutral-500">
                  {category?.description?.en}
                </p>
              </div>
              <div className=" flex flex-col gap-2">
                <Label className=" text-sm">{t('common.description')} ar</Label>
                <p className=" text-sm font-medium text-neutral-500">
                  {category?.description?.ar}
                </p>
              </div>
              <div className=" flex flex-col gap-2">
                <Label className=" text-sm">{t('common.metaKeyword')}</Label>
                <p className=" text-sm font-medium text-neutral-500">
                  {category.metaKeyword}
                </p>
              </div>
              <div className=" flex flex-col gap-2">
                <Label className=" text-sm">
                  {t('common.metaDescription')}
                </Label>
                <p className=" text-sm font-medium text-neutral-500">
                  {category.metaDescription}
                </p>
              </div>
              <div className=" flex flex-col gap-2">
                <Label className=" text-sm">{t('common.showAtHomePage')}</Label>
                <p className=" text-sm font-medium text-neutral-500">
                  {/* @ts-expect-error */}
                  {t(`common.${String(category.showAtHomePage)}` as any)}
                </p>
              </div>
              <div className=" flex flex-col gap-2">
                <Label className=" text-sm">{t('common.status')}</Label>
                <Badge variant={getBadgeVariant(category?.status ?? '')}>
                  {slugToOriginal(category.status)}
                </Badge>
              </div>
              {/* <div className=" flex flex-col gap-2">
              <Label className=" text-sm">Image</Label>
              <div className=" relative aspect-square w-20 overflow-hidden rounded-lg">
                <Image
                  src={category?.image.url ?? ''}
                  fill
                  alt=""
                  className=" object-contain object-center"
                />
              </div>
            </div> */}
              {/* end: main form */}
            </div>
          )
        )}
      </SheetContent>
    </Sheet>
  );
}
