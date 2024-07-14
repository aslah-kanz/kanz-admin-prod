'use client';

import { useContactUs, useEditContactUs } from '@/api/contact-us.api';
import BasePagination from '@/components/common/base-pagination';
import BaseSearch from '@/components/common/base-search';
import BaseTableSkeleton from '@/components/common/base-table-skeleton';
import EmptyState from '@/components/common/empty-state';
import Header from '@/components/common/header/header';
import DialogDelete from '@/components/dialog/dialog-delete';
import Pencxil from '@/components/svg/Pencxil';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { HTTP_STATUS } from '@/constants/common.constant';
import { TDefaultPageParams } from '@/types/common.type';
import { TContactUsParams, TContactUsPayload } from '@/types/contact-us.type';
import React, { useState } from 'react';
import { LuLoader2 } from 'react-icons/lu';
import { useQueryClient } from 'react-query';
import { toast } from 'sonner';

export default function ContactUsManagementPage({
  searchParams,
}: TDefaultPageParams) {
  // hooks
  const queryClient = useQueryClient();

  // state
  // const [showAddContactUs, setShowAddContactUs] = useState<boolean>(false);
  const [showEditContactUs, setShowEditContactUs] = useState<boolean>(false);
  const [showDelete, setShowDelete] = useState<boolean>(false);
  // const [showDetailContactUs, setShowDetailContactUs] =
  //   useState<boolean>(false);
  // const [selectedContactUs, setSelectedContactUs] = useState<
  //   TContactUs | undefined
  // >(undefined);

  // fetch
  const [queryParams, _setQueryParams] = React.useState<TContactUsParams>({
    order: 'desc',
    sort: 'id',
  });
  const { data: contactUs, isLoading: isLoadingList } = useContactUs({
    ...queryParams,
    search: searchParams.search,
    page: searchParams.page,
  });

  // edit
  const statusOptions = React.useMemo(
    () => [
      {
        label: 'Read',
        value: 'read',
      },
      {
        label: 'Replied',
        value: 'replied',
      },
    ],
    [],
  );
  const [statusValue, setStatusValue] = React.useState<'read' | 'replied'>(
    'read',
  );
  const [idEdit, setIdEdit] = React.useState<number>();
  const { mutate: mutateEdit, isLoading: isLoadingEdit } = useEditContactUs();
  const handleEdit = React.useCallback(() => {
    const payload: TContactUsPayload = {
      status: statusValue,
    };
    mutateEdit(
      { id: Number(idEdit), payload },
      {
        onSuccess(resp) {
          if (resp.code === HTTP_STATUS.SUCCESS) {
            toast.success('Contact Us Edited');
            queryClient.removeQueries('getContactUs');
            setShowEditContactUs(false);
          } else {
            toast.error(resp.message);
          }
        },
      },
    );
  }, [mutateEdit, queryClient, idEdit, statusValue]);

  return (
    <>
      <div className=" flex h-full w-full flex-col">
        <Header title="Contact Us" />

        <div className=" h-full w-full p-4 lg:p-6">
          <div className=" flex w-full flex-col rounded-lg border p-5">
            {/* begin: filter, search and action */}
            <div className="flex items-center justify-end rounded-lg border bg-neutral-100 p-1.5">
              <BaseSearch />
            </div>
            {/* end: filter, search and action */}
            {isLoadingList ? (
              <BaseTableSkeleton
                col={6}
                row={10}
              />
            ) : contactUs && contactUs.totalCount > 0 ? (
              <>
                <div className=" mt-4 overflow-hidden rounded-lg border">
                  <Table className="whitespace-nowrap [&_tr:nth-child(even)]:bg-neutral-100">
                    <TableHeader>
                      <TableRow className=" bg-neutral-200 ">
                        <TableHead>Name</TableHead>
                        {/* <TableHead>Date</TableHead> */}
                        <TableHead>Email</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Message</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {contactUs?.content.map((contact) => (
                        <TableRow key={contact.id}>
                          <TableCell>{contact.name}</TableCell>
                          {/* <TableCell>30 Mar 2024</TableCell> */}
                          <TableCell>{contact.email}</TableCell>
                          <TableCell>{contact.subject}</TableCell>
                          <TableCell>{contact.message}</TableCell>
                          <TableCell>{contact.status}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {/* <Button
                          variant="info"
                          size="icon-sm"
                          onClick={() => {
                            // setSelectedContactUs(paymentMethod);
                            // setShowDetailContactUs((prev) => !prev);
                          }}
                        >
                          <Eye size={16} />
                        </Button> */}
                              <Button
                                variant="info"
                                size="icon-sm"
                                onClick={() => {
                                  setIdEdit(contact.id);
                                  setShowEditContactUs(true);
                                }}
                              >
                                <Pencxil
                                  width={16}
                                  height={16}
                                />
                              </Button>
                              {/* <Button
                          variant="destructive"
                          size="icon-sm"
                          onClick={() => {
                            // setSelectedContactUs(paymentMethod);
                            setShowDelete((prev) => !prev);
                          }}
                        >
                          <Trash size={16} />
                        </Button> */}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <BasePagination totalCount={Number(contactUs?.totalCount)} />
              </>
            ) : (
              <EmptyState />
            )}

            {/* <EmptyState description="We couldn't find any data matching your search. Please double-check your keywords or try different search terms" /> */}
          </div>
        </div>
      </div>

      {/* start edit dialog */}
      <Dialog
        open={showEditContactUs}
        onOpenChange={setShowEditContactUs}
      >
        <DialogContent className=" max-w-xl p-0">
          <div className="flex flex-col gap-2 px-4 pt-10">
            <Label className="mb-2">
              Status <span className=" text-primary">*</span>
            </Label>
            <Select
              value={statusValue}
              onValueChange={(value: 'read' | 'replied') => {
                setStatusValue(value);
              }}
            >
              <SelectTrigger className="">
                <SelectValue placeholder="Input Status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
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
              onClick={handleEdit}
              disabled={isLoadingEdit}
            >
              {isLoadingEdit ? (
                <>
                  <LuLoader2
                    className=" animate-spin text-white"
                    size={16}
                  />
                  Please wait
                </>
              ) : (
                'Save Change'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      {/* end edit dialog */}

      <DialogDelete
        open={showDelete}
        onOpenChange={setShowDelete}
      />
    </>
  );
}
