'use client';

import {
  useDeleteProduct,
  useGetProducts,
  useProductById,
} from '@/api/product.api';
import BasePagination from '@/components/common/base-pagination';
import BaseSearch from '@/components/common/base-search';
import BaseTableSkeleton from '@/components/common/base-table-skeleton';
import EmptyState from '@/components/common/empty-state';
import { queryClient } from '@/components/common/providers';
import DialogDelete from '@/components/dialog/dialog-delete';
import Pencxil from '@/components/svg/Pencxil';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent } from '@/components/ui/dialog';
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
import { TDefaultPageParams } from '@/types/common.type';
import { getBadgeVariant, slugToOriginal } from '@/utils/common.util';
import { getLang } from '@/utils/locale.util';
import {
  BoxAdd,
  Eye,
  Filter,
  InfoCircle,
  TaskSquare,
  Trash,
} from 'iconsax-react';
import Link from 'next/link';
import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';
import { toast } from 'sonner';

export default function ProductManagementPage({
  params,
  searchParams,
}: TDefaultPageParams) {
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [showApprove, setShowApprove] = useState<boolean>(false);
  const [showDeleteProduct, setShowDeleteProduct] = useState<{
    id: number | null;
    show: boolean;
  }>({
    id: null,
    show: false,
  });
  const [showProductDetail, setShowProductDetail] = useState<boolean>(false);

  const { data: products, isLoading: loadingGetProducts } = useGetProducts({
    page: (Number(searchParams.page || 1) - 1).toString(),
    search: searchParams.search,
  });

  const [idDetail, setIdDetail] = React.useState<number>();
  const { data: detail } = useProductById(idDetail, {
    enabled: !!idDetail,
  });

  const { mutateAsync: deleteProduct, isLoading } = useDeleteProduct();

  const handleDelete = async () => {
    if (showDeleteProduct.id) {
      await deleteProduct(showDeleteProduct.id)
        .then(() => {
          queryClient.invalidateQueries(['products']);
          setShowDeleteProduct({
            id: null,
            show: false,
          });
        })
        .catch(() => {
          toast.error('delete failed');
        });
    }
  };

  return (
    <>
      <div className=" h-full w-full p-4 lg:p-6">
        <div className=" flex h-full w-full flex-col rounded-lg border p-5">
          {/* begin: filter, search and action */}
          <div className="flex w-full flex-col-reverse items-start justify-between rounded-lg border bg-neutral-100 p-1.5 lg:flex-row lg:items-center">
            <div className="flex items-center">
              <Button
                className=" text-xs"
                variant="transparent"
                asChild
              >
                <Link href="/product-management/create-product">
                  <BoxAdd size={16} />
                  Create Product
                </Link>
              </Button>
              <div className=" h-8 w-px border-r"></div>
              <Button
                className=" text-xs"
                variant="transparent"
                onClick={() => setShowFilter((prev) => !prev)}
              >
                <Filter size={16} />
                Filter
              </Button>
              <div className=" h-8 w-px border-r"></div>
              <Button
                className=" text-xs"
                variant="transparent"
                onClick={() => setShowFilter((prev) => !prev)}
              >
                <TaskSquare size={16} />
                Data Tables
              </Button>
            </div>
            <BaseSearch className=" hidden lg:block" />
          </div>
          <BaseSearch className=" mt-2 block lg:hidden" />
          {/* end: filter, search and action */}

          {loadingGetProducts ? (
            <BaseTableSkeleton row={10} />
          ) : products && products.totalCount > 0 ? (
            <>
              <div className=" mt-4 overflow-hidden rounded-lg border">
                <Table className="whitespace-nowrap [&_tr:nth-child(even)]:bg-neutral-100">
                  <TableHeader>
                    <TableRow className=" bg-neutral-200 capitalize">
                      <TableHead>Product Name</TableHead>
                      <TableHead>Family Code</TableHead>
                      <TableHead>MPN</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.content.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>{getLang(params, product.name)}</TableCell>
                        <TableCell>{product.familyCode}</TableCell>
                        <TableCell>{product.mpn}</TableCell>
                        <TableCell>{String(product.description)}</TableCell>
                        <TableCell>
                          <Badge variant={getBadgeVariant(product.status)}>
                            {slugToOriginal(product.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="info"
                              size="icon-sm"
                              onClick={() => {
                                setIdDetail(product.id);
                                setShowProductDetail((prev) => !prev);
                              }}
                            >
                              <Eye size={16} />
                            </Button>
                            <Button
                              variant="info"
                              size="icon-sm"
                              asChild
                            >
                              <Link href="/product-management/xyz/edit-product">
                                <Pencxil />
                              </Link>
                            </Button>
                            <Button
                              variant="destructive"
                              size="icon-sm"
                              onClick={() =>
                                setShowDeleteProduct({
                                  id: product.id,
                                  show: true,
                                })
                              }
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
              <BasePagination totalCount={products.totalCount} />
            </>
          ) : (
            <EmptyState description="no products found" />
          )}
        </div>
      </div>

      {/* begin: dialog approve */}
      <Dialog
        // open
        open={showApprove}
        onOpenChange={setShowApprove}
      >
        <DialogContent className=" max-w-xl p-0">
          <div className=" flex flex-col items-center gap-2 p-16 text-center">
            <InfoCircle
              size={64}
              className=" text-blue-500"
              variant="Bold"
            />
            <h1 className=" text-lg font-medium text-neutral-800">
              Approval Confirmation
            </h1>
            <p className=" text-sm text-neutral-500">
              Are you sure you want to approve 1 Product? Approving now will
              finalize the vendor approval process immediately
            </p>
          </div>
          <div className=" flex justify-end gap-4 border-t p-4">
            <DialogClose asChild>
              <Button
                className=" text-primary"
                variant="ghost"
              >
                Close
              </Button>
            </DialogClose>
            <Button variant="destructive">View Detail</Button>
            <Button>Approve Now</Button>
          </div>
        </DialogContent>
      </Dialog>
      {/* end: dialog approve */}

      {/* begin: dialog delete confirm */}
      <DialogDelete
        open={showDeleteProduct.show}
        onOpenChange={(val) =>
          setShowDeleteProduct((prev) => ({ ...prev, show: val }))
        }
        onDelete={handleDelete}
        onCancel={() =>
          setShowDeleteProduct((prev) => ({ ...prev, show: false }))
        }
        isLoading={isLoading}
      />
      {/* end: dialog delete confirm */}

      {/* begin: drawer detail product */}
      <Sheet
        open={showProductDetail}
        onOpenChange={setShowProductDetail}
      >
        <SheetContent className=" flex flex-col overflow-y-auto p-5 py-0">
          <SheetHeader className=" sticky top-0 bg-white pb-2 pt-4">
            <div className="flex items-center justify-between">
              <SheetTitle>View Detail</SheetTitle>
              <SheetClose>
                <FiX />
              </SheetClose>
            </div>
            <hr />
          </SheetHeader>

          <div className=" flex flex-col gap-4 ">
            <div className="flex flex-col gap-2">
              <Label className=" text-sm">Product Name</Label>
              <p className=" text-sm font-medium text-neutral-500">
                {detail?.name ? getLang(params, detail.name) : '-'}
              </p>
            </div>
            {/* <div className="flex flex-col gap-2">
              <Label className=" text-sm">Product Title</Label>
              <p className=" text-sm font-medium text-neutral-500">
                Subland Drill 90º
              </p>
            </div> */}
            <div className="flex flex-col gap-2">
              <Label className=" text-sm">Product Family</Label>
              <p className=" text-sm font-medium text-neutral-500">
                {detail?.familyCode}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Label className=" text-sm">Brand</Label>
              <p className=" text-sm font-medium text-neutral-500">
                {detail?.brand?.name ? getLang(params, detail.brand.name) : '-'}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Label className=" text-sm">SKU / MPN</Label>
              <p className=" text-sm font-medium text-neutral-500">
                {detail?.code || detail?.mpn}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Label className=" text-sm">Product Link / Slug</Label>
              <p className=" text-sm font-medium text-neutral-500">
                {detail?.slug}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Label className=" text-sm">Description</Label>
              <p className=" text-sm font-medium text-neutral-500">
                {detail?.description
                  ? getLang(params, detail.description)
                  : '-'}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Label className=" text-sm">Product Attribute</Label>
              <p className=" text-sm font-medium text-neutral-500">
                {detail?.properties?.map((item, i) => {
                  if (item.name) {
                    const separator =
                      detail.properties.length - 1 === i ? '' : ', ';
                    return `${getLang(params, item.name)}${separator}`;
                  }
                  return '';
                })}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Label className=" text-sm">Meta Description</Label>
              <p className=" text-sm font-medium text-neutral-500">
                {detail?.metaDescription}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Label className=" text-sm">Status</Label>
              {detail?.status && (
                <Badge variant={getBadgeVariant(detail.status)}>
                  {slugToOriginal(detail.status)}
                </Badge>
              )}
            </div>
          </div>

          <div className=" sticky bottom-0 flex w-full flex-col gap-2 bg-white py-4 pt-2">
            <Button className=" w-full">Approve Product</Button>
            <Button
              className=" w-full"
              variant="destructive"
            >
              Detail Product
            </Button>
            <Button
              className=" w-full"
              variant="ghost-primary"
            >
              Reject Product
            </Button>
          </div>
        </SheetContent>
      </Sheet>
      {/* end: drawer add sale item */}

      {/* begin: drawer filter */}
      <Sheet
        open={showFilter}
        onOpenChange={setShowFilter}
      >
        <SheetContent className=" flex flex-col p-0">
          <SheetHeader className=" gap-2 px-5 py-6 pb-0">
            <div className="flex items-center justify-between">
              <SheetTitle className="flex items-center gap-2">
                <Filter /> <span>Filter</span>
              </SheetTitle>
              <SheetClose>
                <FiX />
              </SheetClose>
            </div>
            <hr />
          </SheetHeader>

          <div className=" flex flex-1 flex-col overflow-y-auto p-5 pt-0">
            <div className=" flex flex-col gap-2">
              <Label className=" text-sm">Select Filter</Label>
              <Select>
                <SelectTrigger className=" w-full">
                  <SelectValue placeholder="Filter By Status" />
                </SelectTrigger>
                <SelectContent className=" min-w-fit">
                  <SelectItem value="awaiting-approval">
                    Awaiting Approval
                  </SelectItem>
                  <SelectItem value="on-process">On Process</SelectItem>
                  <SelectItem value="complete">Complete</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className=" mt-6 flex flex-col gap-2.5">
              <Label className=" text-sm">Filter Options</Label>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name=""
                  id=""
                />
                <Label className=" text-sm text-neutral-500">All</Label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name=""
                  id=""
                />
                <Label className=" text-sm text-neutral-500">
                  Waiting to Approve
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name=""
                  id=""
                />
                <Label className=" text-sm text-neutral-500">Rejected</Label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name=""
                  id=""
                />
                <Label className=" text-sm text-neutral-500">Active</Label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name=""
                  id=""
                />
                <Label className=" text-sm text-neutral-500">Inactive</Label>
              </div>
            </div>
            <div className=" mt-6 flex flex-col gap-2">
              <Button>Apply Filter</Button>
              <Button
                variant="ghost"
                className=" text-primary"
              >
                Reset Filter
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
      {/* end: drawer filter */}
    </>
  );
}
