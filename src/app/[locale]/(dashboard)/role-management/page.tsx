'use client';

import { useDeleteRole, useGetAllRole } from '@/api/role.api';
import BaseSearch from '@/components/common/base-search';
import EmptyState from '@/components/common/empty-state';
import Header from '@/components/common/header/header';
import DialogDelete from '@/components/dialog/dialog-delete';
import AddRoleSheet from '@/components/role/add-role-sheet';
import DetaiRoleSheet from '@/components/role/detail-role-sheet';
import Pencxil from '@/components/svg/Pencxil';
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
import useAddRoleSheetStore from '@/store/add-role-sheet.store';
import useDetailRoleSheetStore from '@/store/detail-role-sheet.store';
import { TDefaultPageParams } from '@/types/common.type';
import { Eye, Trash, UserAdd } from 'iconsax-react';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { useQueryClient } from 'react-query';
import { toast } from 'sonner';

export default function RoleManagementPage({
  searchParams,
}: TDefaultPageParams) {
  // const [showAddRole, setShowAddRole] = useState<boolean>(false);
  // const [showEditRole, setShowEditRole] = useState<boolean>(false);
  const [showDeleteRole, setShowDeleteRole] = useState<boolean>(false);
  // const [showDetailRole, setShowDetailRole] = useState<boolean>(false);
  // const [nameValue, setnameValue] = useState<string>('John Doe');

  const {
    isOpen,
    onChangeOpen: openAddRole,
    setInitialValue,
  } = useAddRoleSheetStore();
  const {
    isOpen: isDetailOpen,
    onChangeOpen: openDetailRole,
    setInitialValue: setSelected,
  } = useDetailRoleSheetStore();

  const [selectedId, setSelectedId] = useState<number>(0);

  // const searchParams = useSearchParams();

  const { data: roleList } = useGetAllRole({
    search: searchParams.search,
    page: (Number(searchParams.page || 1) - 1).toString(),
    size: searchParams.size,
    order: 'desc',
    sort: 'createdAt',
  });

  const { mutate } = useDeleteRole();

  const queryClient = useQueryClient();
  const router = useRouter();
  const deleteRole = useCallback(() => {
    // console.log('checkID', selectedId);
    mutate(selectedId, {
      onSuccess(resp) {
        if (resp.code === HTTP_STATUS.SUCCESS) {
          toast.success('Bank Deleted');
          queryClient.invalidateQueries({
            queryKey: ['getAllRole'],
          });
          queryClient.invalidateQueries({
            queryKey: ['getRoleById'],
          });
          queryClient.removeQueries('getAllRole');
          queryClient.removeQueries('getRoleById');
          router.push('/role-management');
          setShowDeleteRole((prev) => !prev);
          router.refresh();
        } else {
          toast.error(resp.message);
        }
      },
    });
  }, [mutate, queryClient, router, selectedId]);

  // const FAKE_ROLE: TRole[] = [
  //   {
  //     id: 1,
  //     name: 'Admin',
  //     type: 'admin',
  //     privilageMenu: 8,
  //     status: 'active',
  //   },
  //   {
  //     id: 2,
  //     name: 'Super Admin',
  //     type: 'admin',
  //     privilageMenu: 8,
  //     status: 'active',
  //   },
  //   {
  //     id: 3,
  //     name: 'Supervisor ',
  //     type: 'admin',
  //     privilageMenu: 8,
  //     status: 'inactive',
  //   },
  // ];

  return (
    <>
      <div className=" flex h-full w-full flex-col">
        <Header title="Role Management" />

        <div className=" h-full w-full p-4 lg:p-6">
          <div className=" flex w-full flex-col rounded-lg border p-5">
            {/* begin: filter, search and action */}
            <div className="flex items-center justify-between rounded-lg border bg-neutral-100 p-1.5">
              <div className="flex items-center">
                <Button
                  className=" text-xs"
                  variant="ghost"
                  onClick={() => openAddRole(!isOpen)}
                >
                  <UserAdd size={16} />
                  Create
                </Button>
                {/* <div className=" h-8 w-px border-r"></div>
                <Button
                  className=" text-xs"
                  variant="ghost-primary"
                  onClick={() => setShowFilter((prev) => !prev)}
                >
                  <Filter size={16} />
                  Filter
                </Button> */}
              </div>
              <BaseSearch className=" hidden lg:block" />
            </div>
            <BaseSearch className=" mt-2 block lg:hidden" />
            {/* end: filter, search and action */}

            {/* begin: empty state */}
            {/* <EmptyState description="We couldn't find any data matching your search. Please double-check your keywords or try different search terms" /> */}
            {/* end: empty state */}
            {roleList && roleList.data.length > 0 ? (
              <div className=" mt-4 overflow-hidden rounded-lg border">
                <Table className="whitespace-nowrap [&_tr:nth-child(even)]:bg-neutral-100">
                  <TableHeader>
                    <TableRow className=" bg-neutral-200">
                      <TableHead>Name</TableHead>
                      {/* <TableHead>Permission Menu</TableHead>
                    <TableHead>Status</TableHead> */}
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {roleList.data.map((items) => (
                      <TableRow key={Math.random()}>
                        <TableCell>{items.name}</TableCell>
                        {/* <TableCell>{items.privilageMenu}</TableCell>
                      <TableCell>
                        {items.status === 'active' ?
                          <Badge variant="green">Active</Badge>
                          :
                          <Badge variant="neutral">Inactive</Badge>
                        }
                      </TableCell> */}
                        <TableCell>
                          <div className="flex items-center gap-4">
                            <Button
                              variant="info"
                              size="icon-sm"
                              onClick={() => {
                                openDetailRole(!isDetailOpen);
                                setSelected(items);
                              }}
                            >
                              <Eye size={16} />
                            </Button>
                            <Button
                              variant="info"
                              size="icon-sm"
                              onClick={() => {
                                openAddRole(!isOpen);
                                setInitialValue(items);
                              }}
                            >
                              <Pencxil
                                width={16}
                                height={16}
                              />
                            </Button>
                            <Button
                              variant="destructive"
                              size="icon-sm"
                              onClick={() => {
                                setSelectedId(items.id);
                                setShowDeleteRole((prev) => !prev);
                              }}
                            >
                              <Trash
                                size={16}
                                className=" text-red-500"
                              />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <EmptyState description="We couldn't find any data matching your search. Please double-check your keywords or try different search terms" />
            )}

            {/* <BasePagination totalCount={25} /> */}
          </div>
        </div>
      </div>

      {/* begin: drawer add role */}
      <AddRoleSheet />
      {/* end: drawer add role */}

      {/* begin: drawer detail role */}
      <DetaiRoleSheet />
      {/* end: drawer edit role */}

      {/* begin: dialog delete role */}
      <DialogDelete
        open={showDeleteRole}
        onOpenChange={setShowDeleteRole}
        onDelete={deleteRole}
      />
      {/* end: dialog delete role */}
    </>
  );
}
