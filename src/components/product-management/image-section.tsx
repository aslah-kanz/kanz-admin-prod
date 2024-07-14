import Image from 'next/image';
import { Trash } from 'iconsax-react';
import { FaArrowUp } from 'react-icons/fa6';
import { useFieldArray } from 'react-hook-form';
import { Dispatch, SetStateAction } from 'react';
import { useDropzone } from 'react-dropzone';
import { Label } from '../ui/label';
import { Button } from '../ui/button';

type Props = {
  uploadedImages: File[];
  setUploadedImages: Dispatch<SetStateAction<File[]>>;
};

function ImageSection({ setUploadedImages, uploadedImages }: Props) {
  const {
    fields: galleryFields,
    append: galleryAppends,
    remove: galleryRemove,
  } = useFieldArray({
    name: 'galleries',
  });

  const {
    getRootProps: getGalleryRootProps,
    getInputProps: getGalleryInputProps,
    open: galleryOpen,
  } = useDropzone({
    async onDrop(acceptedFiles, _) {
      setUploadedImages((prev) => {
        return [...prev, acceptedFiles[0]];
      });
    },
    noClick: true,
    multiple: false,
    accept: {
      'image/jpg': [],
      'image/png': [],
      'image/jpeg': [],
    },
  });

  const handleDeleteImage = (index: number) => {
    galleryRemove(index);

    setUploadedImages((prev) => prev.splice(index, 1));
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <p className=" text-lg font-medium text-neutral-800">Product Images</p>
        <Button
          type="button"
          variant="ghost"
          className=" h-8 text-xs text-primary hover:bg-transparent hover:text-primary"
          onClick={() => galleryAppends({})}
        >
          Add Images
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
        {galleryFields.map((_, i) => (
          <div
            key={i}
            className="flex flex-col gap-2"
          >
            <div className="flex items-center justify-between">
              <Label className=" text-sm">Image {i + 1}</Label>
              <Button
                variant="destructive"
                size="icon-sm"
                type="button"
                onClick={() => {
                  handleDeleteImage(i);
                }}
              >
                <Trash size={16} />
              </Button>
            </div>
            <div
              {...getGalleryRootProps({
                className:
                  'flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6',
              })}
            >
              <input
                {...getGalleryInputProps({
                  name: `galleries.${i}`,
                })}
              />
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
                  {uploadedImages?.[i]?.name || 'Drag or Upload Image'}{' '}
                </p>
              </div>
              {!uploadedImages?.[i]?.name && (
                <div className=" mt-6">
                  <Button
                    onClick={galleryOpen}
                    type="button"
                    className=" h-8 gap-2"
                  >
                    <FaArrowUp size={12} />
                    Upload
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default ImageSection;
