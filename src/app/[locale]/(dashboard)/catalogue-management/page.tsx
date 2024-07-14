'use client';

import {
  useAddCatalogue,
  useCatalogues,
  useDeleteCatalogue,
  useEditCatalogue,
  useGetCatalogueById,
} from '@/api/catalogue.api';
import { uploadDocument } from '@/api/http/document.service';
import { uploadImage } from '@/api/http/image.service';
import BasePagination from '@/components/common/base-pagination';
import BaseSearch from '@/components/common/base-search';
import BaseTableSkeleton from '@/components/common/base-table-skeleton';
import EmptyState from '@/components/common/empty-state';
import Header from '@/components/common/header/header';
import Pencxil from '@/components/svg/Pencxil';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent } from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { HTTP_STATUS } from '@/constants/common.constant';
import { TCatalogueParams, TCataloguePayload } from '@/types/catalogue.type';
import { TDefaultPageParams } from '@/types/common.type';
import { textTruncate } from '@/utils/common.util';
import { getLang } from '@/utils/locale.util';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  ArrowDown,
  DocumentText,
  Eye,
  Filter,
  MenuBoard,
  Trash,
} from 'iconsax-react';
import moment from 'moment';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { SubmitHandler, useForm } from 'react-hook-form';
import { FaArrowUp } from 'react-icons/fa6';
import { FiX } from 'react-icons/fi';
import { LuLoader2 } from 'react-icons/lu';
import { useQueryClient } from 'react-query';
import { toast } from 'sonner';
import * as yup from 'yup';
import BaseFormError from '@/components/common/base-form-error';
import { TDocument } from '@/types/bank.type';

const schemaAdd = yup.object().shape({
  title: yup.object({
    en: yup.string().required('This field is required').min(2),
    ar: yup.string(),
  }),
  description: yup.object({
    en: yup.string().required('This field is required'),
    ar: yup.string(),
  }),
  slug: yup.string().required('This field is required'),
  metaDescription: yup.string().required('This field is required'),
  metaKeyword: yup.string().required('This field is required'),
  imageId: yup.number(),
  documentId: yup.number(),
  status: yup.string().oneOf(['draft', 'published']),
});

const schemaEdit = yup.object().shape({
  id: yup.number(),
  title: yup.object({
    en: yup.string().required('This field is required'),
    ar: yup.string(),
  }),
  description: yup.object({
    en: yup.string().required('This field is required'),
    ar: yup.string(),
  }),
  slug: yup.string().required('This field is required'),
  metaDescription: yup.string(),
  metaKeyword: yup.string(),
  imageId: yup.number().required('This field is required'),
  documentId: yup.number().required('This field is required'),
  status: yup.string().oneOf(['draft', 'published']),
});

export default function CatalogueManagementPage({
  params,
  searchParams,
}: TDefaultPageParams) {
  const queryClient = useQueryClient();
  const [_update, setUpdate] = useState(false);
  const [showAddCatalogue, setShowAddCatalogue] = useState<boolean>(false);
  const [idEdit, setIdEdit] = useState<number>();
  const [showEditCatalogue, setShowEditCatalogue] = useState<boolean>(false);
  const [showDeleteCatalogue, setShowDeleteCatalogue] =
    useState<boolean>(false);
  const [idDetail, setIdDetail] = useState<number>();
  const [showDetailCatalogue, setShowDetailCatalogue] =
    useState<boolean>(false);
  const { data: detail } = useGetCatalogueById(idDetail, {
    enabled: !!idDetail,
  });

  const [queryParams, _setQueryParams] = React.useState<TCatalogueParams>({
    order: 'desc',
    sort: 'createdAt',
  });
  const { data: catalogues, isLoading: isLoadingList } = useCatalogues({
    ...queryParams,
    search: searchParams.search,
    page: (Number(searchParams.page || 1) - 1).toString(),
    size: searchParams.size,
  });

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

  const [isLoadingUploadAdd, setIsLoadingUploadAdd] = React.useState(false);
  const [idDelete, setIdDelete] = React.useState<number>();
  const { mutate: mutateDelete, isLoading: isLoadingDelete } =
    useDeleteCatalogue();

  const handleDelete = React.useCallback(() => {
    mutateDelete(Number(idDelete), {
      onSuccess(resp) {
        if (resp.code === HTTP_STATUS.SUCCESS) {
          toast.success('Catalogue Deleted');
          queryClient.removeQueries('getCatalogues');
          queryClient.removeQueries('getCatalogueById');
          setShowDeleteCatalogue(false);
        } else {
          toast.error(resp.message);
        }
      },
    });
  }, [idDelete, mutateDelete, queryClient]);

  const formAdd = useForm<yup.InferType<typeof schemaAdd>>({
    resolver: yupResolver(schemaAdd),
    defaultValues: {
      title: {
        en: '',
        ar: '',
      },
      description: {
        en: '',
        ar: '',
      },
      metaDescription: '',
      metaKeyword: '',
      status: 'draft',
    },
  });
  const [filesImageAdd, setFilesImageAdd] = useState<File[]>([]);
  const [uploadedImageAdd, setUploadedImageAdd] = React.useState<string>('');
  const [imageAddError, setImageAddError] = useState('');
  const {
    getRootProps: getRootPropsImageAdd,
    getInputProps: getInputPropsImageAdd,
    open: openImageAdd,
  } = useDropzone({
    onDrop(acceptedFiles, fileRejections) {
      setIsLoadingUploadAdd(false);
      fileRejections.forEach((file) => {
        file.errors.forEach((err) => {
          if (err.code === 'file-too-large') {
            setImageAddError(`Image is too large`);
          }

          if (err.code === 'file-invalid-type') {
            setImageAddError(`Invalid type`);
          }
        });
      });
      const newFile = acceptedFiles[0];
      if (newFile) {
        setImageAddError('');
        setUploadedImageAdd(URL.createObjectURL(newFile));
        setFilesImageAdd(acceptedFiles);
      }
    },
    noClick: true,
    accept: {
      'image/jpg': [],
      'image/png': [],
      'image/jpeg': [],
    },
  });
  const [filesDocumentAdd, setFilesDocumentAdd] = useState<File[]>([]);
  const [documentAddError, setDocumentAddError] = useState<string>('');
  const {
    getRootProps: getRootPropsDocumentAdd,
    getInputProps: getInputPropsDocumentAdd,
    open: openDocumentAdd,
  } = useDropzone({
    onDrop(acceptedFiles) {
      setIsLoadingUploadAdd(false);
      setDocumentAddError('');
      setFilesDocumentAdd(acceptedFiles);
    },
    noClick: true,
    accept: {
      'application/pdf': [],
    },
  });
  const { mutate: mutateAdd, isLoading: isLoadingAdd } = useAddCatalogue();
  const handleAdd: SubmitHandler<yup.InferType<typeof schemaAdd>> =
    React.useCallback(
      async (payload) => {
        setIsLoadingUploadAdd(true);
        if (filesImageAdd.length) {
          const formDataImage = new FormData();
          formDataImage.append('file', filesImageAdd[0]);
          formDataImage.append(
            'name',
            `${filesImageAdd[0].name}-${Date.now()}`,
          );
          const { data: imageData } = await uploadImage(formDataImage);
          if (imageData.id) {
            payload.imageId = imageData.id;
          } else {
            setFilesImageAdd([]);
            setImageAddError('Upload image error, try again.');
            setIsLoadingUploadAdd(false);
            return;
          }
        } else {
          setImageAddError('This field is required');
          setIsLoadingUploadAdd(false);
        }

        if (filesDocumentAdd.length) {
          const formDataDoc = new FormData();
          formDataDoc.append('file', filesDocumentAdd[0]);
          const { data: docData } = await uploadDocument(formDataDoc);
          if (docData.id) {
            payload.documentId = docData.id;
          } else {
            setFilesDocumentAdd([]);
            setDocumentAddError('Upload document error, try again.');
            setIsLoadingUploadAdd(false);
            return;
          }
        } else {
          setDocumentAddError('This field is required');
          setIsLoadingUploadAdd(false);
          return;
        }
        setIsLoadingUploadAdd(false);
        mutateAdd(payload as TCataloguePayload, {
          onSuccess(resp) {
            if (resp.code === HTTP_STATUS.SUCCESS) {
              toast.success('Catalogue Added');
              queryClient.removeQueries('getCatalogues');
              queryClient.removeQueries('getCatalogueById');
              setShowAddCatalogue(false);
              formAdd.reset();
              setFilesImageAdd([]);
              setUploadedImageAdd('');
              setFilesDocumentAdd([]);
            } else {
              toast.error(resp.message);
            }
          },
          onError() {
            toast.error('Unknown Error');
          },
        });
      },
      [filesImageAdd, filesDocumentAdd, mutateAdd, queryClient, formAdd],
    );

  React.useEffect(() => {
    if (!showAddCatalogue) {
      formAdd.reset();
      setFilesImageAdd([]);
      setUploadedImageAdd('');
      setFilesDocumentAdd([]);
    }
  }, [formAdd, showAddCatalogue]);

  const formEdit = useForm<yup.InferType<typeof schemaEdit>>({
    resolver: yupResolver(schemaEdit),
    defaultValues: {
      title: {
        en: '',
        ar: '',
      },
      description: {
        en: '',
        ar: '',
      },
      metaDescription: '',
      metaKeyword: '',
      status: 'draft',
    },
  });
  const [filesImageEdit, setFilesImageEdit] = useState<File[]>([]);
  const [uploadedImageEdit, setUploadedImageEdit] = React.useState<string>('');
  const [imageEditError, setImageEditError] = useState('');
  const [isLoadingUploadEdit, setIsLoadingUploadEdit] = React.useState(false);
  const {
    getRootProps: getRootPropsImageEdit,
    getInputProps: getInputPropsImageEdit,
    open: openImageEdit,
  } = useDropzone({
    onDrop(acceptedFiles, fileRejections) {
      setIsLoadingUploadEdit(false);
      fileRejections.forEach((file) => {
        file.errors.forEach((err) => {
          if (err.code === 'file-too-large') {
            setImageEditError(`Image is too large`);
          }

          if (err.code === 'file-invalid-type') {
            setImageEditError(`Invalid type`);
          }
        });
      });
      const newFile = acceptedFiles[0];
      if (newFile) {
        setImageEditError('');
        setUploadedImageEdit(URL.createObjectURL(newFile));
        setFilesImageEdit(acceptedFiles);
      }
    },
    noClick: true,
    accept: {
      'image/jpg': [],
      'image/png': [],
      'image/jpeg': [],
    },
  });
  const [filesDocumentEdit, setFilesDocumentEdit] = useState<File[]>([]);
  const [defaultDocumentEdit, setDefaultDocumentEdit] = useState<TDocument>();
  const [documentEditError, setDocumentEditError] = useState<string>('');
  const {
    getRootProps: getRootPropsDocumentEdit,
    getInputProps: getInputPropsDocumentEdit,
    open: openDocumentEdit,
  } = useDropzone({
    onDrop(acceptedFiles) {
      setIsLoadingUploadEdit(false);
      setDocumentEditError('');
      setFilesDocumentEdit(acceptedFiles);
    },
    noClick: true,
    accept: {
      'application/pdf': [],
    },
  });
  const { data: detailEdit } = useGetCatalogueById(idEdit, {
    enabled: !!idEdit,
  });
  const { mutate: mutateEdit, isLoading: isLoadingEdit } = useEditCatalogue();
  const handleEdit: SubmitHandler<yup.InferType<typeof schemaEdit>> =
    React.useCallback(
      async (payload) => {
        setIsLoadingUploadEdit(true);
        if (filesImageEdit?.length) {
          const formDataImage = new FormData();
          formDataImage.append('file', filesImageEdit[0]);
          formDataImage.append(
            'name',
            `${filesImageEdit[0].name}-${Date.now()}`,
          );
          const { data: imageData } = await uploadImage(formDataImage);
          if (imageData.id) {
            payload.imageId = imageData.id;
          } else {
            setFilesImageEdit([]);
            setImageEditError('Upload image error, try again.');
            setIsLoadingUploadEdit(false);
            return;
          }
        }

        if (filesDocumentEdit.length) {
          const formDataDoc = new FormData();
          formDataDoc.append('file', filesDocumentEdit[0]);
          const { data: docData } = await uploadDocument(formDataDoc);
          if (docData.id) {
            payload.documentId = docData.id;
          } else {
            setFilesDocumentEdit([]);
            setDocumentEditError('Upload document error, try again.');
            setIsLoadingUploadEdit(false);
            return;
          }
        }
        setIsLoadingUploadEdit(false);
        mutateEdit(
          { id: Number(idEdit), payload: payload as TCataloguePayload },
          {
            onSuccess(resp) {
              if (resp.code === HTTP_STATUS.SUCCESS) {
                toast.success('Catalogue Edited');
                queryClient.removeQueries('getCatalogues');
                queryClient.removeQueries('getCatalogueById');
                setShowEditCatalogue(false);
              } else {
                toast.error(resp.message);
              }
            },
          },
        );
      },
      [filesDocumentEdit, filesImageEdit, idEdit, mutateEdit, queryClient],
    );

  React.useEffect(() => {
    if (!showEditCatalogue) {
      formEdit.reset();
      setFilesImageEdit([]);
      setUploadedImageEdit('');
      setFilesDocumentEdit([]);
    }
  }, [formEdit, showEditCatalogue]);

  React.useEffect(() => {
    if (detailEdit) {
      formEdit.setValue('title', detailEdit.title);
      formEdit.setValue('description', detailEdit.description);
      formEdit.setValue('slug', detailEdit.slug);
      formEdit.setValue('metaDescription', detailEdit.metaDescription);
      formEdit.setValue('metaKeyword', detailEdit.metaKeyword);
      formEdit.setValue('imageId', detailEdit.image?.id);
      formEdit.setValue('documentId', detailEdit.document?.id);
      formEdit.setValue('status', detailEdit.status);
      if (detailEdit?.image.url) {
        setUploadedImageEdit(detailEdit.image.url);
      }
      if (detailEdit?.document?.name) {
        setDefaultDocumentEdit(detailEdit.document);
      }
    }
  }, [detailEdit, formEdit]);

  return (
    <>
      <div className=" flex h-full w-full flex-col">
        <Header title="Catalogue Management" />

        <div className=" h-full w-full p-4 lg:p-6">
          <div className=" flex w-full flex-col rounded-lg border p-5">
            {/* begin: filter, search and action */}
            <div className="flex items-center justify-between rounded-lg border bg-neutral-100 p-1.5">
              <div className="flex items-center">
                <Button
                  className=" text-xs"
                  variant="transparent"
                  onClick={() => setShowAddCatalogue((prev) => !prev)}
                >
                  <MenuBoard size={16} />
                  Create
                </Button>
                <div className=" h-8 w-px border-r"></div>
                <Button
                  className=" text-xs"
                  variant="transparent"
                  // onClick={() => setShowFilter((prev) => !prev)}
                >
                  <Filter size={16} />
                  Filter
                </Button>
              </div>
              {/* <div className=" relative">
                <FiSearch
                  size={16}
                  className=" absolute left-3 top-3 text-gray-500"
                />
                <Input
                  className=" w-full border bg-white pl-10 ring-offset-transparent placeholder:text-gray-500 focus-visible:ring-0 focus-visible:ring-transparent xl:w-64"
                  placeholder="Search Data"
                  onChange={(e) => setSearchValue(e.target.value)}
                />
              </div> */}
              <BaseSearch className=" block" />
            </div>
            {/* end: filter, search and action */}

            {/* begin: empty state */}
            {/* <EmptyState description="We couldn't find any data matching your search. Please double-check your keywords or try different search terms" /> */}
            {/* end: empty state */}
            {isLoadingList ? (
              <BaseTableSkeleton
                col={3}
                row={10}
              />
            ) : catalogues && catalogues.totalCount > 0 ? (
              <>
                <div className=" mt-4 overflow-hidden rounded-lg border">
                  <Table className="whitespace-nowrap [&_tr:nth-child(even)]:bg-neutral-100">
                    <TableHeader>
                      <TableRow className=" bg-neutral-200 capitalize">
                        <TableHead>Date</TableHead>
                        <TableHead>Title</TableHead>
                        {/* <TableHead>Group</TableHead> */}
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {catalogues?.content.map((catalogue, i) => (
                        <TableRow key={i}>
                          <TableCell>
                            {moment(catalogue.date).format('MM/DD/yyyy')}
                          </TableCell>
                          <TableCell>
                            {textTruncate(getLang(params, catalogue.title))}
                          </TableCell>
                          {/* <TableCell>-catalogue.group.name</TableCell> */}
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="info"
                                size="icon-sm"
                                onClick={() => {
                                  setIdDetail(catalogue.id);
                                  setShowDetailCatalogue((prev) => !prev);
                                }}
                              >
                                <Eye size={16} />
                              </Button>
                              <Button
                                variant="info"
                                size="icon-sm"
                                onClick={() => {
                                  setIdEdit(catalogue.id);
                                  setShowEditCatalogue((prev) => !prev);
                                }}
                              >
                                <Pencxil />
                              </Button>
                              <Button
                                variant="destructive"
                                size="icon-sm"
                                onClick={() => {
                                  setIdDelete(catalogue.id);
                                  setShowDeleteCatalogue((prev) => !prev);
                                }}
                              >
                                <Trash size={16} />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <BasePagination totalCount={Number(catalogues?.totalCount)} />
              </>
            ) : (
              <EmptyState />
            )}
          </div>
        </div>
      </div>

      {/* begin: drawer add catalogue */}
      <Sheet
        open={showAddCatalogue}
        onOpenChange={setShowAddCatalogue}
      >
        <SheetContent className=" flex flex-col gap-4 overflow-y-auto bg-white p-4 py-0">
          <SheetHeader className=" sticky top-0 gap-2 bg-white pt-4">
            <div className="flex items-center justify-between">
              <SheetTitle>Create</SheetTitle>
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
                  <FormField
                    control={formAdd.control}
                    name="title.en"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className=" text-sm">Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Input Title"
                            {...field}
                          />
                        </FormControl>
                        <BaseFormError />
                      </FormItem>
                    )}
                  />
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
                        <BaseFormError />
                      </FormItem>
                    )}
                  />
                </div>
                <div className=" flex flex-col gap-2">
                  <FormField
                    control={formAdd.control}
                    name="description.en"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className=" text-sm">Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Input Description"
                            {...field}
                          />
                        </FormControl>
                        <BaseFormError />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="description.ar"
                    control={formAdd.control}
                    render={({ field }) => (
                      <FormItem>
                        <Textarea
                          dir="rtl"
                          placeholder="اسم الإدخال"
                          {...field}
                        />
                        <BaseFormError />
                      </FormItem>
                    )}
                  />
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
                        <BaseFormError />
                      </FormItem>
                    )}
                  />
                </div>
                <div className=" flex flex-col gap-2">
                  <FormField
                    control={formAdd.control}
                    name="metaDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className=" text-sm">
                          Meta Description
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Input Meta Description"
                            {...field}
                          />
                        </FormControl>
                        <BaseFormError />
                      </FormItem>
                    )}
                  />
                </div>
                <div className=" flex flex-col gap-2">
                  <FormField
                    control={formAdd.control}
                    name="metaKeyword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className=" text-sm">Meta Keyword</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Input Meta Keyword"
                            {...field}
                          />
                        </FormControl>
                        <BaseFormError />
                      </FormItem>
                    )}
                  />
                </div>
                <div className=" flex flex-col gap-2">
                  <Label className=" text-sm">Catalogue Image</Label>
                  <div
                    {...getRootPropsImageAdd({
                      className:
                        'flex items-center justify-center rounded-lg gap-4 border-2 border-dashed p-6',
                    })}
                  >
                    <input {...getInputPropsImageAdd()} />
                    {uploadedImageAdd ? (
                      <div className=" group relative mx-auto aspect-[2/0.8] w-full overflow-hidden rounded-lg border">
                        <Image
                          src={uploadedImageAdd}
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
                              onClick={openImageAdd}
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
                            onClick={openImageAdd}
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
                    {imageAddError}
                  </span>
                </div>
                <div className=" flex flex-col gap-2">
                  <Label className=" text-sm">Catalogue Document</Label>
                  {!!filesDocumentAdd.length && (
                    <div className="flex flex-col gap-4">
                      <div className="flex justify-between">
                        <div className="flex items-center gap-2">
                          <DocumentText
                            variant="Bold"
                            className=" text-neutral-500"
                          />
                          <p className=" text-sm font-medium text-neutral-500">
                            {filesDocumentAdd[0].name}
                          </p>
                        </div>
                        <button type="button">
                          <Trash
                            size={16}
                            className=" text-primary"
                            onClick={() => {
                              setFilesDocumentAdd([]);
                            }}
                          />
                        </button>
                      </div>
                    </div>
                  )}
                  <div
                    {...getRootPropsDocumentAdd({
                      className:
                        'flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6',
                    })}
                  >
                    <input {...getInputPropsDocumentAdd()} />
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
                        onClick={openDocumentAdd}
                        type="button"
                        className=" h-8 gap-2 text-primary"
                        variant="ghost"
                      >
                        <FaArrowUp size={12} />
                        Upload
                      </Button>
                    </div>
                  </div>
                  <span className="font-small text-xs text-red-600">
                    {documentAddError}
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="mb-2 text-sm">
                    Status <span className=" text-primary">*</span>
                  </Label>
                  <Select
                    value={String(formAdd.getValues(`status`))}
                    onValueChange={(value: string) => {
                      formAdd.setValue(`status`, value);
                      setUpdate((prev) => !prev);
                      // setSelectedPropertyType(value);
                    }}
                  >
                    <SelectTrigger className="">
                      <SelectValue placeholder="" />
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
                <Button
                  type="submit"
                  disabled={isLoadingAdd || isLoadingUploadAdd}
                  // onClick={() => {
                  //   setShowAddCatalogue((prev) => !prev);
                  // }}
                >
                  {(isLoadingAdd || isLoadingUploadAdd) && (
                    <LuLoader2
                      className=" animate-spin text-white"
                      size={16}
                    />
                  )}
                  Create
                </Button>
              </div>
            </form>
          </Form>
        </SheetContent>
      </Sheet>
      {/* end: drawer add admin */}

      {/* begin: drawer edit catalogue */}
      <Sheet
        open={showEditCatalogue}
        onOpenChange={(value) => {
          if (!value) {
            queryClient.removeQueries('getCatalogueById');
            formEdit.reset();
          }
          setShowEditCatalogue(value);
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
                <div className=" flex flex-col gap-2">
                  <FormField
                    control={formEdit.control}
                    name="title.en"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className=" text-sm">Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Input Title"
                            {...field}
                          />
                        </FormControl>
                        <BaseFormError />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="title.ar"
                    control={formEdit.control}
                    render={({ field }) => (
                      <FormItem>
                        <Input
                          dir="rtl"
                          placeholder="اسم الإدخال"
                          {...field}
                        />
                        <BaseFormError />
                      </FormItem>
                    )}
                  />
                </div>
                <div className=" flex flex-col gap-2">
                  <FormField
                    control={formEdit.control}
                    name="description.en"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className=" text-sm">Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Input Description"
                            {...field}
                          />
                        </FormControl>
                        <BaseFormError />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="description.ar"
                    control={formEdit.control}
                    render={({ field }) => (
                      <FormItem>
                        <Textarea
                          dir="rtl"
                          placeholder="اسم الإدخال"
                          {...field}
                        />
                        <BaseFormError />
                      </FormItem>
                    )}
                  />
                </div>
                <div className=" flex flex-col gap-2">
                  <FormField
                    control={formEdit.control}
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
                        <BaseFormError />
                      </FormItem>
                    )}
                  />
                </div>
                <div className=" flex flex-col gap-2">
                  <FormField
                    control={formEdit.control}
                    name="metaDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className=" text-sm">
                          Meta Description
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Input Meta Description"
                            {...field}
                          />
                        </FormControl>
                        <BaseFormError />
                      </FormItem>
                    )}
                  />
                </div>
                <div className=" flex flex-col gap-2">
                  <FormField
                    control={formEdit.control}
                    name="metaKeyword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className=" text-sm">Meta Keyword</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Input Meta Keyword"
                            {...field}
                          />
                        </FormControl>
                        <BaseFormError />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex flex-col gap-4">
                  <Label className=" text-sm">Catalogue Image</Label>
                  <div
                    {...getRootPropsImageEdit({
                      className:
                        'flex items-center justify-center rounded-lg gap-4 border-2 border-dashed p-6',
                    })}
                  >
                    <input {...getInputPropsImageEdit()} />
                    {uploadedImageEdit ? (
                      <div className=" group relative mx-auto aspect-[2/0.8] w-full overflow-hidden rounded-lg border">
                        <Image
                          src={uploadedImageEdit}
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
                              onClick={openImageEdit}
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
                            onClick={openImageEdit}
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
                    {imageEditError}
                  </span>
                </div>
                <div className="flex flex-col gap-4">
                  <Label className=" text-sm">Catalogue Document</Label>
                  <div className="flex flex-col gap-4">
                    {(filesDocumentEdit[0]?.name ||
                      defaultDocumentEdit?.name) && (
                      <div className="flex justify-between">
                        <div className="flex items-center gap-2">
                          <DocumentText
                            variant="Bold"
                            className=" text-neutral-500"
                          />
                          <p className=" text-sm font-medium text-neutral-500">
                            {filesDocumentEdit[0]?.name ||
                              defaultDocumentEdit?.name}
                          </p>
                        </div>
                        <button type="button">
                          <Trash
                            size={16}
                            className=" text-primary"
                            onClick={() => {
                              setFilesDocumentEdit([]);
                              setDefaultDocumentEdit(undefined);
                            }}
                          />
                        </button>
                      </div>
                    )}
                  </div>
                  <div
                    {...getRootPropsDocumentEdit({
                      className:
                        'flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6',
                    })}
                  >
                    <input {...getInputPropsDocumentEdit()} />
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
                        onClick={openDocumentEdit}
                        type="button"
                        variant="ghost-primary"
                        size="sm"
                      >
                        <FaArrowUp size={12} />
                        Upload
                      </Button>
                    </div>
                  </div>
                  <span className="font-small text-xs text-red-600">
                    {documentEditError}
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="mb-2 text-sm">
                    Status <span className=" text-primary">*</span>
                  </Label>
                  <Select
                    value={String(formEdit.getValues(`status`))}
                    onValueChange={(value: string) => {
                      formEdit.setValue(`status`, value);
                      setUpdate((prev) => !prev);
                      // setSelectedPropertyType(value);
                    }}
                  >
                    <SelectTrigger className="">
                      <SelectValue placeholder="" />
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
                <Button
                  // onClick={() => {
                  //   setShowEditCatalogue((prev) => !prev);
                  // }}
                  className=" gap-2"
                  disabled={isLoadingEdit || isLoadingUploadEdit}
                >
                  {(isLoadingEdit || isLoadingUploadEdit) && (
                    <LuLoader2
                      className=" animate-spin text-white"
                      size={16}
                    />
                  )}
                  Save Changes
                </Button>
              </div>
            </form>
          </Form>
        </SheetContent>
      </Sheet>
      {/* end: drawer edit catalogue */}

      {/* begin: drawer detail admin */}
      <Sheet
        // open
        open={showDetailCatalogue}
        onOpenChange={setShowDetailCatalogue}
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
              <p className=" text-sm font-medium text-neutral-500">
                {detail?.title && getLang(params, detail?.title)}
              </p>
            </div>
            <div className=" flex flex-col gap-2">
              <Label className=" text-sm">Description</Label>
              <p className=" text-sm font-medium text-neutral-500">
                {detail?.description && getLang(params, detail?.description)}
              </p>
            </div>
            <div className=" flex flex-col gap-2">
              <Label className=" text-sm">Slug</Label>
              <p className=" text-sm font-medium text-neutral-500">
                {detail?.slug}
              </p>
            </div>
            <div className=" flex flex-col gap-2">
              <Label className=" text-sm">Meta Description</Label>
              <p className=" text-sm font-medium text-neutral-500">
                {detail?.metaDescription}
              </p>
            </div>
            <div className=" flex flex-col gap-2">
              <Label className=" text-sm">Meta Keyword</Label>
              <p className=" text-sm font-medium text-neutral-500">
                {detail?.metaKeyword}
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <Label className=" text-sm">Catalogue Image</Label>
              <div className="flex flex-col gap-4">
                <div className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <DocumentText
                      variant="Bold"
                      className=" text-neutral-500"
                    />
                    <p className=" text-sm font-medium text-neutral-500">
                      {detail?.image?.name}
                    </p>
                  </div>
                  {detail?.image?.url && (
                    <Link
                      href={detail?.image?.url}
                      target="_blank"
                    >
                      <ArrowDown size={16} />
                    </Link>
                    // <button type="button">
                    //   <ArrowDown size={16} />
                    // </button>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <Label className=" text-sm">Catalogue Document</Label>
              <div className="flex flex-col gap-4">
                <div className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <DocumentText
                      variant="Bold"
                      className=" text-neutral-500"
                    />
                    <p className=" text-sm font-medium text-neutral-500">
                      {detail?.document?.name}
                    </p>
                  </div>
                  {detail?.document?.url && (
                    <Link
                      href={detail?.document?.url}
                      target="_blank"
                    >
                      <ArrowDown size={16} />
                    </Link>
                    // <button type="button">
                    //   <ArrowDown size={16} />
                    // </button>
                  )}
                </div>
              </div>
            </div>
            <div className=" flex flex-col gap-2">
              <Label className=" text-sm">Status</Label>
              <p className=" text-sm font-medium text-neutral-500">
                {detail?.status}
              </p>
            </div>
            {/* end: main form */}
          </div>
        </SheetContent>
      </Sheet>
      {/* end: drawer detail admin */}

      {/* begin: dialog delete admin */}
      <Dialog
        open={showDeleteCatalogue}
        onOpenChange={setShowDeleteCatalogue}
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
            <Button
              disabled={isLoadingDelete}
              onClick={() => handleDelete()}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      {/* end: dialog delete admin */}
    </>
  );
}
