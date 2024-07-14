'use client';

import { useDeleteBanner, useGetBanner } from '@/api/banner.api';
import AddBannerSheet from '@/components/banner/add-banner-sheet';
import DetailBannerSheet from '@/components/banner/detail-banner-sheet';
import BasePagination from '@/components/common/base-pagination';
import BaseSearch from '@/components/common/base-search';
import EmptyState from '@/components/common/empty-state';
import Header from '@/components/common/header/header';
import ToggleEdit from '@/components/common/toggle-edit';
import Pencxil from '@/components/svg/Pencxil';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { HTTP_STATUS } from '@/constants/common.constant';
import useWindowSize from '@/hooks/use-window-size';
import useAddBannerSheetStore from '@/store/add-banner-sheet.store';
import useDetailBannerSheetStore from '@/store/detail-banner-sheet.store';
import { TDefaultPageParams } from '@/types/common.type';
import { textTruncate } from '@/utils/common.util';
import { getLang } from '@/utils/locale.util';
import { MessageAdd1, Paperclip2 } from 'iconsax-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaArrowUp, FaCheck } from 'react-icons/fa6';
import { FiX } from 'react-icons/fi';
import { useQueryClient } from 'react-query';
import { toast } from 'sonner';

export default function BannerManagementPage({
  searchParams,
}: TDefaultPageParams) {
  // hooks
  const params = useParams();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { width } = useWindowSize();

  // const [showAddBanner, setShowAddBanner] = useState<boolean>(false);
  const [showEditBanner, setShowEditBanner] = useState<boolean>(false);
  const [showDeleteBanner, setShowDeleteBanner] = useState<boolean>(false);
  // const [showDetailBanner, setShowDetailBanner] = useState<boolean>(false);

  // const [liveEditName, setLiveEditName] = useState<boolean>(false);
  // const [liveEditDescription, setLiveEditDescription] =
  //   useState<boolean>(false);
  const [liveEditBanner, setLiveEditBanner] = useState<boolean>(false);

  const [_, setFiles] = useState<File[]>([]);

  const [selectedId, setSelectedId] = useState<number>(0);

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop(acceptedFiles) {
      setFiles(acceptedFiles);
    },
    noClick: true,
    accept: {
      'image/jpg': [],
      'image/png': [],
      'image/jpeg': [],
    },
  });

  const [titleValue, setTitleValue] = useState('Campaign Banner 2019');
  const [descriptionValue, setDescriptionValue] = useState(
    'Explore a fresh and enhanced browsing experience with our latest website update! Discover sleek design improvements, faster navigation, and exciting new features that make your online journey even more enjoyable',
  );

  // store
  const {
    isOpen,
    onChangeOpen: openAddBanner,
    setInitialValue,
  } = useAddBannerSheetStore();
  const {
    // isOpen: isDetail,
    onChangeOpen: openDetailBanner,
    setInitialValue: setInitialValueDetail,
  } = useDetailBannerSheetStore();

  const { data: bannerList, isLoading: loadingGetBanner } = useGetBanner({
    search: searchParams.search,
    page: (Number(searchParams.page || 1) - 1).toString(),
    size: searchParams.size,
    order: 'desc',
    sort: 'createdAt',
  });

  // delete mutation
  const { mutate } = useDeleteBanner();
  const deleteBanner = useCallback(() => {
    // console.log('checkID', selectedId);
    mutate(selectedId, {
      onSuccess(resp) {
        if (resp.code === HTTP_STATUS.SUCCESS) {
          toast.success('Banner Deleted');
          queryClient.invalidateQueries({
            queryKey: ['getBanner'],
          });
          queryClient.invalidateQueries({
            queryKey: ['getBannerById'],
          });
          queryClient.removeQueries('getBanner');
          queryClient.removeQueries('getBannerById');
          router.push('/banner-management');
          router.refresh();
          setShowDeleteBanner((prev) => !prev);
        } else {
          toast.error(resp.message);
        }
      },
    });
  }, [mutate, queryClient, router, selectedId]);
  // console.log('checkBannerList', bannerList);
  return (
    <>
      <div className=" flex h-full w-full flex-col">
        <Header title="Banner Management" />

        <div className=" h-full w-full p-4 lg:p-6">
          <div className=" flex w-full flex-col rounded-lg border p-5">
            {/* begin: filter, search and action */}
            <div className="flex items-center justify-between rounded-lg border bg-neutral-100 p-1.5">
              <div className="flex items-center">
                <Button
                  className=" text-xs"
                  variant="transparent"
                  onClick={() => openAddBanner(!isOpen)}
                >
                  <MessageAdd1 size={16} />
                  Create Banner
                </Button>
                {/* <div className=" h-8 w-px border-r"></div>
                <Button
                  className=" text-xs"
                  variant="ghost-primary"
                  onClick={() => setShowFilter((prev) => !prev)}
                >
                  <Filter size={16} />
                  Filter
                </Button> */}
              </div>
              <BaseSearch className=" hidden lg:block" />
            </div>
            <BaseSearch className=" mt-2 block lg:hidden" />
            {/* end: filter, search and action */}

            {loadingGetBanner ? (
              <div className=" mt-6 grid grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className=" w-full rounded-lg border"
                  >
                    <Skeleton className=" aspect-[350/168] min-h-[285px] w-full" />
                    <Skeleton className=" mx-auto mt-4 h-5 w-24" />
                    <div className="flex flex-col gap-4 p-3">
                      <Skeleton className=" h-4 w-24" />
                      <Skeleton className=" h-4 w-full" />
                    </div>
                    <div className=" flex justify-end gap-2 border-t p-4">
                      <Skeleton className=" h-8 w-16" />
                      <Skeleton className=" h-8 w-14" />
                      <Skeleton className=" h-8 w-12" />
                    </div>
                  </div>
                ))}
              </div>
            ) : bannerList && bannerList.totalCount > 0 ? (
              <>
                <div
                  className={`${width > 640 ? 'grid-cols-3' : 'grid-cols-1'} mt-6 grid  gap-6`}
                >
                  {bannerList.content.map((items, i) => (
                    <div
                      key={i}
                      className=" rounded-lg border"
                    >
                      <div className="flex flex-col">
                        <div className="justify center relative flex aspect-[350/168] w-full">
                          <Image
                            src={items?.image?.url}
                            height={285}
                            width={540}
                            alt=""
                            className=" aspect-[350/168] rounded-t-lg object-cover object-center"
                          />
                        </div>
                        <div className=" flex flex-col p-3">
                          <p className=" overflow-hidden truncate text-ellipsis text-center text-sm font-medium text-primary">
                            {getLang(params, items.title)}
                          </p>
                          <p className=" mt-4 line-clamp-5 text-ellipsis text-xs text-neutral-500">
                            {getLang(params, items.description)}
                          </p>
                          <div className="mt-6 flex items-center gap-2">
                            <Paperclip2 size={16} />
                            <Link
                              href={items.url ?? ''}
                              className="w-4/5 overflow-hidden truncate text-ellipsis text-xs font-medium text-neutral-500"
                            >
                              {textTruncate(items.url, 60)}
                            </Link>
                          </div>
                        </div>
                      </div>
                      <div
                        className={`${width > 640 ? 'flex' : ''} justify-end gap-2 border-t p-4`}
                      >
                        <Button
                          size="sm"
                          variant="ghost-primary"
                          onClick={() => {
                            setSelectedId(items.id);
                            setShowDeleteBanner((prev) => !prev);
                          }}
                        >
                          Delete
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost-primary"
                          onClick={() => {
                            openDetailBanner(!isOpen);
                            setInitialValueDetail(items);
                          }}
                        >
                          View
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => {
                            openAddBanner(!isOpen);
                            setInitialValue(items);
                          }}
                        >
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <BasePagination totalCount={bannerList?.totalCount ?? 0} />
              </>
            ) : (
              <EmptyState description="We couldn't find any data matching your search. Please double-check your keywords or try different search terms" />
            )}
          </div>
        </div>
      </div>

      {/* begin: drawer add banner */}
      <AddBannerSheet />
      {/* end: drawer add banner */}

      {/* begin: drawer edit banner */}
      <Sheet
        open={showEditBanner}
        onOpenChange={setShowEditBanner}
      >
        <SheetContent className=" flex flex-col gap-4 overflow-y-auto bg-white p-4 py-0">
          <SheetHeader className=" sticky top-0 gap-2 bg-white pt-4">
            <div className="flex items-center justify-between">
              <SheetTitle>
                <div className="flex items-center gap-2">
                  <Pencxil
                    width={20}
                    height={20}
                  />
                  Edit
                </div>
              </SheetTitle>
              <SheetClose>
                <FiX />
              </SheetClose>
            </div>
            <hr />
          </SheetHeader>

          <div className=" flex flex-col gap-4">
            {/* begin: main form */}
            <div className="flex flex-col gap-4">
              <div className=" flex items-center justify-between">
                <Label className=" text-sm">Banner</Label>
                {!liveEditBanner ? (
                  <button onClick={() => setLiveEditBanner((prev) => !prev)}>
                    <Pencxil className=" fill-primary" />
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      className=" h-8 w-8 "
                      variant="success"
                      onClick={() => setLiveEditBanner((prev) => !prev)}
                    >
                      <FaCheck size={12} />
                    </Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      className=" h-8 w-8 "
                      onClick={() => setLiveEditBanner((prev) => !prev)}
                    >
                      <FiX size={12} />
                    </Button>
                  </div>
                )}
              </div>
              {!liveEditBanner ? (
                <div className=" relative aspect-[2/1] w-full overflow-hidden rounded-lg">
                  <Image
                    src="/images/banner.png"
                    fill
                    className=" object-cover object-center"
                    alt=""
                  />
                </div>
              ) : (
                <div
                  {...getRootProps({
                    className:
                      'flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6',
                  })}
                >
                  <input {...getInputProps()} />
                  <div className="flex w-full flex-col gap-2 text-center">
                    <div className=" relative aspect-square h-14">
                      <Image
                        src="/images/file-upload.svg"
                        fill
                        alt=""
                        className=" object-contain object-center"
                      />
                    </div>
                    <p className=" text-sm text-neutral-500">
                      Drag or Upload File
                    </p>
                  </div>
                  <div className=" mt-4">
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
            </div>
            <ToggleEdit
              value={titleValue}
              setValue={setTitleValue}
              label="Title"
            />
            <ToggleEdit
              value={descriptionValue}
              setValue={setDescriptionValue}
              label="Description"
              type="textarea"
            />

            <div className=" flex flex-col gap-2">
              <Label className=" text-sm">Status</Label>
              <Switch />
            </div>

            {/* end: main form */}
          </div>
          <div className=" sticky bottom-0 flex flex-col space-y-2 bg-white py-4 pt-2">
            <Button
              onClick={() => {
                setShowEditBanner((prev) => !prev);
              }}
              className=" gap-2"
            >
              Save Changes
            </Button>
          </div>
        </SheetContent>
      </Sheet>
      {/* end: drawer edit banner */}

      {/* begin: drawer detail admin */}
      <DetailBannerSheet />
      {/* end: drawer detail admin */}

      {/* begin: dialog delete admin */}
      <Dialog
        open={showDeleteBanner}
        onOpenChange={setShowDeleteBanner}
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
              Delete Data
            </h1>
            <p className=" text-sm text-neutral-500">
              Are you sure you want to delete your data? All of your data will
              be permanently removed. This action cannot be undone.
            </p>
          </div>
          <div className=" flex justify-end gap-4 border-t px-6 py-4">
            <DialogClose asChild>
              <Button
                className=" text-primary"
                variant="ghost"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button onClick={() => deleteBanner()}>Delete</Button>
          </div>
        </DialogContent>
      </Dialog>
      {/* end: dialog delete admin */}
    </>
  );
}
