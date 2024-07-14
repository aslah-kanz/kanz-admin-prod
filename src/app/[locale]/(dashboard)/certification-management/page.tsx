'use client';

import {
  useAddCertification,
  useCertifications,
  useDeleteCertification,
  useEditCertification,
  useGetCertificationById,
} from '@/api/certification.api';
import BasePagination from '@/components/common/base-pagination';
import BaseSearch from '@/components/common/base-search';
import EmptyState from '@/components/common/empty-state';
import Header from '@/components/common/header/header';
import ToggleEdit from '@/components/common/toggle-edit';
import DialogDelete from '@/components/dialog/dialog-delete';
import Pencxil from '@/components/svg/Pencxil';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { TCertificationParams } from '@/types/certification.type';
import { TDefaultPageParams } from '@/types/common.type';
import { textTruncate } from '@/utils/common.util';
import { getLang } from '@/utils/locale.util';
import { yupResolver } from '@hookform/resolvers/yup';
import { Award, DocumentText, Trash } from 'iconsax-react';
import Image from 'next/image';
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { SubmitHandler, useForm } from 'react-hook-form';
import { FaArrowUp, FaCheck, FaPlus } from 'react-icons/fa6';
import { FiX } from 'react-icons/fi';
import { useQueryClient } from 'react-query';
import { toast } from 'sonner';
import * as yup from 'yup';

const schemaAdd = yup.object().shape({
  title: yup.object({
    en: yup.string().required('This field is required').min(2),
    ar: yup.string(),
  }),
  slug: yup.string().required('This field is required'),
  file: yup.mixed().required('This field is required'),
  status: yup.string().oneOf(['draft', 'published']),
});

const schemaEdit = yup.object().shape({
  title: yup.object({
    en: yup.string().required('This field is required').min(2),
    ar: yup.string().nullable(),
  }),
  slug: yup.string().required('This field is required'),
  file: yup.mixed().nullable(),
  status: yup.string().oneOf(['draft', 'published']),
});

export default function CertificationManagementPage({
  params,
  searchParams,
}: TDefaultPageParams) {
  const queryClient = useQueryClient();
  const [showAddCertification, setShowAddCertification] =
    useState<boolean>(false);
  const [idEdit, setIdEdit] = useState<number>();
  const [showEditCertification, setShowEditCertification] =
    useState<boolean>(false);
  const [idDelete, setIdDelete] = React.useState<number>();
  const [showDeleteCertification, setShowDeleteCertification] =
    useState<boolean>(false);
  // const [idDetail, setIdDetail] = useState<number>();
  const [showDetailCertification, setShowDetailCertification] =
    useState<boolean>(false);

  // const [liveEditTitle, setLiveEditTitle] = useState<boolean>(false);
  const [liveEditCertificate, setLiveEditCertificate] =
    useState<boolean>(false);

  // const [titleValue, setTitleValue] = useState('PCI DSS Compliant Certificate');

  const [queryParams, _setQueryParams] = React.useState<TCertificationParams>({
    order: 'desc',
    sort: 'createdAt',
  });
  const { data: certifications, isLoading: isLoadingList } = useCertifications({
    ...queryParams,
    search: searchParams.search,
    page: (Number(searchParams.page || 1) - 1).toString(),
    size: searchParams.size,
  });

  const { mutate: mutateDelete, isLoading: isLoadingDelete } =
    useDeleteCertification();
  const handleDelete = React.useCallback(() => {
    mutateDelete(Number(idDelete), {
      onSuccess(resp) {
        if (resp.code === HTTP_STATUS.SUCCESS) {
          toast.success('Certification Deleted');
          queryClient.removeQueries('getCertifications');
          queryClient.removeQueries('getCertificationById');
          setShowDeleteCertification(false);
        } else {
          toast.error(resp.message);
        }
      },
    });
  }, [idDelete, mutateDelete, queryClient]);

  const [_, setFilesAdd] = useState<File[]>([]);
  const [uploadedAdd, setUploadedAdd] = React.useState('');
  const [uploadedAddError, setUploadedAddError] = React.useState('');
  const formAdd = useForm<yup.InferType<typeof schemaAdd>>({
    resolver: yupResolver(schemaAdd),
    defaultValues: {
      title: {
        en: '',
        ar: '',
      },
      slug: '',
      status: 'draft',
    },
  });
  const {
    getRootProps: getRootPropsAdd,
    getInputProps: getInputPropsAdd,
    open: openAdd,
  } = useDropzone({
    onDrop(acceptedFiles, fileRejections) {
      fileRejections.forEach((file) => {
        file.errors.forEach((err) => {
          if (err.code === 'file-too-large') {
            setUploadedAddError(`Image is too large`);
          }

          if (err.code === 'file-invalid-type') {
            setUploadedAddError(`Invalid type`);
          }
        });
      });
      const newFile = acceptedFiles[0];
      if (newFile) {
        setUploadedAdd(URL.createObjectURL(newFile));
        setFilesAdd(acceptedFiles);
        formAdd.setValue('file', newFile);
        setUploadedAddError('');
      }
    },
    noClick: true,
    accept: {
      'image/jpg': [],
      'image/png': [],
      'image/jpeg': [],
    },
  });

  const [titleWithArAdd, setTitleWithArAdd] = useState<boolean>(false);
  const { mutate: mutateAdd, isLoading: isLoadingAdd } = useAddCertification();
  const handleAdd: SubmitHandler<yup.InferType<typeof schemaAdd>> =
    React.useCallback(
      (payload) => {
        const formData = new FormData();
        formData.append('title.en', payload.title.en);
        if (payload.title.ar) {
          formData.append('title.ar', payload.title.ar);
        }
        formData.append('slug', payload.slug);
        if (payload.status) {
          formData.append('status', payload.status);
        }
        formData.append('file', payload.file as File);
        mutateAdd(formData, {
          onSuccess(resp) {
            if (resp.code === HTTP_STATUS.SUCCESS) {
              toast.success('Certification Added');
              queryClient.removeQueries('getCertifications');
              queryClient.removeQueries('getCertificationById');
              formAdd.reset();
              setShowAddCertification(false);
            } else {
              toast.error(resp.message);
            }
          },
        });
      },
      [mutateAdd, queryClient, formAdd],
    );

  const formEdit = useForm<yup.InferType<typeof schemaEdit>>({
    resolver: yupResolver(schemaEdit),
    defaultValues: {
      title: {
        en: '',
        ar: '',
      },
      slug: '',
      status: 'draft',
    },
  });
  const [filesEdit, setFilesEdit] = useState<File[]>([]);
  const [uploadedEdit, setUploadedEdit] = React.useState('');
  const [uploadedEditError, setUploadedEditError] = React.useState('');
  const handleAcceptFile = useCallback(() => {
    formEdit.setValue('file', filesEdit[0]);
  }, [filesEdit, formEdit]);
  const {
    getRootProps: getRootPropsEdit,
    getInputProps: getInputPropsEdit,
    open: openEdit,
  } = useDropzone({
    onDrop(acceptedFiles, fileRejections) {
      fileRejections.forEach((file) => {
        file.errors.forEach((err) => {
          if (err.code === 'file-too-large') {
            setUploadedAddError(`Image is too large`);
          }

          if (err.code === 'file-invalid-type') {
            setUploadedAddError(`Invalid type`);
          }
        });
      });
      const newFile = acceptedFiles[0];
      if (newFile) {
        setUploadedEdit(URL.createObjectURL(newFile));
        setFilesEdit(acceptedFiles);
        formEdit.setValue('file', newFile);
        setUploadedEditError('');
      }
    },
    noClick: true,
    accept: {
      'image/jpg': [],
      'image/png': [],
      'image/jpeg': [],
    },
  });
  const { data: detailEdit } = useGetCertificationById(idEdit, {
    enabled: !!idEdit,
  });
  // const [titleWithArEdit, setTitleWithArEdit] = useState<boolean>(false);
  const { mutate: mutateEdit, isLoading: isLoadingEdit } =
    useEditCertification();
  const handleEdit: SubmitHandler<yup.InferType<typeof schemaEdit>> =
    React.useCallback(
      (payload) => {
        const formData = new FormData();
        formData.append('title.en', payload.title.en);
        if (payload.title.ar) {
          formData.append('title.ar', payload.title.ar);
        }
        formData.append('slug', payload.slug);
        if (payload.status) {
          formData.append('status', payload.status);
        }

        const filePayload = payload.file as any;
        if (!filePayload.id) {
          formData.append('file', filePayload as File);
        }
        mutateEdit(
          { id: Number(idEdit), payload: formData as FormData },
          {
            onSuccess(resp) {
              if (resp.code === HTTP_STATUS.SUCCESS) {
                toast.success('Certification Edited');
                queryClient.removeQueries('getCertifications');
                queryClient.removeQueries('getCertificationById');
                setShowEditCertification(false);
              } else {
                toast.error(resp.message);
              }
            },
          },
        );
      },
      [mutateEdit, queryClient, idEdit],
    );

  React.useEffect(() => {
    if (detailEdit) {
      formEdit.setValue('title', detailEdit.title);
      formEdit.setValue('slug', detailEdit.slug);
      formEdit.setValue('file', detailEdit.image);
      formEdit.setValue('status', detailEdit.status);
      setUploadedEdit(detailEdit.image.url);
    }
  }, [detailEdit, formEdit]);

  const statusSelectOptions = React.useMemo(
    () => [
      {
        value: 'draft',
        label: 'Draft',
      },
      {
        value: 'published',
        label: 'Published',
      },
    ],
    [],
  );

  return (
    <>
      <div className=" flex h-full w-full flex-col">
        <Header title="Certification Management" />

        <div className=" h-full w-full p-4 lg:p-6">
          <div className=" flex w-full flex-col rounded-lg border p-5">
            {/* begin: filter, search and action */}
            <div className="flex items-center justify-between rounded-lg border bg-neutral-100 p-1.5">
              <div className="flex items-center">
                <Button
                  className=" text-xs"
                  variant="transparent"
                  onClick={() => setShowAddCertification((prev) => !prev)}
                >
                  <Award size={16} />
                  Create Certification
                </Button>
              </div>
              <BaseSearch className=" hidden lg:block" />
            </div>
            <BaseSearch className=" mt-2 block lg:hidden" />
            {/* end: filter, search and action */}

            {/* begin: empty state */}
            {/* <EmptyState description="We couldn't find any data matching your search. Please double-check your keywords or try different search terms" /> */}
            {/* end: empty state */}

            {isLoadingList ? (
              <div className=" mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
            ) : certifications && certifications.totalCount > 0 ? (
              <>
                <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {certifications?.content?.map((certificate, i) => (
                    <div
                      key={i}
                      className=" rounded-lg border"
                    >
                      <div className=" flex flex-col items-center justify-center gap-4 p-4">
                        <div className=" relative aspect-[2/1] w-full">
                          <Image
                            src={certificate.image.url}
                            fill
                            alt=""
                            className=" object-contain object-center"
                          />
                        </div>
                        <p className=" font-medium text-neutral-500">
                          {textTruncate(getLang(params, certificate.title))}
                        </p>
                      </div>
                      <div className=" flex justify-end gap-4 border-t p-4">
                        <Button
                          size="sm"
                          variant="ghost-primary"
                          onClick={() => {
                            setIdDelete(certificate.id);
                            setShowDeleteCertification((prev) => !prev);
                          }}
                        >
                          Delete
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => {
                            setIdEdit(certificate.id);
                            setShowEditCertification((prev) => !prev);
                          }}
                        >
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <BasePagination
                  totalCount={Number(certifications?.totalCount)}
                />
              </>
            ) : (
              <EmptyState />
            )}
          </div>
        </div>
      </div>

      {/* begin: drawer add certification */}
      <Sheet
        open={showAddCertification}
        onOpenChange={setShowAddCertification}
      >
        <SheetContent className=" flex flex-col gap-4 overflow-y-auto bg-white p-4 py-0">
          <SheetHeader className=" sticky top-0 gap-2 bg-white pt-4">
            <div className="flex items-center justify-between">
              <SheetTitle>
                <div className="flex items-center gap-2">
                  <Award size={24} />
                  Create Certification
                </div>
              </SheetTitle>
              <SheetClose>
                <FiX />
              </SheetClose>
            </div>
            <hr />
          </SheetHeader>

          <Form {...formAdd}>
            <form onSubmit={formAdd.handleSubmit(handleAdd)}>
              <div className=" flex flex-col gap-4">
                {/* begin: main form */}
                <div className=" flex flex-col gap-2">
                  <Label className=" text-sm">Certification File</Label>
                  <div
                    {...getRootPropsAdd({
                      className:
                        'flex items-center justify-center rounded-lg gap-4 border-2 border-dashed p-6',
                    })}
                  >
                    <input {...getInputPropsAdd()} />
                    {uploadedAdd ? (
                      <div className=" group relative mx-auto aspect-[2/0.8] w-full overflow-hidden rounded-lg border">
                        <Image
                          src={uploadedAdd}
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
                              onClick={openAdd}
                              type="button"
                            >
                              <Pencxil />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className=" relative aspect-square h-14">
                          <Image
                            src="/images/file-upload.svg"
                            fill
                            alt=""
                            className=" object-contain object-center"
                          />
                        </div>
                        <div className=" flex flex-col items-center gap-4">
                          <p className=" text-sm text-neutral-500">
                            Drag or Upload Image
                          </p>
                          <Button
                            onClick={openAdd}
                            type="button"
                            className=" h-8 gap-2 text-primary"
                            variant="ghost"
                          >
                            <FaArrowUp size={12} />
                            Upload
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                  <span className="font-small text-xs text-red-600">
                    {uploadedAddError}
                  </span>
                </div>
                <div className=" flex flex-col gap-2">
                  <FormField
                    control={formAdd.control}
                    name="title.en"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <FormLabel className=" text-sm">Title</FormLabel>
                          <div className="flex items-center gap-2">
                            <p className=" text-xs font-medium text-neutral-800">
                              ar
                            </p>
                            <Switch
                              checked={titleWithArAdd}
                              onCheckedChange={setTitleWithArAdd}
                            />
                          </div>
                        </div>
                        <FormControl>
                          <Input
                            placeholder="Input Title"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {titleWithArAdd && (
                    <FormField
                      name="title.ar"
                      control={formAdd.control}
                      render={({ field }) => (
                        <FormItem>
                          <Input
                            dir="rtl"
                            placeholder="اسم الإدخال"
                            {...field}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
                <div className=" flex flex-col gap-2">
                  <FormField
                    control={formAdd.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className=" text-sm">Slug</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Input Slug"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="mb-2 text-sm">Status</Label>
                  <Select
                    value={String(formAdd.getValues(`status`))}
                    onValueChange={(value: string) => {
                      formAdd.setValue(`status`, value);
                      // setUpdate((prev) => !prev);
                      // setSelectedPropertyType(value);
                    }}
                  >
                    <SelectTrigger className="">
                      <SelectValue placeholder="Input Brand" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusSelectOptions.map((option) => (
                        <SelectItem
                          value={String(option.value)}
                          key={option.value}
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* end: main form */}
              </div>
              <div className=" sticky bottom-0 flex flex-col space-y-2 bg-white py-4 pt-2">
                <Button disabled={isLoadingAdd}>
                  <FaPlus />
                  Create
                </Button>
              </div>
            </form>
          </Form>
        </SheetContent>
      </Sheet>
      {/* end: drawer add certification */}

      {/* begin: drawer edit certification */}
      <Sheet
        open={showEditCertification}
        onOpenChange={(value) => {
          if (!value) {
            formEdit.reset();
            queryClient.removeQueries('getCertificationById');
          }
          setShowEditCertification(value);
        }}
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
          <Form {...formEdit}>
            <form onSubmit={formEdit.handleSubmit(handleEdit)}>
              <div className=" flex flex-col gap-4">
                {/* begin: main form */}
                <div className="flex flex-col gap-4">
                  <div className=" flex items-center justify-between">
                    <Label className=" text-sm">Certification File</Label>
                    {!liveEditCertificate ? (
                      <button
                        onClick={() => setLiveEditCertificate((prev) => !prev)}
                      >
                        <Pencxil className=" fill-primary" />
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <Button
                          size="icon-sm"
                          variant="success"
                          onClick={() => {
                            handleAcceptFile();
                            setLiveEditCertificate((prev) => !prev);
                          }}
                        >
                          <FaCheck size={12} />
                        </Button>
                        <Button
                          size="icon-sm"
                          variant="destructive"
                          onClick={() => {
                            setFilesEdit([]);
                            setLiveEditCertificate((prev) => !prev);
                          }}
                        >
                          <FiX size={12} />
                        </Button>
                      </div>
                    )}
                  </div>
                  {!liveEditCertificate ? (
                    <div className=" relative aspect-[2/1] w-full overflow-hidden rounded-lg">
                      <Image
                        src={
                          filesEdit[0]
                            ? URL.createObjectURL(filesEdit[0])
                            : detailEdit?.image?.url || ''
                        }
                        fill
                        className=" object-cover object-center"
                        alt=""
                      />
                    </div>
                  ) : (
                    <>
                      {!!filesEdit.length && (
                        <div className="flex flex-col gap-4">
                          <div className="flex justify-between">
                            <div className="flex items-center gap-2">
                              <DocumentText
                                variant="Bold"
                                className=" text-neutral-500"
                              />
                              <p className=" text-sm font-medium text-neutral-500">
                                {filesEdit[0].name}
                              </p>
                            </div>
                            <button type="button">
                              <Trash
                                size={16}
                                className=" text-primary"
                                onClick={() => {
                                  setFilesAdd([]);
                                }}
                              />
                            </button>
                          </div>
                        </div>
                      )}
                      <div
                        {...getRootPropsEdit({
                          className:
                            'flex items-center justify-center rounded-lg gap-4 border-2 border-dashed p-6',
                        })}
                      >
                        <input {...getInputPropsEdit()} />
                        {uploadedEdit ? (
                          <div className=" group relative mx-auto aspect-[2/0.8] w-full overflow-hidden rounded-lg border">
                            <Image
                              src={uploadedEdit}
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
                                  onClick={openEdit}
                                  type="button"
                                >
                                  <Pencxil />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className=" relative aspect-square h-14">
                              <Image
                                src="/images/file-upload.svg"
                                fill
                                alt=""
                                className=" object-contain object-center"
                              />
                            </div>
                            <div className=" flex flex-col items-center gap-4">
                              <p className=" text-sm text-neutral-500">
                                Drag or Upload Image
                              </p>
                              <Button
                                onClick={openEdit}
                                type="button"
                                className=" h-8 gap-2 text-primary"
                                variant="ghost"
                              >
                                <FaArrowUp size={12} />
                                Upload
                              </Button>
                            </div>
                          </>
                        )}
                      </div>
                      <span className="font-small text-xs text-red-600">
                        {uploadedEditError}
                      </span>
                    </>
                  )}
                </div>
                <FormField
                  control={formEdit.control}
                  name="title.en"
                  render={({ field }) => (
                    <FormItem>
                      <ToggleEdit
                        label="Title en"
                        value={field.value}
                        setValue={field.onChange}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={formEdit.control}
                  name="title.ar"
                  render={({ field }) => (
                    <FormItem>
                      <ToggleEdit
                        label="Title ar"
                        value={field.value || '-'}
                        setValue={field.onChange}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={formEdit.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <ToggleEdit
                        label="Slug"
                        value={field.value || '-'}
                        setValue={field.onChange}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-col gap-2">
                  <Select
                    value={String(formAdd.getValues(`status`))}
                    onValueChange={(value: string) => {
                      formAdd.setValue(`status`, value);
                      // setUpdate((prev) => !prev);
                      // setSelectedPropertyType(value);
                    }}
                  >
                    <SelectTrigger className="">
                      <SelectValue placeholder="Input Status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusSelectOptions.map((option) => (
                        <SelectItem
                          value={String(option.value)}
                          key={option.value}
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* end: main form */}
              </div>
              <div className=" sticky bottom-0 flex flex-col space-y-2 bg-white py-4 pt-2">
                <Button disabled={isLoadingEdit}>Save Changes</Button>
              </div>
            </form>
          </Form>
        </SheetContent>
      </Sheet>
      {/* end: drawer edit certification */}

      {/* begin: drawer detail certification */}
      <Sheet
        // open
        open={showDetailCertification}
        onOpenChange={setShowDetailCertification}
      >
        <SheetContent className=" flex flex-col gap-4 overflow-y-auto bg-white p-4 py-0">
          <SheetHeader className=" sticky top-0 gap-2 bg-white pt-4">
            <div className="flex items-center justify-between">
              <SheetTitle>View Details</SheetTitle>
              <SheetClose>
                <FiX />
              </SheetClose>
            </div>
            <hr />
          </SheetHeader>

          <div className=" flex flex-col gap-4">
            {/* begin: main form */}
            <div className=" flex flex-col gap-2">
              <Label className=" text-sm">Title</Label>
              <p className=" text-sm font-medium text-neutral-500">John Doe</p>
            </div>
            <div className=" flex flex-col gap-2">
              <Label className=" text-sm">Description</Label>
              <p className=" text-sm font-medium text-neutral-500">
                johndoe@gmail.com
              </p>
            </div>
            <div className=" flex flex-col gap-2">
              <Label className=" text-sm">Group</Label>
              <p className=" text-sm font-medium text-neutral-500">
                johndoe@gmail.com
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <Label className=" text-sm">Certification File</Label>
              <div className="flex flex-col gap-4">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="flex justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <DocumentText
                        variant="Bold"
                        className=" text-neutral-500"
                      />
                      <p className=" text-sm font-medium text-neutral-500">
                        Document1 A400MB
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* end: main form */}
          </div>
        </SheetContent>
      </Sheet>
      {/* end: drawer detail certification */}

      {/* begin: dialog delete certification */}
      <DialogDelete
        open={showDeleteCertification}
        onOpenChange={setShowDeleteCertification}
        onDelete={handleDelete}
        isLoading={isLoadingDelete}
      />
      {/* end: dialog delete certification */}
    </>
  );
}
