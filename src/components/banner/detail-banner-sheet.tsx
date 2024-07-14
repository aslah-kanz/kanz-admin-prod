import { useGetBannerById } from '@/api/banner.api';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import useDetailBannerSheetStore from '@/store/detail-banner-sheet.store';
import { Switch } from '@/components/ui/switch';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FiX } from 'react-icons/fi';

function DetailBannerSheet() {
  const [image, setImage] = useState('');

  const { isOpen, initialValue, onChangeOpen, setInitialValue } =
    useDetailBannerSheetStore();

  const { data: detailBanner, isLoading: _loadingLoad } = useGetBannerById(
    initialValue?.id!,
  );
  const [isChecked, setIsChecked] = useState<boolean>(false);

  useEffect(() => {
    if (detailBanner) {
      setTimeout(() => {
        if (detailBanner.status === 'published') {
          setIsChecked(true);
        } else {
          setIsChecked(false);
        }
        setImage(detailBanner.image?.url ?? '');
      }, 150);
    }
  }, [detailBanner]);

  // console.log('checkDetailBanner', detailBanner);

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => {
        onChangeOpen(open);
        setImage('');
        setInitialValue(null);
      }}
    >
      <SheetContent className=" flex flex-col gap-4 overflow-y-auto bg-white p-4 py-0">
        <SheetHeader
          className=" sticky top-0 gap-2 bg-white pt-4"
          style={{ zIndex: 1 }}
        >
          <div className="flex items-center justify-between">
            <SheetTitle>
              <div className="flex items-center gap-2">Detail Banner</div>
            </SheetTitle>
            <SheetClose>
              <FiX />
            </SheetClose>
          </div>
          <hr />
        </SheetHeader>

        <div className=" flex flex-col gap-4">
          {/* begin: main form */}
          <div className=" flex flex-col gap-2">
            <Label className=" text-sm">Banner File</Label>
            <div className=" group relative mx-auto aspect-[2/0.8] w-full overflow-hidden rounded-lg border">
              {image && (
                <Image
                  src={image}
                  fill
                  alt=""
                  className="object-contain"
                />
              )}
            </div>
          </div>
          <div className=" flex flex-col gap-2">
            <Label className=" text-sm">Title EN</Label>
            <p className="text-sm font-medium text-neutral-500">
              {detailBanner?.title?.en}
            </p>
          </div>
          <div className=" flex flex-col gap-2">
            <Label className=" text-sm">Title AR</Label>
            <p
              dir="rtl"
              className="text-sm font-medium text-neutral-500"
            >
              {detailBanner?.title?.ar}
            </p>
          </div>
          <div className=" flex flex-col gap-2">
            <Label className=" text-sm">Link</Label>
            <Link
              href={detailBanner?.url ?? ''}
              className="overflow-hidden truncate text-ellipsis text-xs font-medium text-neutral-500"
            >
              {detailBanner?.url}
            </Link>
          </div>
          <div className=" flex flex-col gap-2">
            <Label className=" text-sm">Description EN</Label>
            <p className="text-sm font-medium text-neutral-500">
              {detailBanner?.description?.en}
            </p>
          </div>
          <div className=" flex flex-col gap-2">
            <Label className=" text-sm">Description AR</Label>
            <p
              dir="rtl"
              className="text-sm font-medium text-neutral-500"
            >
              {detailBanner?.description?.ar}
            </p>
          </div>
          <div className=" flex flex-col gap-2">
            <Label className=" text-sm">Publish</Label>
            <Switch checked={isChecked} />
          </div>
          {/* end: main form */}
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default DetailBannerSheet;
