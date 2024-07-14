'use client';

import {
  useDeletePrincipals,
  useGetPrincipals,
  useGetPrincipalsById,
} from '@/api/principals.api';
import DialogDelete from '@/components/dialog/dialog-delete';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';
import { HTTP_STATUS } from '@/constants/common.constant';
import { getBadgeVariant, textTruncate } from '@/utils/common.util';
import { Eye, InfoCircle, Trash, Warning2 } from 'iconsax-react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback, useState } from 'react';
import { useQueryClient } from 'react-query';
import { toast } from 'sonner';
import { LuLoader2 } from 'react-icons/lu';
import useDetailAdminSheetStore from '@/store/detail-admin-sheet.store';
import { Badge } from '@/components/ui/badge';
import { formatStatus } from '@/utils/principal';
import { FaChevronDown } from 'react-icons/fa6';
import AddAdminSheet from '../admin/add-admin-sheet';
import DetailAdminSheet from '../admin/detail-admin-sheet';
import BasePagination from '../common/base-pagination';
import BaseSearch from '../common/base-search';
import BaseTableSkeleton from '../common/base-table-skeleton';
import EmptyState from '../common/empty-state';
import DetailCompanySheet from '../company/detail-company-sheet';

export default function TabCompany() {
  // const [showDetailCompany, setShowDetailCompany] = useState<boolean>(false);
  const [showDeleteCustomer, setShowDeleteCustomer] = useState<boolean>(false);
  const [showApprove, setShowApprove] = useState<boolean>(false);
  const [showReject, setShowReject] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<number>(0);

  // const { isOpen, onChangeOpen, setInitialValue } =
  //   useDetailCompanySheetStore();

  // const [searchValue, setSearchValue] = useState('');

  const searchParams = useSearchParams();

  const [selectedSearchBy, setSelectedSearchBy] =
    React.useState<string>('search');
  const [searchBy, setSearchBy] = React.useState<string>('search');
  React.useEffect(() => {
    if (searchParams.get('search')) {
      setSearchBy(selectedSearchBy);
    }
  }, [searchParams, selectedSearchBy]);
  const { data: companiesList, isLoading: loadingData } = useGetPrincipals({
    type: searchParams.get('type') || 'company',
    [searchBy]: searchParams.get('search') as string,
    page: (Number(searchParams.get('page') || 1) - 1).toString(),
    size: searchParams.get('size') as string,
  });
  const { mutate: deleteCompany } = useDeletePrincipals();

  const queryClient = useQueryClient();
  const router = useRouter();
  const deleteCustomer = useCallback(() => {
    // console.log('checkDeleteResp', selectedId);
    deleteCompany(selectedId, {
      onSuccess(resp) {
        // console.log('checkDeleteResp', resp);
        if (resp.code === HTTP_STATUS.SUCCESS) {
          queryClient.invalidateQueries({
            queryKey: ['getPrincipalList'],
          });
          queryClient.removeQueries({
            queryKey: ['getPrincipalList'],
          });
          router.refresh();
          setShowDeleteCustomer((prev) => !prev);
          toast.success('Customer Deleted');
          setSelectedId(0);
        } else {
          toast.error(resp.message);
        }
      },
    });
  }, [deleteCompany, queryClient, router, selectedId]);

  const {
    isOpen: isOpenDetailAdmin,
    onChangeOpen: openDetailAdmin,
    setInitialValue: detailAdmin,
  } = useDetailAdminSheetStore();

  const [idDetail, setIdDetail] = React.useState<string | number>();
  const { data: detail, isLoading: isLoadingDetail } = useGetPrincipalsById(
    String(idDetail || ''),
    {
      enabled: !!idDetail,
    },
  );

  React.useEffect(() => {
    if (detail) {
      detailAdmin(detail);
      openDetailAdmin(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detail]);

  React.useEffect(() => {
    if (!isOpenDetailAdmin) {
      setIdDetail('');
    }
  }, [isOpenDetailAdmin]);

  const searchByOptions = React.useMemo(
    () => [
      {
        label: 'All',
        value: 'search',
      },
      {
        label: 'Username',
        value: 'userName',
      },
      {
        label: 'First Name',
        value: 'firstName',
      },
      {
        label: 'Last Name',
        value: 'lastName',
      },
      {
        label: 'Email',
        value: 'email',
      },
      {
        label: 'Phone Number',
        value: 'phoneNumber',
      },
      {
        label: 'Status',
        value: 'status',
      },
    ],
    [],
  );

  return (
    <>
      <div className="flex items-center justify-between rounded-lg border bg-neutral-100 p-1.5">
        <div className="flex items-center">
          {/* <Button
            className=" text-xs"
            variant="ghost"
            onClick={() => setShowFilter((prev) => !prev)}
          >
            <Filter size={16} />
            Filter
          </Button> */}
        </div>
        <div className="flex items-center justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className=" gap-2.5 text-xs text-neutral-800 hover:bg-transparent hover:text-neutral-800"
                variant="ghost"
              >
                <span className=" text-neutral-500">
                  Search By{' '}
                  <span className=" font-medium text-stone-800">
                    {
                      searchByOptions.find(
                        (item) => item.value === selectedSearchBy,
                      )?.label
                    }
                  </span>
                </span>
                <FaChevronDown size={12} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className=" w-fit space-y-1 rounded-lg p-2"
              align="end"
            >
              {searchByOptions.map((item, i) => (
                <DropdownMenuItem
                  key={i}
                  className=" h-8 justify-start rounded-md text-neutral-500 transition-all focus:bg-primary/10 focus:text-primary"
                  onClick={() => setSelectedSearchBy(item.value)}
                >
                  {item.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <BaseSearch className=" block" />
        </div>
        {/* <div className=" relative">
          <FiSearch
            size={16}
            className=" absolute left-3 top-3 text-gray-500"
          />
          <Input
            className=" w-full border bg-white pl-10 ring-offset-transparent placeholder:text-gray-500 focus-visible:ring-0 focus-visible:ring-transparent xl:w-64"
            placeholder="Search Data"
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
            }}
          />
        </div> */}
      </div>
      {loadingData ? (
        <BaseTableSkeleton row={3} />
      ) : companiesList && companiesList?.content?.length > 0 ? (
        <div className=" mt-4 overflow-hidden rounded-lg border">
          <Table className="whitespace-nowrap [&_tr:nth-child(even)]:bg-neutral-100">
            <TableHeader>
              <TableRow className=" bg-neutral-200 [&_th]:capitalize">
                <TableHead>Action</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Firstname</TableHead>
                <TableHead>Lastname</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>Company Name</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {companiesList?.content?.map((items) => (
                <TableRow key={Math.random()}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="info"
                        size="icon"
                        className=" h-8 w-8 bg-blue-50"
                        onClick={() => {
                          // setInitialValue(items);
                          // onChangeOpen(!isOpen);
                          setIdDetail(items.id);
                          // openDetailAdmin(true);
                        }}
                      >
                        {isLoadingDetail && idDetail === items.id ? (
                          <LuLoader2
                            className=" animate-spin"
                            size={16}
                          />
                        ) : (
                          <Eye size={16} />
                        )}
                      </Button>
                      <Button
                        variant="secondary"
                        size="icon"
                        className=" h-8 w-8 bg-red-50"
                        onClick={() => {
                          if (items.id) {
                            setSelectedId(items.id);
                          }
                          setShowDeleteCustomer((prev) => !prev);
                        }}
                      >
                        <Trash
                          size={16}
                          className=" text-red-500"
                        />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        items?.status === 'pendingApproval'
                          ? 'hover:cursor-pointer'
                          : ''
                      }
                      onClick={() => {
                        if (items?.status === 'pendingApproval') {
                          setIdDetail(items.id);
                          // openDetailAdmin(true);
                        }
                      }}
                      variant={
                        items.status ? getBadgeVariant(items.status) : 'default'
                      }
                    >
                      {formatStatus(items.status || '')}
                    </Badge>
                  </TableCell>
                  <TableCell>{items.firstName}</TableCell>
                  <TableCell>{items.lastName}</TableCell>
                  <TableCell>{items.email}</TableCell>
                  <TableCell>
                    {textTruncate(
                      `${items.countryCode}${items.phoneNumber}`,
                      25,
                    )}
                  </TableCell>
                  <TableCell>
                    {items.principalDetails
                      ? items.principalDetails[0]?.companyNameEn
                      : '-'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <EmptyState description="We couldn't find any data matching your search. Please double-check your keywords or try different search terms" />
      )}

      <BasePagination
        totalCount={companiesList?.totalCount as number}
        customSizeOptions={[10, 20, 40]}
        totalDataTitle="user"
      />

      {/* begin: drawer detail company customer */}
      <DetailCompanySheet />
      {/* end: drawer detail company customer */}

      {/* begin: dialog delete customer */}
      <DialogDelete
        open={showDeleteCustomer}
        onOpenChange={setShowDeleteCustomer}
        onDelete={deleteCustomer}
      />
      {/* end: dialog delete customer */}

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
              Are you sure you want to approve this product?
            </p>
          </div>
          <div className=" flex justify-end gap-4 border-t px-6 py-4">
            <DialogClose asChild>
              <Button
                className=" text-primary"
                variant="ghost"
              >
                Close
              </Button>
            </DialogClose>
            <Button>Approve</Button>
          </div>
        </DialogContent>
      </Dialog>
      {/* end: dialog approve */}

      {/* begin: dialog reject */}
      <Dialog
        open={showReject}
        onOpenChange={setShowReject}
      >
        <DialogContent className=" max-w-xl p-0">
          <div className="flex flex-col p-16">
            <div className=" flex flex-col items-center gap-2 text-center">
              <Warning2
                size={64}
                className=" text-yellow-500"
                variant="Bold"
              />
              <h1 className=" text-lg font-medium text-neutral-800">
                Reject Confirmation
              </h1>
              <p className=" text-sm text-neutral-500">
                Are you sure you want to reject this product? Please provide the
                reason for rejecting the product:
              </p>
            </div>

            <div className=" mt-8">
              <div className="flex flex-col gap-4">
                <Label className=" text-sm font-normal">Rejection Reason</Label>
                <Textarea placeholder="Input Rejection Reason" />
              </div>
            </div>
          </div>
          <div className=" flex justify-end gap-4 border-t px-6 py-4">
            <DialogClose asChild>
              <Button
                className=" text-primary"
                variant="ghost"
              >
                Close
              </Button>
            </DialogClose>
            <Button>Reject</Button>
          </div>
        </DialogContent>
      </Dialog>
      {/* end: dialog reject */}

      {/* begin: drawer add admin */}
      <AddAdminSheet type="company" />
      {/* end: drawer add admin */}

      {/* begin: drawer detail admin */}
      <DetailAdminSheet type="company" />
      {/* end: drawer detail admin */}
    </>
  );
}
