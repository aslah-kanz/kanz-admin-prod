'use client';

import BasePagination from '@/components/common/base-pagination';
import Header from '@/components/common/header/header';
import { ProductCollectionItem } from '@/components/product-collection/product-collection-item';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { PRODUCT_COLLECTION_FAKER } from '@/constants/faker.constant';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaArrowUp, FaChevronDown, FaPlus } from 'react-icons/fa6';
import { FiSearch, FiX } from 'react-icons/fi';

export default function ProductCollectiontPage() {
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [showAddCollection, setShowAddCollection] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

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

  function formatFileSize(sizeInBytes: number): string {
    if (sizeInBytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(sizeInBytes) / Math.log(k));

    return `${parseFloat((sizeInBytes / k ** i).toFixed(2))} ${sizes[i]}`;
  }

  return (
    <div className=" flex h-full w-full flex-col">
      <Header title="Product Collection" />

      <div className=" h-full w-full p-4 lg:p-6">
        <div className=" flex h-full w-full flex-col rounded-lg border">
          <div className=" flex flex-1 flex-col p-5">
            {/* begin: title and action */}
            <div className=" flex w-full items-center justify-between">
              <h1 className=" text-lg font-medium text-neutral-800">
                Product Collection List
              </h1>
              <div className="flex gap-4">
                <Button
                  className=" gap-2"
                  onClick={() => {
                    setShowBulkImport((prev) => !prev);
                  }}
                  variant="outline"
                >
                  <FaArrowUp /> Bulk Import
                </Button>
                <Button
                  className=" gap-2"
                  onClick={() => setShowAddCollection((prev) => !prev)}
                >
                  <FaPlus /> Add Collection
                </Button>
              </div>
            </div>
            {/* end: title and action */}

            {/* begin: search and filter */}
            <div className="mt-4 flex w-full flex-col-reverse items-stretch gap-4 xl:flex-row xl:items-center xl:justify-between">
              {/* begin: search */}
              <div className=" relative">
                <FiSearch
                  size={16}
                  className=" absolute left-3 top-3 text-gray-500"
                />
                <Input
                  className=" w-full border bg-white pl-10 ring-offset-transparent placeholder:text-gray-500 focus-visible:ring-0 focus-visible:ring-transparent xl:w-[200px]"
                  placeholder="Search"
                />
              </div>
              {/* end: search */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex gap-2">
                  {/* begin: dropdown filter collection */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        className=" gap-2.5 text-xs text-neutral-800 hover:bg-transparent hover:text-neutral-800"
                        variant="ghost"
                      >
                        <span className=" text-neutral-500">
                          Collection{' '}
                          <span className=" font-medium text-stone-800">
                            Show All
                          </span>
                        </span>
                        <FaChevronDown size={12} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className=" w-fit space-y-1 rounded-lg p-2"
                      align="end"
                    >
                      {['Show All', 'Drill Tools', 'Motor'].map((value, i) => (
                        <DropdownMenuItem
                          key={i}
                          className=" h-8 justify-start rounded-md text-neutral-500 transition-all focus:bg-primary/10 focus:text-primary"
                        >
                          {value}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  {/* end: dropdown filter collection */}

                  {/* begin: dropdown filter category */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        className=" gap-2.5 text-xs text-neutral-800 hover:bg-transparent hover:text-neutral-800"
                        variant="ghost"
                      >
                        <span className=" text-neutral-500">
                          Category{' '}
                          <span className=" font-medium text-stone-800">
                            Show All
                          </span>
                        </span>
                        <FaChevronDown size={12} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className=" w-fit space-y-1 rounded-lg p-2"
                      align="end"
                    >
                      {['Show All', 'Drill Tools', 'Motor'].map((value, i) => (
                        <DropdownMenuItem
                          key={i}
                          className=" h-8 justify-start rounded-md text-neutral-500 transition-all focus:bg-primary/10 focus:text-primary"
                        >
                          {value}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  {/* end: dropdown filter category */}

                  {/* begin: dropdown filter sale status */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        className=" gap-2.5 text-xs text-neutral-800 hover:bg-transparent hover:text-neutral-800"
                        variant="ghost"
                      >
                        <span className=" text-neutral-500">
                          Sale Status{' '}
                          <span className=" font-medium text-stone-800">
                            Show All
                          </span>
                        </span>
                        <FaChevronDown size={12} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className=" w-fit space-y-1 rounded-lg p-2"
                      align="end"
                    >
                      {['Show All', 'Drill Tools', 'Motor'].map((value, i) => (
                        <DropdownMenuItem
                          key={i}
                          className=" h-8 justify-start rounded-md text-neutral-500 transition-all focus:bg-primary/10 focus:text-primary"
                        >
                          {value}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  {/* end: dropdown filter sale status */}

                  {/* begin: dropdown filter store id */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        className=" gap-2.5 text-xs text-neutral-800 hover:bg-transparent hover:text-neutral-800"
                        variant="ghost"
                      >
                        <span className=" text-neutral-500">
                          Store id{' '}
                          <span className=" font-medium text-stone-800">
                            Show All
                          </span>
                        </span>
                        <FaChevronDown size={12} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className=" w-fit space-y-1 rounded-lg p-2"
                      align="end"
                    >
                      {['Show All', 'Drill Tools', 'Motor'].map((value, i) => (
                        <DropdownMenuItem
                          key={i}
                          className=" h-8 justify-start rounded-md text-neutral-500 transition-all focus:bg-primary/10 focus:text-primary"
                        >
                          {value}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  {/* end: dropdown filter store id */}
                </div>
              </div>
            </div>
            {/* end: search and filter */}

            {/* begin: table */}
            <Table className=" mt-8 whitespace-nowrap">
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Collection Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Product List</TableHead>
                  <TableHead>Store ID</TableHead>
                  <TableHead>Collection Price</TableHead>
                  <TableHead>Collection Disc. Price</TableHead>
                  <TableHead>Sell Product</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {PRODUCT_COLLECTION_FAKER.map((productCollection, i) => (
                  <ProductCollectionItem
                    key={i}
                    productCollection={productCollection}
                  />
                ))}
              </TableBody>
            </Table>
            {/* end: table */}

            <BasePagination totalCount={25} />
          </div>
        </div>
      </div>

      {/* begin: drawer add sale item */}
      <Sheet
        open={showAddCollection}
        onOpenChange={setShowAddCollection}
      >
        <SheetContent className=" flex flex-col overflow-y-auto p-5 py-0">
          <SheetHeader className=" sticky top-0 bg-white pb-2 pt-4">
            <div className="flex items-center justify-between">
              <SheetTitle>Add Collection</SheetTitle>
              <SheetClose>
                <FiX />
              </SheetClose>
            </div>
            <hr />
          </SheetHeader>

          <div className=" flex flex-col gap-4 ">
            <div className="flex flex-col gap-2">
              <Label className=" text-sm">Collection Name</Label>
              <Input placeholder="Enter collection name" />
            </div>
            <div className="flex flex-col gap-2">
              <Label className=" text-sm">Description (optional)</Label>
              <Textarea placeholder="Enter description" />
            </div>
            <div className="flex flex-col gap-2">
              <Label className=" text-sm">Banner</Label>
              <div
                {...getRootProps({
                  className:
                    'flex flex-col items-center justify-center rounded-lg border border-dashed p-6',
                })}
              >
                <input {...getInputProps()} />
                <div className="flex w-full flex-col gap-2 text-center">
                  <p className=" font-medium text-neutral-800">
                    Drag and Drop your images here
                  </p>
                  {files.length > 0 ? (
                    <div className=" flex w-full items-start justify-between gap-8">
                      <div className="flex flex-1 items-start gap-2">
                        <p className=" text-left text-[13px] font-medium text-neutral-800">
                          {files[0].name}{' '}
                          <span className=" text-neutral-500">
                            {formatFileSize(files[0].size)}
                          </span>
                        </p>
                        <span className=" text-[13px]">•</span>
                        <p className=" text-[13px] font-medium text-green-600">
                          Complete
                        </p>
                      </div>

                      <button
                        className=" h-5"
                        onClick={() => setFiles([])}
                      >
                        <FiX />
                      </button>
                    </div>
                  ) : (
                    <p className=" text-[13px] text-neutral-500">
                      Choose a file in .jpg or .png format with a size not
                      exceeding 10 MB.
                    </p>
                  )}
                </div>
                <div className=" mt-6">
                  <Button
                    onClick={open}
                    type="button"
                  >
                    Browse Files
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label className=" text-sm">Category</Label>
              <Input placeholder="Enter category" />
            </div>
            <div className="flex flex-col gap-2">
              <Label className=" text-sm">Store ID</Label>
              <Input placeholder="Enter your store ID" />
            </div>
          </div>

          <div className=" sticky bottom-0 w-full bg-white py-4 pt-2">
            <Button className=" w-full">Next</Button>
          </div>
        </SheetContent>
      </Sheet>
      {/* end: drawer add sale item */}

      <Sheet
        open={showBulkImport}
        onOpenChange={(open) => setShowBulkImport(open)}
      >
        <SheetContent className=" flex flex-col p-0">
          <SheetHeader className=" gap-2 px-5 py-6 pb-0">
            <div className="flex items-center justify-between">
              <SheetTitle>Bulk Import</SheetTitle>
              <SheetClose>
                <FiX />
              </SheetClose>
            </div>
            <hr />
          </SheetHeader>

          <div className=" flex flex-1 flex-col overflow-y-auto p-5 pt-0">
            <div
              {...getRootProps({
                className:
                  'flex flex-col items-center justify-center rounded-lg border border-dashed p-6',
              })}
            >
              <input {...getInputProps()} />
              <div className="flex w-full flex-col gap-2 text-center">
                <p className=" font-medium text-neutral-800">
                  Drag and Drop your files here
                </p>
                {files.length > 0 ? (
                  <div className=" flex w-full items-start justify-between gap-8">
                    <div className="flex flex-1 items-start gap-2">
                      <p className=" text-left text-[13px] font-medium text-neutral-800">
                        {files[0].name}{' '}
                        <span className=" text-neutral-500">
                          {formatFileSize(files[0].size)}
                        </span>
                      </p>
                      <span className=" text-[13px]">•</span>
                      <p className=" text-[13px] font-medium text-green-600">
                        Complete
                      </p>
                    </div>

                    <button
                      className=" h-5"
                      onClick={() => setFiles([])}
                    >
                      <FiX />
                    </button>
                  </div>
                ) : (
                  <p className=" text-[13px] text-neutral-500">
                    Choose a file in .csv format with a size not exceeding 10
                    MB.
                  </p>
                )}
              </div>
              <div className=" mt-6">
                <Button
                  onClick={open}
                  type="button"
                >
                  Browse Files
                </Button>
              </div>
            </div>

            <div className=" mt-4 flex w-full flex-col gap-4">
              <Button
                className=" w-full"
                onClick={() => {
                  setShowBulkImport((prev) => !prev);
                }}
                variant="outline"
              >
                Download Template
              </Button>
              <Button
                className=" w-full"
                onClick={() => {
                  setShowBulkImport((prev) => !prev);
                }}
              >
                Upload File
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
