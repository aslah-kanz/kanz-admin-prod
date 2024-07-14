'use client';

import { useDeleteBlog, useGetBlogs } from '@/api/blog.api';
import BasePagination from '@/components/common/base-pagination';
import BaseSearch from '@/components/common/base-search';
import BaseTableSkeleton from '@/components/common/base-table-skeleton';
import EmptyState from '@/components/common/empty-state';
import DialogDelete from '@/components/dialog/dialog-delete';
import Pencxil from '@/components/svg/Pencxil';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { HTTP_STATUS } from '@/constants/common.constant';
import { useI18n } from '@/locales/client';
import { TBlog } from '@/types/blog.type';
import { TDefaultPageParams } from '@/types/common.type';
import { commonImageProps, textTruncate } from '@/utils/common.util';
import { getLang } from '@/utils/locale.util';
import { Edit, Eye, MessageAdd1, Trash } from 'iconsax-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { FiX } from 'react-icons/fi';
import { useQueryClient } from 'react-query';
import { toast } from 'sonner';

export default function CertificationManagementPage({
  searchParams,
}: TDefaultPageParams) {
  // hooks
  const queryClient = useQueryClient();
  const params = useParams();
  const t = useI18n();

  // state
  const [showAddCertification, setShowAddCertification] =
    useState<boolean>(false);
  const [showDeleteArticle, setShowDeleteArticle] = useState<boolean>(false);
  useState<boolean>(false);
  const [selectedBlog, setSelectedBlog] = useState<TBlog | undefined>(
    undefined,
  );

  // fetch blogs
  const { data: blogs, isLoading: loadingGetBlogs } = useGetBlogs({
    search: searchParams.search,
    page: (Number(searchParams.page || 1) - 1).toString(),
    size: searchParams.size,
    order: 'desc',
    sort: 'createdAt',
  });

  // delete blog mutation
  const { mutate: deleteBlog, isLoading: loadingDeleteBlog } = useDeleteBlog({
    onSuccess: (resp) => {
      if (resp.code === HTTP_STATUS.SUCCESS) {
        toast.success('success to delete blog');
        queryClient.invalidateQueries({ queryKey: ['blogs'] });
        setShowDeleteArticle((prev) => !prev);
        setSelectedBlog(undefined);
      } else {
        toast.error('failed to delete blog', { description: resp.message });
      }
    },
  });

  // handle delete
  const handleDelete = () => {
    if (selectedBlog) {
      deleteBlog(selectedBlog.id);
    }
  };

  return (
    <>
      <div className=" h-full w-full p-4 lg:p-6">
        <div className=" flex w-full flex-col rounded-lg border p-5">
          {/* begin: filter, search and action */}
          <div className="flex items-center justify-between rounded-lg border bg-neutral-100 p-1.5">
            <div className="flex items-center">
              <Button
                className=" text-xs"
                variant="transparent"
                asChild
              >
                <Link href="/blog-management/create-article">
                  <Edit size={16} />
                  {t('common.create')}
                </Link>
              </Button>
            </div>
            <BaseSearch className=" hidden lg:block" />
          </div>
          <BaseSearch className=" mt-2 block lg:hidden" />
          {/* end: filter, search and action */}

          {loadingGetBlogs ? (
            <BaseTableSkeleton col={6} />
          ) : blogs && blogs.totalCount > 0 ? (
            <>
              <div className=" mt-4 overflow-hidden rounded-lg border">
                <Table className=" [&_tr:nth-child(even)]:bg-neutral-100">
                  <TableHeader>
                    <TableRow className=" bg-neutral-200">
                      <TableHead>{t('common.thumbnail')}</TableHead>
                      <TableHead>{t('common.title')}</TableHead>
                      {/* <TableHead>Meta Keyword</TableHead>
                      <TableHead>Meta Description</TableHead> */}
                      <TableHead>{t('common.action')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {blogs.content.map((blog) => (
                      <TableRow key={blog.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className=" relative aspect-video h-12 overflow-hidden rounded-md">
                              <Image
                                {...commonImageProps(blog.image)}
                                alt={blog.title.en}
                              />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {textTruncate(getLang(params, blog.title), 50)}
                        </TableCell>
                        {/* <TableCell>
                          {textTruncate(getLang(params, blog.title), 20)}
                        </TableCell>
                        <TableCell>
                          <div
                            dangerouslySetInnerHTML={{
                              __html: getLang(params, blog.description),
                            }}
                          />
                        </TableCell> */}
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="info"
                              size="icon-sm"
                              asChild
                            >
                              <Link
                                href={`https://www.kanzway.com/en/blog/${blog.id}`}
                                target="_blank"
                              >
                                <Eye size={16} />
                              </Link>
                            </Button>
                            <Button
                              variant="info"
                              size="icon-sm"
                              asChild
                            >
                              <Link
                                href={`/blog-management/${blog.id}/edit-article`}
                              >
                                <Pencxil
                                  width={16}
                                  height={16}
                                />
                              </Link>
                            </Button>
                            <Button
                              variant="destructive"
                              size="icon-sm"
                              onClick={() => {
                                setShowDeleteArticle((prev) => !prev);
                                setSelectedBlog(blog);
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

              <BasePagination totalCount={blogs.totalCount} />
            </>
          ) : (
            <EmptyState />
          )}

          {/* <div className="mt-6 grid grid-cols-2 gap-6">
                {[...Array(2)].map((_, i) => (
                  <div
                    key={i}
                    className=" rounded-lg border"
                  >
                    <div className=" flex items-start gap-4 p-4">
                      <div className=" relative aspect-square w-28 overflow-hidden rounded-md">
                        <Image
                          src="/images/article-1.png"
                          fill
                          alt=""
                          className=" object-cover object-center"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <p className=" text-xs text-neutral-500">
                          11 December 2023
                        </p>
                        <Link
                          href="/"
                          className=" font-medium leading-snug text-primary"
                        >
                          Strategies for Streamlining Operations: B2B Solutions
                          in Industrial Equipment
                        </Link>
                        <Badge
                          variant="blue"
                          size="lg"
                        >
                          Operations
                        </Badge>
                      </div>
                    </div>
                    <div className=" flex justify-end gap-2 border-t p-4">
                      <Button
                        size="sm"
                        variant="ghost-primary"
                        onClick={() => setShowDeleteArticle((prev) => !prev)}
                      >
                        Delete
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        // onClick={() =>
                        //   setShowEditCertification((prev) => !prev)
                        // }
                        asChild
                      >
                        <Link href="/blog-management/xyz/edit-article">
                          Edit
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div> */}

          {/* begin: empty state */}
          {/* <EmptyState description="We couldn't find any data matching your search. Please double-check your keywords or try different search terms" /> */}
          {/* end: empty state */}
        </div>
      </div>

      {/* begin: drawer add category */}
      <Sheet
        open={showAddCertification}
        onOpenChange={setShowAddCertification}
      >
        <SheetContent className=" flex flex-col gap-4 overflow-y-auto bg-white p-4 py-0">
          <SheetHeader className=" sticky top-0 gap-2 bg-white pt-4">
            <div className="flex items-center justify-between">
              <SheetTitle>
                <div className="flex items-center gap-2">
                  <MessageAdd1 size={24} />
                  Create Category
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
            <div className=" flex flex-col gap-2">
              <Label className=" text-sm">Category</Label>
              <Input placeholder="Input Category" />
            </div>

            {/* end: main form */}
          </div>
          <div className=" sticky bottom-0 flex flex-col space-y-2 bg-white py-4 pt-2">
            <Button
              onClick={() => {
                setShowAddCertification((prev) => !prev);
              }}
            >
              Create Category
            </Button>
          </div>
        </SheetContent>
      </Sheet>
      {/* end: drawer add certification */}

      {/* begin: dialog delete certification */}
      <DialogDelete
        open={showDeleteArticle}
        onOpenChange={setShowDeleteArticle}
        onDelete={handleDelete}
        isLoading={loadingDeleteBlog}
      />
      {/* end: dialog delete certification */}
    </>
  );
}
