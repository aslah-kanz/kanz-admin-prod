'use client';

import {
  useDeletePrincipals,
  useGetPrincipals,
  useGetPrincipalsById,
} from '@/api/principals.api';
import BasePagination from '@/components/common/base-pagination';
import DialogDelete from '@/components/dialog/dialog-delete';
import Pencxil from '@/components/svg/Pencxil';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { HTTP_STATUS } from '@/constants/common.constant';
import { getBadgeVariant, textTruncate } from '@/utils/common.util';
import { getLang } from '@/utils/locale.util';
import { Eye, UserAdd, Trash } from 'iconsax-react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback, useState } from 'react';
import { useQueryClient } from 'react-query';
import { toast } from 'sonner';
import { LuLoader2 } from 'react-icons/lu';
import useDetailAdminSheetStore from '@/store/detail-admin-sheet.store';
import { formatStatus } from '@/utils/principal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { FaChevronDown } from 'react-icons/fa6';
import useAddAdminSheetStore from '@/store/add-admin-sheet.store';
import AddAdminSheet from '../admin/add-admin-sheet';
import DetailAdminSheet from '../admin/detail-admin-sheet';
import BaseSearch from '../common/base-search';
import BaseTableSkeleton from '../common/base-table-skeleton';
import EmptyState from '../common/empty-state';

export default function TabManufacture() {
  const [showDeleteVendor, setShowDeleteVendor] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<number>(0);
  const params = useParams();

  const searchParams = useSearchParams();

  const [selectedSearchBy, setSelectedSearchBy] =
    React.useState<string>('search');
  const [searchBy, setSearchBy] = React.useState<string>('search');
  React.useEffect(() => {
    if (searchParams.get('search')) {
      setSearchBy(selectedSearchBy);
    }
  }, [searchParams, selectedSearchBy]);
  const { data: manufactureList, isLoading: loadingData } = useGetPrincipals({
    type: searchParams.get('type') || 'manufacture',
    [searchBy]: searchParams.get('search') as string,
    page: (Number(searchParams.get('page') || 1) - 1).toString(),
    size: searchParams.get('size') as string,
  });
  const { mutate } = useDeletePrincipals();
  // const [searchValue, setSearchValue] = useState('');

  const queryClient = useQueryClient();
  const router = useRouter();
  const deleteVendor = useCallback(() => {
    mutate(selectedId, {
      onSuccess(resp) {
        if (resp.code === HTTP_STATUS.SUCCESS) {
          queryClient.invalidateQueries({
            queryKey: ['getPrincipalList'],
          });
          queryClient.removeQueries({
            queryKey: ['getPrincipalList'],
          });
          router.refresh();
          setShowDeleteVendor((prev) => !prev);
          toast.success('Manufacture Deleted');
          setSelectedId(0);
        } else {
          toast.error(resp.message);
        }
      },
    });
  }, [mutate, queryClient, router, selectedId]);

  const {
    isOpen: isOpenAdd,
    onChangeOpen: openAddAdmin,
    setInitialValue: setInitialValueEdit,
  } = useAddAdminSheetStore();

  const [idDetailEdit, setIdDetailEdit] = React.useState<string | number>();
  const { data: detailEdit, isLoading: isLoadingDetailEdit } =
    useGetPrincipalsById(String(idDetailEdit || ''), {
      enabled: !!idDetailEdit,
    });

  React.useEffect(() => {
    if (detailEdit) {
      setInitialValueEdit(detailEdit);
      openAddAdmin(!isOpenAdd);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detailEdit]);

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

  React.useEffect(() => {
    if (!isOpenAdd) {
      setIdDetailEdit('');
    }
  }, [isOpenAdd]);

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
      {/* begin: filter, search and action */}
      <div className="flex items-center justify-between rounded-lg border bg-neutral-100 p-1.5">
        <div className="flex items-center">
          <Button
            className=" text-xs"
            variant="ghost"
            asChild
          >
            <Button
              className=" text-xs"
              variant="ghost"
              onClick={() => openAddAdmin(!isOpenAdd)}
            >
              <UserAdd size={16} />
              Create
            </Button>
          </Button>
          {/* <div className=" h-8 w-px border-r"></div>
          <Button
            className=" text-xs"
            variant="ghost"
            // onClick={() => setShowFilter((prev) => !prev)}
          >
            <ClipboardClose size={16} />
            Delete Vendor
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
      {/* end: filter, search and action */}

      {/* begin: empty state */}
      {/* <EmptyState description="We couldn't find any data matching your search. Please double-check your keywords or try different search terms" /> */}
      {/* end: empty state */}
      {loadingData ? (
        <BaseTableSkeleton row={3} />
      ) : manufactureList && manufactureList?.content?.length > 0 ? (
        <div className=" mt-4 overflow-hidden rounded-lg border">
          <Table className="whitespace-nowrap [&_tr:nth-child(even)]:bg-neutral-100">
            <TableHeader>
              <TableRow className=" bg-neutral-200 ">
                <TableHead>Action</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Manufacture Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>Location</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {manufactureList?.content?.map((items) => (
                <TableRow key={Math.random()}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="info"
                        size="icon-sm"
                        onClick={() => {
                          // detailAdmin(items);
                          setIdDetail(items.id);
                          // openDetailAdmin(true);
                          // openDetailAdmin(!isDetailOpen);
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
                        variant="info"
                        size="icon-sm"
                        onClick={() => {
                          setIdDetailEdit(items.id);
                        }}
                      >
                        {isLoadingDetailEdit && idDetailEdit === items.id ? (
                          <LuLoader2
                            className=" animate-spin"
                            size={16}
                          />
                        ) : (
                          <Pencxil
                            width={16}
                            height={16}
                          />
                        )}
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon-sm"
                        onClick={() => {
                          if (items.id) {
                            setSelectedId(items.id);
                          }
                          setShowDeleteVendor((prev) => !prev);
                        }}
                      >
                        <Trash size={16} />
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
                  <TableCell>
                    {items.principalDetails
                      ? items.principalDetails[0]?.companyNameEn
                      : '-'}
                  </TableCell>
                  <TableCell>{items.email}</TableCell>
                  <TableCell>
                    {textTruncate(
                      `${items.countryCode}${items.phoneNumber}`,
                      25,
                    )}
                  </TableCell>
                  <TableCell>
                    {items.principalDetails
                      ? `${items.principalDetails[0]?.city}, 
                      ${items.principalDetails[0]?.country?.name ? getLang(params, items.principalDetails[0]?.country.name) : ''}`
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
        totalCount={manufactureList?.totalCount as number}
        customSizeOptions={[10, 20, 40]}
        totalDataTitle="user"
      />

      {/* begin: dialog delete vendor */}
      <DialogDelete
        onOpenChange={setShowDeleteVendor}
        open={showDeleteVendor}
        onDelete={deleteVendor}
      />
      {/* end: dialog delete vendor */}

      {/* begin: drawer add admin */}
      <AddAdminSheet type="manufacture" />
      {/* end: drawer add admin */}

      {/* begin: drawer detail admin */}
      <DetailAdminSheet />
      {/* end: drawer detail admin */}
    </>
  );
}
