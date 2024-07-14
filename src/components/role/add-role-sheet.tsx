import {
  useAddRole,
  useGetPrivilage,
  useGetRoleById,
  useUpdateRole,
} from '@/api/role.api';
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
import { HTTP_STATUS } from '@/constants/common.constant';
import useAddRoleSheetStore from '@/store/add-role-sheet.store';
import { TRoleAdd } from '@/types/role.type';
import { yupResolver } from '@hookform/resolvers/yup';
import { UserAdd } from 'iconsax-react';
import { useCallback, useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { FaPlus } from 'react-icons/fa6';
import { FiX } from 'react-icons/fi';
import { useQueryClient } from 'react-query';
import Select from 'react-select';
import { toast } from 'sonner';
import * as yup from 'yup';

const schema = yup.object().shape({
  name: yup.string().required('required').label('Name'),
  status: yup.string().required('required').label('Status'),
  privilegeIds: yup
    .array()
    .required('required')
    .min(1, 'required')
    .label('Privilage'),
});

function AddRoleSheet() {
  const { isOpen, initialValue, onChangeOpen } = useAddRoleSheetStore();

  // const [isChecked, setIsChecked] = useState<boolean>(false);
  const [loadRole, setLoadRole] = useState<boolean>(false);

  const { data: privilageList } = useGetPrivilage(undefined, {
    onSuccess(_resp) {
      // console.log(resp);
      setLoadRole(true);
    },
  });
  const { data: detailRole, isLoading: _loadingLoad } = useGetRoleById(
    initialValue?.id!,
    { enabled: loadRole },
  );

  const {
    handleSubmit,
    formState: { errors },
    control,
    reset,
    setValue,
    // getValues,
  } = useForm<yup.InferType<typeof schema>>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      status: 'inactive',
      privilegeIds: [],
    },
  });

  // const FAKE_PRIVILAGE: TPrivilage[] = [
  //     {
  //         id: 1,
  //         name: "Dashboard"
  //     },
  //     {
  //         id: 2,
  //         name: "Role Management"
  //     },
  //     {
  //         id: 3,
  //         name: "Admin Management"
  //     }
  // ]

  const options = privilageList?.map((obj) => ({
    value: obj.id, // Use the original value for "value"
    label: obj.name, // Use the original value for "label"
  }));

  const onChangePrivilage = (option: any) => {
    if (option) {
      const valuesArray = option.map((obj: any) => obj.value);
      setValue('privilegeIds', valuesArray);
    }
  };

  // const onChangeStatus = (isActive: boolean) => {
  //   if (isActive) {
  //     setValue('status', 'active');
  //   } else {
  //     setValue('status', 'inactive');
  //   }
  // };

  const queryClient = useQueryClient();

  const { mutate: mutateAdd, isLoading: loading } = useAddRole({
    onSuccess(resp) {
      if (resp.code === HTTP_STATUS.SUCCESS) {
        toast.success('Role successfully updated');
        reset();
        queryClient.invalidateQueries({
          queryKey: ['getAllRole'],
        });
        queryClient.removeQueries('getAllRole');
        onChangeOpen(!isOpen);
      } else {
        toast.error(resp.message);
      }
    },
  });

  const { mutate: mutateUpdate, isLoading: loadingUpdate } = useUpdateRole({
    onSuccess(resp) {
      if (resp.code === HTTP_STATUS.SUCCESS) {
        toast.success('Role successfully updated');
        reset();
        queryClient.invalidateQueries({
          queryKey: ['getAllRole'],
        });
        queryClient.invalidateQueries({
          queryKey: ['getRoleById'],
        });
        queryClient.removeQueries('getAllRole');
        queryClient.removeQueries('getRoleById');
        onChangeOpen(!isOpen);
      } else {
        toast.error(resp.message);
      }
    },
  });

  useEffect(() => {
    // console.log('checkInitialValue', initialValue);
    // console.log('checkInitialValue', detailRole);
    if (detailRole) {
      const initialPrivilege = detailRole.privilegeIds?.map((obj) => obj);

      setValue('name', detailRole.name);
      setValue('privilegeIds', initialPrivilege);
    }
  }, [detailRole, initialValue, setValue]);

  const handleActualSubmit: SubmitHandler<TRoleAdd> = useCallback(
    (values: TRoleAdd) => {
      // console.log('checkValueees', values);
      const newPayload = {
        name: values.name,
        privilegeIds: values.privilegeIds,
      };
      if (initialValue) {
        mutateUpdate({ payload: newPayload, id: initialValue.id });
      } else {
        mutateAdd(newPayload);
      }
    },
    [initialValue, mutateAdd, mutateUpdate],
  );

  const isPrivilegeSelected = useCallback(
    (id?: number): boolean => {
      if (detailRole) {
        return detailRole.privilegeIds?.some((item) => item === id);
      }
      return false;
    },
    [detailRole],
  );

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => onChangeOpen(open)}
    >
      <SheetContent className=" flex flex-col gap-4 overflow-y-auto bg-white p-4 py-0">
        <SheetHeader className=" sticky top-0 gap-2 bg-white pt-4">
          <div className="flex items-center justify-between">
            <SheetTitle>
              <div className="flex items-center gap-2">
                <UserAdd size={24} />
                {initialValue ? 'Edit Role' : 'Add Role'}
              </div>
            </SheetTitle>
            <SheetClose>
              <FiX />
            </SheetClose>
          </div>
          <hr />
        </SheetHeader>
        <form onSubmit={handleSubmit(handleActualSubmit)}>
          {/* begin: main drawer */}
          <div className=" flex flex-col gap-4">
            <div className=" flex flex-col gap-2">
              <Label className=" text-sm">Name</Label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => <Input {...field} />}
              />
              <span className="font-small text-sm text-red-600">
                {errors.name?.message}
              </span>
            </div>
            <div className=" relative flex h-auto w-full flex-col gap-2">
              <Label className=" text-sm">Permission Menu</Label>
              <Select
                options={options}
                isMulti
                defaultValue={options?.filter((value) =>
                  isPrivilegeSelected(value.value),
                )}
                className="basic-multi-select text-sm"
                classNamePrefix="select"
                isClearable={false}
                styles={{
                  valueContainer: (base) => ({
                    ...base,
                    overflowY: 'auto',
                  }),
                }}
                onChange={onChangePrivilage}
              />
              <span className="font-small text-sm text-red-600">
                {errors.privilegeIds?.message}
              </span>
            </div>
            {/* <div className=" flex flex-col gap-2">
                <Label className=" text-sm">Status</Label>
                <Switch
                  checked={isChecked}
                  onCheckedChange={(e) => onChangeStatus(e)}
                />
              </div> */}
          </div>
          {/* end: main drawer */}
          <div className=" sticky bottom-0 flex flex-col space-y-2 bg-white py-4 pt-2">
            <Button
              type="submit"
              disabled={loading || loadingUpdate}
              // onClick={() => {
              //     onChangeOpen(!isOpen);
              // }}
            >
              <FaPlus />
              Save
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}

export default AddRoleSheet;
