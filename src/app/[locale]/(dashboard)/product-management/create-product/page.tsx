'use client';

import { useAddProduct } from '@/api/product.api';
import DocumentsSection from '@/components/product-management/documents-section';
import ImageSection from '@/components/product-management/image-section';
import { PMSchema } from '@/components/product-management/schema';
import { Button } from '@/components/ui/button';
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { HTTP_STATUS } from '@/constants/common.constant';
import { yupResolver } from '@hookform/resolvers/yup';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useCallback, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { FaArrowLeft, FaChevronRight } from 'react-icons/fa6';
import { toast } from 'sonner';
import * as yup from 'yup';
import BrandSelect from '@/components/product-management/brand-select';
import StoreSelect from '@/components/product-management/store-select';
import CategoriesSelect from '@/components/product-management/categories-select';
import { useUploadDocument } from '@/api/document.api';
import { useUploadImage } from '@/api/image.api';
import SellableSelect from '@/components/product-management/sellable-select';
import StatusSelect from '@/components/product-management/status-select';
import { queryClient } from '@/components/common/providers';

export default function CreateProductPage() {
  const router = useRouter();
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [uploadedDocuments, setUploadedDocuments] = useState<File[]>([]);

  const form = useForm<yup.InferType<typeof PMSchema>>({
    resolver: yupResolver(PMSchema),
    defaultValues: {
      categoryId: 1,
      sellable: true,
      status: 'published',
      comment: '',
    },
  });

  const { mutateAsync: uploadDocument } = useUploadDocument();
  const { mutateAsync: uploadImage } = useUploadImage();
  const { mutate: mutateAdd, isLoading: isLoadingAdd } = useAddProduct();

  const uploadAllDocuments = useCallback(async () => {
    try {
      toast.info('Uploading documents...');
      const documentIds: number[] = [];

      const documentUploading = uploadedDocuments.map(async (doc) => {
        const fd = new FormData();
        fd.append('file', doc as File);

        return uploadDocument(fd).then((res) => {
          if (res.code === HTTP_STATUS.SUCCESS) {
            documentIds.push(res.data.id);
          }

          if (res.code === HTTP_STATUS.FILE_EXIST) {
            throw new Error('file already exist');
          }
        });
      });

      await Promise.all(documentUploading);

      return documentIds;
    } catch (error) {
      console.log(error);
      toast.error('document file already exist. try renaming your file');
      throw Error('file already exist');
    }
  }, [uploadDocument, uploadedDocuments]);

  const uploadAllImages = useCallback(async () => {
    try {
      const imageIds: number[] = [];
      toast.info('Uploading images...');

      const imageUploading = uploadedImages.map(async (img) => {
        const fd = new FormData();
        fd.append(`file`, img as File);

        return uploadImage(fd).then((res) => {
          if (res.code === HTTP_STATUS.SUCCESS) {
            imageIds.push(res.data.id);
          }

          if (res.code === HTTP_STATUS.FILE_EXIST) {
            throw new Error('file already exist');
          }
        });
      });

      await Promise.all(imageUploading);

      return imageIds;
    } catch (error) {
      toast.error('image file already exist. try renaming your file');
      throw Error('file already exist');
    }
  }, [uploadImage, uploadedImages]);

  const handleAdd = useCallback(
    async (payload: yup.InferType<typeof PMSchema>) => {
      try {
        const imageIds = await uploadAllImages();
        const documentIds = await uploadAllDocuments();

        const finalPayload = {
          ...payload,
          imageIds,
          documentIds,
          categoryIds: [payload.categoryId],
        };

        delete finalPayload.documents;
        delete finalPayload.galleries;

        console.log({ finalPayload });

        mutateAdd(finalPayload, {
          onSuccess(resp) {
            if (resp.code === HTTP_STATUS.SUCCESS) {
              toast.success('Product Added');
              queryClient.invalidateQueries(['products']);
              router.push('/product-management');
            }
            if (resp.code === HTTP_STATUS.DUPLICATE_SLUG) {
              toast.error('failed to generate slug, try another product name');
            }
          },
        });
      } catch (error) {
        toast.error(JSON.stringify(error));
        console.log(error);
      }
    },
    [mutateAdd, router, uploadAllDocuments, uploadAllImages],
  );

  return (
    <FormProvider {...form}>
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

        <form onSubmit={form.handleSubmit(handleAdd)}>
          <div className="mt-8 w-full rounded-lg border p-5">
            {/* begin: breadcrumb */}
            <div className="flex items-center gap-2 text-[13px] text-neutral-500">
              <p>Product</p>
              <FaChevronRight size={12} />
              <p className="text-primary">Create Product</p>
            </div>
            {/* end: breadcrumb */}

            <p className=" my-6 text-lg font-medium text-neutral-800">
              Product Information
            </p>

            <div className=" flex flex-col gap-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <FormField
                    name="name.en"
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
                    name="name.ar"
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
                  <BrandSelect />
                </div>
                <div className="flex flex-col gap-2">
                  <StoreSelect />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <FormField
                    name="mpn"
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
                    name="gtin.ean"
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
                    name="gtin.upc"
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
                  <CategoriesSelect />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <SellableSelect />
                </div>
                <div className="flex flex-col gap-2">
                  <StatusSelect />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <FormField
                  name="comment"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Comment</FormLabel>
                      <Textarea
                        placeholder="Input comment here"
                        {...field}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
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

            <hr className=" my-6" />

            <ImageSection
              uploadedImages={uploadedImages}
              setUploadedImages={setUploadedImages}
            />

            <hr className=" my-6" />

            <DocumentsSection
              uploadedDocuments={uploadedDocuments}
              setUploadedDocuments={setUploadedDocuments}
            />
          </div>
          <div className=" mt-6 flex justify-end gap-4">
            <Button variant="secondary">View Live Product</Button>
            <Button
              type="submit"
              disabled={isLoadingAdd}
            >
              {isLoadingAdd ? '...' : 'Create Product'}
            </Button>
          </div>
        </form>
      </div>
    </FormProvider>
  );
}
