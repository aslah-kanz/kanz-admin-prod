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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { HTTP_STATUS } from '@/constants/common.constant';
import useAddAdminSheetStore from '@/store/add-admin-sheet.store';
import useDetailAdminSheetStore from '@/store/detail-admin-sheet.store';
import { getBadgeVariant, textTruncate } from '@/utils/common.util';
import { Eye, Trash, UserAdd } from 'iconsax-react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback, useState } from 'react';
import { useQueryClient } from 'react-query';
import { toast } from 'sonner';
import { LuLoader2 } from 'react-icons/lu';
import { FaChevronDown } from 'react-icons/fa6';
import { formatStatus } from '@/utils/principal';
import AddAdminSheet from '../admin/add-admin-sheet';
import DetailAdminSheet from '../admin/detail-admin-sheet';
import BaseSearch from '../common/base-search';
import BaseTableSkeleton from '../common/base-table-skeleton';
import EmptyState from '../common/empty-state';

export default function TabAdmin() {
  // const [showAddAdmin, setShowAddAdmin] = useState<boolean>(false);
  // const [showEditAdmin, setShowEditAdmin] = useState<boolean>(false);
  const [showDeleteAdmin, setShowDeleteAdmin] = useState<boolean>(false);
  // const [showDetailAdmin, setShowDetailAdmin] = useState<boolean>(false);

  // const [liveEditName, setLiveEditName] = useState<boolean>(false);
  // const [liveEditEmail, setLiveEditEmail] = useState<boolean>(false);
  // const [liveEditPhoneNumber, setLiveEditPhoneNumber] =
  //   useState<boolean>(false);
  // const [liveEditPassword, setLiveEditPassword] = useState<boolean>(false);

  // const [nameValue, setNameValue] = useState('John Doe');
  // const [emailValue, setEmailValue] = useState('johndoe@gmail.com');
  // const [phoneNumberValue, setPhoneNumberValue] = useState('+1282914912');
  // const [passwordValue, setPasswordValue] = useState('secreto');

  // const [searchValue, setSearchValue] = useState('');

  const [selectedId, setSelectedId] = useState<number>(0);

  // const [files, setFiles] = useState<File[]>([]);

  const searchParams = useSearchParams();

  const {
    isOpen,
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
      openAddAdmin(!isOpen);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detailEdit]);

  const {
    isOpen: isOpenDetailAdmin,
    onChangeOpen: openDetailAdmin,
    setInitialValue: detailAdmin,
  } = useDetailAdminSheetStore();

  const [selectedSearchBy, setSelectedSearchBy] =
    React.useState<string>('search');
  const [searchBy, setSearchBy] = React.useState<string>('search');
  React.useEffect(() => {
    if (searchParams.get('search')) {
      setSearchBy(selectedSearchBy);
    }
  }, [searchParams, selectedSearchBy]);
  const { data: principalsList, isLoading: loadingData } = useGetPrincipals({
    type: searchParams.get('type') || 'admin',
    [searchBy]: searchParams.get('search') as string,
    page: (Number(searchParams.get('page') || 1) - 1).toString(),
    size: searchParams.get('size') as string,
  });
  const { mutate } = useDeletePrincipals();

  const queryClient = useQueryClient();
  const router = useRouter();
  const deleteAdmin = useCallback(() => {
    mutate(selectedId, {
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
          toast.success('Admin Deleted');
          setShowDeleteAdmin((prev) => !prev);
          setSelectedId(0);
        } else {
          toast.error(resp.message);
          setSelectedId(0);
        }
      },
    });
  }, [mutate, queryClient, router, selectedId]);

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
    if (!isOpen) {
      setIdDetailEdit('');
    }
  }, [isOpen]);

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
            onClick={() => openAddAdmin(!isOpen)}
          >
            <UserAdd size={16} />
            Create
          </Button>
          {/* <div className=" h-8 w-px border-r"></div>
          <Button
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
      {/* end: filter, search and action */}
      {loadingData ? (
        <BaseTableSkeleton row={3} />
      ) : principalsList && principalsList?.content?.length > 0 ? (
        <div className=" mt-4 overflow-hidden rounded-lg border">
          <Table className="whitespace-nowrap [&_tr:nth-child(even)]:bg-neutral-100">
            <TableHeader>
              <TableRow className=" bg-neutral-200 ">
                <TableHead>Action</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {principalsList?.content.map((items) => (
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
                          setShowDeleteAdmin((prev) => !prev);
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
                          openDetailAdmin(true);
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
                    <div className="flex items-center gap-2">
                      <p>{`${items.firstName} ${items.lastName}`}</p>
                    </div>
                  </TableCell>
                  <TableCell>{items.email}</TableCell>
                  <TableCell>
                    {textTruncate(
                      `${items.countryCode}${items.phoneNumber}`,
                      25,
                    )}
                  </TableCell>
                  <TableCell>
                    {items?.roles?.length! > 0 &&
                      items?.roles?.map((roles, index) => {
                        let newRoles: string = '';
                        if (index + 1 === items?.roles?.length) {
                          newRoles = roles?.name!;
                        } else {
                          newRoles = `${roles.name}, `;
                        }
                        return textTruncate(newRoles, 25);
                      })}
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
        totalCount={principalsList?.totalCount as number}
        customSizeOptions={[10, 20, 40]}
        totalDataTitle="user"
      />

      {/* begin: drawer add admin */}
      <AddAdminSheet type="admin" />
      {/* end: drawer add admin */}

      {/* begin: drawer detail admin */}
      <DetailAdminSheet />
      {/* end: drawer detail admin */}

      {/* begin: dialog delete admin */}
      <DialogDelete
        open={showDeleteAdmin}
        onOpenChange={setShowDeleteAdmin}
        onDelete={deleteAdmin}
      />
      {/* end: dialog delete admin */}
    </>
  );
}
