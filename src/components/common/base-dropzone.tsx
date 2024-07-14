'use client';

import { useUploadImage } from '@/api/image.api';
import { HTTP_STATUS } from '@/constants/common.constant';
import { cn } from '@/lib/utils';
import { useI18n } from '@/locales/client';
import { TImage } from '@/types/image.type';
import Image from 'next/image';
import { createRef, useState } from 'react';
import Dropzone, { DropzoneRef } from 'react-dropzone';
import { FaArrowUp } from 'react-icons/fa6';
import { LuLoader2 } from 'react-icons/lu';
import { toast } from 'sonner';
import Pencxil from '../svg/Pencxil';
import { Button } from '../ui/button';

type TImageSizeType = 'contain' | 'cover';

type TBaseDropzoneProps = {
  image?: TImage | undefined;
  onImageUpload: (image: TImage) => void;
  imageSize?: TImageSizeType;
};

export default function BaseDropzone({
  onImageUpload,
  image,
  imageSize = 'cover',
}: TBaseDropzoneProps) {
  // hooks
  const t = useI18n();

  // state
  const [localImage, setLocalImage] = useState<TImage | undefined>(image);

  // mutation
  const { mutateAsync: uploadImage, isLoading: loadingUploadImage } =
    useUploadImage({
      onSuccess: (resp) => {
        if (resp.code === HTTP_STATUS.SUCCESS) {
          setLocalImage(resp.data);
          onImageUpload(resp.data);
          toast.success('Success to upload image');
        } else {
          toast.error('Failed to upload image', { description: resp.message });
        }
      },
    });

  // ref
  const dropzoneRef = createRef<DropzoneRef>();

  // handle open dialog
  const openDialog = () => {
    if (dropzoneRef.current) {
      dropzoneRef.current.open();
    }
  };

  return loadingUploadImage ? (
    <div className=" aspect-[2/1] w-full overflow-hidden rounded-lg border">
      <div className=" flex h-full w-full flex-col items-center justify-center bg-black/25">
        <LuLoader2
          className=" animate-spin text-white"
          size={24}
        />
        <p className=" text-white">{t('common.uploading')}</p>
      </div>
    </div>
  ) : (
    <Dropzone
      ref={dropzoneRef}
      noClick
      noKeyboard
      onDrop={(acceptedFiles) => {
        if (acceptedFiles.length > 0) {
          const formData = new FormData();
          formData.append('file', acceptedFiles[0]);
          formData.append('name', `${Date.now()}-${acceptedFiles[0].name}`);
          uploadImage(formData);
        }
      }}
      onDropRejected={(rejectedFiles) => {
        if (rejectedFiles.length > 0) {
          toast.error(rejectedFiles[0].errors[0].message);
        }
      }}
      multiple={false}
      maxFiles={1}
      maxSize={1024 * 1024 * 2}
      accept={{
        'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.svg'],
      }}
    >
      {({ getRootProps, getInputProps }) => {
        if (localImage) {
          return (
            <div
              {...getRootProps()}
              className="group relative mx-auto aspect-[2/1] w-full overflow-hidden rounded-lg border"
            >
              <input {...getInputProps()} />
              <Image
                src={localImage.url}
                fill
                alt=""
                className={cn(' object-cover object-center', {
                  'object-contain': imageSize === 'contain',
                })}
              />
              <div className=" absolute inset-0 flex h-full w-full items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100">
                <div className="flex gap-2">
                  <Button
                    size="icon"
                    className=" border border-white fill-white text-white hover:bg-white hover:fill-neutral-950 hover:text-neutral-950"
                    variant="transparent"
                    onClick={openDialog}
                    type="button"
                  >
                    <Pencxil />
                  </Button>
                </div>
              </div>
            </div>
          );
        }
        return (
          <div
            {...getRootProps({
              className:
                'flex flex-col items-center justify-center w-full aspect-[2/1] rounded-lg border-2 border-dashed p-6',
            })}
          >
            <input {...getInputProps()} />
            <div className="flex w-full flex-col gap-2 text-center">
              <div className=" relative aspect-square h-14">
                <Image
                  src="/images/image-upload.png"
                  fill
                  alt=""
                  className=" object-contain object-center"
                />
              </div>
              <p className=" text-sm text-neutral-500">
                {t('common.dragOrUpload')}
              </p>
            </div>
            <div className=" mt-4">
              <Button
                onClick={openDialog}
                type="button"
                variant="ghost-primary"
                size="sm"
              >
                <FaArrowUp size={12} />
                {t('common.upload')}
              </Button>
            </div>
          </div>
        );
      }}
    </Dropzone>
  );
}
