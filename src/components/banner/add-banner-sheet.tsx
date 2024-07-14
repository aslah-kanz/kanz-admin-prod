import {
  useAddBanner,
  useGetBannerById,
  useUpdateBanner,
} from '@/api/banner.api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { HTTP_STATUS } from '@/constants/common.constant';
import useAddBannerSheetStore from '@/store/add-banner-sheet.store';
import { TBannerForm } from '@/types/banner.type';
import { yupResolver } from '@hookform/resolvers/yup';
import { MessageAdd1 } from 'iconsax-react';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { FaArrowUp, FaPlus } from 'react-icons/fa6';
import { FiX } from 'react-icons/fi';
import { useQueryClient } from 'react-query';
import { toast } from 'sonner';
import * as yup from 'yup';
import Pencxil from '../svg/Pencxil';

const schema = yup.object().shape({
  titleEn: yup.string().required('This field is required').label('Title EN'),
  titleAr: yup.string().required('This field is required').label('Title AR'),
  link: yup.string().url().required('This field is required').label('Link'),
  imageId: yup.number().required('This field is required').label('Image ID'),
  descriptionEn: yup
    .string()
    .required('This field is required')
    .label('Description EN'),
  descriptionAr: yup
    .string()
    .required('This field is required')
    .label('Description AR'),
  status: yup.string().required('This field is required').label('Status'),
  file: yup.mixed<File>(),
});

function AddBannerSheet() {
  // const [files, setFiles] = useState<File[]>([]);
  const [image, setImage] = useState('');
  const [imageError, setImageError] = useState('');
  const [isChecked, setIsChecked] = useState<boolean>(false);

  const { isOpen, initialValue, onChangeOpen, setInitialValue } =
    useAddBannerSheetStore();

  const { data: detailBanner, isLoading: loadingLoad } = useGetBannerById(
    initialValue?.id!,
  );

  // console.log('chcekDetailBanner', detailBanner);

  const {
    handleSubmit,
    formState: { errors },
    control,
    reset,
    setValue,
    // getValues,
  } = useForm<yup.InferType<typeof schema>>({
    resolver: yupResolver(schema),
    defaultValues: {
      titleEn: '',
      titleAr: '',
      imageId: 0,
      link: '',
      descriptionEn: '',
      descriptionAr: '',
      status: 'draft',
      file: undefined,
    },
  });

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop(acceptedFiles, fileRejections) {
      //   setFiles(acceptedFiles);
      // console.log('checkImages', fileRejections);
      fileRejections.forEach((file) => {
        file.errors.forEach((err) => {
          if (err.code === 'file-too-large') {
            setImageError(`Image is too large`);
          }

          if (err.code === 'file-invalid-type') {
            setImageError(`Invalid type`);
          }
        });
      });
      const newFile = acceptedFiles[0];
      if (newFile) {
        setImage(URL.createObjectURL(newFile));
        setValue('file', newFile);
        setImageError('');
      }
    },
    noClick: true,
    multiple: false,
    maxSize: 5000000,
    accept: {
      'image/jpg': [],
      'image/png': [],
      'image/jpeg': [],
    },
  });

  const onChangeStatus = (isActive: boolean) => {
    if (isActive) {
      setValue('status', 'published');
      setIsChecked(true);
    } else {
      setValue('status', 'draft');
      setIsChecked(false);
    }
  };

  const queryClient = useQueryClient();

  const { mutate: mutateAdd, isLoading: loading } = useAddBanner({
    onSuccess(resp) {
      if (resp.code === HTTP_STATUS.SUCCESS) {
        toast.success('Banner successfully Added');
        reset();
        queryClient.invalidateQueries({
          queryKey: ['getBanner'],
        });
        queryClient.removeQueries('getBanner');
        setImage('');
        onChangeOpen(!isOpen);
        setInitialValue(null);
        reset();
      } else {
        toast.error(resp.message);
      }
    },
  });

  const { mutate: mutateUpdate, isLoading: loadingUpdate } = useUpdateBanner({
    onSuccess(resp) {
      if (resp.code === HTTP_STATUS.SUCCESS) {
        toast.success('Banner successfully updated');
        reset();
        queryClient.invalidateQueries({
          queryKey: ['getBanner'],
        });
        queryClient.invalidateQueries({
          queryKey: ['getBannerById'],
        });
        queryClient.removeQueries('getBanner');
        queryClient.removeQueries('getBannerById');
        setImage('');
        onChangeOpen(!isOpen);
        setInitialValue(null);
        reset();
      } else {
        toast.error(resp.message);
      }
    },
  });

  // console.log('checkInitialValue', initialValue);
  const handleActualSubmit: SubmitHandler<TBannerForm> = useCallback(
    (values: TBannerForm) => {
      if (initialValue) {
        const fd = new FormData();
        fd.append('title.en', values.titleEn);
        fd.append('title.ar', values.titleAr);
        fd.append('description.en', values.descriptionEn);
        fd.append('description.ar', values.descriptionAr);
        fd.append('url', values.link);
        fd.append('status', values.status);
        fd.append('file', values.file as File);

        mutateUpdate({ payload: fd, id: initialValue.id });
      } else {
        const fd = new FormData();
        fd.append('title.en', values.titleEn);
        fd.append('title.ar', values.titleAr);
        fd.append('description.en', values.descriptionEn);
        fd.append('description.ar', values.descriptionAr);
        fd.append('url', values.link);
        fd.append('status', values.status);
        fd.append('file', values.file as File);

        mutateAdd(fd);
      }
    },
    [initialValue, mutateAdd, mutateUpdate],
  );

  useEffect(() => {
    if (detailBanner) {
      // console.log('checkInitialValue', detailBanner);
      setValue('titleEn', detailBanner.title?.en ?? '');
      setValue('titleAr', detailBanner.title?.ar ?? '');
      setValue('descriptionEn', detailBanner.description?.en ?? '');
      setValue('descriptionAr', detailBanner.description?.ar ?? '');
      setValue('link', detailBanner.url ?? '');
      setValue('status', detailBanner.status ?? 'draft');
      setValue('imageId', detailBanner.image?.id ?? 0);
      if (detailBanner.status === 'published') {
        setIsChecked(true);
      } else {
        setIsChecked(false);
      }
      setImage(detailBanner.image?.url ?? '');
    }
  }, [detailBanner, setValue]);

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => {
        onChangeOpen(open);
        setInitialValue(null);
        setImage('');
        reset();
      }}
    >
      <SheetContent className=" flex flex-col gap-4 overflow-y-auto bg-white p-4 py-0">
        <SheetHeader
          className=" sticky top-0 gap-2 bg-white pt-4"
          style={{ zIndex: 1 }}
        >
          <div className="flex items-center justify-between">
            <SheetTitle>
              <div className="flex items-center gap-2">
                <MessageAdd1 size={24} />
                {initialValue ? 'Update Banner' : 'Create Banner'}
              </div>
            </SheetTitle>
            <SheetClose>
              <FiX />
            </SheetClose>
          </div>
          <hr />
        </SheetHeader>

        <form
          onSubmit={handleSubmit(handleActualSubmit)}
          className=" flex flex-col gap-4"
        >
          {/* begin: main form */}
          <div className=" flex flex-col gap-2">
            <Label className=" text-sm">Banner File</Label>
            {image ? (
              <div className=" group relative mx-auto aspect-[2/0.8] w-full overflow-hidden rounded-lg border">
                <Image
                  src={image}
                  fill
                  alt=""
                  className="object-contain"
                />
                <div className=" absolute inset-0 flex h-full w-full items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100">
                  <div className="flex gap-2">
                    <Button
                      size="icon-sm"
                      className=" border border-white fill-white hover:bg-white hover:fill-neutral-950"
                      variant="transparent"
                      onClick={open}
                      type="button"
                    >
                      <Pencxil />
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div
                {...getRootProps({
                  className:
                    'flex items-center justify-center rounded-lg gap-4 border-2 border-dashed p-6',
                })}
              >
                <input {...getInputProps()} />
                <div className=" relative aspect-square h-14">
                  <Image
                    src="/images/file-upload.svg"
                    fill
                    alt=""
                    className=" object-contain object-center"
                  />
                </div>
                <div
                  className=" flex flex-col items-center justify-center gap-4"
                  style={{ alignItems: 'center', textAlign: 'center' }}
                >
                  <p className=" text-sm text-neutral-500">
                    Drag or Upload Image
                  </p>
                  <Button
                    onClick={open}
                    type="button"
                    className=" h-8 gap-2 text-primary"
                    variant="ghost"
                  >
                    <FaArrowUp size={12} />
                    Upload
                  </Button>
                </div>
              </div>
            )}
            <span className="font-small text-xs text-red-600">
              {imageError}
            </span>
          </div>
          <div className=" flex flex-col gap-2">
            <Label className=" text-sm">Title EN</Label>
            <Controller
              name="titleEn"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Input English Title"
                />
              )}
            />
            <span className="font-small text-xs text-red-600">
              {errors.titleEn?.message}
            </span>
          </div>
          <div className=" flex flex-col gap-2">
            <Label className=" text-sm">Title AR</Label>
            <Controller
              name="titleAr"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  dir="rtl"
                  placeholder="Input Arabic Title"
                />
              )}
            />
            <span className="font-small text-xs text-red-600">
              {errors.titleAr?.message}
            </span>
          </div>
          <div className=" flex flex-col gap-2">
            <Label className=" text-sm">Link</Label>
            <Controller
              name="link"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Input Link"
                />
              )}
            />
            <span className="font-small text-xs text-red-600">
              {errors.link?.message}
            </span>
          </div>
          <div className=" flex flex-col gap-2">
            <Label className=" text-sm">Description EN</Label>
            <Controller
              name="descriptionEn"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  placeholder="Input English Description"
                />
              )}
            />
            <span className="font-small text-xs text-red-600">
              {errors.descriptionEn?.message}
            </span>
          </div>
          <div className=" flex flex-col gap-2">
            <Label className=" text-sm">Description AR</Label>
            <Controller
              name="descriptionAr"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  dir="rtl"
                  placeholder="Input Arabic Description"
                />
              )}
            />
            <span className="font-small text-xs text-red-600">
              {errors.descriptionAr?.message}
            </span>
          </div>
          <div className=" flex flex-col gap-2">
            <Label className=" text-sm">Publish</Label>
            <Switch
              checked={isChecked}
              onCheckedChange={(e) => onChangeStatus(e)}
            />
          </div>
          <div className=" sticky bottom-0 flex flex-col space-y-2 bg-white py-4 pt-2">
            <Button
              type="submit"
              disabled={loading || loadingLoad || loadingUpdate}
              //   onClick={() => {
              //     onChangeOpen(!isOpen);
              //     setImage('');
              //   }}
            >
              <FaPlus />
              Save
            </Button>
          </div>
          {/* end: main form */}
        </form>
      </SheetContent>
    </Sheet>
  );
}

export default AddBannerSheet;
