'use client';

import { useAttributes } from '@/api/attribute.api';
import { useBrands } from '@/api/brand.api';
import { useCategories } from '@/api/category.api';
import { uploadFileSingle } from '@/api/http/upload.service';
import { useEditroduct, useProductById } from '@/api/product.api';
import { useGetStoresOptions } from '@/api/store.api';
import { Button } from '@/components/ui/button';
import {
  Form,
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
import { Textarea } from '@/components/ui/textarea';
import {
  HTTP_STATUS,
  PRODUCT_PROPERTY_TYPE,
} from '@/constants/common.constant';
import { TCategory } from '@/types/category.type';
import { TProductPropertyTypeValue } from '@/types/common.type';
import { getLang } from '@/utils/locale.util';
import { yupResolver } from '@hookform/resolvers/yup';
import { Trash } from 'iconsax-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useFieldArray, useForm } from 'react-hook-form';
import { FaArrowLeft, FaArrowUp, FaChevronRight } from 'react-icons/fa6';
import { FiPlusCircle } from 'react-icons/fi';
import { useQueryClient } from 'react-query';
import { toast } from 'sonner';
import * as yup from 'yup';

const schema = yup.object().shape({
  id: yup.number().required(),
  storeId: yup.number(),
  title: yup.object().shape({
    en: yup.string().required('required 1').label('Title [en]'),
    ar: yup.string().required('required 2').label('Title [ar]'),
  }),
  brandId: yup.number().required('required 3').label('Brand'),
  code: yup.string().required('required 4').label('Code'),
  mpnCode: yup.string().required('required 5').label('Mpn'),
  gtinCode: yup.object().shape({
    ean: yup.string().required('required 6').label('Ean'),
    upc: yup.string().required('required 7').label('Upc'),
  }),
  familyCode: yup.string().required('required 8').label('Family Code'),
  categoryId: yup.number().required('required 9').label('Category'),
  description: yup.object().shape({
    en: yup.string().required('required 10').label('Description [en]'),
    ar: yup.string().required('required 11').label('Description [ar]'),
  }),
  weight: yup.number().required('required 12').label('Weight'),
  width: yup.number().required('required 13').label('Width'),
  height: yup.number().required('required 14').label('Height'),
  length: yup.number().required('required 15').label('Length'),
  metaKeyword: yup.string().required('required 16').label('Meta Keyword'),
  metaDescription: yup
    .string()
    .required('required 17')
    .label('Meta Description'),
  isManufacture: yup.boolean().required('required 18'),
  galleries: yup.array().min(1).required('required 20').label('Galleries'),
  documents: yup.array().required('required 21').label('Documents'),
  properties: yup.array().required('required 22').label('Properties'),
});

type SchemaType<T extends yup.AnyObjectSchema> = yup.InferType<T>;
type SchemaKeys = keyof SchemaType<typeof schema>;

export default function EditProductPage() {
  // const [files, setFiles] = useState<File[]>([]);

  // const [addImagesCount, setAddImagesCount] = useState(0);

  const params = useParams();
  const router = useRouter();

  const form = useForm<yup.InferType<typeof schema>>({
    resolver: yupResolver(schema),
    defaultValues: {
      isManufacture: true,
      id: Number(params.product_id),
    },
  });

  const {
    fields: galleryFields,
    append: galleryAppends,
    remove: galleryRemove,
  } = useFieldArray({
    control: form.control,
    name: 'galleries',
    rules: { minLength: 1 },
  });
  const {
    fields: documentFields,
    append: documentAppends,
    remove: documentRemove,
  } = useFieldArray({
    control: form.control,
    name: 'documents',
    rules: { minLength: 1 },
  });
  const {
    fields: propertiesFields,
    append: propertiesAppends,
    remove: propertiesRemove,
  } = useFieldArray({
    control: form.control,
    name: 'properties',
    rules: { minLength: 1 },
  });

  const [_update, setUpdate] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [urlUploadedImages, setUrlUploadedImages] = useState<string[]>([]);
  const {
    getRootProps: getGalleryRootProps,
    getInputProps: getGalleryInputProps,
    open: galleryOpen,
  } = useDropzone({
    async onDrop(acceptedFiles, _) {
      // const element = e.target as HTMLInputElement;
      // const formData = new FormData();
      // formData.append('file', acceptedFiles[0]);
      // const { data } = await uploadFileSingle(formData);
      // form.setValue(
      //   element.name as SchemaKeys,
      //   { image: data, order: form.getValues('galleries').length } as any,
      // );
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
  React.useEffect(() => {
    setUrlUploadedImages(() => {
      return uploadedImages.map((item) => URL.createObjectURL(item));
    });
  }, [uploadedImages]);
  const handleDeleteImage = (index: number) => {
    galleryRemove(index);

    setUploadedImages((prev) => prev.splice(index, 1));
  };

  const [uploadedDocuments, setUploadedDocuments] = useState<File[]>([]);
  const [_urlUploadedDocuments, setUrlUploadedDocuments] = useState<string[]>(
    [],
  );
  const {
    getRootProps: getDocRootProps,
    getInputProps: getDocInputProps,
    open: docOpen,
  } = useDropzone({
    async onDrop(acceptedFiles, _) {
      // const element = e.target as HTMLInputElement;
      // const formData = new FormData();
      // formData.append('file', acceptedFiles[0]);
      // const { data } = await uploadFileSingle(formData);
      // const docData = { file: data.url, name: data.name };
      // form.setValue(element.name as SchemaKeys, docData as any);
      setUploadedDocuments((prev) => {
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
  React.useEffect(() => {
    setUrlUploadedDocuments(() => {
      return uploadedDocuments.map((item) => URL.createObjectURL(item));
    });
  }, [uploadedDocuments]);
  const handleDeleteDocument = (index: number) => {
    documentRemove(index);

    setUploadedDocuments((prev) => prev.splice(index, 1));
  };

  const {
    getRootProps: getPropertyRootProps,
    getInputProps: getPropertyInputProps,
    open: propertyOpen,
  } = useDropzone({
    async onDrop(acceptedFiles, _, e) {
      const element = e.target as HTMLInputElement;
      const formData = new FormData();
      formData.append('file', acceptedFiles[0]);
      const { data } = await uploadFileSingle(formData);
      form.setValue(element.name as SchemaKeys, data as any);
    },
    noClick: true,
    multiple: false,
    accept: {
      'image/jpg': [],
      'image/png': [],
      'image/jpeg': [],
    },
  });

  const { data: detail } = useProductById(Number(params.product_id));
  const queryClient = useQueryClient();
  const { mutate: mutateEdit, isLoading: isLoadingEdit } = useEditroduct();
  const handleEdit = React.useCallback(
    (payload: any) => {
      mutateEdit(payload, {
        onSuccess(resp) {
          if (resp.code === HTTP_STATUS.SUCCESS) {
            toast.success('Product Updated');
            queryClient.invalidateQueries({
              queryKey: ['getProducts', 'getProductById'],
            });
            router.push('/product-management');
          } else {
            toast.error(resp.message);
          }
        },
        onError(err) {
          toast.error(err.message);
        },
      });
    },
    [mutateEdit, queryClient, router],
  );

  const { data: attributes } = useAttributes({ size: '99' });
  const { data: brands } = useBrands({ size: '99' });
  const { data: stores } = useGetStoresOptions({ size: '99' });
  const { data: categories } = useCategories({ size: '99' });

  React.useEffect(() => {
    if (detail) {
      Object.keys(detail).forEach(() => {
        form.setValue('storeId', detail.store?.id);
        form.setValue('title', detail.name);
        form.setValue('brandId', detail.brand?.id);
        form.setValue('code', detail.code);
        form.setValue('mpnCode', detail.mpn);
        form.setValue('gtinCode', detail.gtin);
        form.setValue('familyCode', detail.familyCode);
        // form.setValue('categoryId', detail.categories.id)
        form.setValue('description', detail.description);
        // form.setValue('weight', detail.weight)
        // form.setValue('width', detail.width)
        // form.setValue('height', detail.height)
        // form.setValue('length', detail.length)
        form.setValue('metaKeyword', detail.metaKeyword);
        form.setValue('metaDescription', detail.metaDescription);
        form.setValue('galleries', detail.galleries);
        // form.setValue('documents', detail.documents)
        form.setValue('properties', detail.properties);
      });
    }
  }, [detail, form]);

  return (
    <div className=" w-full p-6">
      <Button
        variant="ghost-primary"
        className=" hover:bg-transparent hover:text-primary"
        asChild
      >
        <Link href="/product-management">
          <FaArrowLeft />
          Back to Previous
        </Link>
      </Button>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleEdit)}>
          <div className=" mt-8 w-full rounded-lg border p-5">
            {/* begin: breadcrumb */}
            <div className="flex items-center gap-2 text-[13px] text-neutral-500">
              <p>Product</p>
              <FaChevronRight size={12} />
              <p className=" text-primary">Edit Product</p>
            </div>
            {/* end: breadcrumb */}

            {/* begin: product information */}
            <p className=" my-6 text-lg font-medium text-neutral-800">
              Product Information
            </p>

            <div className=" flex flex-col gap-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <FormField
                    name="title.en"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Product Title <span className=" text-primary">*</span>
                        </FormLabel>
                        <Input
                          placeholder="Input Product Name [en]"
                          {...field}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="title.ar"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <Input
                          dir="rtl"
                          placeholder="Input Product Name [ar]"
                          {...field}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="mb-2">
                    Brand <span className=" text-primary">*</span>
                  </Label>
                  <Select
                    value={String(form.getValues(`brandId`))}
                    onValueChange={(value: string) => {
                      form.setValue(`brandId`, Number(value));
                      setUpdate((prev) => !prev);
                      // setSelectedPropertyType(value);
                    }}
                  >
                    <SelectTrigger className="">
                      <SelectValue placeholder="Input Brand" />
                    </SelectTrigger>
                    <SelectContent>
                      {brands?.content.map((brand) => (
                        <SelectItem
                          value={String(brand.id)}
                          key={brand.id}
                        >
                          {getLang(params, brand.name)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="mb-2">
                    Store <span className=" text-primary">*</span>
                  </Label>
                  <Select
                    value={String(form.getValues(`storeId`))}
                    onValueChange={(value: string) => {
                      form.setValue(`storeId`, Number(value));
                      setUpdate((prev) => !prev);
                      // setSelectedPropertyType(value);
                    }}
                  >
                    <SelectTrigger className="">
                      <SelectValue placeholder="Input Store" />
                    </SelectTrigger>
                    <SelectContent>
                      {stores?.content?.map((store) => (
                        <SelectItem
                          value={String(store.id)}
                          key={store.id}
                        >
                          {store.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {/* <Input placeholder="Input Brand" /> */}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <FormField
                    name="mpnCode"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          MPN <span className=" text-primary">*</span>
                        </FormLabel>
                        <Input
                          placeholder="Input MPN"
                          {...field}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <FormField
                    name="code"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          SKU <span className=" text-primary">*</span>
                        </FormLabel>
                        <Input
                          placeholder="Input SKU"
                          {...field}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <FormField
                    name="gtinCode.ean"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          EAN <span className=" text-primary">*</span>
                        </FormLabel>
                        <Input
                          placeholder="Input EAN"
                          {...field}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <FormField
                    name="gtinCode.upc"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          UPC <span className=" text-primary">*</span>
                        </FormLabel>
                        <Input
                          placeholder="Input UPC"
                          {...field}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <FormField
                    name="familyCode"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Product Family{' '}
                          <span className=" text-primary">*</span>
                        </FormLabel>
                        <Input
                          placeholder="Input Product Family"
                          {...field}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="mb-2">
                    Category <span className=" text-primary">*</span>
                  </Label>
                  <Select
                    value={String(form.getValues(`categoryId`))}
                    onValueChange={(value: string) => {
                      form.setValue(`categoryId`, Number(value));
                      setUpdate((prev) => !prev);
                      // setSelectedPropertyType(value);
                    }}
                  >
                    <SelectTrigger className="">
                      <SelectValue placeholder="Input Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map((category: TCategory) => (
                        <SelectItem
                          value={String(category.id)}
                          key={category.id}
                        >
                          {getLang(params, category.name)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <FormField
                  name="description.en"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Description <span className=" text-primary">*</span>
                      </FormLabel>
                      <Textarea
                        placeholder="Input Description Here [en]"
                        {...field}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="description.ar"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <Textarea
                        dir="rtl"
                        placeholder="Input Description Here [ar]"
                        {...field}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>
                  Packaging ( Weight - Height - Width - Length){' '}
                  <span className=" text-primary">*</span>
                </Label>

                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                  <FormField
                    name="weight"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <Input
                          placeholder="Input Weight"
                          {...field}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="height"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <Input
                          placeholder="Input Height"
                          {...field}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="width"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <Input
                          placeholder="Input Width"
                          {...field}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="length"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <Input
                          placeholder="Input Length"
                          {...field}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              {/* <div className="flex flex-col gap-2">
                <Label>
                  Product Status <span className=" text-primary">*</span>
                </Label>
                <Switch />
              </div> */}
              <div className="flex flex-col gap-2">
                <FormField
                  name="metaKeyword"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Meta Keyword <span className=" text-primary">*</span>
                      </FormLabel>
                      <Input
                        placeholder="Input Meta Keyword"
                        {...field}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col gap-2">
                <FormField
                  name="metaDescription"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Meta Description{' '}
                        <span className=" text-primary">*</span>
                      </FormLabel>
                      <Textarea
                        placeholder="Input Meta Description"
                        {...field}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            {/* end: product information */}

            <hr className=" my-6" />

            {/* begin: product images */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <p className=" text-lg font-medium text-neutral-800">
                  Product Images
                </p>
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
                        {...getGalleryInputProps()}
                        name={`galleries.${i}`}
                      />
                      <div className="flex w-full flex-col gap-2 text-center">
                        <div className=" relative aspect-square h-14">
                          <Image
                            src={
                              urlUploadedImages[i] || '/images/file-upload.svg'
                            }
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
            {/* <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <p className=" text-lg font-medium text-neutral-800">
                  Product Images
                </p>
                <Button
                  variant="ghost"
                  className=" h-8 text-xs text-primary hover:bg-transparent hover:text-primary"
                  onClick={() => setAddImagesCount((prev) => prev + 1)}
                >
                  Add Images
                </Button>
              </div>

              <div className="grid grid-cols-2 items-stretch gap-6 lg:grid-cols-4">
                {['pd-1.jpg', 'pd-3.jpg', 'pd-2.jpg', 'pd-4.jpg'].map(
                  (value, i) => (
                    <div
                      key={i}
                      className=" relative aspect-[4/3] h-full w-full"
                    >
                      <Image
                        src={`/images/${value}`}
                        fill
                        alt=""
                        className=" object-contain object-center"
                      />
                    </div>
                  ),
                )}
                {[...Array(addImagesCount)].map((_, i) => (
                  <div
                    key={i}
                    className="flex flex-col gap-2"
                  >
                    <Label className=" text-sm">Image {i + 1}</Label>
                    <div
                      {...getGalleryRootProps({
                        className:
                          'flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6',
                      })}
                    >
                      <input {...getGalleryInputProps()} />
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
                          Drag or Upload Image
                        </p>
                      </div>
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
                    </div>
                  </div>
                ))}
              </div>
            </div> */}
            {/* end: product images */}

            <hr className=" my-6" />

            {/* begin: product document */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <p className=" text-lg font-medium text-neutral-800">
                  Product Document
                </p>
                <Button
                  variant="ghost-primary"
                  size="sm"
                  className=" h-9"
                  type="button"
                  onClick={() => documentAppends({})}
                >
                  Add Document
                </Button>
              </div>
              {documentFields.map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between">
                    <Label className=" text-sm">
                      Document {i + 1}
                      {uploadedDocuments[i]?.name && ': '}
                      <span className="font-bold">
                        {uploadedDocuments[i]?.name}
                      </span>
                    </Label>
                    <Button
                      variant="destructive"
                      size="icon-sm"
                      type="button"
                      onClick={() => {
                        handleDeleteDocument(i);
                      }}
                    >
                      <Trash size={16} />
                    </Button>
                  </div>
                  {!uploadedDocuments[i]?.name && (
                    <div
                      key={i}
                      {...getDocRootProps({
                        className:
                          'flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6',
                      })}
                    >
                      <input
                        {...getDocInputProps()}
                        name={`documents.${i}`}
                      />
                      <div className="flex w-full flex-col items-center gap-4 text-center">
                        <div className=" relative aspect-square h-14">
                          <Image
                            src={
                              form.getValues('documents')[i].file ||
                              '/images/file-upload.svg'
                            }
                            fill
                            alt=""
                            className=" object-contain object-center"
                          />
                        </div>
                        <p className=" text-sm text-neutral-500">
                          {form.getValues('documents')[i].name ||
                            'Drag or Upload File'}
                        </p>
                        <Button
                          onClick={docOpen}
                          type="button"
                          className=" h-8 gap-2"
                        >
                          <FaArrowUp size={12} />
                          Upload
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {/* <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <p className=" text-lg font-medium text-neutral-800">
                  Product Document
                </p>
                <Button
                  variant="ghost"
                  className=" h-8 text-xs text-primary hover:bg-transparent hover:text-primary"
                >
                  Add Document
                </Button>
              </div>

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
                    <div className="flex items-center gap-6">
                      <button>
                        <FaArrowDown
                          size={12}
                          className=" text-primary"
                        />
                      </button>
                      <button>
                        <Trash
                          size={16}
                          className=" text-primary"
                        />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div> */}
            {/* end: product document */}

            <hr className=" my-6" />

            {/* begin: product property */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <p className=" text-lg font-medium text-neutral-800">
                  Product Property
                </p>
                <Button
                  variant="ghost-primary"
                  size="sm"
                  className=" h-9"
                  type="button"
                  onClick={() =>
                    propertiesAppends({
                      name: {
                        en: '',
                        ar: '',
                      },
                      type: PRODUCT_PROPERTY_TYPE[0].value,
                      fields: [],
                      sequence: propertiesFields.length + 1,
                      items: [
                        {
                          attributeId: 0,
                          value1: null,
                          value2: null,
                          value3: null,
                          icon: '',
                        },
                      ],
                    })
                  }
                >
                  Add Property
                </Button>
              </div>

              {propertiesFields.map((_field, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-5 rounded-lg border p-4"
                >
                  <div className="flex items-center justify-between">
                    <p className=" font-medium text-neutral-800">
                      Property {i + 1}
                    </p>
                    <div className="flex items-center gap-4">
                      {/* <button>
                        <Pencxil className=" fill-primary" />
                      </button> */}
                      <button>
                        <Trash
                          size={16}
                          className=" text-primary"
                          type="button"
                          onClick={() => propertiesRemove(i)}
                        />
                      </button>
                    </div>
                  </div>
                  <Select
                    value={form.getValues(`properties.${i}.type`)}
                    onValueChange={(value: TProductPropertyTypeValue) => {
                      form.setValue(`properties.${i}.type`, value);
                      setUpdate((prev) => !prev);
                      // setSelectedPropertyType(value);
                    }}
                  >
                    <SelectTrigger className=" w-96">
                      <SelectValue placeholder="Icon and Description" />
                    </SelectTrigger>
                    <SelectContent>
                      {PRODUCT_PROPERTY_TYPE.map((property) => (
                        <SelectItem
                          value={property.value}
                          key={property.value}
                        >
                          {property.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className=" grid grid-cols-12">
                    <div className=" col-span-12 space-y-2 md:col-span-8 lg:col-span-6">
                      <FormField
                        name={`properties.${i}.name.en`}
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Property Name{' '}
                              <span className=" text-primary">*</span>
                            </FormLabel>
                            <Input
                              placeholder="Input Property Name [en]"
                              {...field}
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        name={`properties.${i}.name.ar`}
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <Input
                              dir="rtl"
                              placeholder="Input Property Name [ar]"
                              {...field}
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  {form.getValues(`properties.${i}.type`) === 'image' && (
                    <div className="grid grid-cols-3 items-stretch gap-6">
                      {form
                        .getValues(`properties.${i}.items`)
                        ?.map((item: any, itemIndex: number) => (
                          <div
                            key={i}
                            className="flex flex-col gap-4 rounded-lg border p-4"
                          >
                            <div className="flex justify-end">
                              <button
                                type="button"
                                onClick={() => {
                                  const prev = form.getValues(
                                    `properties.${i}.items`,
                                  );
                                  prev.splice(itemIndex, 1);
                                  form.setValue(`properties.${i}.items`, prev);
                                  setUpdate((prev) => !prev);
                                }}
                              >
                                <Trash
                                  size={16}
                                  className=" text-primary"
                                />
                              </button>
                            </div>
                            <div
                              {...getPropertyRootProps({
                                className:
                                  'flex items-center justify-center rounded-lg border-2 border-dashed bg-neutral-50 p-6',
                              })}
                            >
                              <input
                                {...getPropertyInputProps()}
                                name={`properties.${i}.items.${itemIndex}.icon`}
                              />
                              <div className=" relative aspect-square h-14">
                                <Image
                                  src={
                                    item.icon.url || '/images/file-upload.svg'
                                  }
                                  fill
                                  alt=""
                                  className=" object-contain object-center"
                                />
                              </div>
                              <div className="flex w-full flex-col items-center gap-2 text-center">
                                <p className=" text-sm text-neutral-500">
                                  {item.icon.name || 'Drag or Upload File'}
                                </p>
                                <Button
                                  onClick={propertyOpen}
                                  type="button"
                                  className=" h-8 w-fit gap-2"
                                >
                                  <FaArrowUp size={12} />
                                  Upload
                                </Button>
                              </div>
                            </div>
                            {/* <div className="flex flex-col gap-2">
                              <Label className=" text-sm">Description</Label>
                              <Input placeholder="Input product name" />
                            </div> */}
                          </div>
                        ))}
                      <div className=" flex w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-primary py-8">
                        <Button
                          variant="destructive"
                          size="icon-sm"
                          type="button"
                          onClick={() => {
                            const prev = form.getValues(
                              `properties.${i}.items`,
                            );
                            form.setValue(`properties.${i}.items`, [
                              ...prev,
                              {
                                attributeId: 0,
                                value1: null,
                                value2: null,
                                value3: null,
                                icon: '',
                              },
                            ]);
                            setUpdate((prev) => !prev);
                          }}
                        >
                          <FiPlusCircle size={16} />
                        </Button>
                        <p className=" text-sm font-medium text-primary">
                          Add Content
                        </p>
                      </div>
                    </div>
                  )}

                  {/* {selectedPropertyType === '2-rows-data' && (
                    <div className="flex flex-col">
                      <Button
                        variant="ghost-primary"
                        size="sm"
                        className=" self-end"
                      >
                        Add row
                      </Button>
                      <div className="flex gap-2">
                        <div className="  grid flex-1 grid-cols-2 gap-2">
                          <div className=" space-y-2">
                            <Label className=" text-xs">Description</Label>
                            <Input />
                          </div>
                          <div className=" space-y-2">
                            <Label className=" text-xs">Value</Label>
                            <Input />
                          </div>
                        </div>
                        <Button
                          size="icon"
                          variant="transparent-destructive"
                          className=" self-end"
                        >
                          <Trash size={16} />
                        </Button>
                      </div>
                    </div>
                  )} */}
                  {form.getValues(`properties.${i}.type`) === 'table' && (
                    <div className="flex flex-col">
                      {/* <div className=" grid grid-cols-12">
                        <div className=" col-span-12 space-y-2 md:col-span-8 lg:col-span-6">
                          <Label>Title</Label>
                          <Input />
                        </div>
                      </div> */}
                      <div
                        key={i}
                        className="mb-8 flex gap-2 pr-12"
                      >
                        <div className="  grid flex-1 grid-cols-12 gap-2">
                          <div className=" col-span-6 space-y-2"></div>
                          <div className=" col-span-2 space-y-2">
                            <FormField
                              name={`properties.${i}.fields.0.en`}
                              control={form.control}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className=" text-xs">
                                    Header 1
                                  </FormLabel>
                                  <Input
                                    {...field}
                                    placeholder="en"
                                  />
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              name={`properties.${i}.fields.0.ar`}
                              control={form.control}
                              render={({ field }) => (
                                <FormItem>
                                  <Input
                                    {...field}
                                    dir="rtl"
                                    placeholder="ar"
                                  />
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className=" col-span-2 space-y-2">
                            <FormField
                              name={`properties.${i}.fields.1.en`}
                              control={form.control}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className=" text-xs">
                                    Header 2
                                  </FormLabel>
                                  <Input
                                    {...field}
                                    placeholder="en"
                                  />
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              name={`properties.${i}.fields.1.ar`}
                              control={form.control}
                              render={({ field }) => (
                                <FormItem>
                                  <Input
                                    {...field}
                                    dir="rtl"
                                    placeholder="ar"
                                  />
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className=" col-span-2 space-y-2">
                            <FormField
                              name={`properties.${i}.fields.2.en`}
                              control={form.control}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className=" text-xs">
                                    Header 3
                                  </FormLabel>
                                  <Input
                                    {...field}
                                    placeholder="en"
                                  />
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              name={`properties.${i}.fields.2.ar`}
                              control={form.control}
                              render={({ field }) => (
                                <FormItem>
                                  <Input
                                    {...field}
                                    dir="rtl"
                                    placeholder="ar"
                                  />
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      </div>
                      <div
                        key={i}
                        className="flex gap-2 pr-12"
                      >
                        <div className="  grid flex-1 grid-cols-12 gap-2">
                          <div className=" col-span-6 space-y-2">
                            <Label className=" text-xs">Attribute</Label>
                          </div>
                          <div className=" col-span-2 space-y-2">
                            <Label className=" text-xs">Value 1</Label>
                          </div>
                          <div className=" col-span-2 space-y-2">
                            <Label className=" text-xs">Value 2</Label>
                          </div>
                          <div className=" col-span-2 space-y-2">
                            <Label className=" text-xs">Value 3</Label>
                          </div>
                        </div>
                      </div>

                      {form
                        .getValues(`properties.${i}.items`)
                        ?.map((_item: any, itemIndex: number) => (
                          <div
                            key={itemIndex}
                            className="mb-4 flex gap-2"
                          >
                            <div className="  grid flex-1 grid-cols-12 gap-2">
                              <div className=" col-span-6 space-y-2">
                                <Select
                                  value={form.getValues(
                                    `properties.${i}.items.${itemIndex}.attributeId`,
                                  )}
                                  onValueChange={(value: string) => {
                                    form.setValue(
                                      `properties.${i}.items.${itemIndex}.attributeId`,
                                      value,
                                    );
                                    setUpdate((prev) => !prev);
                                    // setSelectedPropertyType(value);
                                  }}
                                >
                                  <SelectTrigger className="">
                                    <SelectValue placeholder="" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {attributes?.content.map(
                                      (attribute, attributeIndex) => (
                                        <SelectItem
                                          value={String(attribute.id)}
                                          key={attributeIndex}
                                        >
                                          {getLang(params, attribute.name)}
                                        </SelectItem>
                                      ),
                                    )}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className=" col-span-2 space-y-2">
                                <FormField
                                  name={`properties.${i}.items.${itemIndex}.value1.en`}
                                  control={form.control}
                                  render={({ field }) => (
                                    <FormItem>
                                      <Input
                                        {...field}
                                        placeholder="en"
                                      />
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  name={`properties.${i}.items.${itemIndex}.value1.ar`}
                                  control={form.control}
                                  render={({ field }) => (
                                    <FormItem>
                                      <Input
                                        {...field}
                                        dir="rtl"
                                        placeholder="ar"
                                      />
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                              <div className=" col-span-2 space-y-2">
                                <FormField
                                  name={`properties.${i}.items.${itemIndex}.value2.en`}
                                  control={form.control}
                                  render={({ field }) => (
                                    <FormItem>
                                      <Input
                                        {...field}
                                        placeholder="en"
                                      />
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  name={`properties.${i}.items.${itemIndex}.value2.ar`}
                                  control={form.control}
                                  render={({ field }) => (
                                    <FormItem>
                                      <Input
                                        {...field}
                                        dir="rtl"
                                        placeholder="ar"
                                      />
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                              <div className=" col-span-2 space-y-2">
                                <FormField
                                  name={`properties.${i}.items.${itemIndex}.value3.en`}
                                  control={form.control}
                                  render={({ field }) => (
                                    <FormItem>
                                      <Input
                                        {...field}
                                        placeholder="en"
                                      />
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  name={`properties.${i}.items.${itemIndex}.value3.ar`}
                                  control={form.control}
                                  render={({ field }) => (
                                    <FormItem>
                                      <Input
                                        {...field}
                                        dir="rtl"
                                        placeholder="ar"
                                      />
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </div>
                            <Button
                              size="icon"
                              variant="transparent-destructive"
                              className=" self-end"
                              type="button"
                              onClick={() => {
                                const prev = form.getValues(
                                  `properties.${i}.items`,
                                );
                                prev.splice(itemIndex, 1);
                                form.setValue(`properties.${i}.items`, prev);
                                setUpdate((prev) => !prev);
                              }}
                            >
                              <Trash size={16} />
                            </Button>
                          </div>
                        ))}
                      <Button
                        variant="ghost-primary"
                        size="sm"
                        className=" self-end"
                        type="button"
                        onClick={() => {
                          const prev = form.getValues(`properties.${i}.items`);
                          form.setValue(`properties.${i}.items`, [
                            ...prev,
                            {
                              attributeId: 0,
                              value1: null,
                              value2: null,
                              value3: null,
                              icon: '',
                            },
                          ]);
                          setUpdate((prev) => !prev);
                        }}
                      >
                        Add row
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {/* <div className="flex flex-col gap-6"> */}
            {/* <div className="flex items-center justify-between">
                <p className=" text-lg font-medium text-neutral-800">
                  Product Property
                </p>
                <Button
                  variant="transparent"
                  className=" h-8 text-xs text-primary hover:text-primary"
                >
                  Add Property
                </Button>
              </div> */}

            {/* begin: feature */}
            {/* <div className="flex flex-col gap-5 rounded-lg border p-5">
                <div className="flex items-center justify-between">
                  <p className=" font-medium text-neutral-800">Feature</p>
                  <div className="flex items-center gap-4">
                    <button>
                      <Pencxil className=" fill-primary" />
                    </button>
                    <button>
                      <Trash
                        size={16}
                        className=" text-primary"
                      />
                    </button>
                  </div>
                </div>
                <Select>
                  <SelectTrigger className=" w-96">
                    <SelectValue placeholder="Icon and Description" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRODUCT_PROPERTY_TYPE.map((property) => (
                      <SelectItem
                        value={property.value}
                        key={property.value}
                      >
                        {property.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="grid grid-cols-2 items-stretch gap-6 gap-y-4">
                  {[...Array(3)].map((_, i) => (
                    <Fragment key={i}>
                      <div className="flex w-full flex-col gap-2 rounded-lg border p-4">
                        <h1 className=" font-medium text-neutral-800">
                          Images
                        </h1>
                        <div className=" relative aspect-square w-12 overflow-hidden rounded-md">
                          <Image
                            src="/images/feature-1.jpg"
                            fill
                            alt=""
                            className=" object-cover object-center"
                          />
                        </div>
                        <h1 className=" font-medium text-neutral-800">
                          Features
                        </h1>
                        <p className=" text-sm text-neutral-500">
                          Steam Tempered (Steam Oxide) Surface Treatment
                        </p>
                      </div>
                      <div className="flex w-full flex-col gap-2 rounded-lg border p-4">
                        <h1 className=" font-medium text-neutral-800">
                          Images
                        </h1>
                        <div className=" relative aspect-square w-12 overflow-hidden rounded-md">
                          <Image
                            src="/images/feature-2.jpg"
                            fill
                            alt=""
                            className=" object-cover object-center"
                          />
                        </div>
                        <h1 className=" font-medium text-neutral-800">
                          Features
                        </h1>
                        <p className=" text-sm text-neutral-500">
                          DIN 8374 - Subland Drill Standards
                        </p>
                      </div>
                    </Fragment>
                  ))}
                </div>
              </div> */}
            {/* end: feature */}

            {/* begin: cutting condition */}
            {/* <div className="flex flex-col gap-5 rounded-lg border p-5">
                <div className="flex items-center justify-between">
                  <p className=" font-medium text-neutral-800">
                    Cutting Condition
                  </p>
                  <div className="flex items-center gap-4">
                    <button>
                      <Pencxil className=" fill-primary" />
                    </button>
                    <button>
                      <Trash
                        size={16}
                        className=" text-primary"
                      />
                    </button>
                  </div>
                </div>
                <Select defaultValue="table">
                  <SelectTrigger className=" w-96">
                    <SelectValue placeholder="Icon and Description" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRODUCT_PROPERTY_TYPE.map((property) => (
                      <SelectItem
                        value={property.value}
                        key={property.value}
                      >
                        {property.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex flex-col gap-2">
                  <Label>Title</Label>
                  <Input placeholder="Input Title" />
                </div>
                <div className=" mt-4 overflow-hidden rounded-lg border">
                  <Table className="whitespace-nowrap [&_tr:nth-child(even)]:bg-neutral-100">
                    <TableHeader>
                      <TableRow className=" bg-neutral-200 [&_th]:normal-case">
                        <TableHead>Name</TableHead>
                        <TableHead>Sustainability</TableHead>
                        <TableHead>vc</TableHead>
                        <TableHead>f</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[...Array(4)].map((_, i) => (
                        <TableRow
                          key={i}
                          className="[&_td:hover]:bg-red-100"
                        >
                          <TableCell>
                            P1.1 - Free machining sulfurized carbon steel with a
                            hardness of &lt; 240HB
                          </TableCell>
                          <TableCell>Primary Use</TableCell>
                          <TableCell>95 ft/min</TableCell>
                          <TableCell>0.0065 inch/rev</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="info"
                                size="icon-sm"
                              >
                                <Pencxil />
                              </Button>
                              <Button
                                variant="destructive"
                                size="icon-sm"
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
              </div> */}
            {/* end: cutting condition */}
            {/* </div> */}
            {/* end: product property */}
          </div>
          <div className=" mt-6 flex justify-end gap-4">
            <Button
              variant="ghost"
              className=" text-primary"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoadingEdit || !form.formState.isValid}
            >
              {isLoadingEdit ? '...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
